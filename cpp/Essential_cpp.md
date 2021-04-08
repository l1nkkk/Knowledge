# 一些操作
## vector
- 不支持列表初始化
```cpp
// 折中
int a[5]{1,2,3,4,5};
vector<int> vi(a,a+5);
```

## 指针
```cpp
int *p;
//...
if(p && )

if(p) delete p;
```

## 文件
```cpp
// 判断了再操作
if(!outfile){}
```
- ofstream 可以为0，不会输出任何东西