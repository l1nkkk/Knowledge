#!/bin/bash

pcount=$#

if (( pcount < 1 )); then
    echo "请输入要同步的目录"
    exit
fi


webnode=(
127.0.0.1
)

let num=1
for host  in  ${webnode[@]}
do
    echo "同步目录的主机$num:"$webnode
    let num=num+1
done

#2 获取文件名称
p1=$1
fname=`basename $p1`
echo filename=$fname

#3 获取上级目录到绝对路径
pdir=`cd -P $(dirname $p1); pwd`

echo basedir=$pdir

#4 获取当前用户名称
user=`whoami`


for host  in  ${webnode[@]}
do
    echo --------------- $user@$host ----------------
    rsync -rvl $pdir/$fname $user@$host:$pdir
done

# for host  in  ${webnode[@]}
# do
# echo $host
# done
