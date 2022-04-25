# 服务端
- 注意1：LT和ET模式是设置
- 注意2：accept传地址长度记得赋值。不然accept失败，而且通知的是fd无效
- 重点1：ET模式下，有数据可读的时候，需要把内核缓冲区中的数据全部读完，因为这次没处理完，该事件下次将不会被通告了。
```cpp
int setFDCtl(int fd, int addOpt){
    int old_option = fcntl(fd, F_GETFL);
    if(old_option == -1){
        LOG(ERROR) << "fcntl error; " << errnoToStr(errno);
        return -1;
    }
    int new_option = old_option | addOpt;
    if(fcntl(fd, F_SETFL, new_option) == -1){
        LOG(ERROR) << "fcntl error; " << errnoToStr(errno);
        return -1;
    }
    return old_option;
}

int setNonblocking(int fd){
    return netbase::setFDCtl(fd, O_NONBLOCK);
}

void epollAddCtl(int epfd, int fd, uint32_t e,bool isEt){
    epoll_event event;
    event.data.fd = fd;
    event.events = e;
    if(isEt){
        event.events |= EPOLLET;
    }
    netbase::epoll_ctl(epfd, EPOLL_CTL_ADD, fd, &event);
}

constexpr int BUFSIZE = 5;
int count = 0;
void lt(vector<epoll_event>& evs, int sz, int epollfd, int listenfd){
    vector<char> buf(BUFSIZE);

    for(int i = 0; i < sz; ++i){
        cout << "Wake Times: " << ++count << endl;
        int sockfd = evs[i].data.fd;
        if(sockfd == listenfd){
            // 处理新连接
            sockaddr_in addr;
            // 注意2：坑爹，坑了两小时，这里如果没给addrlen赋值，报错是说fd无效。
            socklen_t addrlen = sizeof(addr);
            int connfd = netbase::accept(listenfd, (sockaddr*)&addr, &addrlen);
            cout << "Connect from:" << netbase::sock_ntoa((sockaddr*)&addr, addrlen) << endl;

            // 注意1：设置LT模式
            netbase::epollAddCtl(epollfd, connfd, EPOLLIN, false);
            // 设置为非阻塞
            netbase::setNonblocking(connfd);
        } else if(evs[i].events & EPOLLIN){
            bzero(&buf[0], BUFSIZE);
            // 接收数据
            auto nread = netbase::recv(sockfd, &buf[0], BUFSIZE, 0);
            if(nread == 0){ // EOF处理
                netbase::epoll_ctl(epollfd, EPOLL_CTL_DEL, sockfd, nullptr);
                cout << "close: " << netbase::getpeeraddr(sockfd) << endl;
                netbase::close(sockfd);
            }
            else if(nread > 0)
                cout << "recv:" << string(buf.begin(), buf.begin()+nread) << endl;
        }
    }
}

void et(vector<epoll_event>& evs, int sz, int epollfd, int listenfd){
    vector<char> buf(BUFSIZE);
    for(int i = 0; i < sz; ++i){
        cout << "Wake Times: " << ++count << endl;
        int sockfd = evs[i].data.fd;
        if(sockfd == listenfd){
            sockaddr_in addr;
            socklen_t addrlen = sizeof (addr);
            int connfd = accept(sockfd, (sockaddr*)&addr, &addrlen);
            cout << "Connect from:" << netbase::sock_ntoa((sockaddr*)&addr, addrlen) << endl;

            // 注意1：设置LT模式
            netbase::epollAddCtl(epollfd, connfd, EPOLLIN, true);
            netbase::setNonblocking(connfd);
        }else if(evs[i].events & EPOLLIN){
            bzero(&buf[0], BUFSIZE);
            // 重点1：这里需要一次性把缓冲区中所有数据都读出来，因为ET模式下，如果没处理完，该事件也不会再次被通告
            while(true){
                int nread = netbase::recv(sockfd, &buf[0], BUFSIZE, 0);
                if(nread == 0){
                    netbase::epoll_ctl(epollfd, EPOLL_CTL_DEL, sockfd, nullptr);
                    cout << "close: " << netbase::getpeeraddr(sockfd) << endl;
                    netbase::close(sockfd);
                    break;
                }else if(nread == -1){// 重点2：非阻塞IO已经读完了的判断
                    if((errno == EAGAIN) || (errno == EWOULDBLOCK))
                        break;
                }else{
                    cout << "recv:" << string(buf.begin(), buf.begin()+nread) << endl;
                }
            }


        }
    }
}


bool flag = true;
constexpr int MAX_EPOLL_EVENT_NUM = 1024;
void EpollEtLtCmp(){
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    auto addr = netbase::newSockAddr(10714);

    netbase::setNonblocking(listenfd);      // 不阻塞
    netbase::setReuseaddr(listenfd);        // 重用Time_wait
    netbase::bind(listenfd, (sockaddr*)addr.get(), sizeof (sockaddr_in));
    netbase::listen(listenfd,5);

    vector<epoll_event> evs(MAX_EPOLL_EVENT_NUM);
//    epoll_event evs[MAX_EPOLL_EVENT_NUM];
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd,listenfd, EPOLLIN, false);


    LOG(INFO) << "START... ； listen in : " << netbase::sock_ntoa((sockaddr*)addr.get(), sizeof (sockaddr_in));
    while(flag){
        // 注意：timeout：-1
        auto rtn = netbase::epoll_wait(epfd, &evs[0], MAX_EPOLL_EVENT_NUM, -1);
        if(rtn == -1)
            LOG(FATAL) << "netbase::epoll_wait ERROR;";

        // 注：只负责接收打印，以及接收新连接
//        lt(evs, rtn, epfd, listenfd);
        et(evs, rtn, epfd, listenfd);
    }
    return;
}
```