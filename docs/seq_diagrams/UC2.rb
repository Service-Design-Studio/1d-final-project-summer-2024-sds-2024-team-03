title UC2: View Overall Sentiment Distribution

CX Team Member -> overallDistributionForm: 1: select Start Date
CX Team Member -> overallDistributionForm: 2: select End Date
CX Team Member -> overallDistributionForm: 3: select Products
CX Team Member -> overallDistributionForm: 4: select Sources
overallDistributionForm -> analyticsController: 4.1: get_sentiments_distribution \n (startDate, endDate, products, sources)
analyticsController -> analyticsModel: 4.1.1: get_sentiments_distribution \n (startDate, endDate, products, sources)
analyticsModel -> analyticsModel: 4.1.2: calculate Sentiment by Sentiment Category
analyticsModel --> analyticsController: 4.1.3:

analyticsController --> overallDistributionForm: 4.2: return JSON object
overallDistributionForm -> overallDistributionForm: 4.3: display Overall Sentiment Distribution
