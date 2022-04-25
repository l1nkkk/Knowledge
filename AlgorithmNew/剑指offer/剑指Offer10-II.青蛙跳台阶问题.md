```cpp
class Solution {
public:
    int numWays(int n) {
        int cur  = 0;
        int record[2]{1,1};

        while(cur < n){
            record[cur&1] = (record[0] + record[1]) % 1000000007;
            ++cur;
        }
        return record[n&1];
    }
};
```