# 服务端
- 功能：
  - 接收客户端发来的数据，并打印。
  - 客户端一段时间没法送信息将过期，过期的话服务端主动关闭连接
  - 服务端维护一个定时管理器，定期执行定时任务。
- 重点1：信号处理函数再调用前，得保存errno原本的值
- 重点2：定时时间的优先级一般比较低，可以放最后处理
- 注意1：信号处理函数应该尽可能简单
- 注意2：`alarm()` 设置了只吃法一次`SIGALRM`，处理完`SIGALRM`要重新设置
- 注意3：读到用户发来的数据后应该更新过期时间。

```cpp

bool flag = true;
constexpr int BUFSIZE = 1024;
constexpr int EPOLL_EVENTS_NUM = 1024;
constexpr int TIME_SLOT = 3;            // 时间粒度

int pipefd[2];  // 信号管道
class netbase::TimerListMgr timeMgr;    // 定时链表管理器

// 每个连接分配一个用户类
struct UserData{
    UserData(int aepfd,int fd, string aaddr):epfd(aepfd) ,connfd(fd), addr(aaddr){};
    ~UserData(){
        LOG(INFO) << addr << " deconstruct";
    };
    int epfd;
    int connfd;
    string addr;
    shared_ptr<netbase::TimerNode> timer = nullptr;
};


// 注意1：信号处理函数应该尽可能简单
void sigCb(int sig){
    // 重点1: 需要保存原有的errno，不能影响原程序
    int terrno = errno;
    netbase::send(pipefd[1], &sig, sizeof (int), 0);
    errno = terrno;
}

map<string, shared_ptr<UserData> > addrToUser;

// 处理过期连接的回调函数
void timeoutCb(void *ptr){
    UserData *data = static_cast<UserData*> (ptr);
    cout << "conn " << data->addr << " timeout" << endl;
    netbase::epoll_ctl(data->epfd, EPOLL_CTL_DEL, data->connfd, nullptr);
    close(data->connfd);
    addrToUser.erase(data->addr);
}


void timerAndSignal(){
    vector<char> buf(BUFSIZE);
    vector<epoll_event> evs(EPOLL_EVENTS_NUM);

    // tcp listen
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setNonblocking(listenfd);
    netbase::setReuseaddr(listenfd);
    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd, addr.get(), sizeof (sockaddr_in));
    netbase::listen(listenfd, 5);

    // epoll
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd, listenfd, EPOLLIN);

    // pipe 用于信号处理
    netbase::socketpair(AF_UNIX, SOCK_STREAM, 0, pipefd);
    netbase::epollAddCtl(epfd, pipefd[0], EPOLLIN);

    // 信号处理
    netbase::signal(SIGALRM, sigCb);
    netbase::signal(SIGTERM, sigCb);

    // 定时器
    bool timeout = false;
    // 注意2：只触发一次
    alarm(TIME_SLOT);

    while(flag){
        auto sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENTS_NUM, -1);

        for(int i = 0; i < sz; ++i){
            int sockfd = evs[i].data.fd;
            if(sockfd == listenfd){
                // 情况1：新连接
                auto connfd = netbase::accept(listenfd, nullptr, nullptr);
                string key = netbase::getpeeraddr(connfd);
                cout << "accept from:" << key << endl;
                netbase::epollAddCtl(epfd, connfd, EPOLLIN);

                // userData
                addrToUser.insert(make_pair(key,make_shared<UserData>(epfd, connfd,key)));

                // TIMER
                addrToUser[key]->timer = make_shared<netbase::TimerNode>(
                        time(nullptr) + 1 * TIME_SLOT, timeoutCb, addrToUser[key].get()
                        );
                timeMgr.add(addrToUser[key]->timer);
            }else if(sockfd == pipefd[0] && (evs[i].events & EPOLLIN)){
                // 情况2：信号来过
                auto nread = netbase::recv(pipefd[0], &buf[0], sizeof (int), 0);
                if(nread <= 0){
                    LOG(FATAL) << "Are you kidding me?";
                }
                // SIGALRM
                int *sig = reinterpret_cast<int*>(&buf[0]);
                switch (*sig) {
                case SIGALRM:
                    LOG(INFO) << "SIGALRM happen";
                    timeout = true;
                    // 注意2：要再次设置定时
                    alarm(TIME_SLOT);
                    break;
                case SIGTERM:
                    LOG(INFO) << "SIGTERM happen";
                    flag = false;
                    break;
                default:
                    LOG(ERROR) << "sig undefine";
                }
            }else if(evs[i].events & EPOLLIN){
                // 情况3：有数据可读
                auto nread = netbase::recv(sockfd, &buf[0], BUFSIZE, 0);
                auto key = netbase::getpeeraddr(sockfd);
                if(nread == 0){
                    // 断开连接
                    LOG(ERROR) << "TimeMgr del " << key;
                    timeMgr.del(addrToUser[key]->timer);
                    timeoutCb(addrToUser[key].get());
                }else if(nread > 0){
                    cout << "recv: " << string(buf.begin(), buf.begin()+nread);
                    // 注意3：读完记得更新过期时间
                    addrToUser[key]->timer->expire = time(nullptr) + TIME_SLOT *1;
                }else{
                    LOG(FATAL) << "recv error";
                }

            }else{
                LOG(ERROR) << "something happen";
            }
        }
        // 重点2：最后处理定时事件，让IO事件有更高的优先级
        if(timeout){
            LOG(INFO) << "timeMgr tick";
            timeMgr.tick();
            timeout = false;
        }

    }
}
```

