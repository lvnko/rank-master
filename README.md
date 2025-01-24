# 專案實作

## Schema Design
![Rank Master Schema Design](/files/schema_design.png)
以現階段所掌握的技術，用戶驗證 (verification) 及服務訂購 (subscription) 的功能，會在稍後課程有所提及其所需技術的時候，再行規劃其開發。

## API Design
| Endpoints | POST | GET | PUT | DELETE |
|:---|---|---|---|---|
| **/user** | 新增用戶至 user collection | <span style="color: grey;">不適用</span> | <span style="color: grey;">不適用</span> | <span style="color: grey;">不適用</span> |
| /user/ <span style="color: orange;">{{ user_id }}</span> | <span style="color: grey;">不適用</span> | 請求用戶的資料 | 更新用戶的資料 | 刪除用戶及其資料 |
| **/user/** ``{{user_id}}`` /survey | 新增一個屬於 <span style="color: orange;">{{ user_id }}</span> 的 survey | 列出屬於 <span style="color: orange;">{{ user_id }}</span> 的所有 survey | <span style="color: grey;">不適用</span> | <span style="color: grey;">不適用</span> |