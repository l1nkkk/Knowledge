> https://www.hahack.com/codes/cmake/
> 
> https://blog.csdn.net/lanchunhui/article/details/57574867
> 
> https://www.cnblogs.com/52php/p/5681755.html

# 基本
- CMakeLists.txt 每个文件夹一个（有源文件的地方）
- 内部构建(in-source build)和外部构建(out-of-source build)
  - 外部构建就是中间文件一堆在自己选中的文件夹中，不会和源代码混合在一起

# 主要
## 编译链接
> add_executable
- 指定生成目标和参与生成的源文件：**add_executable**
  - eg：`add_executable(Demo main.cc)`： 将名为 main.cc 的源文件编译成一个名称为 Demo 的可执行文件
  - **一个目录多个源文件**：`add_executable(Demo main.cc MathFunctions.cc)`
    - 分别编译成目标文件后参与链接

> add_library
- 将源文件编译为**静态链接库**，默认静态：**add_library**
  - eg：`add_library (MathFunctions ${DIR_LIB_SRCS})`：生成名称为MathFunctions的静态链接库
  - 注：加SHARED就变为**动态**

> target_link_libraries
- 添加**静态链接库**：`target_link_libraries`
  - eg：`target_link_libraries(Demo MathFunctions)`，Demo和`add_executable` 中的一致

> add_subdirectory
- `ADD_SUBDIRECTORY(source_dir [binary_dir] [EXCLUDE_FROM_ALL])`
  - 这个指令用于向当前工程添加存放源文件的子目录
  - 并可以指定中间二进制和目标二进制存放的位置。
    - `ADD_SUBDIRECTORY(src bin)`：相当于把编译后的放在 **${PROJECT_BINARY_DIR}/bin** 下面
  - EXCLUDE_FROM_ALL参数的含义是将这个目录从编译过程中排除，比如，工程的example，可能就需要工程构建完成后，再进入example目录单独进行构建\


- 指明本项目包含一个**子目录**，这样该子目录下的CMakeLists.txt文件也会被处理：add_subdirectory
  - 注：当前子目录
  - eg：`add_subdirectory(math)`,添加当前目录下的math目录到项目子目录

> include_directories
- 去哪找**头文件**（.h），-I（GCC）：`include_directories()`
  - 注：也相当于环境变量中增加路径到 CPLUS_INCLUDE_PATH 变量的作用
  - eg：`include_directories("/home/l1nkkk/gitres/PEKS/pbc-0.5.14/include")`

> link_directories
- 去哪找**库文件**（.so/.dll/.lib/.dylib/...），-L（GCC）：`link_directories()`
  - 注：也相当于环境变量中增加 LD_LIBRARY_PATH 的路径的作用
  - 注：静态动态都在这
  - eg：link_directories("/home/server/third/lib")
- 需要链接的库文件的名字，-l（GCC）：`LINK_LIBRARIE(库名称即可)`
  - STATIC 静态， SHARED 动态
  


## 安装


# 边缘
- CMake 最低版本号要求：cmake_minimum_required
  - eg：`cmake_minimum_required (VERSION 2.8)`
- 项目信息，表示项目的名称：project
  - eg：`project (Demo1)`
- **省事大法**，不用一个个添加到add_executable：`aux_source_directory(<dir> <variable>)`，将dir下的所有源文件添加到variable变量中
```cmake
# 并将名称保存到 DIR_SRCS 变量
aux_source_directory(. DIR_SRCS)

# 指定生成目标
add_executable(Demo ${DIR_SRCS})

```

- 添加DEBUG
  - eg：`add_definitions(-DL1NKKKDEBUG)`
  - 注：相当于 g++ 命令的 -D 选项的作用（-DCPU_ONLY）

- set
  - 设置C++版本： set(CMAKE_CXX_STANDARD 14)

-  源所在文件夹 和 二进制文件所在文件夹 ：**PROJECT_BINARY_DIR** 和 **PROJECT_SOURCE_DIR** 变量
- 输出信息与错误处理：MESSAGE
   -  SEND_ERROR，产生错误，生成过程被跳过。
   - SATUS，输出前缀为`--`的信息。
   - FATAL_ERROR，立即终止所有cmake过程
    ```cmake 
    MESSAGE([SEND_ERROR | STATUS | FATAL_ERROR] "message to display"...)
     ```

> 换个地方保存目标二进制

- 下面分别指定可执行文件 和 共享库的位置
```cmake
SET(EXECUTABLE_OUTPUT_PATH ${PROJECT_BINARY_DIR}/bin)
SET(LIBRARY_OUTPUT_PATH ${PROJECT_BINARY_DIR}/lib)
```

# 命令
- `cmake .`：在当前目录下执行，生成Makefile后，使用，make命令进行编译，得到可执行文件