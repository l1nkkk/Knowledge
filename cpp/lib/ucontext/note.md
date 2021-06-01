- 教程：https://zhengyinyong.com/post/ucontext-usage-and-coroutine/

# demo

## demo1
- 有点setjmp/longjmp 的味道，但是更加高级
```cpp
int main(void)
{
    ucontext_t context;

    getcontext(&context);
    printf("Hello world\n");
    sleep(1);
    setcontext(&context);
    return 0;
}
```

> output

```
hello
hello
...一直hello
```

## demo2
- uc_link没有设置的话，函数结束后就结束运行了

```cpp
void foo(void)
{
    printf("foo\n");
}

int main(void)
{
    ucontext_t context;
    char stack[1024];

    getcontext(&context);
    context.uc_stack.ss_sp = stack;
    context.uc_stack.ss_size = sizeof(stack);
    context.uc_link = NULL;
    makecontext(&context, foo, 0);

    printf("Hello world\n");
    sleep(1);
    setcontext(&context);
    return 0;
}
```
> output

```cpp
Hello world
foo
``` 