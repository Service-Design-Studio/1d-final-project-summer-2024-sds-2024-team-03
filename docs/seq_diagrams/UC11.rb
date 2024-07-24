title UC11: Upload Customer Feedbacks
CX Team Member -> UploadFeedbackForm: 1: select Subproduct
CX Team Member -> UploadFeedbackForm: 2: select Source
CX Team Member -> UploadFeedbackForm: 3: select File
CX Team Member -> UploadFeedbackForm: 4: submit Upload
UploadFeedbackForm -> UploadFeedbackForm: 5: validateData()
UploadFeedbackForm -> analyticsController: 5.1: uploads \n (File, Source, Subproduct)
analyticsController -> dataProcessor: 5.1.1: process_file()
dataProcessor -> dataProcessor: 5.1.2 cleanup_data()
dataProcessor -> dataProcessor: 5.1.3 analyze_data()
dataProcessor -> Gemini: 5.1.3.1 inference(data)
Gemini --> dataProcessor: 5.1.3.2
dataProcessor -> dataProcessor: 5.1.4 saveToDB()
dataProcessor --> analyticsController: 5.1.5
analyticsController --> UploadFeedbackForm: 5.2: return JSON object
UploadFeedbackForm -> UploadFeedbackForm: 5.3: display upload status

