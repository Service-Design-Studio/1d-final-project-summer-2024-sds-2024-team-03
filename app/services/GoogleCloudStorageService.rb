# app/services/google_cloud_storage_service.rb
require "google/cloud/storage"

class GoogleCloudStorageService
  def initialize(bucket_name)
    @storage = Google::Cloud::Storage.new(project: "jbaaam")
    @bucket = @storage.bucket(bucket_name)
  end

  def upload_file(file, destination_path)
    file = @bucket.create_file(file.path, destination_path)
    file.public_url
  end
end

