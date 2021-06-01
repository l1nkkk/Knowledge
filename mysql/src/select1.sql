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
SELECT 100%98;

# 其别名
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
FROM
    employees;
SELECT CONCAT(`first_name`,',',`phone_number`,',',`manager_id`,',',ifnull(commission_pct,0) AS "output" FROM employees;