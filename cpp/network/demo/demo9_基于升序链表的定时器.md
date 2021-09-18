# 头文件
- 挺简单的，就是一个双向链表的应用，然后插入删除和更新保持有序。
- 接口
  - add：添加定时器
  - del：删除定时器
  - update：对更新后的定时器进行位置调整
  - tick():遍历链表，执行过期的定时器中的回调函数。
```cpp
struct TimerNode{
public:
    using FuncType = void (*)(void *ptr);
    TimerNode(const time_t t, FuncType fun, void *data)
        : expire(t), cb(fun), ptr(data){
        guid = netbase::generate_hex(16);
        // debug
        LOG(INFO) << "TimerNode:" <<guid;
    }
    ~TimerNode(){
        pre = nullptr;
        next = nullptr;
        LOG(INFO) << "TimerNode deconstruct...; " << guid;
    }
    std::string guid;
    void (*cb)(void *ptr) = nullptr;
    time_t expire = 0;                              // 绝对时间
    void *ptr = nullptr;                            // 回调函数传参
    std::shared_ptr<TimerNode> pre = nullptr;
    std::shared_ptr<TimerNode> next = nullptr;
private:
    TimerNode(){}
};

// timerlist
/**
 * @brief 升序管理
 */
class TimerListMgr{
public:
    TimerListMgr():_head(nullptr), _tail(nullptr){};
    // 添加定时器,升序
    void add(std::shared_ptr<TimerNode> sptn);
    // 对已有某个定时器的更新
    void update(std::shared_ptr<TimerNode> sptn);
    // 删除某个定时器
    void del(std::shared_ptr<TimerNode> sptn);
    // 心跳
    void tick();
private:
    void _add(std::shared_ptr<TimerNode> head, const std::shared_ptr<TimerNode>& sptn);
    std::shared_ptr<TimerNode> _head;
    std::shared_ptr<TimerNode> _tail;
    int size = 0;
};
```

```cpp
void TimerListMgr::add(std::shared_ptr<TimerNode> sptn) {
    if(sptn == nullptr)
        return;

    ++size;
    if(_head == nullptr){
        _head = sptn;
        _tail = sptn;
        return;
    }
    if(sptn->expire < _head->expire){
        _head->pre = sptn;
        sptn->next = _head;
        _head = sptn;
        return;
    }

    _add(_head, sptn);

    return;
}

void TimerListMgr::del(std::shared_ptr<TimerNode> sptn) {
    if(sptn == nullptr)
        return;

    --size;
    if(sptn != _head){
        sptn->pre->next = sptn->next;
    }else{
        _head = sptn->next;
    }
    if(sptn != _tail){
        sptn->next->pre = sptn->pre;
    }else{
        _tail = sptn->pre;
    }
    sptn->next = nullptr;
    sptn->pre = nullptr;
    return;
}

void TimerListMgr::update(std::shared_ptr<TimerNode> sptn){
    if(sptn == nullptr)
        return;
    del(sptn);
    add(sptn);
}


void TimerListMgr::_add(std::shared_ptr<TimerNode> head, const std::shared_ptr<TimerNode>& sptn) {
    auto it = std::move(head);
    while (it != nullptr){
        // 找到比其大的位置
        if(it->expire > sptn->expire){
            break;
        }
        it = it->next;
    }
    if(it != nullptr){
        // 在it前面插入
        it->pre->next = sptn;
        sptn->pre = it->pre;
        it->pre = sptn;
        sptn->next = it;
    }else{
        // 在链表尾部插入
        _tail->next = sptn;
        sptn->pre = _tail;
        _tail = sptn;
    }
    return;
}

void TimerListMgr::tick() {
    if(_head == nullptr){
        return;
    }
    time_t nowTime = time(nullptr);
    auto it = _head;
    while(it != nullptr){
        if(it->expire > nowTime)
            break;
        if(it->expire <= nowTime){
            it->cb(it->ptr);
            _head = it->next;
            if(_head)
                _head->pre = nullptr;
            else
                _tail = _head;
            it = _head;
        }
    }
}

```