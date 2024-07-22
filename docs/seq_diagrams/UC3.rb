title UC3: View Sentiment Distribution by Subproduct

CX Team Member -> SubproductSentimentDistributionForm: 1: select Start Date
CX Team Member -> SubproductSentimentDistributionForm: 2: select End Date
CX Team Member -> SubproductSentimentDistributionForm: 3: select Products
CX Team Member -> SubproductSentimentDistributionForm: 4: select Sources
SubproductSentimentDistributionForm -> analyticsController: 4.1: get_subproduct_sentiment_distribution \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_subproduct_sentiment_distribution \n (startDate, endDate, products, sources)
analyticsModel -> analyticsModel: 4.1.2: calculate Sentiments by \n Sentiment Category and Subproduct
analyticsModel --> analyticsController: 4.1.3:

analyticsController --> SubproductSentimentDistributionForm: 4.2: return JSON object
SubproductSentimentDistributionForm -> SubproductSentimentDistributionForm: 4.3: display Subproduct Sentiment Distribution
