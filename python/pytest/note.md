- [命令](#%E5%91%BD%E4%BB%A4)
- [Fixture功能](#Fixture%E5%8A%9F%E8%83%BD)
  - [fixture的作用范围](#fixture%E7%9A%84%E4%BD%9C%E7%94%A8%E8%8C%83%E5%9B%B4)
  - [fixture的参数化](#fixture%E7%9A%84%E5%8F%82%E6%95%B0%E5%8C%96)
- [allure 生成报告](#allure-%E7%94%9F%E6%88%90%E6%8A%A5%E5%91%8A)
- [测试代码与测试数据分离](#%E6%B5%8B%E8%AF%95%E4%BB%A3%E7%A0%81%E4%B8%8E%E6%B5%8B%E8%AF%95%E6%95%B0%E6%8D%AE%E5%88%86%E7%A6%BB)
- [pytest的配置文件](#pytest%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
  - [pytest.ini](#pytestini)
    - [注册标记来防范拼写错误](#%E6%B3%A8%E5%86%8C%E6%A0%87%E8%AE%B0%E6%9D%A5%E9%98%B2%E8%8C%83%E6%8B%BC%E5%86%99%E9%94%99%E8%AF%AF)
    - [指定pytest的最低版本号](#%E6%8C%87%E5%AE%9Apytest%E7%9A%84%E6%9C%80%E4%BD%8E%E7%89%88%E6%9C%AC%E5%8F%B7)
    - [指定pytest忽略某些目录](#%E6%8C%87%E5%AE%9Apytest%E5%BF%BD%E7%95%A5%E6%9F%90%E4%BA%9B%E7%9B%AE%E5%BD%95)
  - [\_\_init__.py](#initpy)
- [样例](#%E6%A0%B7%E4%BE%8B)
  - [第一个测试](#%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%B5%8B%E8%AF%95)
  - [测试例外的发生和捕捉](#%E6%B5%8B%E8%AF%95%E4%BE%8B%E5%A4%96%E7%9A%84%E5%8F%91%E7%94%9F%E5%92%8C%E6%8D%95%E6%8D%89)
  - [不同参数传递测试](#%E4%B8%8D%E5%90%8C%E5%8F%82%E6%95%B0%E4%BC%A0%E9%80%92%E6%B5%8B%E8%AF%95)
  - [分组测试](#%E5%88%86%E7%BB%84%E6%B5%8B%E8%AF%95)
  - [指定fixture作用范围](#%E6%8C%87%E5%AE%9Afixture%E4%BD%9C%E7%94%A8%E8%8C%83%E5%9B%B4)
  - [fixture的参数化](#fixture%E7%9A%84%E5%8F%82%E6%95%B0%E5%8C%96-1)
  - [Class1：用python的requests请求一个接口](#Class1%E7%94%A8python%E7%9A%84requests%E8%AF%B7%E6%B1%82%E4%B8%80%E4%B8%AA%E6%8E%A5%E5%8F%A3)
  - [Class：使用装饰器，pytest.mark.parametrize](#Class%E4%BD%BF%E7%94%A8%E8%A3%85%E9%A5%B0%E5%99%A8pytestmarkparametrize)
  - [编写获取测试data的函数](#%E7%BC%96%E5%86%99%E8%8E%B7%E5%8F%96%E6%B5%8B%E8%AF%95data%E7%9A%84%E5%87%BD%E6%95%B0)
  - [将测试data与case相分离](#%E5%B0%86%E6%B5%8B%E8%AF%95data%E4%B8%8Ecase%E7%9B%B8%E5%88%86%E7%A6%BB)
# 命令

- pytest：测试目录下所有test_开头的测试文件   
- --duration=0：测试0秒以上的所有方法  
- -vv：输出详细内容  
- --markers：查看pytest的分组  
- -m [分组]：测试某个分组的测试方法  
- --setup-show：查看test时所运行的函数  
- -s：打印输出
- -k：允许使用表达式指定希望运行的测试用例  
  eg:`pytest -v -k "baidu" test.py `#执行含有baidu的测试用例
- --collect-only 展示在给定的配置下哪些测试用例会被执行，但是不实际运行这些用例
- --alluredir 目录:生成测试报告  【强推】  
  通过执行`allure generate 目录 -o 目录`-o 为生成的html所在的目录  
  allure.attach("log")可以在html中显示log部分
- --trace-config 查看当前的插件


# Fixture功能
> 来源：https://blog.csdn.net/qq_30758629/article/details/95923286

fixture是在测试函数运行前后，由pytest执行的外壳函数；代码可以定制，满足多变的测试需求；

包括定义传入测试中的数据集，配置测试前系统的初始状态(注：如mysql的连接)，为批量测试提供数据源等等...

fixture是pytest用于将测试前后进行预备，清理工作的代码分离出核心测试逻辑的一种机制！

（注：相当于init）

## fixture的作用范围
fixture里面有个scope参数可以控制fixture的作用范围:session > module > class > function；  
示例：[指定fixture作用范围](#%E6%8C%87%E5%AE%9Afixture%E4%BD%9C%E7%94%A8%E8%8C%83%E5%9B%B4)

## fixture的参数化

pytest支持在多个完整测试参数化方法:

- *pytest.fixture(): 在fixture级别的function处参数化  
  示例：[fixture的参数化](#fixture%E7%9A%84%E5%8F%82%E6%95%B0%E5%8C%96-1)

- @pytest.mark.parametrize：允许在function或class级别的参数化,为特定的测试函数或类提供了多个argument/fixture设置。

- pytest_generate_tests：可以实现自己的自定义动态参数化方案或扩展。

# allure 生成报告
**安装：**  
到`https://bintray.com/qameta/maven/allure2`下载软件压缩包，解压，将其bin目录设置为环境变量即可。


**运行：**  
运行case时增加命令行选项 `pytest -v --alluredir` 目录 test.py

**生成报告：**  
生成报告 allure generate 目录 -o 目录  
-o：html生成之后所存的文件

**用浏览器打开如果可能出现一堆loading和404**，解决:
这是因为浏览器不允许ajax访问本地文件。
执行`allure report open [html报告所在文件夹]`即可解决

# 测试代码与测试数据分离
以下是目录层级，data中是测试数据；test是测试代码，utils为一般通用方法。让data接test的层级保持相同  
![](pic/1.png)

# pytest的配置文件
pytest里都有哪些非测试文件？

1. pytest.ini: pytest的主配置文件,可以改变pytest的默认行为,其中有很多可配置的选项。放在根目录

2. conftest.py:是本地的插件库,其中的hook函数和fixture将作用于该文件所在的目录以及所有子目录。

3. __init__py:每个测试子目录都包含该文件时,那么在多个测试目录中可以出现同名测试文件。

## pytest.ini

### 注册标记来防范拼写错误
自定义标记可以简化测试工作，但是标记容易拼写错误，默认情况下不会引起错误，pytest以为这是另外一个标记。为了避免拼写错误，可以在pytest.ini文件里注册标记

markers =

smoke: a test_data get_and_format marker

通过命令查看：

`pytest --markers`

没有注册的标记不会出现在 --markers列表里，如果使用 --strict选项，遇到拼写错误的标记或未注册的标记就会报错

如何自己增加一个测试函数的标记呢？

@pytest.mark.smoke

`pytest -m 'smoke' test.py`

### 指定pytest的最低版本号

minversion = 6.0

minversion选项可以指定运行测试用例的pytest的最低版本

### 指定pytest忽略某些目录

1. pytest执行用例搜索时，会递归遍历所有子目录，包括某些你明知没必要遍历的目录

`norecursedirs = .* data config utils`

2. 可以使用norecursedirs缩小pytest的搜索范围

指定访问目录

`testpaths = tests`
## \_\_init__.py
避免文件名冲突；如果不同子目录下存在相同的测试文件名，那么将会产生冲突，使用__init__.py可以



# 样例
## 第一个测试
```py
def add(x, y):
    return x+y

def test1():
    assert 3 == add(1, 1)

def test2():
    assert 1 != add(1, 1)
```

## 测试例外的发生和捕捉
```py
import pytest

def func(x):
    if x == 0:
        raise ValueError("value error!")
    else:
        pass

# func(1)
# try:
#     func(0)
# except ValueError as identifier:
#     print("error")

def test_mytest1():
    with pytest.raises(ValueError):
        func(0)

def test_mytest2():
    assert func(1) == None
```

## 不同参数传递测试
为同一个函数传递不同参数进行测试。
```py

def add(x, y):
    return x+y

import pytest

@pytest.mark.parametrize(
    "x,y,expected",
    [
        (1, 1, 2),
        (2, 2, 4),
        (10, 10, 20),
    ]
)
def test_add(x, y, expected):
    assert add(x, y) == expected
```

## 分组测试
将测试方法分为不同的测试组，测试时可以单独测试某个组的方法。其实不在ini文件添加也可以，只是pytest找不到相应的分组机器说明。但是还是可以通过代码中添加装饰器以及在pytest使用-m指定分组运行相应分组的测试用例。

如果有在pytest.ini中注册group，则如果在测试代码中遇到没有注册的组名就会报错，否则还是可以正常进行。也就是卸载pytest.ini可以起到一种防止组名不小心写错的情况

```sh
$ pytest --markers
$ nano pytest.ini

[pytest]
markers =
    g1: group1.
    g2: group2.

$ pytest --markers
```

其中g1为组名，group1为描述
```py
import pytest

@pytest.mark.g1
def test_func1():
    pass

@pytest.mark.g2
def test_func2():
    pass

@pytest.mark.g1
def test_func3():
    pass

@pytest.mark.g2
def test_func4():
    pass

@pytest.mark.g1
def test_func5():
    pass
```

```sh
$ pytest -vv
$ pytest -vv -m g1
$ pytest -vv -m g2
```

## 指定fixture作用范围
```py

1)function
每一个函数或方法都会调用 \
@ pytest.fixture()
 
 
def first():
    print("\n获取用户名")
    a = "xiaoyulaoshi"
    return a
 
 
@pytest.fixture(scope="function")
def sencond():
    print("\n获取密码")
    b = "123456"
    return b
 
 
def test_1(first):
    '''用例传fixture'''
    print("测试账号：%s" % first)
    assert first == "xiaoyulaoshi"
 
 
def test_2(sencond):
    '''用例传fixture'''
    print("测试密码：%s" % sencond)
    assert sencond == "123456"
 
 
2).class 每一个类调用一次，一个类可以有多个方法
 
 
@pytest.fixture(scope="class")
def first():
    print("\n获取用户名,scope为class级别只运行一次")
    a = "xiaoyulaoshi"
    return a
 
 
class TestCase():
    def test_1(self, first):
        '''用例传fixture'''
        print("测试账号：%s" % first)
        assert first == "xiaoyulaoshi"
 
    def test_2(self, first):
        '''用例传fixture'''
        print("测试账号：%s" % first)
        assert first == "xiaoyulaoshi"
 
 
3).module，每一个.py文件调用一次，该文件内又有多个function和class
import pytest
 
 
@pytest.fixture(scope="module")
def first():
    print("\n获取用户名,scope为module级别当前.py模块只运行一次")
    a = "xiaoyulaoshi"
    return a
 
 
def test_1(first):
    '''用例传fixture'''
    print("测试账号：%s" % first)
    assert first == "xiaoyulaoshi"
 
 
class TestCase():
    def test_2(self, first):
        '''用例传fixture'''
        print("测试账号：%s" % first)
        assert first == "xiaoyulaoshi"
 
 
4).session
是多个文件调用一次，可以跨.py文件调用，每个.py文件就是module
当我们有多个.py文件的用例时候，如果多个用例只需调用一次fixture，那就可以设置为scope = "session"，并且写到conftest.py文件里
 
conftest.py
 
import pytest
 
 
@pytest.fixture(scope="session")
def first():
    print("\n获取用户名,scope为session级别多个.py模块只运行一次")
    a = "xiaoyulaoshi"
    return a
 
 
test_fixture11.py
 
import pytest
 
 
def test_1(first):
    '''用例传fixture'''
    print("测试账号：%s" % first)
    assert first == "xiaoyulaoshi"
 
 
import pytest
 
 
def test_2(first):
    '''用例传fixture'''
    print("测试账号：%s" % first)
    assert first == "xiaoyulaoshi"

```

## fixture的参数化


```py
import pytest
import requests
 
par_to_test=[{
      "case": "serach a word :haha",
      "headers": {},
      "querystring": {
        "wd":"hah"
      },
      "payload": {},
      "expected": {
        "status_code":200
      }
    },
{
      "case": "serach a word2 :kuku",
      "headers": {},
      "querystring": {
        "wd":"kuku"
      },
      "payload": {},
      "expected": {
        "status_code":200
      } },
 
{
      "case": "serach a word3 :xiaoyulaoshi",
      "headers": {},
      "querystring": {
        "wd":"xiaoyulaoshi"
      },
      "payload": {},
      "expected": {
        "status_code":200
      } }
]
 
@pytest.fixture(params = par_to_test)
def class_scope(request):
    return request.param
 
def test_baidu_search(class_scope):
    url = "https://www.baidu.com"
    r = requests.request("GET", url, data=class_scope["payload"], headers=class_scope["headers"], params=class_scope["querystring"])
    assert r.status_code == class_scope["expected"]["status_code"]

```

## Class1：用python的requests请求一个接口
```py

import requests
import pytest
import allure
 
 
class TestParam1(object):
    """
    """
 
    @pytest.fixture(scope="class", autouse=True)
    def prepare(self, request):
        with allure.step("测试数据准备:"):
            pass
 
        @allure.step("测试数据数据清理:")
        def fin():
            """
            Clean up test environment after testing
            """
            pass
 
        request.addfinalizer(fin)
 
    def test_param_1(self):
        url = "http://127.0.0.1:8000/add_message/"
        headers = {
            'Content-Type': "application/x-www-form-urlencoded",
        }
        payload ={
            "mid" :"106",
            "name" :"android4",
"content" : "8" ,
            "status": "1",
            "author" :"xixi"
        }
        response = requests.request("POST", url, data=payload, headers=headers)
        print(response.json())
        assert response.json()["message"] == "add message success"

```
## Class：使用装饰器，pytest.mark.parametrize
```py

#!/usr/bin/python
# coding=utf-8
 
 
import pytest
import requests
 
from utils.get_data import get_data_path
from utils.get_data import get_test_data
 
param=[
    ({'Content-Type': 'application/x-www-form-urlencoded'}, {'name': 'android11', 'content': '8', 'status': '1', 'author': 'xixi', 'mid': '110'}),
    ({'Content-Type': 'application/x-www-form-urlencoded'}, {'name': 'android12', 'content': '8', 'status': '1', 'author': 'xixi', 'mid': '111'}),
    ({'Content-Type': 'application/x-www-form-urlencoded'}, {'name': 'android13', 'content': 'hahah', 'status': '1', 'author': 'xixi', 'mid': '112'})
]
 
 
class TestParam2(object):
    """
    """
 
    @pytest.fixture(scope="class", autouse=True)
    def prepare(self, request):
        pass
 
        def fin():
 """
            Clean up test environment after testing
            """
            pass
 
        request.addfinalizer(fin)
 
    @pytest.mark.parametrize("headers,payload", param)
    def test_param_2(self,headers,payload):
        url = "http://127.0.0.1:8000/add_message/"
        response = requests.request("POST", url, data=payload, headers=headers)
        res = response.json()
        #assert res["message"] == "add message success"

```

## 编写获取测试data的函数
```py

def get_data_path(case_path):
    file_name = os.path.dirname(case_path).split(os.sep + 'tests' + os.sep, 1)
    test_data = os.sep.join([file_name[0], 'data', file_name[1], os.path.basename(case_path).replace('.py', '.json')])
    return test_data
 
def get_test_data(test_data_path):
    case = []
    headers = []
    querystring = []
    payload = []
    expected = []
    with open(test_data_path,encoding='utf-8') as f:
        dat = json.loads(f.read())
        test = dat['test']
        for td in test:
            case.append(td['case'])
            headers.append(td.get('headers', {}))
            querystring.append(td.get('querystring', {}))
            payload.append(td.get('payload', {}))
            expected.append(td.get('expected', {}))
    list_parameters = list(zip(case, headers, querystring, payload, expected))
    return case, list_parameters

```

## 将测试data与case相分离

```py

#!/usr/bin/python
# coding=utf-8
 
 
import pytest
import requests
 
from utils.get_data import get_data_path
from utils.get_data import get_test_data
 
case,param = get_test_data(get_data_path(__file__))
 
class TestParam2(object):
    """
    """
 
    @pytest.fixture(scope="class", autouse=True)
    def prepare(self, request):
        pass
 
        def fin():
            """
            Clean up test environment after testing
            """
            pass
 
        request.addfinalizer(fin)
 
    @pytest.mark.parametrize("case,headers,querystring,payload,expected", param,ids=case)
    def test_param_2(self,case,headers,querystring,payload,expected):
        url = "http://127.0.0.1:8000/add_message/"
        response = requests.request("POST", url, data=payload, headers=headers)
        
        res = response.json()
        assert res["message"] == "add message success"

```