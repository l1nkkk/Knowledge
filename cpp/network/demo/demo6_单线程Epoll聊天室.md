# 服务端
- 没什么重点的。就是一个练习实例
- 客户端比较重点
```cpp
constexpr int BUFSIZE = 1024;
struct user{
    user() = default;
    user(string aaddrstr, string auserid, int afd): addrstr(aaddrstr), userId(auserid), fd(afd), buf(BUFSIZE){}
    string addrstr;                     // 对端sock地址
    string userId;                      // 用户id
    int fd;                             // 对应的fd
    vector<char> buf;                   // 接收缓存
};



constexpr int EPOLL_EVENT_NUM = 1024;
bool flag = true;
void chatSer(){
    vector<epoll_event> evs(EPOLL_EVENT_NUM);   // 事件缓存
    vector<char> buf(BUFSIZE);          // 全局接收缓存
    map<string, user> users;


    // listen fd
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setReuseaddr(listenfd);    // 可使用TIME_WAIT状态下fd
    netbase::setNonblocking(listenfd);  // 非阻塞
    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd, addr.get(), sizeof (sockaddr_in));
    netbase::listen(listenfd, 5);

    LOG(INFO) << "START.... " << netbase::sock_ntoa(addr.get(), sizeof (sockaddr_in));


    // epoll fd
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd, listenfd, EPOLLIN | EPOLLERR);


    // deal
    while(flag){
        auto sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENT_NUM, -1);

        for(int i = 0; i < sz; ++i){
            int sockfd = evs[i].data.fd;
            if((sockfd== listenfd) && (evs[i].events & EPOLLIN)){
                // 情况1：新的连接
                int connfd = netbase::accept(listenfd, nullptr, nullptr);
                LOG(INFO) << "connect from： " << netbase::getpeeraddr(connfd);
                // epoll
                netbase::epollAddCtl(epfd, connfd, EPOLLIN);
//                netbase::setNonblocking(connfd);
            }else if(evs[i].events & EPOLLIN){
                // 情况2：有数据可读
                // 处理：转发write所有人
                int nread = netbase::recv(sockfd, &buf[0], BUFSIZE, 0);


                string key = netbase::getpeeraddr(sockfd);
                if(nread == 0){ // 情况2-1：对方close
                    LOG(INFO) << users[key].userId << " have left";
                    users.erase(key);
                    close(sockfd);
                    epoll_ctl(epfd, EPOLL_CTL_DEL, sockfd, nullptr);
                }else if(nread > 0){ // 情况2-2：socket读缓存中读到了数据
                    if(users.count(key) == 0){// 对方第一次会先发送他的id，所以第一次收到用户的数据不是聊天内容
                        users.insert(make_pair(key,user(key,string(buf.begin(),
                                                         buf.begin()+nread), sockfd)));
                        cout << string(buf.begin(),buf.begin()+nread) << " log in" << endl;
                    }else{
                        // 转发所有人
                        string msg = users[key].userId + " send :" +
                                string(buf.begin(), buf.begin()+nread);
                        cout << msg << endl;
                        for(auto &u : users){
                            if(u.first != key)
                                netbase::send(u.second.fd, &msg[0], msg.size(), 0);
                        }
                    }
                }else{
                    LOG(FATAL) << "recv happen"<< netbase::errnoToStr(errno);
                }
            }else{
                LOG(FATAL) << "something happen"<< netbase::errnoToStr(errno);
            }
        }
    }
}

```


# 客户端
- 重点1：利用管道，实现零拷贝的
  - 65536 linux默认管道最小大小
  - `SPLICE_F_MORE | SPLICE_F_MOVE`：跟着书上来的，都是让内核做个参考。
```cpp
constexpr int BUFSIZE = 1024;
constexpr int EPOLL_EVENT_NUMS = 1024;
bool flag = true;
void chatCli(){
    // buf
    vector<char> buf(BUFSIZE, 0);
    vector<epoll_event> evs(EPOLL_EVENT_NUMS);

    srand(time(NULL));
    int useid = rand()%100;

    auto connfd = netbase::socket(AF_INET,SOCK_STREAM, 0);
    auto addr = netbase::newSockAddr(10714);
    connect(connfd, addr.get(), sizeof(sockaddr_in));


    // 发送用户信息
    string useInfo = "use" + std::to_string(useid);
    LOG(INFO) << "USER: " << useInfo << " online....";
    bcopy((void *) useInfo.c_str(), &buf[0],  useInfo.size());
    netbase::writen(connfd, &buf[0], useInfo.size());

    // epoll
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd, STDIN_FILENO, EPOLLIN);
    netbase::epollAddCtl(epfd, connfd, EPOLLIN|EPOLLHUP);

    // pipe管道
    int pipefd[2];
    netbase::pipe(pipefd);


    while(flag){
        int sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENT_NUMS, -1);
        // 标准输入可读
        for(int i = 0; i < sz; ++i){
            if(evs[i].data.fd == STDIN_FILENO){
                // 重点1：零拷贝
                netbase::splice(STDIN_FILENO, nullptr, pipefd[1], nullptr, 65536, SPLICE_F_MORE | SPLICE_F_MOVE);
                netbase::splice(pipefd[0], nullptr, connfd, nullptr, 65536, SPLICE_F_MORE | SPLICE_F_MOVE);
            }else if(evs[i].data.fd == connfd){
                // 服务端发来信息
                if(evs[i].events & EPOLLIN){
//                    auto nread = netbase::recv(connfd, &buf[0], BUFSIZE, 0);
                    // 重点1：零拷贝
                    auto nread = netbase::splice(connfd, nullptr, pipefd[1], nullptr, 65536, SPLICE_F_MORE | SPLICE_F_MOVE);
                    if(nread == 0){
                        // 对端close SOCKET
                        close(connfd);
                        netbase::epoll_ctl(epfd, EPOLL_CTL_DEL, connfd, nullptr);
                        cout << "server close the connection" <<endl;
                    }else if(nread == -1){
                        LOG(FATAL) << "nread == -1, fatal";
                    }else{
                        // 打印到屏幕,零拷贝
//                        netbase::splice(connfd, nullptr, pipefd[1], nullptr, 65536, SPLICE_F_MORE | SPLICE_F_MOVE);
                        netbase::splice(pipefd[0], nullptr, STDOUT_FILENO, nullptr, 65536, SPLICE_F_MORE | SPLICE_F_MOVE);
                    }
                }else if(evs[i].events & EPOLLHUP){
                    LOG(INFO) << "EPOLLHUP happen";
                }
            }
        }
    }
}
```