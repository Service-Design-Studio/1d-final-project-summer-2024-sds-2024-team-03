title UC11: Upload Customer Feedbacks
CX Team Member -> UploadFeedbackForm: 1: select Subproduct
CX Team Member -> UploadFeedbackForm: 2: select Source
CX Team Member -> UploadFeedbackForm: 3: select File
CX Team Member -> UploadFeedbackForm: 4: submit Upload
UploadFeedbackForm -> UploadFeedbackForm: 5: validateData()
UploadFeedbackForm -> analyticsController: 5.1: uploads \n (File, Source, Subproduct)
analyticsController -> GoogleCloudStorageService: 5.1.1 upload_file()
GoogleCloudStorageService -> GoogleStorageBucket: 5.1.1.1 drop file
GoogleStorageBucket --> GoogleCloudStorageService: 5.1.1.2
GoogleCloudStorageService --> analyticsController: 5.1.2
analyticsController --> UploadFeedbackForm: 5.2: return JSON object
UploadFeedbackForm -> UploadFeedbackForm: 6: display upload status

Note over GoogleStorageBucket: the process below happen asynchronously
GoogleStorageBucket -> DataProcessor: 7.1.1.1.1  main(File)
DataProcessor -> DataProcessor: 7.1.1.1.2 cleanup_data()
DataProcessor -> DataProcessor: 7.1.1.1.3 analyze_data()
DataProcessor -> Gemini: 7.1.1.1.3.1 inference(data)
Gemini --> DataProcessor: 7.1.1.1.3.2
DataProcessor -> DataProcessor: 7.1.1.1.4 saveToDB
