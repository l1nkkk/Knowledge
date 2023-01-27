
- [安装](#%E5%AE%89%E8%A3%85)
- [注意](#%E6%B3%A8%E6%84%8F)
  - [vscode配置](#vscode%E9%85%8D%E7%BD%AE)
- [基础](#%E5%9F%BA%E7%A1%80)
  - [原始数据类型](#%E5%8E%9F%E5%A7%8B%E6%95%B0%E6%8D%AE%E7%B1%BB%E5%9E%8B)
    - [例子](#%E4%BE%8B%E5%AD%90)
  - [函数的定义](#%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9A%E4%B9%89)
  - [类](#%E7%B1%BB)
    - [es5中](#es5%E4%B8%AD)
      - [1.最简单的类](#1%E6%9C%80%E7%AE%80%E5%8D%95%E7%9A%84%E7%B1%BB)
      - [2.构造函数和原型链里增加方法](#2%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E5%92%8C%E5%8E%9F%E5%9E%8B%E9%93%BE%E9%87%8C%E5%A2%9E%E5%8A%A0%E6%96%B9%E6%B3%95)
      - [3.类里面的静态方法](#3%E7%B1%BB%E9%87%8C%E9%9D%A2%E7%9A%84%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
      - [4.es5里面的继承](#4es5%E9%87%8C%E9%9D%A2%E7%9A%84%E7%BB%A7%E6%89%BF)
      - [5.原型链实现继承](#5%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%AE%9E%E7%8E%B0%E7%BB%A7%E6%89%BF)
      - [6.原型链实现](#6%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%AE%9E%E7%8E%B0)
      - [7.原型链+构造函数的组合继承模式](#7%E5%8E%9F%E5%9E%8B%E9%93%BE%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E7%9A%84%E7%BB%84%E5%90%88%E7%BB%A7%E6%89%BF%E6%A8%A1%E5%BC%8F)
      - [8.原型链+对象冒充继承的另一种方式](#8%E5%8E%9F%E5%9E%8B%E9%93%BE%E5%AF%B9%E8%B1%A1%E5%86%92%E5%85%85%E7%BB%A7%E6%89%BF%E7%9A%84%E5%8F%A6%E4%B8%80%E7%A7%8D%E6%96%B9%E5%BC%8F)
    - [ts中的类](#ts%E4%B8%AD%E7%9A%84%E7%B1%BB)
      - [1.ts类的定义](#1ts%E7%B1%BB%E7%9A%84%E5%AE%9A%E4%B9%89)
      - [2.ts中实现继承 extends super](#2ts%E4%B8%AD%E5%AE%9E%E7%8E%B0%E7%BB%A7%E6%89%BF-extends-super)
      - [3.类里面的修饰符](#3%E7%B1%BB%E9%87%8C%E9%9D%A2%E7%9A%84%E4%BF%AE%E9%A5%B0%E7%AC%A6)
      - [4.静态属性，静态方法](#4%E9%9D%99%E6%80%81%E5%B1%9E%E6%80%A7%E9%9D%99%E6%80%81%E6%96%B9%E6%B3%95)
      - [5.多态](#5%E5%A4%9A%E6%80%81)
      - [6.抽象类，抽象方法](#6%E6%8A%BD%E8%B1%A1%E7%B1%BB%E6%8A%BD%E8%B1%A1%E6%96%B9%E6%B3%95)
  - [接口](#%E6%8E%A5%E5%8F%A3)
    - [属性接口](#%E5%B1%9E%E6%80%A7%E6%8E%A5%E5%8F%A3)
    - [函数类型接口](#%E5%87%BD%E6%95%B0%E7%B1%BB%E5%9E%8B%E6%8E%A5%E5%8F%A3)
    - [可索引接口(不常用)](#%E5%8F%AF%E7%B4%A2%E5%BC%95%E6%8E%A5%E5%8F%A3%E4%B8%8D%E5%B8%B8%E7%94%A8)
    - [类类型接口(常用)](#%E7%B1%BB%E7%B1%BB%E5%9E%8B%E6%8E%A5%E5%8F%A3%E5%B8%B8%E7%94%A8)
    - [接口的扩展](#%E6%8E%A5%E5%8F%A3%E7%9A%84%E6%89%A9%E5%B1%95)
- [泛型](#%E6%B3%9B%E5%9E%8B)
  - [泛型函数](#%E6%B3%9B%E5%9E%8B%E5%87%BD%E6%95%B0)
  - [泛型类](#%E6%B3%9B%E5%9E%8B%E7%B1%BB)
    - [把类作为参数约束数据传入的类型](#%E6%8A%8A%E7%B1%BB%E4%BD%9C%E4%B8%BA%E5%8F%82%E6%95%B0%E7%BA%A6%E6%9D%9F%E6%95%B0%E6%8D%AE%E4%BC%A0%E5%85%A5%E7%9A%84%E7%B1%BB%E5%9E%8B)
  - [泛型接口](#%E6%B3%9B%E5%9E%8B%E6%8E%A5%E5%8F%A3)
- [模块](#%E6%A8%A1%E5%9D%97)
- [应用](#%E5%BA%94%E7%94%A8)
  - [ts封装统一操作Mysql Mongodb Mssql的底层库](#ts%E5%B0%81%E8%A3%85%E7%BB%9F%E4%B8%80%E6%93%8D%E4%BD%9CMysql-Mongodb-Mssql%E7%9A%84%E5%BA%95%E5%B1%82%E5%BA%93)
- [装饰器](#%E8%A3%85%E9%A5%B0%E5%99%A8)
  - [类装饰器](#%E7%B1%BB%E8%A3%85%E9%A5%B0%E5%99%A8)
> https://ts.xcatliu.com/basics/primitive-data-types

# 安装
- 必须先安装nodejs
- `npm install -g typescript`
- tsc helloworld.ts
# 注意
- 浏览器不支持ts和es6，所以必须把这些转成es5.使用 `tsc index.ts` 进行编译
- 每一次都需要用ts进行编译，所以推荐使用vscode等编辑器可以自动编译
- ts是es5和es6的超集
- ts在js之上增加了类型校验，利于维护，更规范
```ts
var flag:boolean=true
flag=123 //错误
```
## vscode配置
1. `tsc --init`生成tsconfig.json文件，改"outDir"，其表示输出的位置
2. 任务 - 运行任务 - 监视tsconfig.json

# 基础
## 原始数据类型
布尔值、数值、字符串、空值(void)、null、undefined
|  类型  |   标识    |
| :----: | :-------: |
| 布尔值 |  boolean  |
|  数值  |  number   |
| 字符串 |  string   |
|  空值  |   void    |
|        |   null    |
|        | undefined |
| 任意值 |    any    |
| 数组类型 | number[] or Array\<number> |
| 元祖 |  [number,string] |
| 枚举 | enum |
|  | never |

- 使用构造函数 Boolean 创造的对象不是布尔值
- 在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样。
- 可以用 void** 表示没有任何返回值的函数**，声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null。
- 与 void 的区别是，undefined 和 null 是所有类型的子类型。也就是说 undefined 类型的变量，可以赋值给 number 类型的变量(并不可以！！！)
- 任意值上访问任何属性都是允许的，允许调用任何方法，声明一个变量为任意值之后，对它的任何操作，返回的内容的类型都是任意值。
- 定义没有赋值就是undefined

### 例子
```ts
// 1. boolean

let isDone: boolean = false;

let createdByNewBoolean: boolean = new Boolean(1);

// Type 'Boolean' is not assignable to type 'boolean'.
//   'boolean' is a primitive, but 'Boolean' is a wrapper object. Prefer using 'boolean' when possible.

let createdByNewBoolean: Boolean = new Boolean(1);

// 2. number
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;

// 3. string
let myName: string = 'Tom';
let myAge: number = 25;

// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;

// 4. 空值
// 表示方法没有返回任何类型
function alertName(): void {
    alert('My name is Tom');
}

let unusable: void = undefined;

// 5. null和undefined
let u: undefined = undefined;
let n: null = null;

// 这样不会报错
let num: number|undefined = undefined;

// 这样也不会报错
let u: undefined;
let num: number|undefined = u;

// error
let u: void;
let num: number = u;
// Type 'void' is not assignable to type 'number'.

// 6. any
// no error
let anyThing: any = 'hello';
console.log(anyThing.myName);
console.log(anyThing.myName.firstName);

// no error too
let anyThing: any = 'Tom';
anyThing.setName('Jerry');
anyThing.setName('Jerry').sayHello();
anyThing.myName.setFirstName('Cat');


// 7. 数组

// 法一

var arr:number[]=[11,22,33]

// 法二

var arr:Array<number>=[11,22,33]

// 8. 元祖

var arr:[number,string]=[123,'this is ts']

// 9. 枚举
enum Flag {success=1,failed=2};
let s:Flag=Flag.success;

// 10.never
var a:never;
a=(()=>{
    throw new Error;
})()


```


## 函数的定义
- 普通函数声明
```ts
function run():string{
    return "run";
}

```

- 匿名函数

```ts
var fun2=function():number{
    return 123;
}
```

- ts中定义形参

```ts
function getInfo(name:string,age:number):string{
    return `${name} --- ${age}`;
}
alert(getInfo("link",20));
```

- 没有返回值的方法

```ts
function getInfo():void{
    console.log('run')
}
```

- 方法可选参数 
  - 可选参数必须配置到参数的后面
```ts
function getInfo（name:string,age?:number):string{
    if(age){
        return `${name} --- ${age}`
    }else{
        return `${name ---- 年龄保密`
    }

}
```

- 默认参数

```ts
function getInfo（name:string,age?:number=20):string{
    if(age){
        return `${name} --- ${age}`
    }else{
        return `${name ---- 年龄保密`
    }

}
```


- 剩余参数

```ts
function sun(...result:number[]):number{
    var sum=0;
    for(var i-0;i<result.length;i++){
        sum+=result[i];
    }
    return sum;
}
sum(1,2,3,4)
```

- 重载
  - es5没有重载

```ts
//ts中的重载

function getInfo(name:string):string;

function getInfo age :number) :string;

function getInfo(str:any) :any{

    if(typeof str==='string'){

        return '我叫: '+str;
    }else{

        return'我的年龄是'+str;
    }
}

// alert(getInfo('张三 ')); //正确

// alert(getInfo(20)); //正确
// alert(true) // 错误

function getInfo( name:string):string;

function get Info(name : string , age: number):string;
function get Info (name: any , age? :any) : any{
    if(age){
        return '我叫' +name+ '我的年龄是 ' +age;
    }else{
      rеturn '我叫:' +nаmе;
    }
}

// alert(getInfo( 'zhangsan')); /* 正确*/

// alert(getInfo(123)); //错误

// alert(getInfo('zhangsan',20)) ;

```

- 剪头函数 es6
  - this指向问题，剪头函数里面的this指向上下文

```ts
setTimeout(function(){
    alert('run')
},1000)

setTimeout(()=>{
    alert('run')
},1000)

```

## 类
### es5中
#### 1.最简单的类
```js
function Person(){
    this.name='l1nkk';
    this.age=20;
}
var p = new Person();
alert(p.name);
```
#### 2.构造函数和原型链里增加方法
  - 原型链上的属性会被多个实例共享，构造函数不会
```js
function Person(){
    this.name='l1nkk';
    this.age=20;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}


var p = new Person();
// p.run()
p.work
```

#### 3.类里面的静态方法
  - 原型链+对象冒充的组合继承模式
```js

Persion.getInfo = function(){
    alert("static function")
}

// 调用
Persion.getInfo()

```

#### 4.es5里面的继承

```js
function Person(){
    this.name='l1nkk';
    this.age=20;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}

// 原型链+对象冒充的组合继承模式
function Web(){
    Person.call(this) /*对象冒充实现继承*/
}

var w = new Web();
w.run(); // 对象冒充可以继承构造函数里面的属性和方法

w.work(); // 没法继承原型链里面的属性和方法
```
#### 5.原型链实现继承
  - 对象冒充可以继承构造函数里面的属性和方法，没法继承原型链里面的属性和方法

```js
function Person(){
    this.name='l1nkk';
    this.age=20;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}


function Web(){
    Person.call(this) /*对象冒充实现继承*/
}

var w = new Web();
w.run(); // 对象冒充可以继承构造函数里面的属性和方法

w.work(); // 没法继承原型链里面的属性和方法
```

#### 6.原型链实现
  - 可以继承构造函数里面的属性和方法，原型链里面的属性和方法
```js
function Person(){
    this.name='l1nkk';
    this.age=20;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}

function Web(){
  
}
Web.prototype=new Person(); //原型链实现继承
var w = new Web();
w.work()
```
  - 问题所在,不能给父类构造函数传参
```js
function Person(name,age){
    this.name=name;
    this.age=age;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}

function Web(name,age){
  
}
Web.prototype=new Person(); //原型链实现继承
var w = new Web('l1nkk',22);
w.run() // 出现name undefined的情况

```
#### 7.原型链+构造函数的组合继承模式

```js
function Person(name,age){
    this.name=name;
    this.age=age;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}

function Web(name,age){
  Person.call(this,name,age) // 对象冒充 实例化子类可以给父类传参
}
Web.prototype=new Person(); 
var w = new Web('l1nkk',22);
w.run() // 出现name undefined的情况
w.work() //也没有问题
```
#### 8.原型链+对象冒充继承的另一种方式

```js
function Person(name,age){
    this.name=name;
    this.age=age;

    this.run=function(){
        alert(this.name+'在运动');
    }
}

// 原型链
Person.prototype.sex="男"
Person.prototype.work=function(){
    alert(this.name+'在工作');
}


function Web(name,age){
  Person.call(this,name,age) // 对象冒充 实例化子类可以给父类传参
}
Web.prototype=Person.prototype;
var w = new Web('l1nkk',22);
w.run() // 出现name undefined的情况
w.work()
```

### ts中的类

#### 1.ts类的定义
```ts
class Person{
    name:string; //s属性 前面省略了public关键字
    constructor(n:string){ // 构造函数  实例化类的时候触发的方法
        this.name = n;
    }
    run():void{
        alert(this.name);
    }
    getName():string{
        return this.name
    }
    setName(name:string):void{
        this.name=name
    }
}
var p=new Persion('l1nkkk')
p.run()

```


#### 2.ts中实现继承  extends super
- 父类和子类有相同的方法先找子类
```ts
class Person{
    name:string; //s属性 前面省略了public关键字
    constructor(n:string){ // 构造函数  实例化类的时候触发的方法
        this.name = n;
    }
    run():string{
        // alert(this.name);
        return `${this.name}在运动`
    }
    getName():string{
        return this.name
    }
    setName(name:string):void{
        this.name=name
    }
}

// var p=new Person('wwww')
// p.run();

class Web extends Person{
    constructor(name:string){
        super(name);
    }
}
var w =new Web('linkkk');
alert(w.run());
```
#### 3.类里面的修饰符
- 三种(和c++差不多)
  - public(默认)：公有。 在类里面、子类、类外面可访问
  - protected：保护。  在类里面、子类可访问。类外面无法访问。
  - private：私有。  在类里面可访问。类外面、子类无法访问。

#### 4.静态属性，静态方法
- static
- 只能调用

```ts
class Person{
    name:string; //s属性 前面省略了public关键字

    static sex="男";

    constructor(n:string){ // 构造函数  实例化类的时候触发的方法
        this.name = n;
    }
    run():string{
        // alert(this.name);
        return `${this.name}在运动`
    }
    getName():string{
        return this.name
    }
    setName(name:string):void{
        this.name=name
    }
    static print(){
        allert("print")
    }
}
```

#### 5.多态

- 其实就是继承后重写，没什么特别的。也没什么关键字。

#### 6.抽象类，抽象方法

- 抽象类不能直接被实例化；抽象方法不包含具体实现，必须在派生类中实现
- 关键字：abstract

```ts
abstract class Animal{
    name:string;
    constructor(name:string){
        this.name=name;
    }
    abstract eat():any;
}

class Dog extends Animal{
    constructor(name:any){
        super(name)
    }
    eat(){
        console.log(this.name+' eating...')
    }
}
var d=new Dog('小狗')
d.eat();
```
## 接口
- 行为和动作的规范，对批量方法进行约束
- 关键字：interface
- ?:表示可选
### 属性接口
```ts
interface FullName{
    firstName:string;
    secondName:string;
    age?:number;
}

// 传入的参数必须包含firstName，secondName
function printName(name:FullName){
    console.log(name.firstName+'---'+name.secondName)
}

var obj={
    age:20,
    firstName:'lin',
    secondName:'qing'
}

printName(\obj)
```

> 实际例子
```ts

interface Config{
    type:string;
    url:string;
    data? :string;
    dataType: string;
}
function ajax(config:Config){
    var xhr=new XMLHttpRequest();
    xhr.open(config . url, config.url, true);
    xhr.send(config. data);
    xhr.onreadystatechange-function(){
     if(xhr.readyState==4 && xhr . status==200){
            console.log('chengong')
            if(config.dataType=='json'){
                JSON.parse(xhr.responseText)
            }else{
                console.log(xhr,responseText)
            }
        }
    }
}

```

### 函数类型接口
- 对方法传入参数，以及返回值进行约束
- 可以批量约束
```ts
interface encrypt{
    (key:string,value:string):string{
        return key+value;
    }
}

var md5:encrypt=function(key:string,value:string):string{
    return key+value;
}
console.log(md5('name','zhangsan'))
```

### 可索引接口(不常用)
- 数组、对象的约束（不常用）

> 对数组约束，标识:number
```ts
interface UserArr{
    [index:number]:string
}

// var arr:UserArr=[123,'bbb'] //错
var arr:UserArr=['aaa','bbb']
console.log(arr[0])

```

> 对对象的约束,其他类型
```ts
interface UserObj{
    [index:string]:string
}
var arr:UserObj={name:"wl1nkkk",age:20};
```


### 类类型接口(常用)
- 对类的约束

```ts
interface Animal{
    name:string;
    eat(str:string):void;
}

class Dog implements Animal{
    name:string;
    constructor(name:string){
        this.name=name;
    }
    // 不传string也可以对
    eat(){
        console.log(this.name+"eat...")
    }
}

```

### 接口的扩展
- 接口可以扩展接口

```ts
interface Animal{
    eat():void;
}

interface Person extends Animal{
    work():void;
}
```
# 泛型
- 可以支持不特定的数据类型，要求：传入的参数和返回的参数一致
- 要考虑到重用性和对未来类型可用
- 帮助避免重复的代码

## 泛型函数
```ts

//同时返回string类型和number类型( 代码冗余)
function getData1(value:string):string{
    return value;
}

function getData2(value: number ) :number{
    return value;
}

// 法一
// 但是这样放弃了类型检查，无法保证传入什么返回什么
function getData(value: any ) :any{
    return value;
}

// 法二：使用泛型

function getData<T>(value: T ) :T{
    return value;
}
```
## 泛型类
```ts
class MinClas<T>{
    public list:T[]=[];

    add(value: T) :void {
        this. list . push(value); 

    }
    min():T{
        var minNum=this.list[Ø];
        for(var i=0;i<this.list.length;i+){
            if (minNum>this. list[i]){
                minNum=this. list[i];
            }
        }
        return minNum;
    }
}
var m1=new MinClas<T>();
```
### 把类作为参数约束数据传入的类型
```ts
//定义一个User的类这个类的作用就是映射数据库字段然后定
//义一个Mysq1Db的类这个类用于操作数据库然后把User类作
//为参数传入到Mysq1Db中
class User{
    username:string|undefined;
    password:string|undefined;
}

class MysqlDb{
    add(user:User):boolean{
        console.log(user);
        return true;
    }
}

var u=new User();
u.username='l1nkkk';
u.password='123456';

var Db=new MysqlDb();
Db.add(u)

```
- 上面例子中使用User来规定输入，那为什么不使用接口呢，区别在于因为接口不能实例化，在这里有了更多玩法

- 如果现在多了个ArticleCate也要调用MysqlDb那么需要再写一个。这样导致代码重复

```ts
class MysqlDb<T>{
    add(info:T):boolean{
        console.log(info);
        return true;
    }
}
```

- ArticleCate
```ts
class ArticleCate{
    title:string | undefined ;
    desc:string| undefined ;
    status : number | undefined ;

    constructor(params:{ 
        title:stringI undefined,
        desc:stringI undefined,
        status? :numberI undefined
    }){
        this.title-params . title;
        this.desc=params.desc ;
        this.status=params. status;
    }
}

var a=new ArticleCate({
title:'分类'
desc:'1111'

});
var Db=new MysqlDb<ArticleCate>();
```

## 泛型接口

```ts
interface ConfigFn<T>{}
    (value:T):T;
}

function getData<T>(value:T):T{
    return value;
}
var myGetData:ConfigFn<string>=getData;
myGetData( '20'); 
```
# 模块

# 应用
## ts封装统一操作Mysql Mongodb Mssql的底层库
> 功能:定义一个操作数据库的库支持 Mysql Mssql MongoDb
> 
> 要求1: Mysql MsSql MongoDb功能- 样都有add update > delete get方法
> 
> 注意:约束统一的规范、以及代码重用
> 
> 解决方案:需要约束规范所以要定义接口， 需要代码重用所以用到泛型
> 
> 1、接口:在面向对象的编程中，接口是一种规范的定义，它定义> 了行为和动作的规范
> 
> 2、泛型通俗理解:泛型就是解决类接口方法的复用性、

```ts
interface DBI<T>{
    add( info: T) :boolean;
    update( info:T, id:number):boolean;
    delete(id:number):boolean;
    get( id:number ):any[];
}


class MysqlDb<T> implements DBI<T>{
    constructor(){
        console.log("database connect");
    }
    add(info: T):boolean{
        console.log(info);
        return true ;

    }

    update(info: , id: number): boolean {
        throw new Error( "Method not implemented."); 
    }

    delete(id: number): boolean{
        throw new Error( "Method not implemented.");
    }

    get(id: number): any[]{
        throw new Error( "Method not implemented.");
    }

}
class MssqlDb<T> implements DBI<T>{
    constructor(){
        console.log("database connect");
    }
    add(info: T):boolean{
        console.log(info);
        return true ;

    }

    update(info: , id: number): boolean {
        throw new Error( "Method not implemented."); 
    }

    delete(id: number): boolean{
        throw new Error( "Method not implemented.");
    }

    get(id: number): any[]{
        throw new Error( "Method not implemented.");
    }

}

class User{
    username:string|undefined;
    password:string|undefined;
}

var u=new User();
u.username="L1nkkk"
u.password="123456"

var oMssql=new MsSqlDb<User>();
oMssql.add(u)


```

# 装饰器
- 装饰器:装饰器是一种特殊类型的声明， 它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。

- 通俗的讲装饰器**就是一个方法**， 可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能。

- 常见的装饰器有:类装饰器、属性装饰器、方法装饰器、参数装饰器

- 装饰器的写法:普通装饰器(无法传参)、装饰器工厂 ( 可传参) 

- 装饰器是过去几年中js最大的成就之-,已是Es7的标准特性之一

## 类装饰器
