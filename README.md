# 專案實作

## Schema Design
![Rank Master Schema Design](/files/schema_design.png)
以現階段所掌握的技術，用戶驗證 (verification) 及服務訂購 (subscription) 的功能，會在稍後課程有所提及其所需技術的時候，再行規劃其開發。

## API Design
| Endpoints | POST | GET | PUT | DELETE |
|:---|---|---|---|---|
| **/user** | 新增用戶至 user collection | ``-- 不適用 --`` | ``-- 不適用 --`` | ``-- 不適用 --`` |
| /user/ ``{{user_id}}`` | ``-- 不適用 --`` | 請求用戶的資料 | 更新用戶的資料 | 刪除用戶及其資料 |
| **/user/** ``{{user_id}}`` /survey | 新增一個屬於 ``{{user_id}}`` 的 survey 至 survey collection | 列出在 survey collection 內所有屬於 ``{{user_id}}`` 的 survey | ``-- 不適用 --`` | ``-- 不適用 --`` |
| **/user/** ``{{user_id}}`` /survey/ ``{{survey_id}}`` | ``-- 不適用 --`` | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會獲得該 survey 的資料 | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會更新該 survey 的資料 | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會刪除該 survey |