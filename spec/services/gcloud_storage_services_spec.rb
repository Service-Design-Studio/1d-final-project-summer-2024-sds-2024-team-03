require 'rails_helper'

RSpec.describe GoogleCloudStorageService do
  describe '#initialize' do
    it 'initializes with a bucket name' do
      # Mocking the Google Cloud Storage client and bucket retrieval
      storage = double('Storage')
      bucket = double('Bucket')
      expect(Google::Cloud::Storage).to receive(:new).with(project_id: 'jbaaam', credentials: 'jbaaam-upload-key.json').and_return(storage)
      expect(storage).to receive(:bucket).with('my-bucket').and_return(bucket)

      service = GoogleCloudStorageService.new('my-bucket')

      # Ensuring that the bucket instance variable is correctly set
      expect(service.instance_variable_get(:@bucket)).to eq(bucket)
    end
  end

  describe '#upload_file' do
    let(:storage) { double('Storage') }
    let(:bucket) { double('Bucket') }
    let(:uploaded_file) { double('UploadedFile', public_url: 'http://example.com/file.jpg') }
    let(:file) { instance_double('File', path: 'path/to/local/file.jpg') }  # More specific mock with instance_double

    before do
      allow(Google::Cloud::Storage).to receive(:new).and_return(storage)
      allow(storage).to receive(:bucket).with('my-bucket').and_return(bucket)
      allow(bucket).to receive(:create_file).with(file.path, 'destination/path').and_return(uploaded_file)
    end

    it 'uploads a file to Google Cloud Storage and returns the public URL' do
      service = GoogleCloudStorageService.new('my-bucket')
      url = service.upload_file(file, 'destination/path')
      expect(url).to eq('http://example.com/file.jpg')
    end
  end
end
