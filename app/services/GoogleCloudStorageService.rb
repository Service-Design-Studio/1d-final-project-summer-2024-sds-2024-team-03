# app/services/google_cloud_storage_service.rb
require "google/cloud/storage"


class GoogleCloudStorageService
  def initialize(bucket_name)
    p("=> GoogleCloudStorageService.initialize")
    @storage = Google::Cloud::Storage.new(
      project_id: "jbaaam",
      credentials: "jbaaam-upload-key.json" # Ensure this path is correct
    )    
    @bucket = @storage.bucket(bucket_name)
    p("=> GoogleCloudStorageService.bucket_name" + bucket_name)
  end

  def upload_file(file, destination_path)
    print("enter upload file.path:" + file.path)
    print("enter upload destination_path:" + destination_path)
    file = @bucket.create_file(file.path, destination_path)
    print("file")
    file.public_url
  end
end

