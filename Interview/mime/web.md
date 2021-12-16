# cookie 和 session
- 需求：http无状态，但需要状态
- 注： **Cookie 逐渐淘汰**，新的浏览器 API 已经允许开发者直接将数据存储到本地，如使用 Web storage API（本地存储和会话存储）或 IndexedDB
- cookie：直接放`Cookie:`或`Set-Cookie: `字段
- 分类
  - 会话期 Cookie：会话结束over
  - 持久性 Cookie：一段时间

- 作用域：可设置，通过 `Path`
- JS可获取：通过 HttpOnly 禁止

> Session
- 借助Cookie，但信息存于服务器（如redis），key放在 cookie 给浏览器