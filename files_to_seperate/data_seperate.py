import pandas as pd 

data = pd.read_csv("clean_post.csv") # 小份測試資料from post_clean，假設讀入時已經是篩選過符合主題的資料

sentiment = data.filter(['post_id ',"title",'sentiment'], axis=1)
sentiment["date"] = pd.to_datetime(data["created_at"]).dt.date

sentiment.to_csv("sentiment.csv")