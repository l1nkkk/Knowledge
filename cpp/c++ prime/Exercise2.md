# 8
## 8-1
## 8-2
```cpp
using std::istream;

istream& exercise8_1(istream& ist){
    string buf;
    while(ist >> buf){
        cout << buf << " " << endl;
    }
    ist.clear();
    return ist;
}

int main(){
    exercise8_1(std::cin);
}
```

## 8-3
- 当这个三个被置位的时候
    - failbit
    - badbit
    - eofbit

## 8-4
```cpp
void exercise8_4(){
    string readFile = "/home/l1nkkk/clionObj/test/1.data";
    vector<string> vs;
    string tstr;
    ifstream in(readFile);
    if(!in) cout << "打开失败" << endl;

    while (getline(in,tstr)){
        vs.push_back(tstr);
        cout << tstr << endl;
    }
}
```
## 8-5
```cpp
void exercise8_5(){
    string readFile = "/home/l1nkkk/clionObj/test/1.data";
    vector<string> vs;
    string tstr;
    ifstream in(readFile);
    if(!in) cout << "打开失败" << endl;

    while (in >> tstr){
        vs.push_back(tstr);
        cout << tstr << endl;
    }
}
```

# 9
## 9-2
```cpp
list<deque<int> > ld;
```

## 9-7
```cpp
vector<int>::size_type;
```

## 9-8
```cpp
list<string>::iterator || list<string>::const_iterator // read
list<string>::iterator // write
```