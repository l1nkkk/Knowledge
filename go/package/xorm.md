- [demo1:新建数据库引擎、数据库引擎设置、操作](#demo1%E6%96%B0%E5%BB%BA%E6%95%B0%E6%8D%AE%E5%BA%93%E5%BC%95%E6%93%8E%E6%95%B0%E6%8D%AE%E5%BA%93%E5%BC%95%E6%93%8E%E8%AE%BE%E7%BD%AE%E6%93%8D%E4%BD%9C)
- [demo2：同步表到数据库的多种模式](#demo2%E5%90%8C%E6%AD%A5%E8%A1%A8%E5%88%B0%E6%95%B0%E6%8D%AE%E5%BA%93%E7%9A%84%E5%A4%9A%E7%A7%8D%E6%A8%A1%E5%BC%8F)
- [操作](#%E6%93%8D%E4%BD%9C)
- [类型对应](#%E7%B1%BB%E5%9E%8B%E5%AF%B9%E5%BA%94)
- [其他操作](#%E5%85%B6%E4%BB%96%E6%93%8D%E4%BD%9C)
> https://gobook.io/read/gitea.com/xorm/manual-zh-CN/  
> https://www.bilibili.com/video/BV1z64y1c7eo?from=search&seid=1092835782295908251
- orm库

# demo1:新建数据库引擎、数据库引擎设置、操作

- 设置显示SQL语句
- 设置日志级别
- 设置连接池
- 将结构同步到数据库中的表中
- 使用原生sql语句进行查询

```go
package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	"xorm.io/core"
)

var engine *xorm.Engine

func main() {
	var err error
	// 1.新建数据库引擎
	engine, _ = xorm.NewEngine("mysql", "l1nkkk:linuxlin000@/MedicalApp?charset=utf8")

	if err != nil {
		fmt.Println("error")
	}
	// 2.关闭数据库引擎
	defer engine.Close()

	// 3.数据库引擎设置
	engine.ShowSQL(true)                     // 设置显示SQL语句
	engine.Logger().SetLevel(core.LOG_DEBUG) // 设置日志级别
	engine.SetMaxOpenConns(10)               // 设置连接池

	// 将结构同步到数据库中的表中
	engine.Sync(new(Mytest))

	// 查询表的所有数据
	session := engine.Table("user")
	var count int64
	if count, err = session.Count(); err != nil {
		return
	}
	fmt.Println(count)

	// 使用原生sql语句进行查询
	result, err := engine.Query("select * from user")
	if err != nil {
		return
	}
	for key, value := range result {

		fmt.Println(key, value)
	}
}

// 必须全大写
type Mytest struct {
	T1 int
	T2 string
}

```

# demo2：同步表到数据库的多种模式


```go
package main

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	"xorm.io/core"
)

var engine *xorm.Engine

func main() {
	var err error
	// 1.新建数据库引擎
	engine, _ = xorm.NewEngine("mysql", "l1nkkk:linuxlin000@/MedicalApp?charset=utf8")

	if err != nil {
		fmt.Println("error")
	}
	// 关闭数据库引擎
	defer engine.Close()

	// 2.设置映射规则，并将其表结构同步到数据库
	//驼峰法变小写中间+`_`
	engine.SetMapper(core.SnakeMapper{})
	if err = engine.Sync2(new(UserTable)); err != nil {
		return
	}
	fmt.Println("UserTable table done")

	// 不变，和成员名一样
	engine.SetMapper(core.SameMapper{})
	if err = engine.Sync2(new(StudentTable)); err != nil {
		return
	}
	fmt.Println("StudentTable table done")

	// 智能驼峰法，比如不会把ID变成 i_d
	engine.SetMapper(core.GonicMapper{})
	if err = engine.Sync2(new(PersonTable)); err != nil {
		return
	}
	fmt.Println("PersonTable table done")

}

type UserTable struct {
	UserId   int64  `xorm:"pk autoincr"` // 设置主键
	UserName string `xorm:"varchar(32)"`
	UserAge  int64  `xorm:"default 1"`
	UserSex  int64  `xorm:"default 0"` // 设置默认值
}

type StudentTable struct {
	Id          int64  `xorm:"pk autoincr"`
	StudentName string `xorm:"varchar(24)"`
	StudentAge  int    `xorm:"int default 0"`
	StudentSex  int    `xorm:"index"` // 另sex为索引
}

type PersonTable struct {
	ID         int64     `xorm:"pk autoincr"`
	PersonName string    `xorm:"varchar(24)"`
	PersonAge  int       `xorm:"int default 0"`
	PersonSex  int       `xorm:"notnull"` // 设置不为空
	City       CityTable `xorm："-"`       // 不映射这个字段到数据库中建表
}

type CityTable struct {
	CityName      string
	CityLongitude float32
	CityLatitude  float32
}

```
# 操作
- get方法：返回一条数据
- find方法：返回多条数据
- where方法
- and方法：接多个条件，在where之后
- id方法：主键查找
- SQL：接原生的sql语句
- OrderBy：排序，默认升序
- Cols：查询特定字段。`engine.Cols("person_name","person_age").Find(&personsCols)`，没有选中的列为0值
- Insert：插入数据
- Delete：删除数据
- Update：更新数据
- Count：统计功能
- 事务：NewSession、Begin、Commit

# 类型对应
https://github.com/go-xorm/tests/blob/master/testTypes.go

# 其他操作

- 判断表是否为空：`engine.IsTableEmpty(new(PersonTable))`
- 判断表是否存在：`engine.IsTableExist(new(PersonTable))`