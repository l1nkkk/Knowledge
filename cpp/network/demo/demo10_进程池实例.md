# 分析
- 体会到多进程编程有多麻烦和繁琐
- 功能：
  - 信号、IO事件 统一事件源处理
  - 对于IO，读取客户端发送的数据，并打印。不回射
- 并发模型：高效半同步/半异步模型（实质全异步）
- 子进程与父进程之间通信：双工管道
- 子进程任务
  - 处理信号
    - SIGCHLD
    - SIGTERM
    - SIGINT
  - 对管理的IO进行复用
- 父进程
  - 处理信号
    - SIGCHLD
    - SIGTERM
    - SIGINT
  - 为接收到的新连接分配一个子进程，让子进程永久管理它（通过信号传递）
    - 分配算法，轮询
    - 处理子进程退出时，进程池的更新
# 对象
- 进程Process
  - pid
  - pipe：与父进程通信
- 进程池
  - run：运行进程池
  - runParent:运行父进程方法
  - run


# 代码

```cpp

struct Process{
    Process()=default;
    Process(int aid):id(aid){}
    void reset(){ id = -1; pid = -1; pipefd[0] = -1; pipefd[1] = -1;}
    int id = -1;                // 进程池中的标识ID，-1表示初始状态
    int pid = -1;               // 系统ID
    int pipefd[2] = {-1,-1};    // 用于父进程之间的通信
};

template <typename T>
class ProcessPoll {
public:
    /**
     * @param
     * @return
     */
    static ProcessPoll<T>* getInstance(int listenfd, int pnum){
        if(!_instance)
            _instance = new ProcessPoll<T>(listenfd, pnum);
        return _instance;
    }
    void run();

private:
    void parentRun();
    void childRun();
private:
    static constexpr int MAX_USER_PER_PROCESS = 1024;
//    std::map<int, T> sockToUser;
    T* sockToUser;
    int _curPNum;
    ProcessPoll(int listenfd, int pnum);
    const int _maxNum;
    int _flagid = -1; // 0标识主进程
    int _listenfd;
    std::vector<std::shared_ptr<Process> > _process;
    static ProcessPoll<T>* _instance;

};

void testProcessPoll();
```

