# app/services/google_cloud_storage_service.rb
require "google/cloud/storage"

storage = Google::Cloud::Storage.new(
  project_id: "jbaaam",
  credentials: "jbaaam-upload-key.json"
)

class GoogleCloudStorageService
  def initialize(bucket_name)
    @storage = Google::Cloud::Storage.new(project: "jbaaam")
    @bucket = @storage.bucket(bucket_name)
  end

  def upload_file(file, destination_path)
    print("enter upload")
    file = @bucket.create_file(file.path, destination_path)
    print("file")
    file.public_url
  end
end

