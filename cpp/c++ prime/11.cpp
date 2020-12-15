class Student{
public:
    friend ostream &operator <<(ostream & out,const Student astu);
    Student(const string& aname,const int& aage):name(aname),age(aage){};
    string getName() const {return name;};
    int getAge() const {return age;};
private:
    string name;
    int age;
};

ostream &operator <<(ostream & out,const Student astu){
    cout << "Name: "<< astu.name << " Age:" << astu.age;
}

bool compareStudent(const Student &s1,const Student &s2){
    return s1.getName() < s2.getName();
}

int main(){
    vector<string> vs1{"1","1","2","2","3","3"};

    // 1-1. 定义空set
    set<string> ss1;
    // 1-2. 定义空map
    map<string,string> mss1;

    // 2-1.列表初始化set
    set<string> ss2{"one","two","three","one","two","three"};
    // output:one three two
    for(auto a : ss2){
        cout << a << " ";
    }
    cout << endl;
    // 2-2.列表初始化map
    map<string,string> mss2{
            {"One","1"},
            {"Two","2"},
            {"Three","3"}
    };

    // 3-1. 容器范围初始化 set
    set<string> ss3(vs1.begin(),vs1.end());
    // 3-2. 容器范围初始化 multiset
    multiset<string> ms1(vs1.begin(),vs1.end());

    // 4 定义自定义类,必须要传给一个比较函数。
    set<Student, decltype(compareStudent) *> sStu1(compareStudent);
    // 等价于：set<Student, decltype(compareStudent) *> sStu1(&compareStudent);
    sStu1.insert({"l1nkkk",3});
    sStu1.insert({"l1nkkz",3});
    sStu1.insert({"l1nkka",3});
    // 没有效果的，因为已经存在了
    sStu1.insert({"l1nkkk",4});
    for(auto a:sStu1){
        cout << a << endl;
    }

    // 5-1. set添加元素，迭代器范围
    ss2.insert(vs1.begin(),vs1.end());
    // output:1 2 3 one three two
    for(auto a:ss2){
        cout << a << " ";
    }
    cout << endl;

    // 5-2. set添加元素，初始化器列表
    ss2.insert({"4","5","6"});
    // output:1 2 3 4 5 6 one three two
    for(auto a:ss2){
        cout << a << " ";
    }
    cout << endl;

    // 6-1 map添加元素，花括号初始化
    mss2.insert({"Four","4"});
    // Key已存在，不起作用
    auto res = mss2.insert({"Three","4"});
    // output:插入无效
    cout << (res.second ? "插入成功\n":"插入无效\n");

    // 6-2 map添加元素，调用make_pair
    mss2.insert(make_pair("Five","5"));

    // 6-3 map添加元素，显示构造pair
    mss2.insert(pair<string,string>("Six","6"));

    // 6-4 map添加元素，模板类类型显示构造pair
    mss2.insert(pair<string,string>("Seven","7"));
    // output:Key:Five Value:5 ; Key:Four Value:4 ; Key:One Value:1 ; Key:Seven Value:7 ; Key:Six Value:6 ; Key:Three Value:3 ; Key:Two Value:2 ;
    for(auto it = mss2.cbegin();it != mss2.cend();it++){
        cout << "Key:"<< it->first << " Value:" << it->second << " ; ";
    }
    cout << endl;

    // 7-1 可重复关联容器的遍历：通过find+count
    auto endcount = ms1.count("1");
    auto ms1_it = ms1.find("1");
    cout << "--------multiset show1:\n";
    while(endcount){
        cout << *ms1_it++ << " ";
        endcount--;
    }
    cout << "\n--------end" << endl;

    // 7-2 可重复关联容器的遍历：通过lower_bound和upper_bround
    cout << "--------multiset show2:\n";
    for(auto lbit = ms1.lower_bound("2"), ubit = ms1.upper_bound("2");
    lbit != ubit;
    ++lbit){
        cout << *lbit << " ";
    }
    cout << "\n--------end" << endl;

    // 7-3 可重复关联容器的遍历：通过equal_range
    cout << "--------multiset show3:\n";
    for(auto erit = ms1.equal_range("3");
        erit.first != erit.second;
        ++erit.first){
        cout << *erit.first << " ";
    }
    cout << "\n--------end" << endl;
    return 0;

}