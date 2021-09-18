# 服务端代码
- 注意点1：SO_REUSEADDR忽略TIME_WAIT，可以直接用TIME_WAIT状态的sock
- 重点1：正确处理子进程退出
- 重点2：需要关闭listenfd，引用计数-1
- 重点2：需要关闭connfd，引用计数-1


```cpp
constexpr int BUFSIZE = 1024;


void strEcho(int fd){
    vector<char> buf(BUFSIZE);
    ssize_t n;
    LOG(INFO) << "IN strEcho";
    while((n = netbase::read(fd, &buf[0], BUFSIZE)) > 0){
        std::cout << "recv:" << std::string(buf.begin(), buf.begin()+n) << std::endl;
        netbase::writen(fd, &buf[0], n);
    }
}

bool flag = true;
void strEchoSer(){
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    int reuse = 1;
    // 注意点1：SO_REUSEADDR忽略TIME_WAIT，可以直接用TIME_WAIT状态的sock
    setsockopt(listenfd,SOL_SOCKET, SO_REUSEADDR, &reuse, sizeof(reuse));

    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd, addr.get(), sizeof(sockaddr_in));
    netbase::listen(listenfd,5);

    // 重点1：正确处理子进程退出
    netbase::signal(SIGCHLD, netbase::sigchldDeal);

    while(flag){
        int connfd;
        int pid;
        LOG(INFO) << "accept.......";
        if((connfd = netbase::accept(listenfd, nullptr, nullptr)) < 0){
            if(errno == EINTR)
                continue;;
        }
        if((pid = netbase::fork()) == 0){
            // 子进程逻辑
            LOG(INFO) << "In clild";
            netbase::close(listenfd);   // 重点2：需要关闭listenfd，引用计数-1
            strEcho(connfd);
            exit(0);
        }
        LOG(INFO) << "child pid :" << pid;
        netbase::close(connfd);// 重点2：需要关闭connfd，引用计数-1
    }
}
```
- 正确的SIGCHLD处理
	- 非阻塞
```cpp
/**
 * @brief SIGCHLD的信号处理
 * @param sig
 */
void sigchldDeal(int sig){
    int status;
    int pid;
    while((pid = waitpid(-1, &status, WNOHANG)) > 0){
        LOG(INFO) << "Process " << pid << " Quit normal, status:" << status;
    }
    if(pid == -1){
        if(errno  != ECHILD)
            LOG(ERROR) << "waitpid error; " << netbase::errnoToStr(errno);
    }
}

```

# 客户端
- 缺陷：当套接字上发生事件（比如服务端断开了），客户端可能阻塞于fget
```cpp
constexpr int BUFSIZE = 1024;
void strEchoCli(){
    LOG(INFO) << "Start";
    int sockfd;
    auto addr = netbase::newSockAddr(10714);
    std::string sendStr;
    std::vector<char> buf(BUFSIZE,0);

    sockfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::connect(sockfd, (sockaddr*)addr.get(), sizeof(sockaddr_in));
    while(std::cin >> sendStr){
        if(sendStr == "q"){
            exit(0);
        }
        bzero(&buf[0], BUFSIZE);
        netbase::writen(sockfd, (void *)sendStr.c_str(), sendStr.size());
        int nread = netbase::read(sockfd, &buf[0], BUFSIZE);
        std::cout << "recv:" << std::string(buf.begin(),buf.begin()+nread) << std::endl;
    }

}
```