```go
func demo1() {
	s := "lin西华！"
	bytes := []byte(s)
	// 1.len是字节数
	// 2.s[i]索引的也是字节
	// output: 0:0x6c 1:0x69 2:0x6e 3:0xe8 4:0xa5 5:0xbf 6:0xe5 7:0x8d 8:0x8e 9:0xef 10:0xbc 11:0x81
	for i := 0; i < len(s); i++ {
		fmt.Printf("%d:%#x ", i, s[i])
	}
	fmt.Println()
	// 3.使用range可以直接按照utt-8遍历
	// output: (0:0x6c) (1:0x69) (2:0x6e) (3:0x897f) (6:0x534e) (9:0xff01)
	for i, ch := range s {
		fmt.Printf("(%d:%#x) ", i, ch)
	}
	fmt.Println()
	// 4.获取utf-8数
	// output: s的utf-8字符数： 6
	fmt.Println("s的utf-8字符数：", utf8.RuneCountInString(s))
	
	// 5.utf-8遍历复杂版
	// output: l i n 西 华 ！
	for len(bytes) > 0 {
		// 返回的size是解码后用到了多少个字节，ch是解码结果
		ch, size := utf8.DecodeRune(bytes)
		// 截取更新
		bytes = bytes[size:]
		fmt.Printf("%c ", ch)
	}
}

func main() {
	demo1()
}
```