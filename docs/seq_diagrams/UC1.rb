title UC1: View Overall Sentiment Score

CX Team Member -> overallSentimentScoreForm: 1: select Start Date
CX Team Member -> overallSentimentScoreForm: 2: select End Date
CX Team Member -> overallSentimentScoreForm: 3: select Products
CX Team Member -> overallSentimentScoreForm: 4: select Sources
overallSentimentScoreForm -> analyticsController: 4.1: get_overall_sentiment_scores \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_overall_sentiment_scores \n (startDate, endDate, products, sources)
analyticsModel -> analyticsModel: 4.1.2: calculate Overall Sentiment Score
analyticsModel --> analyticsController: 4.1.3: 

analyticsController --> overallSentimentScoreForm: 4.2: return JSON object
overallSentimentScoreForm -> overallSentimentScoreForm: 4.3: display Overall Sentiment Score
