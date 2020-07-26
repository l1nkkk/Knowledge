
- cmake
  - https://stackoverflow.com/questions/12399422/how-to-set-linker-flags-for-openmp-in-cmakes-try-compile-function


# 实例
## parallel
- `parallel`:主要是创建多个并行域。用在一个结构块之前，表示这段代码将被多个线程并行执行；
- hello world
  - num_threads(6)可以省略，将会是默认的
```cpp
#include <iostream>
#include "omp.h"
using std::cout;
using std::endl;
void *thread(void *vargp);
int main() {
#pragma omp parallel num_threads(6)
    {
        cout << "hello openmp" << endl;
    }
}
```
## parallel for


## error例子

```cpp
int main() {
    int res = 0;
#pragma omp parallel for num_threads(4)
    for(auto i = 0;i < 2;i++){
        cout << "当前正在调用的线程" << omp_get_thread_num() << endl;
        res += i;
    }
    cout << endl;
    cout << omp_in_parallel() << endl;
    cout << res << endl;
}
```

# 优化实例
## SPMD---demo1
- 没优化版本

```cpp
inline double f(double x)
{
    return 4.0 / (1.0 + x * x);
}

int main(int argc, char *argv[])
{
    const long num_steps = 1000000;
    double sum = 0.0;
    double step = 1.0 / num_steps;

    for(int i =0 ; i < num_steps; ++i)
    {
        double x = (i + 0.5) * step;
        sum += f(x);
    }
    double pi = step * sum;
    printf("pi = %f", pi);
}

```

--- 

- 优化后版本

其实就是把多次求f(x)后累加，分成几份，然后最后线程归并之后在对这几份结果进行累加。
```cpp
inline double f(double x)
{
    return 4.0 / (1.0 + x * x);
}

int main(int argc, char *argv[])
{
    const long num_steps = 1000000;
    constexpr unsigned TNUM = 10;
    double sum = 0.0;
    // 注意这里编程了数组
    double sum1[100]{0.0};
    double thread_num=0;
    double step = 1.0 / num_steps;
    timeval tstart, tend;
    gettimeofday(&tstart, nullptr);


    // for(int i =0 ; i < num_steps; ++i)
    // {
    //     double x = (i + 0.5) * step;
    //     sum += f(x);
    // }
#pragma omp parallel  num_threads(TNUM)
{
    int id = omp_get_thread_num();
    int tnum = omp_get_num_threads();

    if(0 == id) thread_num = tnum;
    // l1nkkk:注意这里的i+=tnum
    for (int i = id; i < num_steps; i+=tnum) {
        double x = (i + 0.5) * step;
        sum1[id] += f(x);
    }
}
    for(int i = 0; i < 10;i++){
        sum+=sum1[i];
    }
    double pi = step * sum;
    cout << "pi = " << pi << endl;
    cout << "Thread num :" << thread_num << endl;
    gettimeofday(&tend, nullptr);
    cout << "used time : " << (tend.tv_sec - tstart.tv_sec) + (tend.tv_usec - tstart.tv_usec)/1000000.0 << endl;

}
```