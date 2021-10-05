- [配置文件](#%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6)
- [存储引擎](#%E5%AD%98%E5%82%A8%E5%BC%95%E6%93%8E)
  - [有关的一些命令和操作](#%E6%9C%89%E5%85%B3%E7%9A%84%E4%B8%80%E4%BA%9B%E5%91%BD%E4%BB%A4%E5%92%8C%E6%93%8D%E4%BD%9C)
- [未分类常用命令](#%E6%9C%AA%E5%88%86%E7%B1%BB%E5%B8%B8%E7%94%A8%E5%91%BD%E4%BB%A4)
- [常见函数](#%E5%B8%B8%E8%A7%81%E5%87%BD%E6%95%B0)
  - [单行函数](#%E5%8D%95%E8%A1%8C%E5%87%BD%E6%95%B0)
    - [字符函数](#%E5%AD%97%E7%AC%A6%E5%87%BD%E6%95%B0)
    - [数学函数](#%E6%95%B0%E5%AD%A6%E5%87%BD%E6%95%B0)
    - [日期函数](#%E6%97%A5%E6%9C%9F%E5%87%BD%E6%95%B0)
    - [其它函数](#%E5%85%B6%E5%AE%83%E5%87%BD%E6%95%B0)
    - [流程控制函数](#%E6%B5%81%E7%A8%8B%E6%8E%A7%E5%88%B6%E5%87%BD%E6%95%B0)
    - [总结例子](#%E6%80%BB%E7%BB%93%E4%BE%8B%E5%AD%90)
  - [分组函数](#%E5%88%86%E7%BB%84%E5%87%BD%E6%95%B0)
    - [分组函数总结案例](#%E5%88%86%E7%BB%84%E5%87%BD%E6%95%B0%E6%80%BB%E7%BB%93%E6%A1%88%E4%BE%8B)
- [SQL](#SQL)
  - [DQL（Data Query Language）数据查询语言](#DQLData-Query-Language%E6%95%B0%E6%8D%AE%E6%9F%A5%E8%AF%A2%E8%AF%AD%E8%A8%80)
    - [基础查询](#%E5%9F%BA%E7%A1%80%E6%9F%A5%E8%AF%A2)
    - [条件查询](#%E6%9D%A1%E4%BB%B6%E6%9F%A5%E8%AF%A2)
    - [排序查询](#%E6%8E%92%E5%BA%8F%E6%9F%A5%E8%AF%A2)
    - [分组查询](#%E5%88%86%E7%BB%84%E6%9F%A5%E8%AF%A2)
      - [分组前筛选](#%E5%88%86%E7%BB%84%E5%89%8D%E7%AD%9B%E9%80%89)
      - [分组后筛选](#%E5%88%86%E7%BB%84%E5%90%8E%E7%AD%9B%E9%80%89)
      - [按多个字段分组](#%E6%8C%89%E5%A4%9A%E4%B8%AA%E5%AD%97%E6%AE%B5%E5%88%86%E7%BB%84)
      - [添加排序](#%E6%B7%BB%E5%8A%A0%E6%8E%92%E5%BA%8F)
      - [总结案例](#%E6%80%BB%E7%BB%93%E6%A1%88%E4%BE%8B)
  - [连接查询](#%E8%BF%9E%E6%8E%A5%E6%9F%A5%E8%AF%A2)
    - [SQL92标准](#SQL92%E6%A0%87%E5%87%86)
      - [等值查询](#%E7%AD%89%E5%80%BC%E6%9F%A5%E8%AF%A2)
      - [非等值连接](#%E9%9D%9E%E7%AD%89%E5%80%BC%E8%BF%9E%E6%8E%A5)
      - [自连接](#%E8%87%AA%E8%BF%9E%E6%8E%A5)
    - [SQL99](#SQL99)
      - [内连接](#%E5%86%85%E8%BF%9E%E6%8E%A5)
      - [外连接](#%E5%A4%96%E8%BF%9E%E6%8E%A5)
      - [交叉连接](#%E4%BA%A4%E5%8F%89%E8%BF%9E%E6%8E%A5)
    - [sql99和sql92比较](#sql99%E5%92%8Csql92%E6%AF%94%E8%BE%83)
- [数据库（database）](#%E6%95%B0%E6%8D%AE%E5%BA%93database)
  - [默认数据库](#%E9%BB%98%E8%AE%A4%E6%95%B0%E6%8D%AE%E5%BA%93)
- [细节](#%E7%BB%86%E8%8A%82)

- 启动mysql:
mysql -h host -P mysqlport -u user -p[直接密码不用空格] 
# 配置文件
如果是win，是my.ini。如果是linux是my.cnf。更改之后需要重启mysql  
mysql version如下
```
l1nkkk@l1nkkk-TM1701:~$ mysql --version
mysql  Ver 14.14 Distrib 5.7.29, for Linux (x86_64) using  EditLine wrapper
```
在ubuntu中配置文件在`/etc/mysql`里。可以在` /etc/mysql/mysql.conf.d/mysqld.cnf`查看mysql服务的配置。以下是mysqld.conf的内容。
> mysql配置文件和Innodb各参数解析：https://www.cnblogs.com/cheng2015/p/7685017.html
```sh
#
# The MySQL database server configuration file.
#
# You can copy this to one of:
# - "/etc/mysql/my.cnf" to set global options,
# - "~/.my.cnf" to set user-specific options.
# 
# One can use all long options that the program supports.
# Run program with --help to get a list of available options and with
# --print-defaults to see which it would actually understand and use.
#
# For explanations see
# http://dev.mysql.com/doc/mysql/en/server-system-variables.html
chongtu
# This will be passed to all mysql clients
# It has been reported that passwords should be enclosed with ticks/quotes
# escpecially if they contain "#" chars...
# Remember to edit /etc/mysql/debian.cnf when changing the socket location.

# Here is entries for some specific programs
# The following values assume you have at least 32M ram

[mysqld_safe]
socket		= /var/run/mysqld/mysqld.sock
nice		= 0

[mysqld]
#
# * Basic Settings
#
user		= mysql
pid-file	= /var/run/mysqld/mysqld.pid
socket		= /var/run/mysqld/mysqld.sock
port		= 3306
basedir		= /usr
datadir		= /var/lib/mysql
tmpdir		= /tmp
lc-messages-dir	= /usr/share/mysql
skip-external-locking
#
# Instead of skip-networking the default is now to listen only on
# localhost which is more compatible and is not less secure.
bind-address		= 127.0.0.1
#
# * Fine Tuning
#
key_buffer_size		= 16M
max_allowed_packet	= 16M
thread_stack		= 192K
thread_cache_size       = 8
# This replaces the startup script and checks MyISAM tables if needed
# the first time they are touched
myisam-recover-options  = BACKUP
#max_connections        = 100
#table_open_cache       = 64
#thread_concurrency     = 10
#
# * Query Cache Configuration
#
query_cache_limit	= 1M
query_cache_size        = 16M
#
# * Logging and Replication
#
# Both location gets rotated by the cronjob.
# Be aware that this log type is a performance killer.
# As of 5.1 you can enable the log at runtime!
#general_log_file        = /var/log/mysql/mysql.log
#general_log             = 1
#
# Error log - should be very few entries.
#
log_error = /var/log/mysql/error.log
#
# Here you can see queries with especially long duration
#slow_query_log		= 1
#slow_query_log_file	= /var/log/mysql/mysql-slow.log
#long_query_time = 2
#log-queries-not-using-indexes
#
# The following can be used as easy to replay backup logs or for replication.
# note: if you are setting up a replication slave, see README.Debian about
#       other settings you may need to change.
#server-id		= 1
#log_bin			= /var/log/mysql/mysql-bin.log
expire_logs_days	= 10
max_binlog_size   = 100M
#binlog_do_db		= include_database_name
#binlog_ignore_db	= include_database_name
#
# * InnoDB
#
# InnoDB is enabled by default with a 10MB datafile in /var/lib/mysql/.
# Read the manual for more InnoDB related options. There are many!
#
# * Security Features
#
# Read the manual, too, if you want chroot!
# chroot = /var/lib/mysql/
#
# For generating SSL certificates I recommend the OpenSSL GUI "tinyca".
#
# ssl-ca=/etc/mysql/cacert.pem
# ssl-cert=/etc/mysql/server-cert.pem
# ssl-key=/etc/mysql/server-key.pem
```

# 存储引擎
## 有关的一些命令和操作

- mysql现在已提供什么存储引擎（DEFAULT表示现在默认所选用）:  d
`mysql> show engines;`
 
- ysql当前默认的存储引擎:  
`mysql> show variables like '%storage_engine%';`
 
- 你要看某个表用了什么引擎(在显示结果里参数engine后面的就表示该表当前用的存储引擎):    
`mysql> show create table 表名;`  

- 查看mysql版本：  
`select version();`

- 设置默认存储引擎：  
`在配置文件my.cnf中的 [mysqld] 下面加入
default-storage-engine=INNODB 一句`

- 重启mysql服务器：  
`service mysqld restart`或  
`mysqladmin -u root -p shutdown`

- 查看表使用的存储引擎：  
  - 两种方法：  
   a.` show table status from db_name where name='table_name';`  
   b. `show create table table_name;`
如果显示的格式不好看，可以用\g代替行尾分号

- 修改表引擎方法：  
`alter table table_name engine=innodb;`

- 关闭Innodb引擎方法  
关闭mysql服务：` net stop mysql`  
找到mysql安装目录下的my.ini文件：  
找到`default-storage-engine=INNODB` 改为`default-storage-engine=MYISAM`  
找到#skip-innodb 改为`skip-innodb`  
启动mysql服务：`net start mysql`  

# 未分类常用命令
| 功能         | 命令                         |
| ------------ | ---------------------------- |
| 显示数据库   | show databases;              |
| 显示数据表   | show tables [from db];       |
| 当前所在库   | select databse               |
| 显示表的结构 | desc table_name              |
| 显示版本     | select version()             |
| 显示字符集   | show variables like ‘%char%’ |

# 常见函数
调用：`select 函数名(实参列表)[from 表]`  


## 单行函数
每处理一行的数据，输出一个结果
  
### 字符函数
1. LENGTH 获取字符串**字节**  
2. CONCAT 拼接字符串
3. UPPER，LOWER 大小写转换

4. SUBSTR/SUBSTRING 截取子字符串。字符索引  
注：SQL中索引从1开始
1. INSTR 返回子串第一次的索引
2. TRIM 去除空格，或者指定字符串
3. LPAD 用指定的字符实现左填充指定长度
4. RPAD 用指定的字符实现右填充指定长度
5. REPLACE 替换字符

案例--单行函数--字符函数：
```sql
select * from employees where email like '%e%' order by length(email) desc,department_id asc;
select concat(last_name,'_',first_name) from employees;
select upper('johk');
select substr('jjjooo',3) sudo ;
select substr('jjjooo',1,3) sudo ;
select concat(upper(substr(last_name,1,1)),'_',lower(substr(last_name,2))) sudo from employees;
select instr('jjjokkk','o') sodu;
select length(trim('    aa    ')) sodu;
select trim('a' from 'aaaddddffaaajaa') sodu;
select trim('aa' from 'aaaddddffaaajaa') sodu;
select lpad('aaa',10,'*') xixi;
select lpad('aaa',2,'*') xixi;
select rpad('aaa',12,'*') xixi;
select replace('aaassss','s','a') xixi;
```
### 数学函数
1. ROUND 四舍五入，可以设置保留位数
2. CEIL 向上取整，返回>=该参数的最小整数
3. FLOOR 向下取整，返回>=该参数的最大整数
4. TRUNCATE 截断，小数点后保留几位
5. MOD 取余，看被除数，如果是正数，结果就为正。 =》 a = a - a/b*b


案例--单行函数--数学函数：
```sql
select round(1.65);
select round(1.333,2);
select ceil(0.002);
select floor(1.11);
select truncate(1.69,1);
select mod(10,-3);
select mod(-10,3);
```
### 日期函数
1. NOW 返回当前系统日期+时间
2. CURDATE 返回当前系统日期，不包含时间
3. CURTIME 返回当前时间，不包含日期
4. YEAD,MONTH,MONTHNAME 可以获取指定的部分，年，月，日，小时，分钟，秒
5. str_to_date:将日期格式的字符转换成指定格式的日期(注：业务场景看例子)  
6. DATE_FORMATE:日期转，指定的字符串格式
![](pic/WeChat&#32;Image_20200210172131.png)

案例--单行函数--日期函数：
```sql
select now();
select curdate();
select curtime();
select year(now());
select year(hiredate) from employees;
select month(now());
select monthname(now());
select str_to_date('1999-3-2','%Y-%c-%d') as output;
select * from employees where hiredate='1992-4-3';
select * from employees where hiredate=str_to_date('4-3-1992','%c-%d-%Y');
select date_format(now(),'%Ynian%cyue%dri') as output;
```
### 其它函数
1. SELECT VERSION()
2. SELECT DATABASE()
3. SELECT USER()
### 流程控制函数
1. if函数：有点像三元运算符
2. case函数：switch case的结果(可以当表达式用select显示，也可以通过分装在函数中单独调用)  
  ```SQL
  # 方法1
  case 要判断的字段或表达式  
  when 常量1 then 要显示的值1或语句1;
  when 常量2 then 要显示的值2或语句2;
  ...
  else 要显示的值n或语句n;
  end
  # 方法2
  case 
  when 条件1 then 要显示的值1或语句1;
  when 条件2 then 要显示的值2或语句2;
  ...
  else 要显示的值n或语句n;
  end
  ```
  案例  
  ```sql
  select salary as initial,department_id,
  case department_id
  when 30 then salary*1.1
  when 40 then salary*1.2
  when 50 then salary*1.3
  else salary 
  end as new
  from employees;

  # 查询员工工资情况
  select salary,
  case
  when salary>20000 then 'A'
  when salary>15000 then 'B'
  when salary>10000 then 'C'
  else 'D'
  end as grade
  from employees;
  ```

### 总结例子
```sql
select now();

select length(last_name) length,substr(last_name,1,1) initial ,last_name from employees order by initial;

select concat(last_name,'earns',salary,'monthly but want',salary*3) as "dream salary" from employees;

select concat(last_name,'earns',salary,'monthly but want',salary*3) as "dream salary" from employees where salary=24000;
```
## 分组函数
- 处理多行数据，返回一个结果
- 做统计使用，又称为统计函数，聚合函数，组函数  

**分类**
- sum 求和； =》 调用+
- avg 平均值
- max 最大值
- min 最小值
- count 计算个数

**特点**
- sum、avg一般用于处理数值型
- max、min、count可以处理任何类型
- 所有的分组函数都忽略null值
- 可以和distinct搭配实现去重
- count函数详解
  - MYISAM下，count(*)的效率高，因为内部有一个技术字段，直接返回就是了
  - 在INNODB存储引擎下，count(*)和count(1)效率差不多，比count(字段)要高一些
  - 一般count(*)用来统计行数
- *和分组函数一同查询的字段有限制，**一般要求只能是group by后的字段**。因为分组函数后只有一个值，而其他字段是一组值，所以不管最后显示什么，意义都不大，在8.x版本直接报错。

```sql
# 基本使用
select sum(salary) from employees;
select avg(salary) from employees;
select min(salary) from employees;
select max(salary) from employees;
select count(salary) from employees;

# 判断支持哪些类型
select sum(last_name) from employees;
select max(last_name),min(first_name) from employees;
select max(hiredate),min(hiredate) from employees;

# 是否忽略null值
select count(commission_pct) from employees;
select sum(commission_pct) from employees;

# 与distinct搭配
select sum(distinct salary),sum(salary) from employees;
select count(distinct salary) from employees;

# count函数的详细介绍
# -
select count(salary) from employees;

# -统计行数
select count(*) from employees;

# -统计1的个数，相当于在一个表中添加一列
select count(1) from employees;

# 和分组函数一同查询的字段有限制。
select avg(salary),employee_id from employees;

```
### 分组函数总结案例
```sql
# 查询公司员工工资的最大值，最小值，平均值，总和
select max(salary).min(salary),round(avg(salary),2),sum(salary) from employee

# 查询员工表中的最大入职时间和最小入职时间的相差天数(DIFFRENCE )
select datediff(max(hiredate),min(hiredate)) from employees;

# 查询部门编号为90的员工个数
SELECT COUNT(*)
FROM employees
WHERE department_id=90;

# 和我家宝宝在一起的天数
select datediff(now(),'2019-10-4');
```

# SQL
## DQL（Data Query Language）数据查询语言
- 基础查询
- 条件查询
- 分组查询
### 基础查询
- 查询字段
- 查询常量值
- 查询表达式
- 查询函数
- 起别名
  - 方式1
  - 方式2
- 去重 DISTINCT
- +号的作用:仅仅只有一个功能运算符,不能字符串拼接
- 字符串拼接，如果其中有null的元素则整个结果都为null
- ifnull，判断是否为null，如果为null，返回指定值

```sql
use myemployees;
# 查询字段
SELECT 'lASt_name' FROM employees;

SELECT first_name,email FROM employees;

SELECT * FROM employees;

# 查询常量值
SELECT 100;
SELECT 'linqing';

# 查询表达式
SELECT 19*20;

# 查询函数
SELECT version();
SELECT 100%98;【羽毛球】赵剑

# 起别名
SELECT 100%98 AS jieguo;
## 方式1
SELECT lASt_name AS xing,first_name AS ming FROM employees;
## 方式2 
SELECT lASt_name 姓,first_name 名 FROM employees;
# 别名如果有特殊符号，加双引号
SELECT salary AS "out put" FROM employees;

# 去重 DISTINCT
SELECT department_id FROM employees;
SELECT DISTINCT department_id FROM employees;

# +号的作用:仅仅只有一个功能运算符
-- 以下执行结果全为0
SELECT lASt_name+first_name AS 姓名 FROM employees;
-- 两个都为数值型，做加法运算
SELECT 100+90;
-- 其中一方为字符型，字符型转换为数值型，成功则做加法；失败，则字符型数值转换为0；
SELECT '123'+90;
SELECT 'john'+90;
-- 只要其中一方为null，则结果肯定为null
SELECT null+10;

# 字符串拼接，如果其中有null的元素则整个结果都为null
SELECT CONCAT('a','b','c');
SELECT CONCAT(lASt_name,first_name) AS xingming FROM employees;

DESC departments;

# ifnull，判断是否为null，如果为null，返回指定值
SELECT 
    IFNULL(commission_pct, 0) AS 奖金率, commission_pct
FROMre
    employees;
SELECT CONCAT(`first_name`,',',`phone_number`,',',`manager_id`,',',ifnull(commission_pct,0)) AS "output" FROM employees;
```
### 条件查询
36-38案例和复习

语法：
```sql
SELECT 
    查询列表
FROM
    表名
WHERE
    筛选条件
```
分类：
- 按条件表达式筛选  
  条件运算符： > 、< 、= 、!=或者<>（建议） 、>= 、<=
- 按逻辑表达式筛选(用于连接条件表达式)
  逻辑运算符： && 、|| 、! 《=》 and、or、not(建议)
- 模糊查询 like、between and、in、is null 
  - like
    - 一般和通配符搭配使用，%：任意多个字符，_：任意单个字符
    - 标明转义字符，`like '_$_%' escape '$';`
  - between and
    - 使语句比较简洁
    - 包含临界值
    - 两个临界值调换后效果不一样
    - 相当于 >= and <=
    - eg：`employee_id between 100 and 120`
  - in
    - 相当于 = or = or = 
    - job_id in (IT_PROG，AD_VP，AD_PRES)；
    - 含义：判断某字段的值是否属于in列表中的某一项
    - 使语句简介
    - 不支持通配符，应为in相当于=，不同于like
  - is null
    - =不能用于处理null值
    - 可以判断null值
- 补充：
  - 安全等于<=>
    - 可以判断null值，也可以判断普通类型的值
    - 缺点：可读性较差
    - 不太建议使用，还是该is null就is null，不然就用=

案例： 
- 按条件表达式筛选
  1. 工资>12000的员工信息
  2. 部门编号不等于90的员工名和部门编号
- 按逻辑表达式筛选  
  1. 工资在10000到20000之间
  2. *部门编号不是90-110之间，或者工资高于15000的员工信息
- 模糊查询
  - like
    1. 查询员工名中包含字符a的员工信息 
    2. 查询员工中第三个字符为e，第五个字符为a的员工名和工资
    3. 查询员工名中第二个字符为_的员工名
  - between andyong
    1. 查询员工编号在100到120之间的员工信息
  - in
    1. 查询员工的工种名是 IT_PROG/AD_VP/AD_PRES中的一个的员工名和工种编号
  - is null
    1. 查询没有奖金的员工名和奖金率
    2. 查询有奖金的员工名和奖金率
- 补充
  1. 查询没有奖金的员工名和奖金率
  2. 查询工资为12000的员工的信息
```sql
# 1.工资>12000的员工信息
select 
  * 
from
  employees 
where 
  salary>12000;

# 2.部门编号不等于90的员工名和部门编号
select last_name,department_id from employees where department_id <> 90;

# 1.工资在10000到20000之间
select last_name,salary,commission_pct from employees where salary>10000 and salary<20000;

# 2.部门编号不是90-110之间，或者工资高于15000的员工信息
select * from employees where department_id<90 or department_id>110 or salary>15000;

select * from employees where not(department_id>=90 and department_id<=110) or salary>15000;

# 1.查询员工名中包含字符a的员工信息，可以是a开头，大小写无关
select * from employees where last_name like '%a%';

# 2.查询员工中第三个字符为e，第五个字符为a的员工名和工资
select last_name,salary from employees where last_name like '__e_a%';

# 3.查询员工名中第二个字符为_的员工名
select last_name from employees where last_name like '_\_%';

select last_name from employees where last_name like '_$_%' escape '$';

# 1. 查询员工编号在100到120之间的员工信息
select * from employees where employee_id between 100 and 120;

# 2. 查询员工的工种名是 IT_PROG/AD_VP/AD_PRES中的一个的员工名和工种编号
select last_name,job_id from employees where  job_id in (IT_PROG，AD_VP，AD_PRES)

# 1. 查询没有奖金的员工名和奖金率
select last_name,commission_pct from employees where commission_pct is null;

# 2. 查询有奖金的员工名和奖金率
select last_name,commission_pct from employees where commission_pct is not null;

# 1. 查询没有奖金的员工名和奖金率
select last_name,commission_pct from employees where commission_pct <=> null;

# 2. 查询工资为12000的员工的信息
select last_name,salary from employees where salary <=> 12000;
select * from employees where job_id <>'IT' or salary is 12000;
```
### 排序查询
p42 示例
语法：
```sql
SELECT 
    查询列表
FROM
    表名
[WHERE
    筛选条件]
ORDER BY
    排序列表
```
特点：
- ASC升序，DESC降序
- 支持多个字段，支持表达式，别名，函数
- 一般放在查询语句的最后，limit子句除外

案例：
- 1. 查询员工信息，要求工资从高到低
- 2. 查询员工信息，要求工资从低到高
- 3. *[按表达式排序],按年薪的高低显示员工的信息和年薪
- 4. *[按别名排序],按年薪的高低显示员工的信息和年薪
- 5. *[按函数排序]按姓名的长度显示员工的姓名和工资
- 6. *查询员工信息，先按工资排序，再按员工编号排序
- 7. 选择工资不在8000到17000的员工的姓名和工资，按工资降序
- 8. 查询邮箱中包含e的员工信息，并先按邮箱的字节数降序，再按部门号升序
```sql
- 1.查询员工信息，要求工资从高到低
select * from employees order by salary desc; 
- 2.查询员工信息，要求工资从低到高
select * from employees order by salary asc; 

select * from employees order by salary ;

# 3.[按表达式排序],按年薪的高低显示员工的信息和年薪
select *,salary*12*(1+ifnull(commission_pct,0)) 年薪 from employees order by salary*12*(1+ifnull(commission_pct,0)) desc; 
# 4.[按别名排序],按年薪的高低显示员工的信息和年薪
select *,salary*12*(1+ifnull(commission_pct,0)) 年薪 from employees order by 年薪 desc; 

# 5.[按函数排序]按姓名的长度显示员工的姓名和工资
select length(last_name) zijiechangdu ,last_name,salary from employees order by length(last_name) desc;

# 6.*查询员工信息，先按工资排序，再按员工编号排序
select * from employees order by salary desc,employee_id asc;
# 7.选择工资不在8000到17000的员工的姓名和工资，按工资降序
select last_name,salary from employees where salary not between 8000 and 17000 order by salary desc;
# 8.查询邮箱中包含e的员工信息，并先按邮箱的字节数降序，再按部门号升序
select * from employees where email like '%e%' order by length(email) desc,department_id asc;
select concat(last_name,'_',first_name) from employees;
```

### 分组查询
引入：查询每个部门的平均工资，而不是整个公司。可以使用group by 子句将表中的数据分成若干组。  
**语法：**  
```sql
SELECT column, froup_function(column)
FROM table
[ WHERE condition ]
[ GROUP BY group_by_expression ]
[ ORDER BY column ]

select 分组函数,列(要求出现在group by的后面)
from 表
[ where 筛选条件 ]
group by分组的列表
[ order by子句 ]
```
**注意：**  
查询列表必须特殊，要求是分组函数和group by后出现的字段

**特点：**
- 分组查询中的筛选条件分两类　
  - 分组函数做条件肯定是放在having子句中
  - 从性能角度，能用分组前筛选的，就优先考虑使用分组前筛选

　
|            | 数据源         | 位置              | 关键字 |
| ---------- | -------------- | ----------------- | ------ |
| 分组前筛选 | 原始表         | group by 子句前面 | where  |
| 分组后筛选 | 分组后的结果集 | group by 子句后面 | having |
- group by支持单个字段分组，多个字段分组（多个字段之间用都好隔开没有顺序要求）
- 也可以添加排序。

#### 分组前筛选
**例子：**
- 1.查询每个工种的最高工资
- 2.查询每个位置上的部门个数
- 添加筛选条件
  1. 查询邮箱中包含a字符的，每个部门的平均工资
```sql
# 1. 查询每个工种的最高工资
select max(salary),job_id from employees group by job_id;

# 2. 查询每个位置上的部门个数
select count(*),location_id from employees group by location_id;

# 添加筛选条件re
# -1. 查询邮箱中包含a字符的，每个部门的平均工资

select avg(salary),department_id from employees where email like '%a%' group by department_id;
# -2. 查询有奖金的每个领导手下员工的最高工资
select max(salary),manager_id from employees where commission_pct is not null group by manager_id;
```
#### 分组后筛选
例子：
- 编号大于102的领导手下的最低工资，且最低工资大于5000的员工个数。
  1. 编号大于102的领导手下的最低工资
  2. 添加筛选条件：最低工资>5000
- 按员工姓名的长度分组，查询每一组的员工的个数，筛选员工个数>5的有哪些
  1. 查询每个长度的员工个数
  2. 添加筛选条件：筛选员工个数>5
  
```sql
# 编号大于102的领导手下的最低工资，且最低工资大于5000的员工个数。
# -1.编号大于102的领导手下的最低工资
select min(salary),manager_id 
from employees 
where manager_id>102 
group by manager_id;
# -2.添加筛选条件：最低工资>5000
select min(salary),manager_id 
from employees 
where manager_id>102 
group by manager_id 
having min(salary)>5000;

# 按员工姓名的长度分组，查询每一组的员工的个数，筛选员工个数>5的有哪些
# -1.查询每个长度的员工个数
select count(*),length(last_name) 
from employees 
group by length(last_name);
# -2.添加筛选条件：筛选员工个数>5
select count(*) c,length(last_name) 
from employees 
group by length(last_name)
having c>5;
```
#### 按多个字段分组
案例：  
- 查询每个部门每个工种的员工的平均工资
```sql
select avg(salary),department_id,job_id 
from employees 
group by job_id,department_id; 
```

#### 添加排序
案例：
- 查询每个部门每个工种的员工的平均工资，并且按平均工资的高低显示
```sql
select avg(salary),department_id,job_id 
from employees 
group by job_id,department_id 
order by avg(salary) desc; 
```

#### 总结案例
- 查询个job_id的员工工资的最大值，最小值，平均值，总和，并按job_id升序
- 查询员工最高工资和最低工资的差距
- 查询**各个**管理者手下员工的最低工资，其中最低工资不能低于6000，没有管理者的员工不计算在内
- 查询所有部门的编号，员工数量和工资平均值，并按平均工资降序
- 选择具体有各个job_id的员工人数

抓住**各个**这个关键词，就是group by。
```sql
# 查询个job_id的员工工资的最大值，最小值，平均值，总和，并按job_id升序
select max(salary),min(salary),avg(salary),sum(salary),job_id
from employees
group by job_id
order by job_id

# 查询员工最高工资和最低工资的差距
select max(salary) m,min(salary) n,max(salary) - min(salary)
from employees;

# 查询各个管理者手下员工的最低工资，其中最低工资不能低于6000，没有管理者的员工不计算在内
select min(employees.salary),manager_id
from employees
where employees.manager_id is not null
group by employees.manager_id
having min(employees.salary) > 6000;

# 查询所有部门的编号，员工数量和工资平均值，并按平均工资降序
select department_id,avg(salary),count(*)
from employees
group by department_id
order by department_id desc;

# 选择具体有各个job_id的员工人数
select count(*) 个数,job_id
from employees
group by job_id;

```

## 连接查询
**分类：**  
- 按年代分类：
  - SQL92标准：仅仅支持内连接
  - SQL99B标准[推荐]：支持内连接+外连接（左外和右外）+交叉连接
- 按功能分类：
  - 内连接
    - 等值连接
    - 非等值连接
    - 自连接
  - 外连接
    - 左外连接
    - 右外连接
    - 全外连接
  - 交叉连接
### SQL92标准
#### 等值查询
就是连接条件使用了一个=号
**案例：**
- 查询员工名和对应的部门名
- (为表起别名)查询员工名、工种号、工种名
  - 注：如果为表起了别名，则查询的字段不能使用原来的表名去限定
- （加筛选条件）
  - 查询有奖金的员工名和部门名
- （可以加分组）
  - 查询每个城市的部门个数
  - *查询有奖金的每个部门的部门名和部门的领导编号和该部门的最低工资
  - *查询每个工种的工种名和员工的个数，并且按员工个数降序
- (三表连接) 
  - 查询员工名，部门名和所在的城市

```sql
# 查询员工名和对应的部门名
select last_name,department_name 
from employees,departments 
where employees.department_id=departments.department_id;

# 查询员工名、工种号、工种名
select last_name,employees.job_id,job_title 
from employees,jobs 
where employees.`job_id`=jobs.`job_id`;

# （加筛选条件）查询有奖金的员工名和部门名
select last_name,department_name 
from employees e,departments d 
where e.department_id=d.department_id and e.commission_pct is not null;

# （可以加分组）查询每个城市的部门个数
select count(*) 个数,city
from departments d,locations l
where d.location_id=l.location_id
group by city;

# -*查询有奖金的每个部门的部门名和部门的领导编号和该部门的最低工资
select department_name,d.manager_id
from departments d,employees e 
where d.department_id=e.department_id 
and commission_pct is not null 
group by department_name,manager_id;

# -查询每个工种的工种名和员工的个数，并且按员工个数降序
select job_title,count(*) 
from employees e,jobs j 
where e.job_id=j.job_id 
group by job_title 
order by count(*) desc;

# 三表连接
# -查询员工名，部门名和所在的城市
select last_name,department_name,city 
from employees e,departments d,locations l 
where e.department_id=d.department_id 
and d.location_id=l.location_id;

```
#### 非等值连接
就是不是通过=使表连起来的了，也不一定是!=。
**案例：**
- 查询员工的工资和工资级别

```sql
select salary,grade_level 
from employees e,jod_grades j 
where salary between j.lowest_sal and j.highest.sal;
```

#### 自连接
相当于等值连接，而等值涉及多个表，自连接只有自己。  
**示例：**  
- 员工名和上级的名称
```sql
select e.employee_id,e.last_name,m.employee_id,m.last_name 
from employees e,employees m 
where e.employee_id=m.manager_id;
```
### SQL99


**语法：**
```sql
select 查询列表
from 表1 别名 【 连接类型 】
join 表2 别名
on 连接条件
【 where 筛选条件 】
【 group by 分组 】
【 having 筛选条件 】
【 order by 排序列表 】

```
**分类：**
- 内连接 【inner】
- 外连接
  - 左外连接：left【 outer 】
  - 右外连接：right【 outer 】
  - 全外连接 ：full【 outer 】
- 交叉连接 cross

#### 内连接
**语法：**
```sql
select 查询列表
from 表1 别名
inner join 表2 别名
on 连接条件
```
**分类：**  
- 等值
- 非等值
- 自连接

**特点：**
1. 可以添加排序，分组，筛选
2. inner可以省略
3. 筛选条件放在where后面，连接条件放在on后面，提高分离性，便于阅读
4. inner join连接和SQL92的内连接的效率是差不多的
**案例：**  
- 等值连接
  - 1.查询员工名和对应的部门名
  - 2.（加筛选条件）查询有奖金的员工名和部门名
  - 3.（可以加分组）查询部门个数>3的城市名和部门个数
  - 4.（添加排序，多表连接）查询员工名、部门名、工种名，并按部门名降序
- 非等值连接
  - 1.查询员工的工资和工资级别
  - *2.查询工资级别中级别的个数大于2的个数。并且进行按工资级别降序
- 自连接
  - 1.员工名和上级的名称


```sql
# 等值
# 1. 查询员工名和对应的部门名
select last_name,department_name from employees e inner join departments d on e.department_id=d.department_id;

# 2. （加筛选条件）查询有奖金的员工名和部门名
select last_name,department_name 
from employees e
inner join departments d 
on e.department_id=d.department_id and e.commission_pct is not null;

# 3. （可以加分组）查询部门个数>3的城市名和部门个数
select city,count(*) number from departments d inner join locations l on d.location_id=l.location_id group by city having count(*)>3;

# 4. （添加排序）查询员工名、部门名、工种名，并按部门名降序
select last_name,department_name,job_title 
from employees e 
inner join departments d on e.department_id=d.department_id 
inner join jobs j on e.job_id=j.job_id orderjobs 
order  by department_name desc;

# 非等值
# 1. 查询员工的工资和工资级别
select salary,grade_level 
from employees e
join job_grades j 
on salary between j.lowest_sal and j.highest_sal;

# 2.查询工资级别中级别的个数大于2的个数。并且进行按工资级别降序
select salary,grade_level 
from employees e
join job_grades j 
on salary between j.lowest_sal and j.highest_sal
order by

# 自连接
# 1.员工名和上级的名称
select e.employee_id,e.last_name,m.employee_id,m.last_name 
from employees e
join employees m 
on e.employee_id=m.manager_id;

```
#### 外连接


**特点：**
1. 用于一个表中有，另外一个表中没有记录的情况
2. 外连接的查询结果为主表中的所有记录  
    如果从表中有和它匹配的，则显示匹配的值  
    如果从表中没有和它匹配的，则显示null  
    外连接查询结果=内连接结果+主表中有而从表没有的记录  
3. 左外连接，left join左边的是主表  
    右外连接，right join右边的是主表
4. 左外和右外交换两个表的顺序，可以实现同样的效果
5. mysql不支持全外连接，全外连接左表和右表中没有匹配的都能打印出。
6. 全外连接=内连接的结果+表1中有但表2没有的+表2中有但表1没有的


**案例：**  
- 1.查询男朋友不在男神表的的**女神名**(注：女神名为主表)【左外连接，右外连接】


```sql
-- 1-1.查询男朋友不在男神表的的女神名（左外连接）
select b.name,bo.* from beauty b left outer join boys bo on b.boyfriend_id=bo.id where bo.id is null;
-- 1-2.查询男朋友不在男神表的的女神名（右外连接）
select b.name,bo.* from boys bo right join beauty b on b.boyfriend_id=bo.id where bo.id is null;
```

#### 交叉连接
就是笛卡尔乘积  
`select b.*,bo.* from beauty b cross join boys bo;`

### sql99和sql92比较 
功能：sql99支持的比较多
可读性：sql99实现连接条件和筛选条件的分离，可读性较高
![](pic/2.png)
![](pic/3.png)

# 数据库（database）
- 显示所有数据库：  
  `show databases;`


## 默认数据库

**默认数据库分类：**

- information_schema
- performance_schema
- mysql
- test

**数据库信息：informance_schema**

- 保存了MySQl服务所有**数据库的信息**。
- 具体MySQL服务有多少个数据库，各个数据库有哪些表，各个表中的字段是什么数据类型，各个表中有哪些索引，各个数据库要什么权限才能访问。  
**权限，管理，部署：mysql**

- 保存MySQL的权限、参数、对象和状态信息。
- 如哪些user可以访问这个数据、DB参数、插件、主从

**性能：performance_schema**

- 主要用于收集数据库服务器性能参数
提供进程等待的详细信息，包括锁、互斥变量、文件信息；
保存历史的事件汇总信息，为提供MySQL服务器性能做出详细的判断；
对于新增和删除监控事件点都非常容易，并可以随意改变mysql服务器的监控周期，例如（CYCLE、MICROSECOND）


# 细节
- 着重号  
``如果与关键字冲突可以用此符号避免冲突
- 没有字符，只有字符串的概念
- %代表任何一个字符(like中使用居多)
- 字符型必须用单引号
- 如果为表起了别名，则查询的字段不能使用原来的表名去限定（注：示例在等值连接那）
- having与where