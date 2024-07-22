title UC4: View Sentiment Analysis by Subproduct

CX Team Member -> SubproductSentimentAnalysisForm: 1: select Start Date
CX Team Member -> SubproductSentimentAnalysisForm: 2: select End Date
CX Team Member -> SubproductSentimentAnalysisForm: 3: select Products
CX Team Member -> SubproductSentimentAnalysisForm: 4: select Sources
SubproductSentimentAnalysisForm -> analyticsController: 4.1: get_sentiment_analysis \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_sentiment_analysis \n (startDate, endDate, products, sources)
analyticsModel -> analyticsModel: 4.1.2: calculate Sentiment Analysis by Subproducts
analyticsModel --> analyticsController: 4.1.3:

analyticsController --> SubproductSentimentAnalysisForm: 4.2: return JSON object
SubproductSentimentAnalysisForm -> SubproductSentimentAnalysisForm: 4.3: display Sentiment Analysis
