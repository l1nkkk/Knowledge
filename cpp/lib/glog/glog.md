# 安装
http://senlinzhan.github.io/2017/10/07/glog/

# 使用

- 文档：
  - http://rpg.ifi.uzh.ch/docs/glog.html
  - https://github.com/google/glog#user-guide
- 自定义：https://www.cnblogs.com/LyndonYoung/articles/8000265.html
- https://www.jianshu.com/p/d55838893e9c
# demo
```cpp
#include <iostream>


#include <glog/logging.h>
using namespace  std;
// demo1 hello world
void demo1(){
    PLOG(INFO) << "file";
    // Most flags work immediately after updating values.
    FLAGS_logtostderr = 1;
    LOG(INFO) << "file";
    FLAGS_logtostderr = 0;
    // This won't change the log destination. If you want to set this
    // value, you should do this before google::InitGoogleLogging .
    FLAGS_log_dir = "/tmp/log/directory";
    LOG(INFO) << "the same file";
}


int main(int argc, char* argv[])
{
    int *some_ptr = nullptr;
    // 注意初始化
    google::InitGoogleLogging(argv[0]);
    demo1();
}
```

## 初始化
```cpp
#include "glog/logging"
class GLogInit
{
public:
    GLogInit(char* name)
    {
        // 初始化应用进程名
        google::InitGoogleLogging(name);
        // 设置错误级别大于等于多少时输出到文件
        // 参数2为日志存放目录和日志文件前缀
        google::SetLogDestination(google::INFO,"D:\\glogTest\\log");
        // 是否将日志输出到标准错误是不是日志文件
        FLAGS_logtostderr = false;
        // 是否同时将日志发送到标准错误和日志文件中
        FLAGS_alsologtostderr = false;
        // 当日志级别大于此级别时，自动将此日志输出到标准错误中
        FLAGS_stderrthreshold = google::FATAL;
        // 当日志级别大于此级别时会马上输出，而不缓存
        FLAGS_logbuflevel = google::WARNING;
        // 缓存最久长时间为多久
        FLAGS_logbufsecs = 0;
        // 当日志文件达到多少时，进行转存，以M为单位
        FLAGS_max_log_size =10;
        // 当磁盘已满时,停止输出日志文件
        FLAGS_stop_logging_if_full_disk = true;     
    }

    ~GLogInit()
    {
        google::ShutdownGoogleLogging();
    }   
}

```


## 自定义前缀
> https://izualzhy.cn/glog-source-reading-notes-extension
```cpp
class MyInfoLogger : public google::base::Logger {
public:
    virtual void Write(bool force_flush,
                       time_t timestamp,
                       const char* message,
                       int message_len) {
        std::cout << "MyInfoLogger::Write "
                  << "|" << force_flush
                  << "|" << timestamp
                  << "|" << message
                  << "|" << message_len << std::endl;
    }

    virtual void Flush() {
        std::cout << "MyInfoLogger::Flush" << std::endl;
    }

    virtual google::uint32 LogSize() {
        return 0;
    }
};


int main(int argc, char* argv[])
{
    google::InitGoogleLogging(argv[0]);

    MyInfoLogger my_info_logger;
    google::base::SetLogger(google::GLOG_INFO, &my_info_logger);

    LOG(INFO) << "LOG(INFO)";
    LOG(WARNING) << "LOG(WARNING)";

    return 0;
}
```

> output
```
MyInfoLogger::Write |0|1622218288|I20210529 00:11:28.126195 97325 main.cpp:49] LOG(INFO)
|55
MyInfoLogger::Write |0|1622218288|W20210529 00:11:28.126278 97325 main.cpp:50] LOG(WARNING)
|58
```