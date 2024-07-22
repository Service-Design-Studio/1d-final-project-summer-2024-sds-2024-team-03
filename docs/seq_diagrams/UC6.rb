title UC6: View Sentiment Time Trend for each Subproducts

CX Team Member -> SubproductSentimentAnalysisForm: 1: select Start Date
CX Team Member -> SubproductSentimentAnalysisForm: 2: select End Date
CX Team Member -> SubproductSentimentAnalysisForm: 3: select Products
CX Team Member -> SubproductSentimentAnalysisForm: 4: select Sources
CX Team Member -> SubproductSentimentAnalysisForm: 5: select Subproduct
CX Team Member -> SubproductSentimentAnalysisForm: 6: select Feedback Categories
SubproductSentimentAnalysisForm -> analyticsController: 6.1: get_sentiment_time_analysis \n (startDate, endDate, products, \n sources, subproduct, feedbackCategories)
analyticsController -> analyticsModel: 6.1.1: get_sentiment_time_analysis \n (startDate, endDate, products, \n sources, subproduct, feedbackCategories)
analyticsModel --> analyticsController: 6.1.2:

analyticsController --> SubproductSentimentAnalysisForm: 6.2: return JSON object
SubproductSentimentAnalysisForm -> SubproductSentimentAnalysisForm: 6.3: display Sentiment Analysis
