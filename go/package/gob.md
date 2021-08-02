- 参考：https://laravelacademy.org/post/22040
# 简述
- 二进制的一个序列化和反序列化的库
  


# demo

## demo1:序列化到文件
- 将`interface{}`序列化到文件中，以及从文件中反序列化
```go

type Article struct {
	Id      int
	Title   string
	Content string
	Author  string
}

// 写入二进制数据到磁盘文件
func write(data interface{}, filename string) {
	var (
		bufWri *bufio.Writer
		file   *os.File
		err    error
	)
	if file, err = os.OpenFile(filename, os.O_WRONLY, 0666); err != nil {
		return
	}
	defer file.Close()

	bufWri = bufio.NewWriter(file)
	defer bufWri.Flush()

	encoder := gob.NewEncoder(bufWri)

	err = encoder.Encode(data)
	if err != nil {
		log.Fatal(err)
	}



}

// 从磁盘文件加载二进制数据
func read(data interface{}, filename string) {
	var(
		file *os.File
		err error
		reader *bufio.Reader
	)
	if file, err = os.OpenFile(filename, os.O_RDONLY, 0666); err != nil{
		log.Fatal(err)
	}
	reader = bufio.NewReader(file)

	dec := gob.NewDecoder(reader)
	err = dec.Decode(data)
	if err != nil {
		log.Fatal(err)
	}
}

func TestGob(t *testing.T) {
	var enArticles = []Article{
		{
			Id:      1,
			Title:   "基于 Gob 包编解码二进制数据",
			Content: "通过 Gob 包序列化二进制数据以便通过网络传输",
			Author:  "l1nkkk",
		},
		{
			Id:      2,
			Title:   "lalalalala",
			Content: "通hahahaha",
			Author:  "l1nkkk",
		},
	}


	write(enArticles, "article_data")
    // 注：需要make
	var deArticle  []Article = make([]Article,0)

    // 注：传地址
	read(&deArticle, "article_data")
	fmt.Println(deArticle)
}

```

## demo2:批量序列化，并判断文件结束

```go

func WriterKVPair(pair []kv.KVPair, path string){
	var(
		err error
		file *os.File
		writer *bufio.Writer
		enc *gob.Encoder
	)
	if file, err = os.OpenFile(path, os.O_WRONLY |os.O_CREATE, 0666); err != nil{
		log.Fatal(err)
	}
	defer file.Close()

	writer = bufio.NewWriter(file)
	defer writer.Flush()    // 注意

	enc = gob.NewEncoder(writer)
	for _,kv := range pair{
		if err = enc.Encode(kv); err != nil{
			log.Println(err)
		}
	}


}

func ReaderKVPair( path string) ([]kv.KVPair, error){
	var (
		rtn []kv.KVPair
		err error
		file *os.File
		reader *bufio.Reader
		dec *gob.Decoder
	)
	if file,err =os.OpenFile(path, os.O_RDONLY, 0666); err != nil{
		return nil, err
	}
	defer file.Close()

	reader = bufio.NewReader(file)

	dec = gob.NewDecoder(reader)
	for  {
		var kv kv.KVPair
		if err = dec.Decode(&kv); err != nil{
			if err.Error() == "EOF"{
				break
			}else{
				return nil, err
			}
		}
		rtn = append(rtn, kv)
	}

	return rtn, nil
}

func TestGobKVPair(t *testing.T){
	var (
		readKvs []kv.KVPair = make([]kv.KVPair, 0)
		err error
	)
	vgs,num,_ := Load()
	kvs := graph.GraphToKV(vgs, num)
	WriterKVPair(kvs, "kvpair_data")
	if readKvs,err = ReaderKVPair("kvpair_data"); err != nil{
		t.Fatal(err)
	}
	if len(readKvs) != int(num){
		t.Error(err)
	}

	fmt.Printf("%#v",readKvs)
}
```

