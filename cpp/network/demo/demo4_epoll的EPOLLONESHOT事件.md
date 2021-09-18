# 服务端
- 多线程。一个线程处理一个套接字时，其他线程不能处理该套接字。
- 重点1：线程处理完了需要重新注册epoll，接下来的事件才能被监听到
- 注意1：epoll_wait返回的的epoll_event,并不是我们所注册的一样。而是其发生的事件。
  - eg:`EPOLLIN | EPOLLET | EPOLLONESHOT `注册的时候可能注册了这些事件，epoll_wait返回的只有`EPOLLIN`
```cpp

constexpr int BUFSIZE = 10;
struct fds{
    fds(int aepfd, int asockfd, epoll_event aevent):
    epfd(aepfd), sockfd(asockfd), event(aevent){}
    int epfd;
    int sockfd;
    epoll_event event;
};

void* run(void *data){
    LOG(INFO) << "In " << gettid();
    fds* fdsp = (fds*)data;
    vector<char> buf(BUFSIZE);
    // 读取数据
    while(true){
        bzero(&buf[0], BUFSIZE);
        int nread = netbase::recv(fdsp->sockfd, &buf[0], BUFSIZE,0);
        if(nread == 0){
            LOG(INFO) << netbase::getpeeraddr(fdsp->sockfd);
            close(fdsp->sockfd);
            netbase::epoll_ctl(fdsp->epfd, EPOLL_CTL_DEL,fdsp->sockfd,NULL);
            break;
        }else if(nread == -1){
            if((errno == EAGAIN) || (errno == EWOULDBLOCK)){

                // 重点1：需要重新注册回去，接下来的事件才能被监听到
                epoll_event ev;
                ev.data.fd = fdsp->sockfd;
                ev.events = EPOLLIN | EPOLLET | EPOLLONESHOT;
                netbase::epoll_ctl(fdsp->epfd, EPOLL_CTL_MOD, fdsp->sockfd, &ev);
                // 注意1：错误的，因为fdsp->event为epoll通知的事件，只包含了EPOLLIN，并不包括之前注册的EPOLLET | EPOLLONESHOT
//                netbase::epoll_ctl(fdsp->epfd, EPOLL_CTL_MOD, fdsp->sockfd, &fdsp->event);
                break;
            }
            LOG(FATAL) << "error";
        }else{
            cout << "recv:" << string(buf.begin(), buf.begin()+nread) << endl;
            sleep(2);
        }

    }
    LOG(INFO) << "Quit " << gettid();
}


bool flag = true;
constexpr int EPOLL_EVENTS_NUMS = 1024;
void epoll_Epolloneshot(){

    // 监听sock
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setNonblocking(listenfd);
    netbase::setReuseaddr(listenfd);
    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd,(sockaddr*) addr.get(), sizeof(addr));
    netbase::listen(listenfd, 5);

    LOG(INFO) << "START" << netbase::sock_ntoa((sockaddr*)addr.get(), sizeof (sockaddr_in));

    // epoll sock
    int epfd = netbase::epoll_create(5);
    vector<epoll_event> evs(EPOLL_EVENTS_NUMS);

    // 注意1：不设置EPOLLONESHOT，原因：不会出现多线程处理情况
    netbase::epollAddCtl(epfd, listenfd, EPOLLIN, true);
    while(flag){
        int sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENTS_NUMS, -1);
        // deal
        for(int i = 0; i < sz; ++i){
            int sockfd = evs[i].data.fd;
            if(sockfd == listenfd){
                sockaddr_in addr;
                socklen_t addrlen = sizeof(addr);
                auto connfd = netbase::accept(listenfd, (sockaddr*)&addr, &addrlen);
                // 注意1：设置EPOLLONESHOT
                netbase::epollAddCtl(epfd, connfd, EPOLLIN | EPOLLONESHOT, true);
                netbase::setNonblocking(connfd);
                LOG(INFO) << "connect from:" << netbase::getpeeraddr(connfd);

            }else if(evs[i].events){
                pthread_t thread;
                struct fds input(epfd, sockfd, evs[i]);
                pthread_create(&thread, NULL, run, (void *)&input);
            }
        }
    }
}
```