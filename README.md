# 專案實作

## Schema Design
版本：v2.2
![Rank Master Schema Design](/files/schema_design-v2.4.png)
以現階段所掌握的技術，用戶驗證 (verification) 及服務訂購 (subscription) 的功能，會在稍後課程有所提及其所需技術的時候，再行規劃其開發。

## API Design
- 以下為暫時擬定的 API Endpoints；
- 根據現有的 Schema Design，大概還有一半以上的 Endpoints 待定 (例：圖像 image ... )。

| Endpoints | POST | GET | PUT | DELETE |
|:---|---|---|---|---|
| **/user** | 新增用戶至 user collection | ``-- 不適用 --`` | ``-- 不適用 --`` | ``-- 不適用 --`` |
| **/user/** ``{{user_id}}`` | ``-- 不適用 --`` | 請求用戶的資料 | 更新用戶的資料 | 刪除用戶及其資料 |
| **/user/** ``{{user_id}}`` /survey | 新增一個屬於 ``{{user_id}}`` 的 survey 至 survey collection | 列出在 survey collection 內所有屬於 ``{{user_id}}`` 的 survey | ``-- 不適用 --`` | ``-- 不適用 --`` |
| **/user/** ``{{user_id}}`` /survey/ ``{{survey_id}}`` | ``-- 不適用 --`` | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會獲得該 survey 的資料 | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會更新該 survey 的資料 | 如果 ``{{survey_id}}`` 屬於 ``{{user_id}}`` 的話，便會刪除該 survey |
| **/survey/** | 若在 ``req.body`` 中有提供 ``{{user_id}}``，便會新增一個所屬的 survey 至 survey collection | ``-- 不適用 --`` | ``-- 不適用 --`` | ``-- 不適用 --`` |
| **/survey/** ``{{survey_id}}`` | ``-- 不適用 --`` | 請求 ``{{survey_id}}`` 的 survey 資料 | 更新 ``{{survey_id}}`` 的 survey 資料 | 刪除 ``{{survey_id}}`` 的資料 |
| **/option/** | 若在 ``req.body`` 中有提供 ``{{survey_id}}``，便會新增一個所屬的 option 至 option collection | ``-- 不適用 --`` | ``-- 不適用 --`` | ``-- 不適用 --`` |
| **/option/** ``{{option_id}}`` | ``-- 不適用 --`` | 請求 ``{{option_id}}`` 的 option 資料 | 更新 ``{{option_id}}`` 的 option 資料 | 刪除 ``{{option_id}}`` 的資料 |
| **/vote/** ``{{vote_id}}`` | ``-- 不適用 --`` | 請求 ``{{vote_id}}`` 的 option 資料 | 更新 ``{{vote_id}}`` 的 option 資料 | ``-- 不適用 --`` |
| **/vote/** new/``{{survey_id}}``/``{{candidate_id}}`` | 從 ``{{survey_id}}`` 的 option 列中新增一雙 option 配對給 ``{{candidate_id}}`` 做比較 | ``-- 不適用 --`` | ``-- 不適用 --`` | ``-- 不適用 --`` |

## 有用資源
- 隨機用戶檔案生成器 ([連結](https://randomuser.me/api/?format=json&?nat=us,dk,fr,gb,ch,de,dk))
- 全球語言碼速查 ([連結](https://simplelocalize.io/data/locales/))