> 参考1：https://labuladong.gitbook.io/algo/mu-lu-ye/er-fen-cha-zhao-xiang-jie  
> 参考2：https://labuladong.gitbook.io/algo/mu-lu-ye-4/er-fen-cha-zhao-pan-ding-zi-xu-lie
> https://www.cnblogs.com/ider/archive/2012/04/01/binary_search.html

- [概述](#概述)
  - [模板](#模板)
  - [寻找一个数](#寻找一个数)
  - [寻找左侧边界的二分搜索](#寻找左侧边界的二分搜索)
  - [寻找右侧边界二分法](#寻找右侧边界二分法)
- [进阶](#进阶)
  - [用二分查找法找寻区域](#用二分查找法找寻区域)
  - [在轮转后的有序数组上应用二分查找法](#在轮转后的有序数组上应用二分查找法)
    - [153. 寻找旋转排序数组中的最小值](#153-寻找旋转排序数组中的最小值)
  - [在两个有序的数组中找他们的中位数](#在两个有序的数组中找他们的中位数)

# 概述
- **分析二分查找的一个技巧是：不要出现 else，而是把所有情况用 else if 写清楚，这样可以清楚地展现所有细节**。
- 代码中` left + (right - left) / 2 `就和 `(left + right) / 2` 的结果相同，但是有效防止了 `left` 和 `right` 太大直接相加导致溢出。
- 二分法难就难在于 `想到可以用二分法`
- 当 `target` 不存在时，**得到的索引恰好是比 val 大的最小元素索引**。
  - 如果在数组 [0,1,3,4] 中搜索元素 2，算法会返回索引 2，也就是元素 3 的位置，元素 3 是数组中大于 2 的最小元素。
- 个人体会：二分搜索，区间收敛过程，都会有一刻`lo + 1 == hi` 
- 其实二分法是一种递归，只是其是尾递归，所以可以不用栈

## 模板
```cpp
int binarySearch(int[] nums, int target) {
    int left = 0, right = ...;

    // 区间无任何元素，则退出while循环
    while(...) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            ...
        } else if (nums[mid] < target) {
            left = ...
        } else if (nums[mid] > target) {
            right = ...
        }
    }
    return ...;
}
```
## 寻找一个数
```cpp
int binarySearch(vector<int> nums, int target){
    int left, right, mid;
    left = 0;
    right = nums.size()-1;  // 注意
    while ( left <= right ) {
        mid = left + (right - left)/2;
        if ( target < nums[mid] )
            right = mid - 1; // 注意
        else if ( target > nums[mid] )
            left = mid + 1; // 注意
        else if( target == nums[mid] )
            return mid;
    }
    return  -1;
}
```
- 为什么是`right = nums.size()-1; `
  - 因为是左闭右闭区间 **[left, right]**

- 为什么`while`是`<=`
  - 因为区间为空，循环终止。区间为空的时候为 **[right+1, right]**

- 为什么`left = mid + 1，right = mid - 1`
  - 因为搜索区间是左闭右闭区间 **[left, right]**。如果接下来是搜索 **[left, mid]**，那么mid已经知道不符合，肯定不用继续搜索

## 寻找左侧边界的二分搜索
- 特殊性质：**当 val 不存在时，得到的索引恰好是比 val 大的最小元素索引**。（感觉这么说不是很好，还是要依赖具体实现）
  - https://labuladong.gitbook.io/algo/mu-lu-ye-4/er-fen-cha-zhao-pan-ding-zi-xu-lie
```cpp
int binarySearch(vector<int> nums, int target){
    int left, right, mid;
    left = 0;
    right = nums.size();  // 注意
    while ( left < right ) {
        mid = left + (right - left)/2;
        if ( target < nums[mid] )
            right = mid; // 注意
        else if ( target > nums[mid] )
            left = mid + 1; // 注意
        else if( target == nums[mid] )
            right=mid; // 搜素左侧的关键
    }
    // return left; // 重点1.这种做法有特殊作用

    // 退出一定 left == right
    // 所有都比其大
    if ( left == nums.size() ) return -1;
    return nums[left] == target ? left : -1;
}
```
> 左闭右开情况下分析
- (个人总结)性质1：区间缩小到某一刻，肯定会有 `left + 1 == right` 的情况。最后退出的情况，肯定是 `left == right`
- (个人总结)性质2：`(left+right)/2`有偏向 `left` 的特性
- (个人总结)性质3：只要`right != nums.size()`，就有`nums[right] >= target`
- (个人总结)经验：不要去揣测`left`的情况，因为`mid+1`是不确定的。

- 如果在重点1中退出，如何理解该返回值？
  - 特例：target比所有的都大，`left == right`退出，过程中`right`没机会动，所以`left`为 `nums.size()`
  - 其他情况：因为`nums[right] >= target`，又因为退出时`left == right`，又因为偏左性质，所以最后分两种情况
    - 数组中有target：left为target再数组中最左边元素的下标
    - 数组中没有target：`left == right && nums[right] >= target`得，**left为刚好比target大的元素的位置**，也可以认为 **`left` 为 nums 中比target小的元素个数**

> 左闭右闭的代码
```cpp
int binarySearch(vector<int> nums, int target){
    int left, right, mid;
    left = 0;
    right = nums.size()-1;  // 注意
    while ( left <= right ) {
        mid = left + (right - left)/2;
        if ( target < nums[mid] )
            right = mid-1; // 注意
        else if ( target > nums[mid] )
            left = mid + 1; // 注意
        else if( target == nums[mid] )
            right=mid-1; // 搜素左侧的关键
    }
    // 所有都比其大
    if ( left == nums.size() ) return -1;
    return nums[left] == target ? left : -1;
}
```
- 尝试用上面的分析去分析，可以很快得出为什么是这样写
## 寻找右侧边界二分法
> 左闭右开
```cpp
int binarySearch(vector<int> nums, int target){
    int left, right, mid;
    left = 0;
    right = nums.size();  // 注意
    while ( left < right ) {
        mid = left + (right - left)/2;
        if ( target < nums[mid] )
            right = mid; // 注意
        else if ( target > nums[mid] )
            left = mid + 1; // 注意
        else if( target == nums[mid] )
            left = mid + 1; // 搜素右侧的关键
    }
    if(left == 0) return -1;
    return nums[left-1] == target ? left-1 : -1;
}
```

> 左闭右闭的代码
```cpp
int binarySearch(vector<int> nums, int target){
    int left, right, mid;
    left = 0;
    right = nums.size()-1;  // 注意
    while ( left <= right ) {
        mid = left + (right - left)/2;
        if ( target < nums[mid] )
            right = mid - 1; // 注意
        else if ( target > nums[mid] )
            left = mid + 1; // 注意
        else if( target == nums[mid] )
            left = mid + 1; // 搜素右侧的关键
    }
    if(left == 0) return -1;
    return nums[left-1] == target ? left-1 : -1;
}

```




# 进阶
## 用二分查找法找寻区域
- 思路
  - 左侧边界寻找+右侧边界寻找
  - done

## 在轮转后的有序数组上应用二分查找法

### 153. 寻找旋转排序数组中的最小值
- 这里的退出条件不再是区间为空。**而是区间里只剩下一个元素**
- 这种情况下使用左闭右闭区间比较简单
```cpp
int findMin(vector<int>& nums) {
        int left, right;
        left = 0;
        right = nums.size()-1;
        // 注：这里返回的是一个只有一个元素的区间，这个元素就是最小的元素。这种情况最好用左闭右闭，比较简单
        while(left < right){
            int mid = left + (right - left) /2;
            if( nums[mid] < nums[right]){   // 最小值在左边
                right = mid;
            } else{ // 最小值在右边
                left = mid+1;
            }
        }
        return nums[left];
    }
```

## 在两个有序的数组中找他们的中位数
> 题目
- 要求限制：时间复杂度为 `O(log (m+n))`
<div align="center" style="zoom:80%"><img src="./pic/4-1.png"></div>

> 思路
- 找到中位数====>如果可以这两个数组中第k小的数，就好了。（要求log级别，想到二分法，一半一半的排除不可能的结果）
- 参考：https://leetcode-cn.com/problems/median-of-two-sorted-arrays/solution/xiang-xi-tong-su-de-si-lu-fen-xi-duo-jie-fa-by-w-2/
  - 如何找到第k小的数
- 当要找的是第7小的数。步骤如下
  - 比较两个数组（假设a,b两数组）的第 k/2 个数字，如果 k 是奇数，向下取整
  - 如下图所示，设`a[k/2 -1] > b[k/2-1]`，则可以排除`b[k/2-1]`以前的所有数，其不可能为第 `k` 小的数。
  - 更新k的值，因为排除了一部分了（接近一半）。再这里`k=7-3=4`，以此类推
  - 当`k==1`，比较两个数，拿最小的即可
  - 当 **只剩一个数组**的时候，直接用k来作为偏移索引。


<div align="center" style="zoom:100%"><img src="./pic/4-2.png"></br><span>比较</span></div>
<div align="center" style="zoom:100%"><img src="./pic/4-3.png"></br><span>更新k值</span></div>
<div align="center" style="zoom:100%"><img src="./pic/4-4.png"></br></div>
<div align="center" style="zoom:100%"><img src="./pic/4-5.png"></br><span>比较两个数，拿最小的即可</span></div>

- 特殊情况
  - 当`k/2 -1`造成数组越界怎么办？指向最后一个元素就好了。
<div align="center" style="zoom:100%"><img src="./pic/4-6.png"></br><span>越界则指向最后一个</span></div>
<div align="center" style="zoom:100%"><img src="./pic/4-7.png"></br></div>


> 代码


```cpp

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // 要找到第k大的数，从1开始
        int k = (nums1.size() + nums2.size()+ 1)/2 ; // (2 +3) /2
        if((nums1.size() + nums2.size()) & 1)
            return getKth(nums1, nums2, 0, nums1.size(), 0, nums2.size(), k);
        else
            return (getKth(nums1, nums2, 0, nums1.size(), 0, nums2.size(), k)+
            getKth(nums1, nums2, 0, nums1.size(), 0, nums2.size(), k+1))/2.0;
    }

private:
    // [l1,r1), [l2,r2)
    // 获取第k小的值
    int getKth(vector<int>& nums1, vector<int>& nums2, int l1, int r1, int l2, int r2, int k){
        // 只剩下一个数组有数的情况
        if(l1 == r1)
            return nums2[l2+k-1];
        if(l2 == r2)
            return nums1[l1+k-1];
        if(k == 1){
            return min(nums1[l1], nums2[l2]);
        }

        // 数组两边各取的数量为t
        int t = k/2;
        int pos1,pos2;
        // 判断边界，如果越界了就取数组最后一个
        if(l1+t > r1) pos1 = r1-1;
        else pos1 = l1+t-1;
        if(l2+t > r2) pos2 = r2-1;
        else pos2 = l2+t-1;
        if(nums1[pos1] < nums2[pos2]){// pos1 out
            return getKth(nums1, nums2, pos1+1, r1, l2, r2, k-pos1+l1-1);
        }else{
            return getKth(nums1, nums2, l1, r1, pos2+1, r2, k-pos2+l2-1);
        }

    }
};
```