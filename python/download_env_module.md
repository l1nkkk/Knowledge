- [virtualenv](#virtualenv)
  - [关于如何指定python2和python3](#%E5%85%B3%E4%BA%8E%E5%A6%82%E4%BD%95%E6%8C%87%E5%AE%9Apython2%E5%92%8Cpython3)
- [python模块的安装和打包](#python%E6%A8%A1%E5%9D%97%E7%9A%84%E5%AE%89%E8%A3%85%E5%92%8C%E6%89%93%E5%8C%85)
  - [概述](#%E6%A6%82%E8%BF%B0)
  - [模块和包](#%E6%A8%A1%E5%9D%97%E5%92%8C%E5%8C%85)
  - [setuptools](#setuptools)
  - [pip](#pip)
  - [pip加速](#pip%E5%8A%A0%E9%80%9F)
- [egg](#egg)
# virtualenv
- 安装  
  `pip3 install virtualenv`
- 创建一个独立的Python运行环境，命名为venv  
  ` virtualenv --no-site-packages venv` 
  - 其中加入参数`--no-site-packages`，这样，已经安装到系统Python环境中的所有第三方包都不会复制过来
- 进入环境  
  `source venv/bin/activate`
- 退出环境  
  `deactivate`

## 关于如何指定python2和python3
- 如果要创建python2的环境的话，命令为  
  `virtualenv -p /usr/bin/python2.7 env2.7`
- 如果要创建python3的环境话，命令为  
  `virtualenv -p /usr/bin/python3.5 env3.5`




# python模块的安装和打包
## 概述
> 简摘自：https://zhuanlan.zhihu.com/p/25020501
-  模块  
   - 一个python脚本文件一般就是一个模块
 - 包
   - 包就是一个包含其他模块的模块
   - 这些模块通常位于一个目录下，并以一个__init__.py文件将这个目录与文件系统中其他目录区分开来。
- Distutils
  - Distutils模块的目的是为了统一Python模块和包的安装方式
  - Distutils模块的巧妙之处在于，它能用同样的脚本去创建包的分发以及下载安装该包。
- Setuptools
  - Setuptools是建立在Distils顶层的。它让在pypi上保存模块成为可能。它通过eggs进行分发。
- Eggs
  - 相对于Distutils产生tar.gz包，setuptools产生egg包
  - 可以放到pypi上
- easy_install
  - 当上传完你的egg，全世界都能够通过easy_install 安装使用
  - easy_install 会在pypi上找到、下载、如果需要的话会编译这个egg，并把它添加到你的sys.path中去，以便Python能够发现它
- Buildout
  - Buildout 是一个基于配置文件的系统，通过它我们可以为大型系统创建复杂但可重用的设置。Buildout很复杂
  - 从eggs的角度看，你可以在Buildout中设定哪些eggs将要安装在你的系统中。

## 模块和包
> https://www.liaoxuefeng.com/wiki/1016959663602400/1017454145014176

> 引入

- 在Python中，`**一个.py文件就称之为一个模块（Module）**`，但是反过来不成立。
- 不同人开发相同名的模块，会冲突，故而引出`**包(package)**`
  - 每一个包目录下面都会有一个__init__.py的文件，这个文件是必须存在的，否则，Python就把这个目录当成普通目录，而不是一个包。`__init__.py`可以是空文件，也可以有Python代码，**因为`__init__.py`本身就是一个模块，而它的模块名就是`文件夹名`**。

> 基础概念

- module 模块：module 是 python 中代码重用的基本单元，一个 module 可以通过 import 语句导入到另一个 module；module 分为：pure python module（纯 python 模块）、extension module（扩展模块）和 package（包）
  - `pure python module`：纯 python 模块是用纯 python 语言编写的模块，单一的 .py 文件作为一个模块使用，也就是一个 .py 可以称为模块了
  - `extension module`：扩展模块是用底层的 C/C++、Objective-C或 Java 编写的模块，通常包含了一个动态链接库，比如 so、dll 或 Java，目前 distutils 只支持 C/C++ 和 Objective-C，不支持 Java 编写扩展模块；但是 python 提供了一个 JCC 这样一个用于生成访问 Java 类接口的 C++ 代码的胶水模块，应该也是可以使用 Java 编写模块的。
  - `package：包是一个带有` __init__.py 文件的文件夹，用于包含其他模块
    - `root package`：root package 是包的最顶层，它不是实质性的包，因为它不包含 __init__.py 文件。大量的标准库位于 root package，因为它们不属于一个任何更大的模块集合了。实际上，每一个 sys.path 列举出来的文件夹都是 root package，你可以在这些文件夹中找到大量的模块。
- `distribution`：模块分发，一个归档在一起的 python 模块集合，它作为一个可下载安装的资源，方便用户使用，作为开发者便需要努力创建一个易于使用的 distribution。如`Distutils的tar.gz` 或者` setuptools的zip压缩的egg文件`。
- distribution root：源代码树的最顶层，也就是 setup.py 所在的位置。
> 使用模块  

`import sys`   
导入sys模块后，我们就有了变量sys指向该模块，利用sys这个变量，就可以访问sys模块的所有功能。

> 作用域  

- 正常的函数和变量名是公开的（`public`），可以被直接引用，比如：`abc，x123，PI`等；
- 类似`__xxx__`这样的变量是特殊变量，可以被直接引用，但是有特殊用途，比如上面的`__author__`，`__name__`就是特殊变量，hello模块定义的文档注释也可以用特殊变量__doc__访问，我们自己的变量一般不要用这种变量名；
- 类似`_xxx和__xxx`这样的函数或变量就是**非公开的（private）**，不应该被直接引用，比如`_abc，__abc`等；

注：private函数和变量“不应该”被直接引用，而不是“不能”被直接引用，是因为Python并没有一种方法可以完全限制访问private函数或变量，但是，从编程习惯上不应该引用private函数或变量。
> 模块搜索路径

默认情况下，Python解释器会搜索当前目录、所有已安装的内置模块和第三方模块，搜索路径存放在sys模块的path变量中：
```py
import sys
sys.path.append('/Users/michael/my_py_scripts')
```
## setuptools
> 摘自(一篇就够，好文):https://www.cnblogs.com/cposture/p/9029023.html

`Setuptools` 和 `distutils` 都是用于**编译、分发和安装** python 包的一个工具，特别是在包依赖问题场景下非常有用，它是一个强大的包管理工具。`Setuptools 是 distutils 的加强版`。编译、分发和安装 python 包的一个关键的事就是编写 setup 脚本。setup 脚本的主要作用在于向包管理工具 Setuptools 或 distutils 说明你的模块分发细节，所以 Setuptools 支持大量的命令以操作你的包。setup 脚本主要调用一个 `setup()` 方法，许多提供给 Setuptools 的信息都以 keyword arguments 的参数形式提供给 setup() 方法。


## pip

> **版本**
- pip --version

> **安装**
- pip install <包名>
- pip install -r requirements.txt
- pip help install

**eg:**
```sh
pip install SomePackage              # 最新版本
pip install SomePackage==1.0.4       # 指定版本
pip install 'SomePackage>=1.0.4'     # 最小版本
```

> **卸载**
- pip uninstall <包名>
- pip uninstall -r requirements.txt

> **升级**
- pip install -U <包名>
- pip install <包名> --upgrade

> **生成包及版本信息**
- pip freeze > requirements.txt

> **列出安装的包**
- pip list
- pip list -o:查询可升级的包

> **查看包信息**
- pip show <包名>
- pip show -f <包名>：详细信息

> **搜索包**
- pip search <搜索关键字>


## pip加速
https://learnku.com/python/wikis/23003

# egg
> https://zhuanlan.zhihu.com/p/25020501
> https://www.osgeo.cn/python101/chapter38_eggs.html


- Python eggs 是Python的较旧分发格式
- egg文件基本上是具有不同扩展名的zip文件。
  - 在理想情况中，egg 是一个使用 zip 压缩的文件，其中包括了所有需要的包文件
  - egg包不一定是扩展名是egg的，其实在linux里面是不区分扩展名的
  - setuptools可以决定egg是不是zip压缩的，也可以直接是一个未压缩目录
- Python 可以直接从 egg 中导入。
- python的egg文件有点像java中的jar文件，是一个工程打包文件，便于安装部署。
