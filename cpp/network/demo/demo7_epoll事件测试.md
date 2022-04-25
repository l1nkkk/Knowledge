- 目的：测试EPOLL对于事件`EPOLLHUP`的触发。
- 实验原因：man手册还有一些博客中说，对端如果close就会触发该事件。有些博客甚至说了，就算不设置，也会触发
- 实验结果：
  - 无论设置与否，都不触发`EPOLLHUP`,而是触发了`EPOLLIN`事件
- 实验工具客户端：telnet
```cpp
bool flag = true;
void testEpollEvent(){
    vector<epoll_event> evs(5);

    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setReuseaddr(listenfd);
    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd, addr.get(), sizeof (sockaddr_in));
    netbase::listen(listenfd, 5);

    // epoll
    int epfd = netbase::epoll_create(5);
    // 测试
    netbase::epollAddCtl(epfd, listenfd, EPOLLIN , false);

    while(flag){
        int sz = netbase::epoll_wait(epfd, &evs[0], 5, -1);
        for(int i = 0; i < sz; ++i){
            auto sockfd = evs[i].data.fd;
            if(evs[i].events & EPOLLHUP){
                LOG(INFO) << "In EPOLLHUP";
                close(sockfd);
            }else if(evs[i].events & EPOLLERR){
                LOG(ERROR) << "In EPOLLERR";
            }else if((listenfd == sockfd) && (evs[i].events & EPOLLIN)){
                LOG(INFO) << "accept";
                auto connfd = accept(listenfd, nullptr, nullptr);
                // 测试点
                netbase::epollAddCtl(epfd, connfd, EPOLLIN , false);
                //netbase::epollAddCtl(epfd, connfd, EPOLLIN | EPOLLHUP | EPOLLERR, false);
            }
        }
    }
}
```