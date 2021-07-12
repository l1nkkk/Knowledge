> 参考1：https://labuladong.gitbook.io/algo/mu-lu-ye/er-fen-cha-zhao-xiang-jie  
> 参考2：https://labuladong.gitbook.io/algo/mu-lu-ye-4/er-fen-cha-zhao-pan-ding-zi-xu-lie

# 概述
- **分析二分查找的一个技巧是：不要出现 else，而是把所有情况用 else if 写清楚，这样可以清楚地展现所有细节**。
- 代码中` left + (right - left) / 2 `就和 `(left + right) / 2` 的结果相同，但是有效防止了 `left` 和 `right` 太大直接相加导致溢出。
- 二分法难就难在于 `想到可以用二分法`
- 当 `target` 不存在时，**得到的索引恰好是比 val 大的最小元素索引**。
  - 如果在数组 [0,1,3,4] 中搜索元素 2，算法会返回索引 2，也就是元素 3 的位置，元素 3 是数组中大于 2 的最小元素。

## 模板
```cpp
int binarySearch(int[] nums, int target) {
    int left = 0, right = ...;

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
    // 退出一定 left == right
    // 所有都比其大
    if ( left == nums.size() ) return -1;
    return nums[left] == target ? left : -1;
}
```

- `while`中为什么是`<`
  - 因为是左闭右开区间 **[left, right)**，**[left, left)**区间为空

- 搜索偏向左侧的关键：
  - `else if( target == nums[mid] )   return right=mid; // 搜素左侧的关键`

- 为什么是 `left = mid + 1，right = mid`
  - 因为是左闭右开区间 **[left, right)**

- 为什么要左闭右开，可以左闭右闭吗
  - 比较普遍。当然可以，只要你明白了「搜索区间」这个概念，就能有效避免漏掉元素，随便你怎么改都行。


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


