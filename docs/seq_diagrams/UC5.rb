title UC4: View Sentiment Time Trend for all Subproducts

CX Team Member -> AllSubproductSentimentTrendsForm: 1: select Start Date
CX Team Member -> AllSubproductSentimentTrendsForm: 2: select End Date
CX Team Member -> AllSubproductSentimentTrendsForm: 3: select Products
CX Team Member -> AllSubproductSentimentTrendsForm: 4: select Sources
AllSubproductSentimentTrendsForm -> analyticsController: 4.1: get_sentiment_trends \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_sentiment_trends \n (startDate, endDate, products, sources)
analyticsModel --> analyticsController: 4.1.3:

analyticsController --> AllSubproductSentimentTrendsForm: 4.2: return JSON object
AllSubproductSentimentTrendsForm -> AllSubproductSentimentTrendsForm: 4.3: display Sentiment Analysis Trends
