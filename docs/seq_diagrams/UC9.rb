title UC9: View Related Feedbacks of Actionable

CX Team Member -> relatedFeedbackForm: 1: select Actionable 
CX Team Member -> relatedFeedbackForm: 2: submit View Analytics
relatedFeedbackForm -> actionablesController: 2.1: get_related_analytics \n (actionable)
actionablesController -> actionableModel: 2.1.1: get_related_analytics \n (actionable)
actionableModel --> actionablesController: 2.1.2:
actionablesController --> relatedFeedbackForm: 2.2: return JSON object
relatedFeedbackForm -> relatedFeedbackForm: 2.3: display related analytics
