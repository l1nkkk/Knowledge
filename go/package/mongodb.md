```go
import (
	"github.com/mongodb/mongo-go-driver/mongo/findopt"

	"github.com/mongodb/mongo-go-driver/bson/objectid"

	"github.com/mongodb/mongo-go-driver/mongo/clientopt"

	"github.com/mongodb/mongo-go-driver/mongo"
)
```

- mongodb连接，增伤改查。
- 其中的数据库和表不用事先创建

- demo1
  - 连接
```go
func demo1() {

	var (
		client     *mongo.Client
		database   *mongo.Database
		collection *mongo.Collection
		err        error
	)
	// 1.建立连接
	if client, err = mongo.Connect(context.TODO(), "mongodb://127.0.0.1:27017", clientopt.ConnectTimeout(5*time.Second)); err != nil {
		log.Println(err)
		return
	}
	// 2.选择数据库
	database = client.Database("my_db")
	// 3.选择表
	collection = database.Collection("my_collection")

	collection = collection

	fmt.Println("done")
}
```
- demo2
  - 增
  - 这里还不用用到bson的反射
```go
func demo2() {
	var (
		client     *mongo.Client
		database   *mongo.Database
		collection *mongo.Collection
		err        error
		record     LogRecord
		insertRes  *mongo.InsertOneResult
		docld      objectid.ObjectID
	)
	// 1.建立连接
	if client, err = mongo.Connect(context.TODO(), "mongodb://39.107.83.89:27017", clientopt.ConnectTimeout(5*time.Second)); err != nil {
		log.Println(err)
		return
	}
	// 2.选择数据库
	database = client.Database("cron")
	// 3.选择表
	collection = database.Collection("log")

	record = LogRecord{
		JobName:   "job_lin",
		Command:   "echo hello",
		Err:       "",
		Content:   "hello",
		TimePoint: TimePoint{StartTime: time.Now().Unix(), EndTime: time.Now().Unix()},
	}
	if insertRes, err = collection.InsertOne(context.TODO(), record); err != nil {
		log.Println(err)
		return
	}
	// _id,如果在记录中没有定义_id字段，mongodb会自动生成的，其为一个12字节的二进制
	docld = insertRes.InsertedID.(objectid.ObjectID)
	fmt.Println("自增Id", docld.Hex())
	fmt.Println("done")
}
```

- demo3
  - 查
  - 需要用到bson
```go
func demo3() {
	var (
		client     *mongo.Client
		database   *mongo.Database
		collection *mongo.Collection
		err        error
		cdt        *FindByJobName
		cursor     mongo.Cursor
		record     *LogRecord
		// record     LogRecord
		// insertRes  *mongo.InsertOneResult
		// docld      objectid.ObjectID
	)
	// 1.建立连接
	if client, err = mongo.Connect(context.TODO(), "mongodb://39.107.83.89:27017", clientopt.ConnectTimeout(5*time.Second)); err != nil {
		log.Println(err)
		return
	}
	// 2.选择数据库
	database = client.Database("cron")
	// 3.选择表
	collection = database.Collection("log")

	// 4.过滤条件。过滤条件仍然是一个bson格式的结构
	cdt = &FindByJobName{JobName: "job1"}

	// 5.查询
	// skip为跳过几条数据，limit为查询几条数据
	if cursor, err = collection.Find(context.TODO(), cdt, findopt.Skip(0), findopt.Limit(2)); err != nil {
		log.Println(err)
		return
	}
	// 记得关闭，因为cursor是一个会占用连接的资源
	defer cursor.Close(context.TODO())

	for cursor.Next(context.TODO()) {
		// 定义一个日志对象来接收查询返回
		record = &LogRecord{}

		// 反序列化bson
		if err = cursor.Decode(record); err != nil {
			log.Println(err)
			return
		}
		fmt.Println(*record)
	}
	fmt.Println("done")
}
```

- demo4
  - 删除
  - 注意`TimeBeforeCond`
```go
// 删除
// 字段名为tag，字段值为value
type TimeBeforeCond struct {
	Before int64 `bson:"$lt"`
}

// {"timePoint.startTime":{"$lt":当前时间}}
type DelCond struct {
	Beforecond TimeBeforeCond `bson:"timePoint.startTime"`
}

func demo4() {
	var (
		client     *mongo.Client
		database   *mongo.Database
		collection *mongo.Collection
		err        error
		delCond    *DelCond
		delRes     *mongo.DeleteResult
		// record     LogRecord
		// insertRes  *mongo.InsertOneResult
		// docld      objectid.ObjectID
	)
	// 1.建立连接
	if client, err = mongo.Connect(context.TODO(), "mongodb://139.155.11.163:27017", clientopt.ConnectTimeout(5*time.Second)); err != nil {
		log.Println(err)
		return
	}
	// 2.选择数据库
	database = client.Database("cron")
	// 3.选择表
	collection = database.Collection("log")
	// 4.删除记录
	// delete({"timePoint.startTime":{"$lt":当前时间}})
	delCond = &DelCond{Beforecond: TimeBeforeCond{Before: time.Now().Unix()}}
	if delRes, err = collection.DeleteMany(context.TODO(), delCond); err != nil {
		log.Println(err)
		return
	}
	fmt.Println("删除行数， ", delRes.DeletedCount)
	fmt.Println("done!")
}

```