```cpp
namespace Process{
template <typename T>
ProcessPoll<T>* ProcessPoll<T>::_instance = nullptr;

int sigPipe[2];     // 用于信号传递

template <typename T>
ProcessPoll<T>::ProcessPoll(int listenfd, int pnum):_listenfd(listenfd), _maxNum(pnum) {
    _curPNum = pnum;
    // 1.分配进程对象
    for(int i = 0; i < _maxNum; ++i){
        _process.push_back(make_shared<Process>(i));
        netbase::socketpair(AF_UNIX, SOCK_STREAM, 0, _process[i]->pipefd);

        // 重点1：在这里fork
        _process[i]->pid = fork();
        if(_process[i]->pid != 0){
            // 主进程
            close(_process[i]->pipefd[0]); // 虽然是全双工，但是把pipefd[1]当做写端，由主进程管理。pipefd[1]交给子进程
            continue;
        }else{
            // 子进程
            _process[i]->pid = getpid();
            close(_process[i]->pipefd[1]);
            // 注1：我认为是有必要的，书上没有这一步，可以用lsof调试看看效果，对比注册前后效果。
            for(int j = 0; j < i; ++j){
                close(_process[j]->pipefd[1]);
            }
            _flagid = i;
            break;
        }
    }
}

template <typename T>
void ProcessPoll<T>::run() {
    if(_flagid == -1){
        parentRun();
    }else{
        childRun();
    }
}

void sigdeal(int sig){
    int terrno = errno;
    LOG(INFO) << sig << " signal arrive";
    netbase::send(sigPipe[1], &sig, sizeof (int), 0);
    errno= terrno;
}

void sigInit(){
    netbase::socketpair(AF_UNIX, SOCK_STREAM, 0, sigPipe);

    netbase::signal(SIGCHLD, sigdeal);
    netbase::signal(SIGTERM, sigdeal);
    netbase::signal(SIGINT, sigdeal);
}

constexpr int BUFSIZE = 1024;
constexpr int EPOLL_EVENTS_NUM = 1024;



// 子进程执行
template <typename T>
void ProcessPoll<T>::childRun() {
    LOG(INFO) << "ChildProcess Start ... " << _flagid;
    sigInit();

    int isStop = false;
    vector<epoll_event> evs(EPOLL_EVENTS_NUM);
    vector<char> buf(BUFSIZE);
    int sigPipeFd = sigPipe[0];
    int connPipeFd = _process[_flagid]->pipefd[0];

    // 注意：后面看看怎么用只能指针
    // ERROR list<make_shared<T>> user;
    // T users = new T[MAX_USER_PER_PROCESS];


    sockToUser = new T[MAX_USER_PER_PROCESS];

    // 子进程的epoll
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd, _process[_flagid]->pipefd[0], EPOLLIN);
    netbase::epollAddCtl(epfd, sigPipeFd, EPOLLIN);

    while (!isStop){
        int sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENTS_NUM, -1);
        for(int i = 0; i < sz; ++i){
            auto sockfd = evs[i].data.fd;
            // 情况1：如果为信号管道可读
            if((sockfd == sigPipeFd) && (evs[i].events & EPOLLIN)){
                auto nread = netbase::recv(sockfd, &buf[0], sizeof (int), 0);
                if(nread <= 0){
                    LOG(FATAL) << "ERROR netbase::recv";
                }else{
                    int* sig = reinterpret_cast<int *> (&buf[0]);
                    switch (*sig) {
                    case SIGCHLD:
                        // 处理子进程，有可能process中也使用了多进程
                        netbase::sigchldDeal(*sig);
                        break;
                    case SIGTERM:
                    case SIGINT:
                        isStop = true;
                        break;
                    default:
                        LOG(FATAL) << "UNDEFILE SIGDEAL";
                    }
                }
            }else if((connPipeFd == sockfd) && (evs[i].events & EPOLLIN)){// 情况2：如果为IPC管道可读,主进程发来消息
                auto nread = netbase::recv(sockfd, &buf[0], sizeof (char), 0); // 协议，通过char,一字节通知
                if(nread <= 0){
                    LOG(FATAL) << "netbase::recv error";
                }else{
                    auto connfd = netbase::accept(_listenfd, nullptr, nullptr);
                    LOG(INFO) << "CONNECT FROM " << netbase::getpeeraddr(connfd);
                    netbase::epollAddCtl(epfd, connfd, EPOLLIN);
                    netbase::setNonblocking(connfd);

                    sockToUser[connfd].init(epfd, connfd, netbase::getpeeraddr(connfd));

                }
            }else if(evs[i].events & EPOLLIN){ // 情况3：有用户数据的可读
//                LOG(INFO) << "process。。。";
                sockToUser[sockfd].process();
                if(sockToUser[sockfd].isClose()){
                    sockToUser[sockfd].reset();
                }
            }
        }
    }
    LOG(INFO) << _flagid << " child exit success";
    exit(_flagid);
}

// 父进程逻辑
template <typename T>
void ProcessPoll<T>::parentRun() {
    LOG(INFO) << "ParentProcess Start ... ";
    sigInit();

    int isStop = false;
    vector<epoll_event> evs(EPOLL_EVENTS_NUM);
    vector<char> buf(BUFSIZE);
    int sigPipeFd = sigPipe[0];

    // 用于轮训
    int winSize = _maxNum;
    int nowPos = 0;


    // 子进程的epoll
    int epfd = netbase::epoll_create(5);
    netbase::epollAddCtl(epfd, sigPipeFd, EPOLLIN);
    netbase::epollAddCtl(epfd, _listenfd, EPOLLIN);

    while (!isStop) {
        LOG(INFO) << "parent epoll_wait";
        int sz = netbase::epoll_wait(epfd, &evs[0], EPOLL_EVENTS_NUM, -1);
        for(int i = 0; i < sz; ++i){
            int sockfd = evs[i].data.fd;
            // 情况1：如果为信号管道可读
            if((sockfd == sigPipeFd) && (evs[i].events & EPOLLIN)){
                auto nread = netbase::recv(sockfd, &buf[0], sizeof (int), 0);
                if(nread <= 0){
                    LOG(FATAL) << "ERROR netbase::recv";
                }else{
                    int* sig = reinterpret_cast<int *> (&buf[0]);
                    switch (*sig) {
                    case SIGCHLD:
                        // 处理子进程，有可能process中也使用了多进程
                        int status;
                        netbase::sigchldDeal(*sig, &status);
                        status>>=8;
                        _process[status]->reset();
                        _curPNum--;
                        if(_curPNum == 0){
                            LOG(INFO) << "DONE";
                            exit(0);
                        }
                        LOG(INFO) << "current Child Process Num " << _curPNum;
                        break;
                    case SIGTERM:
                    case SIGINT:
                        for(int i = 0; i < _maxNum; ++i){
                            if(_process[i]->pid != -1)
                                kill(_process[i]->pid , SIGTERM);
                        }
                        isStop = true;
                        break;
                    default:
                        LOG(FATAL) << "UNDEFILE SIGDEAL";
                    }
                }
            }else if(evs[i].events & EPOLLIN){
                // 情况2：新连接到来
                // 轮训调度
                int startPos = nowPos;
                int i = 0;
                do{
                    if(_process[nowPos]->id != -1){
                        break;
                    }
                    nowPos = (nowPos+1) % winSize;
                    ++i;
                }while(i < winSize);
                if(i == winSize){
                    isStop = true;
                    LOG(WARNING) << "child Process none";
                    break;
                }else{
                    LOG(INFO) << "new connect ";
                    buf[0] = '1';
                    send(_process[nowPos]->pipefd[1], &buf[0], sizeof (char), 0);
                    nowPos = (nowPos+1) % winSize;
                }
            }
        }
    }
    // 很low的做法
    sleep(1);


    exit(0);
}

struct User{
    User() = default;
    User(int afd, string aaddr): fd(afd), addr(aaddr){};
    ~User(){
        LOG(INFO) << "User deconstructor " << addr;
    }

    void process(){
        constexpr int BUFSIZE = 1024;
        vector<char> buf(BUFSIZE);
        auto nread = netbase::splice(fd, nullptr, pipeFd[1], nullptr, 65536, SPLICE_F_MOVE | SPLICE_F_MORE);
        if(nread == 0){
            LOG(INFO) << "close connect : " << addr;
            netbase::epoll_ctl(epfd,  EPOLL_CTL_DEL, fd, nullptr);
            close(fd);
            closeFlag = true;
        }else if(nread < 0){
            LOG(FATAL) << "netbase::recv error";
        }else{
            netbase::splice(pipeFd[0], nullptr, STDOUT_FILENO, nullptr, 65536, SPLICE_F_MOVE | SPLICE_F_MORE);
        }
    }
    void init(int aepfd, int afd, string aaddr){
        epfd = aepfd;
        fd = afd;
        addr = aaddr;
        netbase::pipe(pipeFd);
    }
    bool isClose(){
        return closeFlag;
    }
    void reset(){
        epfd = -1;
        fd = -1;
        addr = "";
        closeFlag = false;
        close(pipeFd[0]);
        close(pipeFd[1]);

    }
    int epfd = -1;
    int fd = -1;
    std::string addr = "";
    bool closeFlag = false;
    int pipeFd[2];
};

void testProcessPoll(){
    int listenfd = netbase::socket(AF_INET, SOCK_STREAM, 0);
    netbase::setReuseaddr(listenfd);
    auto addr = netbase::newSockAddr(10714);
    netbase::bind(listenfd, addr.get(), sizeof(sockaddr_in));
    netbase::listen(listenfd, 5);

    auto pmgr = ProcessPoll<User>::getInstance(listenfd, 3);
    // 重点2：再这里run
    pmgr->run();

}
```