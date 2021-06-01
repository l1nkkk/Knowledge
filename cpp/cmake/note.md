> https://www.hahack.com/codes/cmake/
> 
> https://blog.csdn.net/lanchunhui/article/details/57574867
> 
> 推荐：https://www.cnblogs.com/52php/p/5681755.html

- [基本](#基本)
  - [变量](#变量)
    - [显示设置变量set](#显示设置变量set)
    - [引用变量](#引用变量)
  - [内部构建和外部构建](#内部构建和外部构建)
  - [外部构建](#外部构建)
- [构建目标文件](#构建目标文件)
  - [编译可执行目标文件：add_executable](#编译可执行目标文件add_executable)
  - [编译共享库：ADD_LIBRARY](#编译共享库add_library)
    - [解析](#解析)
    - [demo](#demo)
    - [设置目标文件输出的名称：SET_TARGET_PROPERTIES](#设置目标文件输出的名称set_target_properties)
    - [动态库版本号：SET_TARGET_PROPERTIES](#动态库版本号set_target_properties)
    - [安装](#安装)
- [导入](#导入)
  - [头文件搜索路径：INCLUDE_DIRECTORIES](#头文件搜索路径include_directories)
  - [导入共享库](#导入共享库)
    - [添加共享库目录：LINK_DIRECTORIES](#添加共享库目录link_directories)
    - [添加共享库：TARGET_LINK_LIBRARIES](#添加共享库target_link_libraries)
      - [demo](#demo-1)
  - [添加项目子目录：ADD_SUBDIRECTORY](#添加项目子目录add_subdirectory)
  - [换个地方保存目标二进制](#换个地方保存目标二进制)
- [安装](#安装-1)
  - [安装路径前缀：CMAKE_INSTALL_PREFIX](#安装路径前缀cmake_install_prefix)
  - [定义安装规则：INSTALL](#定义安装规则install)
    - [**目标文件安装解析**](#目标文件安装解析)
    - [**普通文件安装**](#普通文件安装)
    - [**非目标文件的可执行程序安装（如脚本）**](#非目标文件的可执行程序安装如脚本)
    - [**目录的安装**](#目录的安装)
    - [其他](#其他)
- [工程制作](#工程制作)
- [其他](#其他-1)
  - [版本要求](#版本要求)
  - [项目名称](#项目名称)
  - [源文件添加到变量](#源文件添加到变量)
  - [设置全局define](#设置全局define)
  - [Message命令](#message命令)
- [命令](#命令)

# 基本
- CMakeLists.txt 每个文件夹一个（有源文件的地方）
- 内部构建(in-source build)和外部构建(out-of-source build)
  - 外部构建就是中间文件一堆在自己选中的文件夹中，不会和源代码混合在一起
- 指令(参数1 参数2...) :参数使用括弧括起，**参数之间使用空格或分号分开**。
- 指令**大小写无关**，推荐全部使用**大写**指令。
## 变量
### 显示设置变量set
- 用于定义变量：`SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])`
  - 设置C++版本： `set(CMAKE_CXX_STANDARD 14)`
  - `SET(SRC_LIST main.c t1.c )` <==> `SET(SRC_LIST "main.c" "t1.c" )`
    - 后者支持文件名出现空格

### 引用变量
- 我们使用了`${}`来引用变量，这是cmake的变量应用方式，但是，有一些例外，比如在IF控制语句，变量是直接使用变量名引用，而不需要`${}`。如果使用了`${}`去应用变量，其实IF会去判断名为`${}`所代表的值的变量，那当然是不存在的了。

## 内部构建和外部构建
- 内部构建
  - 生成了一些无法自动删除的中间文件（即无法通过`make distclean`删除中间文件）
> 内部构建后的文件比源文件还多
```
$ ls
CMakeCache.txt  cmake_install.cmake  main.c
CMakeFiles      CMakeLists.txt       Makefile

```

## 外部构建
- 推荐使用
- 步骤：
  1. 如果 内部构建过，需要删除所有内部构建产生的文件
  2. 建立**编译目录** build，**可以在任何地方建立**，不一定再工程目录中
  3. 进入build目录，执行`cmake [CMakeLists.txt所在目录]`
  4. 这时候已经产生了make需要的中间文件，运行make构建工程
- 注：`HELLO_SOURCE_DIR` 仍然指代工程路径，即` /backup/cmake/t1` 而H`ELLO_BINARY_DIR` 则指代编译路径，即`/backup/cmake/t1/build`


# 构建目标文件
## 编译可执行目标文件：add_executable
- 指定生成目标和参与生成的源文件：**add_executable**
  - eg：`add_executable(Demo main.cc)`： 将名为 main.cc 的源文件编译成一个名称为 Demo 的可执行文件
  - **一个目录多个源文件**：`add_executable(Demo main.cc MathFunctions.cc)`
    - 分别编译成目标文件后参与链接

## 编译共享库：ADD_LIBRARY


### 解析
```cmake
ADD_LIBRARY(libname [SHARED|STATIC|MODULE][EXCLUDE_FROM_ALL]source1 source2 ... sourceN)
```
- `libname`：填写hello ==自动转成==> `libhello.X`，如果是动态库‘X‘为`.so`，静态库为`.a`
- `SHARED` : 动态库(扩展名为.so)
- `STATIC` : 静态库(扩展名为.a)，默认
- `MODULE` : 在使用dyld的系统有效，如果不支持dyld，则被当作SHARED对待。
- `EXCLUDE_FROM_ALL` : 参数的意思是这个库不会被默认构建，除非有其他的组件依赖或者手工构建。

  - eg：`ADD_LIBRARY (MathFunctions ${DIR_LIB_SRCS})`：生成名称为MathFunctions的静态链接库


### demo

```cmake
SET(LIBHELLO_SRC hello.c)
ADD_LIBRARY(hello SHARED ${LIBHELLO_SRC})
ADD_LIBRARY(hello_static STATIC ${LIBHELLO_SRC})
```
> output
```
│   ├── libhello.so
│   ├── libhello_static.a
```
> 解析
- 如果是`ADD_LIBRARY(hello STATIC ${LIBHELLO_SRC})`，会发现，静态库根本没有被构建，仍然只生成了一个动态库。
  - 因为hello作为一个target是不能重名的，所以，静态库构建指令无效。
  - 但是我们一般想要的都是同名，通过下面的指令可以实现

### 设置目标文件输出的名称：SET_TARGET_PROPERTIES
```cmake
SET_TARGET_PROPERTIES(target1 target2 ...PROPERTIES prop1 value1prop2 value2 ...)
```
- eg:解决上一个demo的问题`SET_TARGET_PROPERTIES(hello_static PROPERTIES OUTPUT_NAME "hello")`
  - 可以同时得到`libhello.so/libhello.a`两个库了

### 动态库版本号：SET_TARGET_PROPERTIES
- 一般要的是下面这样的效果
```
libhello.so.1.2
libhello.so ->libhello.so.1
libhello.so.1->libhello.so.1.2
```
- 实现：
  - `SET_TARGET_PROPERTIES(hello PROPERTIES VERSION 1.2 SOVERSION 1)`，效果如下
  - VERSION指代动态库版本，SOVERSION指代API版本。
```
│   ├── libhello.a
│   ├── libhello.so -> libhello.so.1
│   ├── libhello.so.1 -> libhello.so.1.2
│   ├── libhello.so.1.2
```



### 安装
- 原目录结构
```
.
├── CMakeLists.txt
└── lib
    ├── CMakeLists.txt
    ├── hello.c
    └── hello.h

```

- 命令
```cmake
INSTALL(TARGETS hello hello_static
LIBRARY DESTINATION lib
ARCHIVE DESTINATION lib)
INSTALL(FILES hello.h DESTINATION include/hello)
```


# 导入

## 头文件搜索路径：INCLUDE_DIRECTORIES
```cmake
INCLUDE_DIRECTORIES([AFTER|BEFORE] [SYSTEM] dir1 dir2 ...)
```
- `AFTER|BEFORE`：控制是追加还是置前
- EG：`INCLUDE_DIRECTORIES(/usr/include/hello)`
- 注：也相当于环境变量中增加路径到 CPLUS_INCLUDE_PATH 变量的作用。相当于GCC中的`-`

## 导入共享库
### 添加共享库目录：LINK_DIRECTORIES
- 添加非标准的共享库搜索路径
- 可以是一个可执行文件，但是同样可以用于为自己编写的共享库添加共享库链接
```cmake
LINK_DIRECTORIES(directory1 directory2 ...)
```

> link_directories
- 去哪找**库文件**（.so/.dll/.lib/.dylib/...），-L（GCC）：`link_directories()`
  - 注：也相当于环境变量中增加 LD_LIBRARY_PATH 的路径的作用
  - 注：静态动态都在这
  - eg：link_directories("/home/server/third/lib")
- 需要链接的库文件的名字，-l（GCC）：`LINK_LIBRARIE(库名称即可)`
  - STATIC 静态， SHARED 动态

### 添加共享库：TARGET_LINK_LIBRARIES
- 为target添加需要链接的共享库
```cmake
TARGET_LINK_LIBRARIES(target library1<debug | optimized> library2...)
```
- 如果是静态的则使用：`TARGET_LINK_LIBRARIES(main libhello.a)`
- 动态的可以直接：`TARGET_LINK_LIBRARIES(main hello)`
#### demo
- 这几句的顺序不能乱，不然就要出现问题
```cmake
LINK_DIRECTORIES(/home/l1nkkk/tmp/lib)

ADD_EXECUTABLE(main main.c)
TARGET_LINK_LIBRARIES(main libhello.so)

```

> 查看链接情况
- ldd：查看动态链接
- 动态链接下
```
$ ldd src/main 
	linux-vdso.so.1 (0x00007fff3c353000)
	libhello.so.1 => /home/l1nkkk/tmp/lib/libhello.so.1 (0x00007f2bbb0c9000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f2bbaecc000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f2bbb0d5000)

```
- 静态链接下

```
$ ldd ./src/main 
	linux-vdso.so.1 (0x00007fffcad56000)
	libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f489bfbf000)
	/lib64/ld-linux-x86-64.so.2 (0x00007f489c1c3000)

```


## 添加项目子目录：ADD_SUBDIRECTORY
- `ADD_SUBDIRECTORY(source_dir [binary_dir] [EXCLUDE_FROM_ALL])`
  - 这个指令用于向当前工程添加存放源文件的子目录
  - 并可以指定中间二进制和目标二进制存放的位置。
    - `ADD_SUBDIRECTORY(src bin)`：相当于向当前工程添加存放源文件的子目录`src`，把编译过程中的中间二进制和目标二进制存放在 **${PROJECT_BINARY_DIR}/bin** 下面
      - **如果不进行`bin`目录的指定**，那么编译结果(包括中间结果)都将存放在`build/src`目录(这个目录跟原有的src目录对应)，指定`bin`目录后，**相当于在编译时将`src`重命名为`bin`**，所有的中间结果和目标二进制都将存放在`bin`目录。
  - `EXCLUDE_FROM_ALL`参数的含义是将这个目录从编译过程中排除，比如，工程的example，可能就需要工程构建完成后，再进入example目录单独进行构建\

- 指明本项目包含一个**子目录**，这样该子目录下的CMakeLists.txt文件也会被处理：add_subdirectory
  - 注：当前子目录
  - eg：`add_subdirectory(math)`,添加当前目录下的math目录到项目子目录

> SUBDIRS指令
- 使用方法是：SUBDIRS(dir1 dir2...)
- 注：`SUBDIRS(dir1)` <===> `ADD_SUBDIRECTORY(dir1)`
- 但个指令已经不推荐使用。
- 它**可以一次添加多个子目录**，并且即使外部编译，子目录体系仍然会被保存。
- 如果我们在上面的例子中将`ADD_SUBDIRECTORY (src bin)修改为SUBDIRS(src)`。那么在build目录中将出现一个src目录，生成的目标代码hello将存放在src目录中。


## 换个地方保存目标二进制
- 不论是**SUBDIRS**还是**ADD_SUBDIRECTORY**指令，都可以通过SET指令重新定义**EXECUTABLE_OUTPUT_PATH**和**LIBRARY_OUTPUT_PATH**变量来指定**最终的目标二进制的位置**
- 下面分别指定可执行文件 和 共享库的位置
  - 不包含编译生成的中间文件
```cmake
SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
SET(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)
```
- **在哪里加**
  - 在哪里`ADD_EXECUTABLE`或`ADD_LIBRARY`，如果需要改变目标存放路径，就在哪里加入上述的定义


> `<projectname>_BINARY_DIR`和`PROJECT_BINARY_DIR`
-  `<projectname>_BINARY_DIR`和`PROJECT_BINARY_DIR`变量，他们指的编译发生的当前目录，两种情况
   - 内部编译：PROJECT_SOURCE_DIR也就是工程代码所在目录
   - 外部编译：指的是外部编译所在目录，也就是执行cmake时的所在目录




  


# 安装
## 安装路径前缀：CMAKE_INSTALL_PREFIX
- CMAKE_INSTALL_PREFIX变量类似于configure脚本的 –prefix
- CMAKE_INSTALL_PREFIX的**默认定义是`/usr/local`**

> 法1
```sh
cmake -DCMAKE_INSTALL_PREFIX=/usr ..
```
> 法2
- 定义在`PROJECT` 之后。
```cmake
SET(CMAKE_INSTALL_PREFIX /home/l1nkkk/tmp)
```
## 定义安装规则：INSTALL
- INSTALL指令用于定义安装规则，**安装的内容可以包括目标二进制、动态库、静态库以及文件、目录、脚本等**。（注：README这些都可以）

### **目标文件安装解析**
```cmake
INSTALL(TARGETS targets...
[[ARCHIVE|LIBRARY|RUNTIME]
[DESTINATION <dir>]
[PERMISSIONS permissions...]
[CONFIGURATIONS
[Debug|Release|...]]
[COMPONENT <component>]
[OPTIONAL]
] [...])
``` 
- `targets`：就是我们通过`ADD_EXECUTABLE`或者`ADD_LIBRARY`定义的目标文件，可能是可执行**二进制、动态库、静态库**
- 三种目标类型 
  - `ARCHIVE`: 指静态库
  - `LIBRARY`: 指动态库
  - `RUNTIME`: 指可执行目标二进制
- `DESTINATION`：定义了安装的路径，如果路径以/开头，那么指的是绝对路径，这时候`CMAKE_INSTALL_PREFIX`其实就无效了。如果你希望使用`CMAKE_INSTALL_PREFIX`来定义安装路径，就要写成相对路径，即不要以/开头，那么安装后的路径就是`${CMAKE_INSTALL_PREFIX}/<DESTINATION定义的路径>`
> demo1
```cmake
PROJECT(HELLO)

SET(CMAKE_INSTALL_PREFIX /home/l1nkkk/tmp)
ADD_SUBDIRECTORY(src bin)
ADD_EXECUTABLE(hellobin src/main.c)

install(TARGETS hellobin DESTINATION bin) 
```
> demo2
```cmake
INSTALL(TARGETS myrun mylib mystaticlib
RUNTIME DESTINATION bin
LIBRARY DESTINATION lib
ARCHIVE DESTINATION libstatic
)
```
### **普通文件安装**
```cmake
INSTALL(FILES files... DESTINATION <dir>
[PERMISSIONS permissions...]
[CONFIGURATIONS [Debug|Release|...]]
[COMPONENT <component>]
[RENAME <name>] [OPTIONAL])
```
- `files`：文件名是此指令所在路径下的相对路径
- `PERMISSIONS`：指定访问权限
  - 果默认不定义权限PERMISSIONS，安装后的权限为：`OWNER_WRITE, OWNER_READ, GROUP_READ,和WORLD_READ`，即**644权限**。


### **非目标文件的可执行程序安装（如脚本）**

```cmake
INSTALL(PROGRAMS files... DESTINATION <dir>
[PERMISSIONS permissions...]
[CONFIGURATIONS [Debug|Release|...]]
[COMPONENT <component>]
[RENAME <name>] [OPTIONAL])
```
- 与`FILES`一样，唯一的不同是安装后权限为:`OWNER_EXECUTE, GROUP_EXECUTE, 和WORLD_EXECUTE`，即755权限

### **目录的安装**
```cmake
INSTALL(DIRECTORY dirs... DESTINATION <dir>
[FILE_PERMISSIONS permissions...]
[DIRECTORY_PERMISSIONS permissions...]
[USE_SOURCE_PERMISSIONS]
[CONFIGURATIONS [Debug|Release|...]]
[COMPONENT <component>]
[[PATTERN <pattern> | REGEX <regex>]
[EXCLUDE] [PERMISSIONS permissions...]] [...])
```
- `dirs`: 所在Source目录的相对路径
  - 注意：abc和abc/有很大的区别。（abc包括目录本身）
  - 如果目录名不以/结尾，那么这个目录将被安装为目标路径下的abc，如果目录名以/结尾，代表将这个目录中的内容安装到目标路径，但不包括这个目录本身。
- `PATTERN`：用于使用正则表达式进行过滤
- `PERMISSIONS`：用于指定PATTERN过滤后的文件权限。

```cmake
INSTALL(DIRECTORY icons scripts/ DESTINATION share/myproj
PATTERN "CVS" EXCLUDE
PATTERN "scripts/*"
PERMISSIONS OWNER_EXECUTE OWNER_WRITE OWNER_READ
GROUP_EXECUTE GROUP_READ)
```

```
将icons目录安装到 <prefix>/share/myproj，将scripts/中的内容安装到<prefix>/share/myproj不包含目录名为CVS的目录，对于scripts/*文件指定权限为 OWNER_EXECUTE OWNER_WRITE OWNER_READ ROUP_EXECUTE GROUP_READ。
```

### 其他
```
INSTALL([[SCRIPT <file>] [CODE <code>]] [...])
SCRIPT参数用于在安装时调用cmake脚本文件（也就是<abc>.cmake文件）
CODE参数用于执行CMAKE指令，必须以双引号括起来。比如：
INSTALL(CODE "MESSAGE(\"Sample install message.\")")
安装还有几个被标记为过时的指令，比如INSTALL_FILES等，这些指令已经不再推荐使用，所以，这里就不再赘述了。下面，我们就来改写我们的工程文件，让他来支持各种文件的安装，并且，我们要使用CMAKE_INSTALL_PREFIX指令。
```


# 工程制作
采用 out-of-source 外部构建，约定的构建目录是工程目录下的build自录。

本小节的任务是让前面的Hello World更像一个工程，我们需要作的是：

1. 为工程添加一个子目录src，用来放置工程源代码;
2. 添加一个子目录doc，用来放置这个工程的文档hello.txt
3. 在工程目录添加文本文件COPYRIGHT, README；
4. 在工程目录添加一个runhello.sh脚本，用来调用hello二进制
5. 将构建后的目标文件放入构建目录的bin子目录；
6. 最终安装这些文件：将`hello`二进制与runhello.sh安装至`/usr/bin`，将doc目录的内容以及`COPYRIGHT/README`安装到`/usr/share/doc/cmake/t2`

```
.   # 工程目录
├── build   # d 构建目录
├── src     # d 源代码
├── doc     # d 文档
├── bin     # d 存放构建后的目标文件
├── COPYRIGHT
├── README
├── run.sh
├── CMakeLists.txt
```



# 其他
## 版本要求
- CMake 最低版本号要求：cmake_minimum_required
  - eg：`cmake_minimum_required (VERSION 2.8)`

## 项目名称
- 项目信息，表示项目的名称：PROJECT(projectname [CXX] [C] [Java])
  - 可指定工程支持的语言，支持的语言列表是可以忽略的
  - 隐式的定义了两个cmake变量:`<projectname>_BINARY_DIR `以及 `<projectname>_SOURCE_DIR`，分别是二进制
  - eg：`project (Demo1)`，定义了两个变量：`Demo1_BINARY_DIR `以及 `Demo1_SOURCE_DIR`

- 注：生成的可执行文件名称，与项目名没有关系。eg：`ADD_EXECUTABLE(t1 main.c)` 生成的可执行文件名称为t1

> `PROJECT_BINARY_DIR` 和 `PROJECT_SOURCE_DIR` 变量
- cmake系统也帮助我们预定义了`\PROJECT_BINARY_DIR` 和 `PROJECT_SOURCE_DIR` 变量，他们的值分别跟 `<projectname>_BINARY_DIR `以及 `<projectname>_SOURCE_DIR`一致
- 建议使用`PROJECT_BINARY_DIR` 和 `PROJECT_SOURCE_DIR`。
  - 因为稳定，修改了工程名称也无所谓

## 源文件添加到变量
- **省事大法**，不用一个个添加到add_executable：`aux_source_directory(<dir> <variable>)`，将dir下的所有源文件添加到variable变量中
```cmake
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(Demo ${DIR_SRCS})

```

## 设置全局define
- 添加DEBUG
  - eg：`add_definitions(-DL1NKKKDEBUG)`
  - 注：相当于 g++ 命令的 -D 选项的作用（-DCPU_ONLY）

## Message命令
- 输出信息与错误处理：MESSAGE
   -  SEND_ERROR，产生错误，生成过程被跳过。
   - SATUS，输出前缀为`--`的信息。
   - FATAL_ERROR，立即终止所有cmake过程
    ```cmake 
    MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display"...)
     ```


# 命令
- `cmake .`：在当前目录下执行，生成Makefile后，使用，make命令进行编译，得到可执行文件