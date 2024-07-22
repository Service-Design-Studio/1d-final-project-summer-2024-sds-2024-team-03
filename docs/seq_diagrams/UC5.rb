title UC4: View Sentiment Time Trend for all Subproducts

CX Team Member -> AllSubproductSentimentAnalysisForm: 1: select Start Date
CX Team Member -> AllSubproductSentimentAnalysisForm: 2: select End Date
CX Team Member -> AllSubproductSentimentAnalysisForm: 3: select Products
CX Team Member -> AllSubproductSentimentAnalysisForm: 4: select Sources
AllSubproductSentimentAnalysisForm -> analyticsController: 4.1: get_sentiment_time_analysis \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_sentiment_time_analysis \n (startDate, endDate, products, sources)
analyticsModel --> analyticsController: 4.1.3:

analyticsController --> AllSubproductSentimentAnalysisForm: 4.2: return JSON object
AllSubproductSentimentAnalysisForm -> AllSubproductSentimentAnalysisForm: 4.3: display Sentiment Analysis
