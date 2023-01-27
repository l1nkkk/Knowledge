- 重点1：select监听未完成confd的可写事件
- 重点2：利用getsockopt获取SO_ERROR，来判断连接是否成功

```cpp
int unblockConnect(){
    int connfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setNonblocking(connfd);
    auto addr = netbase::newSockAddr(10714);

    auto ret = netbase::connect(connfd, (sockaddr*)addr.get(), sizeof (sockaddr));
    if(ret == 0){
        // 连接成功
        cout << "connect success" << endl;
        return connfd;
    }else{
        fd_set fds;
        FD_ZERO(&fds);
        FD_SET(connfd, &fds);
        timeval timeout{1,0};
        cout << "select ..." << endl;
        // 重点1：监听可写事件
        auto ns = select(connfd+1, nullptr, &fds, nullptr, &timeout);
        if(ns <= 0){
            // -1出错， 0 超时仍未有
            cout << "connect failed" << endl;
            close(connfd);
            return -1;
        }else{
            int error;
            socklen_t len = sizeof (int);
            // 重点2：利用getsockopt获取SO_ERROR，来判断连接是否成功
            if(getsockopt(connfd, SOL_SOCKET, SO_ERROR, &error, &len) == 0){
                if(error == 0){
                    cout << "connect success" << endl;
                    return connfd;
                }
            }
            cout << "connect failed" << endl;
            close(connfd);
            return -1;

        }
    }
}


```