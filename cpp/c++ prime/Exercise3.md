- [13](#13)
  - [13-5](#13-5)
  - [13-8](#13-8)
  - [13-22](#13-22)
  - [13-26](#13-26)
  - [13-27](#13-27)
  - [13-30&13-31](#13-3013-31)
  - [13-34 13-36 13-37](#13-34-13-36-13-37)
  - [13-38](#13-38)
  - [13.39 -- 13.43](#1339----1343)
- [15](#15)
  - [demo:容器与继承](#demo%E5%AE%B9%E5%99%A8%E4%B8%8E%E7%BB%A7%E6%89%BF)
    - [main](#main)
    - [Quote](#Quote)
    - [DiscQuote](#DiscQuote)
    - [BulkQuote](#BulkQuote)
    - [Basket](#Basket)
# 13
## 13-5
```cpp
class HasPtr {
public:
    HasPtr(const std::string& s = std::string()) : ps(new std::string(s)), i(0)
    {
    }
    HasPtr(const HasPtr& hp):ps(new string(*hp.ps)),i(hp.i){};
private:
    std::string* ps;
    int i;
};
```


## 13-8

## 13-22
```CPP
class HasPtr {
public:
    HasPtr(const std::string& s = std::string()) : ps(new std::string(s)), i(0)
    {
    }
    HasPtr(const HasPtr& hp):ps(new string(*hp.ps)),i(hp.i){
        cout << "In HasPtr(const HasPtr& hp)" << endl;
    };
    ~HasPtr(){delete ps;}
    HasPtr& operator= (const HasPtr& hp){
        cout << "In operator=" << endl;
        // 必须释放之前的
        auto newp = new string(*hp.ps)
        delete ps;
        ps = newp;
        i = hp.i;
        return *this;
    }
private:
    std::string* ps;
    int i;
};
```

## 13-26

```cpp
class ShareStrPtr;
class ShareStr{
public:
    typedef vector<string>::size_type size_type;
    friend class ShareStrPtr;
    ShareStr():data(make_shared<vector<string>>()){};
    ShareStr(initializer_list<string> ail):data(make_shared<vector<string>>(ail)){};

    ShareStr(const ShareStr& ss):data(new vector<string>(ss.data->begin(),ss.data->end())){};

    ShareStr& operator=(const ShareStr& ss){
        data = make_shared<vector<string>>(*ss.data);
        return *this;
    }

    size_type size() const{ return data->size();}
    bool empty()const{ return  data->empty();}
    void push_back(const string &t){data->push_back(t);}
    void pop_back();
    void show(){
        for(auto a : *data){
            cout << a << " ";
        }
        cout << endl;
    };
    // 元素访问
    string &front();
    string &back();

    ShareStrPtr begin();
    ShareStrPtr end();
private:
    shared_ptr<vector<string>> data;
    void check(size_type i, const string &msg)const;
};

void ShareStr::check(size_type i, const string &msg)const{
    if(i >= data->size())
        throw out_of_range(msg);
}

string& ShareStr::front() {
    check(0,"front on empty ShareStr");
    return data->front();
}

string& ShareStr::back() {
    check(0,"back on empty ShareStr");
    return data->back();
}

void ShareStr::pop_back(){
    check(0,"pop_back on empty ShareStr");
    data->pop_back();
}

class ShareStrPtr{
public:
    ShareStrPtr():curr(0){}
    ShareStrPtr(ShareStr &a, size_t sz = 0):
            wptr(a.data),curr(sz){}


    bool operator !=(const ShareStrPtr& sp){ return this->curr != sp.curr;}
    // 解引用shared_ptr
    string& deref() const;
    // 递增ShareStrPtr的curr
    ShareStrPtr& incr();

private:
    // msg 为报错信息
    shared_ptr<vector<string>> check(size_t i, const string& msg)const;
    weak_ptr<vector<string>> wptr;
    size_t curr;
};

shared_ptr<vector<string>> ShareStrPtr::check(size_t i, const string& msg)const{
    auto ret = wptr.lock();
    // 看是否已经绑定了shared_ptr
    if(!ret)
        throw runtime_error("没有绑定ShareStrPtr");
    if(i >= ret->size())
        throw std::out_of_range(msg);
    return ret;
}

string& ShareStrPtr::deref() const {
    auto p = check(curr,"deference past end");
    return (*p)[curr];
}

ShareStrPtr& ShareStrPtr::incr() {
    // curr已经到了尾后位置
    check(curr,"increment past end of StrBlobPtr");
    ++curr;
    return *this;
}

// 重点理解begin和end
ShareStrPtr ShareStr::begin() {
    return ShareStrPtr(*this);
}
ShareStrPtr ShareStr::end() {
    return ShareStrPtr(*this, data->size());
}

```

## 13-27
```cpp
class HasPtr {
public:
    HasPtr(const std::string& s = std::string()) : ps(new std::string(s)), i(0),use(0)
    {
    }
    HasPtr(const HasPtr& hp):ps(hp.ps),i(hp.i),use(hp.use){
        cout << "In HasPtr(const HasPtr& hp)" << endl;
        // 引用数++
        ++*hp.use;
    };
    ~HasPtr(){
        if(--*use == 0){
            delete ps;
            delete use;
        }

    }
    HasPtr& operator= (const HasPtr& hp){
        cout << "In operator=" << endl;
        // 1. 先看看要不要释放
        if(--*use == 0){
            delete ps;
            delete use;
        }
        // 2. 拷贝赋值
        ps = hp.ps;
        i = hp.i;
        use = hp.use;
        // 3. 引用数++
        ++*hp.use;
    }
private:
    std::string* ps;
    int i;
    size_t *use;
};
```

## 13-30&13-31
```cpp

/*
In HasPtr(const string& s = string())
In HasPtr(const string& s = string())
In HasPtr(const string& s = string())
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
初始化结束
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
 In swap 
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
 In swap 
In HasPtr(const HasPtr& hp)
In HasPtr(const HasPtr& hp)
 In swap 

Process finished with exit code 0

 */
class HasPtr;
void swap(HasPtr &hp1,HasPtr &hp2);
class HasPtr {
public:
    friend void swap(HasPtr &hp1,HasPtr &hp2);
    bool operator< (const HasPtr hp) const{
        return *(this->ps) < *(hp.ps);
    }
    HasPtr(const string& s = string()) : ps(new std::string(s)), i(0),use(new size_t(1))
    {
        cout << "In HasPtr(const string& s = string())" << endl;
    }
    HasPtr(const HasPtr& hp):ps(hp.ps),i(hp.i),use(hp.use){
        cout << "In HasPtr(const HasPtr& hp)" << endl;
        // 引用数++
        ++*hp.use;
    };
    ~HasPtr(){
        if(--*use == 0){
            delete ps;
            delete use;
        }

    }
    HasPtr& operator= (HasPtr hp){ //hp在这里的初始化调用拷贝构造函数
        swap(*this,hp);
        return *this;
    }
private:
    string* ps;
    int i;
    size_t *use;
};

void swap(HasPtr &hp1,HasPtr &hp2){
    cout << " In swap " << endl;
    using std::swap;
    swap(hp1.ps,hp2.ps);
    swap(hp1.use,hp2.use);
}

int main(){
    vector<HasPtr> vh = {{"123"},{"456"},{"355"}};
    cout << "初始化结束" << endl;
    sort(vh.begin(),vh.end());

    return 0;
}
```


## 13-34 13-36 13-37

```cpp

class Message;
class Folder{
public:
    explicit Folder(const string &s = ""):folderName(s){};
    friend void swap(Folder &lf,Folder &rf);
    Folder(const Folder&af);
    ~Folder();
    Folder& operator=(const Folder& af);
    // 添加其管理的消息，加入到自己的set中
    void addMsg(Message& am);
    // 删除其管理的消息，从自己管理的set删除
    void remMsg(Message& am);
    void show();
private:
    string folderName;
    // 存储文件夹里的消息
    set<Message*> messages;
    // 将文件夹加入到消息中的set
    void add_to_message(Folder& af);
    // 将该文件夹从消息中set删除
    void remove_from_message();
};


class Message{
    friend class Folder;
    friend void swap(Message &,Message &);
public:
    explicit Message(const string &std = ""):contents(std){}
    // 拷贝构造函数
    Message(const Message&);
    Message(Message&&);
    // 拷贝赋值函数
    Message& operator=(const Message&);
    Message& operator=(Message&&);
    ~Message();
    void save(Folder&);
    void remove(Folder&);
    void show(){
        cout << "--- Message:"<< contents << endl;
    }
private:
    // 消息内容
    string contents;
    // 包含本Message的Folder
    set<Folder*> folders;

    // 13.6.2 add:把旧消息移去，新消息添加，而且对set进行移动赋值
    void move_Folders(Message *m);
    void add_to_Folders(const Message&);
    void remove_from_Folders();
};

void Message::save(Folder &f){
    folders.insert(&f);
    f.addMsg(*this);
}

void Message::remove(Folder &f) {
    folders.erase(&f);
    f.remMsg(*this);
}

void Message::add_to_Folders(const Message &am) {
    for(auto af : am.folders){
        af->addMsg(*this);
    }
}

Message::Message(const Message& am):contents(am.contents),folders(am.folders){
    // 向folder中添加信息
    add_to_Folders(am);
}

void Message::remove_from_Folders() {
    for(auto af : folders){
        af->remMsg(*this);
    }
}
Message::~Message() {
    remove_from_Folders();
}

Message& Message::operator=(const Message &am) {
    // 不加这一步也是自相等安全的
    if(&am == this)
        return *this;
    remove_from_Folders();
    contents = am.contents;
    folders = am.folders;
    add_to_Folders(am);
    return *this;
}

void Folder::add_to_message(Folder &af) {
    for (auto am:messages){
        am->save(af);
    }
}

void Folder::remove_from_message() {
    for (auto am:messages){
        am->remove(*this);
    }
}

Folder::Folder(const Folder& af):messages(af.messages),folderName(af.folderName){
    add_to_message(*this);
};

Folder::~Folder(){
    remove_from_message();
}

Folder& Folder::operator=(const Folder &af) {
    remove_from_message();
    this->messages = af.messages;
    this->folderName = af.folderName;
    add_to_message(*this);
}

void Folder::addMsg(Message &am) {
    this->messages.insert(&am);
}

void Folder::remMsg(Message &am) {
    this->messages.erase(&am);
}

void Folder::show() {
    cout << "In Folder:" << this->folderName << endl;
    for(auto am : messages){
        am->show();
    }
}

void swap(Folder &lf,Folder &rf){
    using std::swap;
    lf.remove_from_message();
    rf.remove_from_message();
    swap(lf.messages,rf.messages);
    lf.add_to_message(lf);
    rf.add_to_message(rf);
}


// 比较复杂的地方
void swap(Message &lms, Message &rms){
    using std::swap; // 在本例中严格来说不需要，但这是一个好习惯
    lms.remove_from_Folders();
    rms.remove_from_Folders();
    swap(lms.folders,rms.folders);
    swap(lms.contents,rms.contents);
    lms.add_to_Folders(lms);
    rms.add_to_Folders(rms);
}

void Message::move_Folders(Message *m) {
    // 关键，调用set的移动赋值运算符
    folders = std::move(m->folders);
    for(auto f: folders){
        f->remMsg(*m);
        f->addMsg(*this);
    }
    m->folders.clear(); //确保销毁m是无害的
}

Message::Message(Message &&m):contents(std::move(m.contents)) { // 调用string的拷贝构造函数
    move_Folders(&m);
}

Message &Message::operator=(Message &&m) {
    // 判断是否自赋值
    if(this != &m){
        this->remove_from_Folders();
        this->contents = std::move(m.contents); // 移动赋值运算符
        this->move_Folders(&m);
    }
    return *this;
}

int main(){
    Folder af("f1"),bf("f2");
    Folder cf("f3");

    Message am("1"),bm("2"),cm("3");
    am.save(af);
    am.save(bf);
    bm.save(af);
    bm.save(cf);

    cf.addMsg(cm);


    af.show();
    bf.show();
    cf.show();

    Folder df = af;
    df.show();
    df = bf;
    df.show();
}

```

## 13-38
正常设计下，赋值运算符需要清除自己在Folder的保存，然后重新赋值之后再添加到赢保存到的Folder中  
如果使用swap，那么将需要调用一次拷贝构造函数，然后再调用swap，这里面过多不必要的操作，比如又添加folder又从folder删除

> 别人的回答
使用swap来设计的赋值运算符只在有动态分配内存的时候有意义，其他其实是没有意义的。

## 13.39 -- 13.43

```cpp
/*
 * 这是一个自己写的vector<string>
 */
class StrVec{
public:
    StrVec():firstP(nullptr),firstFree(nullptr),endP(nullptr){}
    StrVec(const StrVec&);
    StrVec(initializer_list<string> );
    StrVec & operator=(const StrVec&);
    ~StrVec();

    // 插入
    void push_back(const string&);
    // 返回实际存储量
    size_t size()const{ return firstFree - firstP;}
    // 返回容量
    size_t capacity()const{ return endP - firstP;}

    string* begin()const{return firstP;}
    string* end()const{return firstFree;}
private:
    // alloc类，用来管理内存
    static allocator<string> alloc;
    void cheakAlloc()
        {if(size() == capacity())reallocate();};
    // 被拷贝功能函数所用，传入一个范围，将这些元素拷贝到新内存中,返回一个分配的地址和其尾后地址
    pair<string*,string*> alloc_n_copy(const string*,const string*);
    // 1.destroy元素 2.释放分配的内存空间
    void free();
    // 获得更多内存
    void reallocate();
    string *firstP;     // 第一个的位置
    string *firstFree;  // 尾后指针
    string *endP;       // 动态数组尾部
};

// 动态数组拷贝后的容量可能不同。
StrVec::StrVec(const StrVec & asv) {
    auto ret = alloc_n_copy(asv.begin(),asv.end());
    firstP = ret.first;
    firstFree = endP = ret.second;
}

pair<string *, string *> StrVec::alloc_n_copy(const string *a, const string *b) {
    // 分配内存
    auto data = alloc.allocate(b-a);
    // 将其一个个考进去初始化
    return {data,uninitialized_copy(a,b,data)};
}

void StrVec::free() {
    if(firstFree) {
        // while (firstFree == firstP)
        //     alloc.destroy(--firstFree);
        // 使用了这个不能保证逆序。
        for_each(firstP,firstFree,[](const string& s){alloc.destroy(&s);});
        alloc.deallocate(firstFree, endP - firstFree);
        firstFree = endP = firstP = nullptr ;
    }
}

void StrVec::reallocate() {
    auto newcap = size()? size()*2 : 1 ;
    // 分配内存
    auto newdata = alloc.allocate(newcap);
    auto dest = newdata;

    // c从旧的考到新的
    for(auto it = firstP; it == firstFree; ++it){
        alloc.construct(dest++,std::move(*it));
    }

    // 更新指针
    firstP = newdata;
    firstFree = dest;
    // 不再firstFree == endP
    endP = newdata+newcap;
}

StrVec::~StrVec() {
    free();
}

void StrVec::push_back(const string &aStr) {
    this->cheakAlloc();
    alloc.construct(this->firstFree++,aStr);
}

StrVec &StrVec::operator=(const StrVec &asv) {
    // 释放之前的
    this->free();
    // 拷贝现在的
    auto ret = alloc_n_copy(asv.begin(),asv.end());
    firstFree = endP = ret.second;
    firstP = ret.first;
    return *this;
}

StrVec::StrVec(initializer_list<string> ls) {
    auto data = alloc.allocate(ls.size());
    auto dest = data;
    for(auto it = ls.begin();it != ls.end();++it){
        alloc.construct(dest++,*it);
    }
    firstFree = endP = dest;
    firstP = data;
}

```

# 15
## demo:容器与继承
- 在这里使用了智能指针,虚函数,多态,移动构造函数和拷贝构造函数等等

- output:
```
添加右值
添加左值
添加左值
In Quote netPrice
ISBN编号: 1000 # 卖出数量: 1 总共消费: 10
In Quote netPrice
ISBN编号: 1001 # 卖出数量: 1 总共消费: 10
ISBN编号: 1002 # 卖出数量: 1 总共消费: 14
sum：34
```

### main
```cpp
/*
    添加右值
    添加左值
    添加左值
    In Quote netPrice
    ISBN编号: 1000 # 卖出数量: 1 总共消费: 10
    In Quote netPrice
    ISBN编号: 1001 # 卖出数量: 1 总共消费: 10
    ISBN编号: 1002 # 卖出数量: 1 总共消费: 14
    sum：34
    Process finished with exit code 0
*/
int main(){
    Basket bsk;
    // 添加右值
    bsk.addItem(std::move(*(new Quote("1000",10))));
    // 添加左值
    bsk.addItem(*(new Quote("1001",10)));
    bsk.addItem(*(new BulkQuote("1002",20,0,0.3)));
    bsk.totalReceipt(cout);
}
```

### Quote

- Quote.h

```cpp
class Quote {
public:
    Quote():bookNo(),price(0){};    // 默认构造函数
    Quote(const Quote&) = default;  // 拷贝构造函数
    Quote(Quote &&) = default;      // 移动构造函数
    Quote(const string &abookNo, const double &aprice):bookNo(abookNo),price(aprice){};
    string isbn()const{return bookNo;}


    // 对自己进行克隆，设置成虚函数，可以动态绑定
    // 2-1. 调用拷贝构造函数
    virtual Quote* clone() const& {return new Quote(*this);}
    // 2-2. 调用移动构造函数
    virtual Quote* clone() const&&{return new Quote(std::move(*this));}

    virtual double netPrice(size_t n = 10) const {
        cout << "In Quote netPrice" << endl;
        return price * n;
    }
    // 1. 虚析构函数，对析构函数进行动态绑定。
    virtual ~Quote() = default;
    // 15.11
    virtual ostream & debug(ostream& os) const {
        os << "bookNo:" << bookNo << "; price:" << price;
    };
private:
    // 编号
    string bookNo;
protected:
    // 价格
    double price;
};

double printTotal(ostream &os, const Quote &item, size_t n);
```
> Quote.cpp

```cpp
double printTotal(ostream &os, const Quote &item, size_t n){
    double res = item.netPrice(n);
    os << "ISBN编号: " << item.isbn() << " # 卖出数量: " << n << " 总共消费: " << res;
    return res;
}
```

### DiscQuote

> DiscQuote.h
```cpp
class DiscQuote : public Quote{
public:
    DiscQuote() = default;
    DiscQuote(const string abooknum,double price,size_t qty,double disc):
        Quote(abooknum,price),quantity(qty),discount(disc){}
    DiscQuote(const DiscQuote&)= default;
    DiscQuote(DiscQuote&&) = default;
    ~DiscQuote(){};

    // 对自己进行克隆，设置成虚函数，可以动态绑定
    // 2-1. 调用拷贝构造函数
    DiscQuote* clone() const& override {return new DiscQuote(*this);}
    // 2-2. 调用移动构造函数
    DiscQuote* clone() const&& override {return new DiscQuote(std::move(*this));}
protected:
    size_t quantity = 0;// 折扣适用的购买量
    double discount = 0.0;// 表示值扣的小数值
};
```

### BulkQuote

> BulkQuote.h
```cpp
class BulkQuote:public DiscQuote{
public:
    BulkQuote() = default;
    BulkQuote(BulkQuote&&) = default;
    BulkQuote(const BulkQuote&) = default;
    ~BulkQuote(){};

    // BulkQuote(const string &abookNo, const double &aprice, size_t qty,double adiscount):
    //         DiscQuote(abookNo, aprice, qty, adiscount){};
    // 使用继承基类的构造函数,可以注释以上的构造函数
    using DiscQuote::DiscQuote;

    double netPrice(size_t n = 5) const override;
    // ostream & debug(ostream &os) const override {
    //     this->Quote::debug(os) << "; min_qty:" << min_qty << "; discount:" << discount;
    // }
    // 对自己进行克隆，设置成虚函数，可以动态绑定
    // 2-1. 调用拷贝构造函数
    BulkQuote* clone() const& override {return new BulkQuote(*this);}
    // 2-2. 调用移动构造函数
    BulkQuote* clone() const&& override {return new BulkQuote(std::move(*this));}
};
```

> BulkQuote.cpp
```cpp
// 15.15
double BulkQuote::netPrice(size_t n) const {
    // cout << "test ---";
    if(n > this->quantity)
        return (1-this->discount) * this->price * n;
    else
        return n * this->price;
}

```

### Basket
> Basket.h
```cpp
class Basket {
public:
    void addItem(const Quote &rq){
        cout << "添加左值" << endl;
        items.insert(shared_ptr<Quote>(rq.clone()));
    };
    void addItem(Quote &&rrq){
        cout << "添加右值" << endl;
        items.insert(shared_ptr<Quote>(move(rrq).clone()));
    };
    double totalReceipt(ostream&)const;
private:

    static bool compare(const shared_ptr<Quote> &lhs, const shared_ptr<Quote> &rhs){
        return lhs->isbn() < rhs->isbn();
    }

    // 重要的数据成员,这里不支持用()初始化
    multiset<shared_ptr<Quote>, decltype(compare)*> items{compare};
};
```

> Basket.cpp

```cpp

double Basket::totalReceipt(ostream &os) const {
    double res;
    // 注意下这个for的用法
    for(auto itp = items.cbegin(); itp != items.cend();itp = items.upper_bound(*itp)){
        res += printTotal(os, **itp, items.count(*itp));
        os << endl;
    }
    os << "sum：" << res;
    return res;
}
```