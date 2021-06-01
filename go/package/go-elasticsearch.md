> https://strconv.com/posts/use-elastic/

```go

package main

import (
	"context"
	"fmt"
	"github.com/olivere/elastic/v7"
	"reflect"
)

func main(){
	testSearchData()
}

type SmbData struct {
	Time     uint64      `json:"Time"`
	Temperature  float64   `json:"temperature"`
	Pressure float64 `json:"pressure"`
	Humidity float64 `json:"humidity"`
}

var (
	smbData SmbData
)

// 索引是否存zai
func testExist(){
	var (
		servers   = []string{"http://localhost:9200/"}

		indexName = "fromsmb"
	)
	ctx := context.Background()
	client, err := elastic.NewClient(elastic.SetURL(servers...))
	if err != nil {
		panic(err)
	}
	exists, err := client.IndexExists(indexName).Do(ctx)
	if err != nil {
		panic(err)
	}
	if !exists {
		// _, err := client.CreateIndex(indexName).BodyString(mapping).Do(ctx)
		//if err != nil {
		//	panic(err)
		//}
		fmt.Println("not exists")
	} else{
		fmt.Println("exists")
	}
}

func testSearchData(){
	var (
		servers   = []string{"http://localhost:9200/"}
	)
	ctx := context.Background()
	client, err := elastic.NewClient(elastic.SetURL(servers...))
	if err != nil {
		panic(err)
	}
	searchResult, err := client.Search().
		Index("fromsmb").
		Sort("Time", false). // 按id升序排序
		From(0).Size(1). // 拿前10个结果
		Pretty(true).
		Do(ctx) // 执行
	if err != nil {
		panic(err)
	}
	total := searchResult.TotalHits()
	fmt.Printf("Found %d subjects\n", total)
	if total > 0 {
		for _, item := range searchResult.Each(reflect.TypeOf(smbData)) {
			if t, ok := item.(SmbData); ok {
				fmt.Printf("Found: Subject(time=%d, Humidity=%f, Pressure=%f, Temperature=%f)\n", t.Time, t.Humidity, t.Pressure, t.Temperature)
			}
		}

	} else {
		fmt.Println("Not found!")
	}
}
```