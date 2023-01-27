> https://wiki.jikexueyuan.com/project/twisted-intro/p03.html
# reactor模式
利用循环体来等待事件发生，然后处理发生的事件的模型非常常见，而被设计成为一个模式：reactor模式。
<center>
<img src="pic/1.png" height="30%" width="30%">
<br>
<span>图1</span>
</center>
这个循环就是个"reactor"（反应堆），因为它等待事件的发生然后对其作相应的反应。正因为如此，它也被称作事件循环。由于交互式系统都要进行I/O操作，因此这种循环也有时被称作select loop,这是由于select调用被用来等待I/O操作。  

一个真正reactor模式的实现是需要实现循环独立抽象出来(独立于业务，专注于事件)并具有如下的功能：
- 监视一系列与你I/O操作相关的文件描述符（description)
- 不停地向你汇报那些准备好的I/O操作的文件描述符

一个设计优秀的reactor模式实现需要做到：
- 处理所有不同系统会出现的I/O事件
- 提供优雅的抽象来帮助你在使用reactor时少花些心思去考虑它的存在
- 提供你可以在抽象层外使用的公共协议实现。
# 初识
## 最简单的twisted程序

```py
from twisted.internet import reactor
reactor.run()
```
twisted实现了Reactor模式，因此它必然会有一个对象来代表这个reactor或者说是事件循环，而这正是twisted的核心。上面代码的第一行引入了reactor，第二行开始启动事件循环


- Twisted的reactor只有通过调用reactor.run()才启动。
- reactor循环是在其开始的线程中运行，也就是运行在主线程中。
- 一旦启动，reactor就会在程序的控制下（或者具体在一个启动它的线程的控制下）一直运行下去。
- reactor空转时并不会消耗任何CPU的资源。
- 并不需要显式的创建reactor，只需要引入就OK了（单例模式）。

在Twisted中，reactor是Singleton模式，即在一个程序中只能有一个reactor，并且只要你引入它就相应地创建一个。当然了，twisted还有其它可以引入reactor的方法。例如，可以使用twisted.internet.pollreactor来调用poll代替select方法。  

若使用其它的reactor，需要在引入twisted.internet.reactor前安装它。下面是安装pollreactor的方法：

```py
from twited.internet import pollreactor
pollreactor.install()
from twisted.internet import reactor
reactor.run()
```
- pollreactor.install()
  - 安装reactor

## hello world
```py
def hello():
    print 'Hello from the reactor loop!'
    print 'Lately I feel like I\'m stuck in a rut.'
from twisted.internet import reactor 
reactor.callWhenRunning(hello)
print 'Starting the reactor.'
reactor.run()
```

我们使用回调来描述hello函数的引用。回调实际上就是交给Twisted（或者其它框架）的一个函数引用，这样Twisted会在合适的时间调用这个函数引用指向的函数，具体到这个程序中，是在reactor启动的时候调用。由于Twisted循环是独立于我们的代码，`我们的业务代码与reactor核心代码的绝大多数交互都是通过使用Twisted的APIs回调我们的业务函数来实现的`。

> 下面这几点值得我们仔细考虑下：

- reactor模式是单线程的。
- 像Twisted这种交互式模型已经实现了reactor循环，意味无需我们亲自去实现它。
- 我们仍然需要框架来调用我们自己的代码来完成业务逻辑。
- 因为在单线程中运行，要想跑我们自己的代码，必须在reactor循环中调用它们。
- reactor事先并不知道调用我们代码的哪个函数

<center>
<img src="pic/2.png" height="30%" width="30%">
<br>
<span>图1</span>
</center>

上图揭示了回调中的几个重要特性：  
- 我们的代码与Twisted代码运行在同一个线程中。
- 当我们的代码运行时，Twisted代码是处于暂停状态的。
- 同样，当Twisted代码处于运行状态时，我们的代码处于暂停状态。
- reactor事件循环会在我们的回调函数返回后恢复运行。

注： 在一个回调函数执行过程中，实际上Twisted的循环是被有效地阻塞在我们的代码上的。因此，**我们应该确保回调函数不要浪费时间（尽快返回）**

## 退出Twisted
```py
class Countdown(object):

    counter = 5

    def count(self):
        if self.counter == 0:
            reactor.stop()
        else:
            print self.counter, '...'
            self.counter -= 1
            reactor.callLater(1, self.count)

from twisted.internet import reactor

reactor.callWhenRunning(Countdown().count)

print 'Start!'
reactor.run()
print 'Stop!'
```
- callLater函数
  - callLater函数为Twisted注册了一个回调函数。callLater中的第二个参数是回调函数，第一个则是说明你希望在将来几秒钟时执行你的回调函数。
  - 。由于程序并没有监听任何文件描述符，为什么它没有像前那些程序那样卡在select循环上？select函数，或者其它类似的函数，同样会接纳一个超时参数。如果在只提供一个超时参数值并且没有可供I/O操作的文件描述符而超时时间到时，select函数同样会返回。因此，如果设置一个0的超时参数，那么会无任何阻塞地立即检查所有的文件描述符集。

## 异常

在结束我们的回调函数后会再次回到Twisted代码中，若在我们的回调中发生异常，那是不是异常会跑到Twisted代码中，而造成不可想象的后果？ 

reactor并不会因为回调函数中出现失败（虽然它会报告异常）而停止运行。