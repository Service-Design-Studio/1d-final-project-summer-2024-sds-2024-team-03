title UC6: View Sentiment Time Trend for each Subproducts

CX Team Member -> SubproductSentimentTrendsForm: 1: select Start Date
CX Team Member -> SubproductSentimentTrendsForm: 2: select End Date
CX Team Member -> SubproductSentimentTrendsForm: 3: select Products
CX Team Member -> SubproductSentimentTrendsForm: 4: select Sources
CX Team Member -> SubproductSentimentTrendsForm: 5: select Subproduct
CX Team Member -> SubproductSentimentTrendsForm: 6: select Feedback Categories
SubproductSentimentTrendsForm -> analyticsController: 6.1: get_each_sentiment_trend(startDate, endDate, products, sources, subproduct, feedbackCategories)
analyticsController -> analyticsModel: 6.1.1: get_each_sentiment_trend \n (startDate, endDate, products, \n sources, subproduct, feedbackCategories)
analyticsModel --> analyticsController: 6.1.2:

analyticsController --> SubproductSentimentTrendsForm: 6.2: return JSON object
SubproductSentimentTrendsForm -> SubproductSentimentTrendsForm: 6.3: display Sentiment Analysis Trends
