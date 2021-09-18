- select实现回射。
- 重点：支持批量，而不是**停等方式**
# 服务端
- 重点1：使用`set`，存放连接的socket，有序。可以从中返回最大，从而决定maxfd
- 注意1：maxfd需要最大的fd+1，才能把最大的fd加入到监听
- 注意2：select返回就绪的fd个数
```cpp
constexpr int BUFSIZE = 1024;
bool flag = true;
void strEchoSer(){
    LOG(INFO) << "start ....";
    int listenfd;
    int reset = 1;
    fd_set allset;
    fd_set rset;
    set<int> sockRecord;    // 重点1：存放连接的socket，有序。可以从中返回最大，从而决定maxfd
    vector<char> buf(BUFSIZE);
    int maxfd;

    listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    setsockopt(listenfd, SOL_SOCKET, SO_REUSEADDR, &reset, sizeof(reset));  // TIMW_WAIT可用

    auto addr = netbase::newSockAddr(10714);
    bind(listenfd, (sockaddr*)addr.get(), sizeof(sockaddr_in));
    netbase::listen(listenfd, 5);
    // 注意1：这里要+1
    maxfd = listenfd+1;
    FD_ZERO(&allset);
    FD_SET(listenfd, &allset);
    while(flag){
        // 注意3：
        rset = allset;
        // 注意2：nready，就续的个数
        auto nready = netbase::select(maxfd, &rset, nullptr, nullptr, nullptr);
        while(nready > 0){
            if(FD_ISSET(listenfd, &rset)){
                sockaddr_in connaddr;
                socklen_t addlen = sizeof(sockaddr_in);
                auto connfd = netbase::accept(listenfd, (sockaddr*)&connaddr, &addlen);
                LOG(INFO) << "accept from: " << netbase::sock_ntoa((sockaddr*)&connaddr, addlen);
                sockRecord.insert(connfd);
                if(connfd+1 > maxfd){
                    maxfd = connfd+1;
                }
                FD_SET(connfd, &allset);
                if(--nready <= 0)
                    break;
            }

            for(auto &fd : sockRecord){
                if(FD_ISSET(fd, &rset)){
                    auto nread = read(fd, &buf[0], BUFSIZE);
                    if(nread == 0) {
                        auto info = netbase::getpeeraddr(fd);
                        netbase::close(fd);
                        sockRecord.erase(fd);
                        if(sockRecord.empty())
                            maxfd = listenfd+1;
                        else
                            maxfd = max(*sockRecord.upper_bound(0), listenfd) + 1;

                        LOG(INFO) << "close " <<  info << "; current maxfd: " << maxfd;
                        FD_CLR(fd,&allset);
                    }
                    else{
                        cout << "recv: " << string(buf.begin(), buf.begin()+nread)<< "\n----------" << endl;
                        netbase::writen(fd, &buf[0], nread);
                    }
                    if(--nready <= 0)
                        break;
                }
            }
        }
    }

}
```

# 客户端
- ！！！注意：**不要使用有缓存的io和select的一起使用**。
  - 比如不要使用stdio中的fget，因为其会有自己维护的缓冲区，而每次却只返回一行，剩下的留到自己的用户缓冲区中。而**select的通知是站在read的角度上的，它并不知道有用户缓冲区**
- 重点1：发送完必须用shutdown，否则会发现反射读取到的内容变少了。因为有些还没读，连接就被。
  - close调用了之后，就算后面有数据到来，内核也会偷偷将其丢弃。
```cpp
void strEchoCli(){
    vector<char> buf(BUFSIZE,0);
    int connfd;
    fd_set fset;
    FILE *f = fopen("/home/l1nkkk/project/mime/netClient/demo/data/TheAnswer.txt","r");
    if(f == NULL)
        LOG(FATAL) << "fopen Error";
    shared_ptr<FILE> spf(f,[](FILE *fp){ fclose(fp);});

    connfd = socket(AF_INET, SOCK_STREAM, 0);
    auto addr = netbase::newSockAddr(10714);
    netbase::connect(connfd, (sockaddr*)addr.get(), sizeof (sockaddr_in));

    FD_ZERO(&fset);
    while(flag){
        if(!readDone)
            FD_SET(fileno(f), &fset);
        FD_SET(connfd, &fset);
        int maxfd = max(connfd, fileno(f))+1;
//        cout << "select..." << endl;
        netbase::select(maxfd, &fset, nullptr, nullptr, nullptr);

        if(FD_ISSET(connfd,&fset)){
            auto nread = netbase::read(connfd, &buf[0], BUFSIZE);
            if(nread == 0){
                LOG(INFO) << "Done";
                exit(0);
            }
            cout << "recv：" << string(buf.begin(), buf.begin()+nread) << "\n----------" << endl;
        }
        if(FD_ISSET(fileno(f), &fset)){
            auto nread = netbase::read(fileno(f), &buf[0], BUFSIZE);
            if(nread == 0){ // EOF
                readDone = true;
                FD_CLR(fileno(f), &fset);
                // 重点1：这里必须用shutdown，否则会发现反射读取到的内容变少了。因为有些还没读，连接就被close了
                shutdown(connfd, SHUT_WR);
            }else{
                netbase::writen(connfd, &buf[0], nread);
                cout << "send " << nread << " B" << endl;
            }
        }

    }
}
```