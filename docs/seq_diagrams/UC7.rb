title UC7: View Improvement Task List

CX Team Member -> actionableForm: 1: select Start Date
CX Team Member -> actionableForm: 2: select End Date
CX Team Member -> actionableForm: 3: select Products
CX Team Member -> actionableForm: 4: select Sources
actionableForm -> actionablesController: 4.1: get_actionables \n (startDate, endDate, products, sources)
actionablesController -> analyticsModel: 4.1.1: get_analytics \n (startDate, endDate, products, sources)
analyticsModel --> actionablesController: 4.1.2: 

actionablesController -> actionableModel: 4.1.3: get_actionables \n (analytics)
actionableModel -> gemini: 4.1.3.1: inference(analytics)
gemini --> actionableModel: 4.1.3.2:
actionableModel --> actionablesController: 4.1.4
actionablesController --> actionableForm: 4.2: return JSON object
actionableForm -> actionableForm: 4.3: display list of Actionables
