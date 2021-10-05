- [代理](#%E4%BB%A3%E7%90%86)
- [分支](#%E5%88%86%E6%94%AF)
  - [查看分支](#%E6%9F%A5%E7%9C%8B%E5%88%86%E6%94%AF)
- [git库文件夹中文件的状态](#git%E5%BA%93%E6%96%87%E4%BB%B6%E5%A4%B9%E4%B8%AD%E6%96%87%E4%BB%B6%E7%9A%84%E7%8A%B6%E6%80%81)
- [忽略不想提交文件(.gitignore)](#%E5%BF%BD%E7%95%A5%E4%B8%8D%E6%83%B3%E6%8F%90%E4%BA%A4%E6%96%87%E4%BB%B6gitignore)
  - [三种方式](#%E4%B8%89%E7%A7%8D%E6%96%B9%E5%BC%8F)
  - [优先级](#%E4%BC%98%E5%85%88%E7%BA%A7)
  - [语法](#%E8%AF%AD%E6%B3%95)
  - [例子](#%E4%BE%8B%E5%AD%90)
  - [测试](#%E6%B5%8B%E8%AF%95)
  - [注意点](#%E6%B3%A8%E6%84%8F%E7%82%B9)
# 代理

git config --global https.proxy http://127.0.0.1:1080

git config --global https.proxy https://127.0.0.1:1080

git config --global --unset http.proxy

git config --global --unset https.proxy


# 分支

## 查看分支
- git branch
  - -a:查看本地分支

创建分支：`git branch <name>`

切换分支：`git checkout <name>`或者`git switch <name>`

创建+切换分支：`git checkout -b <name>`或者`git switch -c <name>`

合并某分支到当前分支：`git merge <name>`

删除分支：`git branch -d <name>`


# git库文件夹中文件的状态
- Untracked:  
未跟踪, 此文件在文件夹中, 但并没有加入到git库, 不参与版本控制. 通过git add 状态变为Staged.
 
- Unmodify:
文件已经入库, 未修改, 即版本库中的文件快照内容与文件夹中完全一致. 这种类型的文件有两种去处, 如果它被修改,
而变为Modified. 如果使用git rm移出版本库, 则成为Untracked文件
 This is a command-line program that helps to build random sample data for project rena

to check its running arguments, see
- Modified:  
文件已修改, 仅仅是修改, 并没有进行其他的操作. 这个文件也有两个去处, 通过git add可进入暂存staged状态,
使用git checkout 则丢弃修改过, 返回到unmodify状态, 这个git checkout即从库中取出文件, 覆盖当前修改
 
- Staged:
暂存状态.   执行git commit则将修改同步到库中, 这时库中的文件和本地文件又变为一致, 文件为Unmodify状态.
执行git reset HEAD filename取消暂存, 文件状态为Modified
 
Git 状态 untracked 和 not staged的区别:  
1. untrack     表示是新文件，没有被add过，是为跟踪的意思。
2. not staged  表示add过的文件，即跟踪文件，再次修改没有add，就是没有暂存的意思
# 忽略不想提交文件(.gitignore)
> https://www.cnblogs.com/kevingrace/p/5690241.html  
## 三种方式
- 在Git项目中定义.gitignore文件
- 在Git项目的设置中指定排除文件(不推荐)  
  这种方式只是**临时**指定该项目的行为，需要编辑当前项目下的 `.git/info/exclude`文件，然后将需要忽略提交的文件写入其中。需要注意的是，这种方式指定的忽略文件的根目录是项目根目录。
- 定义Git全局的 .gitignore 文件  
  这种方式也需要创建相应的 .gitignore 文件，可以放在任意位置。然后在使用以下命令配置Git：  
  `git config --global core.excludesfile ~/.gitignore`



## 优先级
在 .gitingore 文件中，每一行指定一个忽略规则，Git检查忽略规则的时候有多个来源，它的优先级如下（由高到低）：  
1. 从命令行中读取可用的忽略规则
2. 当前目录定义的规则
3. 父级目录定义的规则，依次递推
4. $GIT_DIR/info/exclude 文件中定义的规则
5. core.excludesfile中定义的全局规则

## 语法
1. **空格**不匹配任意文件，可作为分隔符，可用反斜杠转义  
2. #开头的文件标识注释，可以使用反斜杠进行转义。
3. 可以使用标准的**glob模式**匹配。所谓的glob模式是指shell所使用的简化了的正则表达式。
4. 以斜杠"/"开头表示目录；"/"结束的模式只匹配文件夹以及在该文件夹路径下的内容，但是不匹配该文件；"/"开始的模式匹配项目跟目录；如果一个模式不包含斜杠，则它匹配相对于当前 .gitignore 文件路径的内容，如果该模式不在 .gitignore 文件中，则相对于项目根目录。
5. 以星号"*"通配多个字符，即匹配多个任意字符；使用两个星号"**" 表示匹配任意中间目录，比如`a/**/z`可以匹配 a/z, a/b/z 或 a/b/c/z等。
6. 以问号"?"通配单个字符，即匹配一个任意字符；
7. 以方括号"[]"包含单个字符的匹配列表，即匹配任何一个列在方括号中的字符。比如[abc]表示要么匹配一个a，要么匹配一个b，要么匹配一个c；如果在方括号中使用短划线分隔两个字符，表示所有在这两个字符范围内的都可以匹配。比如[0-9]表示匹配所有0到9的数字，[a-z]表示匹配任意的小写字母）。
8. 以叹号"!"表示不忽略(跟踪)匹配到的文件或目录，即要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（!）取反。需要特别注意的是：**如果文件的父目录已经被前面的规则排除掉了，那么对这个文件用"!"规则是不起作用的。**也就是说"!"开头的模式表示否定，该文件将会再次被包含，如果排除了该文件的父级目录，则使用"!"也不会再次被包含。可以使用反斜杠进行转义。
```sh
#指定要将哪些文件添加到版本管理中
!*.zip
!/mtk/one.txt

#想象一个场景：假如我们只需要管理/mtk/目录中的one.txt文件，这个目录中的其他文件都不需要管理，那么.gitignore规则应写为：：
/mtk/*
!/mtk/one.txt
 
#假设我们只有过滤规则，而没有添加规则，那么我们就需要把/mtk/目录下除了one.txt以外的所有文件都写出来！
#注意上面的/mtk/*不能写为/mtk/，否则父目录被前面的规则排除掉了，one.txt文件虽然加了!过滤规则，也不会生效！

```

## 例子

```sh
#               表示此为注释,将被Git忽略
*.a             表示忽略所有 .a 结尾的文件
!lib.a          表示但lib.a除外
/TODO           表示仅仅忽略项目根目录下的 TODO 文件，不包括 subdir/TODO
build/          表示忽略 build/目录下的所有文件，过滤整个build文件夹；
doc/*.txt       表示会忽略doc/notes.txt但不包括 doc/server/arch.txt
 
bin/:           表示忽略当前路径下的bin文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件
/bin:           表示忽略根目录下的bin文件
/*.c:           表示忽略cat.c，不忽略 build/cat.c
debug/*.obj:    表示忽略debug/io.obj，不忽略 debug/common/io.obj和tools/debug/io.obj
**/foo:         表示忽略/foo,a/foo,a/b/foo等
a/**/b:         表示忽略a/b, a/x/b,a/x/y/b等
!/bin/run.sh    表示不忽略bin目录下的run.sh文件
*.log:          表示忽略所有 .log 文件
config.php:     表示忽略当前路径的 config.php 文件
 
/mtk/           表示过滤整个文件夹
*.zip           表示过滤所有.zip文件
/mtk/do.c       表示过滤某个具体文件

#还有一些规则如下：
fd1/*
#说明：忽略目录 fd1 下的全部内容；注意，不管是根目录下的 /fd1/ 目录，还是某个子目录 /child/fd1/ 目录，都会被忽略；
 
/fd1/*
#说明：忽略根目录下的 /fd1/ 目录的全部内容；
 
/*
!.gitignore
!/fw/ 
/fw/*
!/fw/bin/
!/fw/sf/
#说明：忽略全部内容，但是不忽略 .gitignore 文件、根目录下的 /fw/bin/ 和 /fw/sf/ 目录；注意要先对bin/的父目录使用!规则，使其不被排除。
```
## 测试
.gitignor忽略规则查看  
如果你发下.gitignore写得有问题，需要找出来到底哪个规则写错了，可以用git check-ignore命令检查：
```sh
$ git check-ignore -v HelloWorld.class
.gitignore:1:*.class    HelloWorld.class
```

## 注意点
- 如果你不慎在创建.gitignore文件之前就push了项目，那么**即使你在.gitignore文件中写入新的过滤规则，这些规则也不会起作用**，Git仍然会对所有文件进行版本管理。所以大家一定要养成在项目开始就创建.gitignore文件的习惯，否则一单push，处理起来会非常麻烦。
  - 解决：这时候不可以直接使用"git rm directory"，这样会删除本地仓库的文件。可以使用"git rm -r –cached directory"来删除缓冲，然后进行"commit"和"push"，这样会发现远程仓库中的不必要文件就被删除了，以后可以直接使用"git add -A"来添加修改的内容，上传的文件就会受到.gitignore文件的内容约束。
- 如果我们意外的将想要忽略的文件添加到缓存中去了，我们可以使用rm命令将其从中移除。
  ```sh
  git rm HelloWorld.class --cached
  rm 'HelloWorld.class'
  ```
- .gitignore中已经标明忽略的文件目录下的文件，git push的时候还会出现在push的目录中，或者用git status查看状态，想要忽略的文件还是显示被追踪状态。
原因是因为在git忽略目录中，新建的文件在git中会有缓存，如果某些文件已经被纳入了版本管理中，就算是在.gitignore中已经声明了忽略路径也是不起作用的，
这时候我们就应该先把本地缓存删除，然后再进行git的提交，这样就不会出现忽略的文件了。
  - .gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。 
  - 想要.gitignore起作用，必须要在这些文件不在暂存区中才可以，.gitignore文件只是忽略没有被staged(cached)文件，对于已经被staged文件，加入ignore文件时一定要先从staged移除，才可以忽略。
  ```SH
   git rm -r --cached .
   git add .
   git commit -m 'update .gitignore'
   git push -u origin master
  ```