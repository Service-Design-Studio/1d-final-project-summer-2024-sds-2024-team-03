require 'rails_helper'

RSpec.describe "Multi-controller Tests", type: :controller do
  before(:all) do
    WebMock.allow_net_connect!
  end

  after(:all) do
    WebMock.disable_net_connect!(allow_localhost: true)
  end

  before(:all) do
    @initial_average_sentiment_score = nil
  end
  
  let(:invalid_attributes) {
    { date: nil, feedback: nil, product: nil, subcategory: nil, sentiment: nil, sentiment_score: nil, source: nil }
  }

  let(:valid_attributes) {
    { date: '15/08/2024', feedback: 'Great product', product: 'Others', subcategory: 'CSS', sentiment: 'Frustrated', sentiment_score: '0.9', source: 'Problem Solution Survey' }
  }
  # Additional setup like defining user authentication can be added here if necessary

  describe AnalyticsController do
    describe "Gets the initial overall sentiment score" do
      it "retrieves sentiment scores" do
        get :get_sentiment_scores, params: { product: 'Cards', source: 'CSS', fromDate: '11/06/2024', toDate: '12/06/2024' }
        expect(response).to be_successful

        json_response = JSON.parse(response.body)
        sentiment_scores = json_response.map { |record| record['sentiment_score'].to_f }
        @initial_average_sentiment_score = (sentiment_scores.sum / sentiment_scores.size).round(1)
        puts "The initial average sentiment score is: #{@initial_average_sentiment_score}"
      end
    end

  describe "Gets the initial latest date" do
    it "fetches earliest and latest dates" do
      get :get_earliest_latest_dates
      json_response = JSON.parse(response.body)
      expect(json_response["earliest_date"]).to eq('01/03/2024')
      expect(json_response["latest_date"]).to eq('12/06/2024')
      puts "The initial latest date is: #{json_response["latest_date"]}"
    end
  end


  describe "Uploading a file with valid format on the upload page" do
    it "but it does not have valid data" do
      # Ensure you have the correct setup for real uploads in test environment
      #file = fixture_file_upload('features\model_cucumber\valid\Cashline__CSS__valid_Problem Solution Survey.csv', 'text/csv')
      file = fixture_file_upload('features\model_cucumber\invalid\Cashline__CSS__invalid_nofeedback_voice.csv', 'text/csv')
      post :uploads, params: { file: file }
      sleep(10) #waits for 10 seconds
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['url']).to include("https://storage.googleapis.com/")
    end
  end
end
describe LogsController do
  it "returns a failed response" do
    get :index
    puts(response)
    expect(response).to be_successful #response to get the logs is successful
    expect(response.body).to include("Operation could not be completed")
    expect(response.body).to include("not enough values to unpack")
  end
end
describe AnalyticsController do
  describe "Gets the final latest date" do
    it "fetches earliest and latest dates" do
      get :get_earliest_latest_dates
      json_response = JSON.parse(response.body)
      expect(json_response["earliest_date"]).to eq('01/03/2024')
      expect(json_response["latest_date"]).to eq('12/06/2024') #latest date should still be the same
      puts "The new latest date is: #{json_response["latest_date"]}"
    end
  end
  describe "Gets the final overall sentiment score" do
    it "retrieves sentiment scores" do
      get :get_sentiment_scores, params: { product: 'Cards', source: 'CSS', fromDate: '11/06/2024', toDate: '12/06/2024' }
      expect(response).to be_successful

      json_response = JSON.parse(response.body)
      sentiment_scores_new = json_response.map { |record| record['sentiment_score'].to_f }
      new_average_sentiment_score = (sentiment_scores_new.sum / sentiment_scores_new.size).round(1)
      puts(new_average_sentiment_score)
      expect(new_average_sentiment_score)).to eq(4.2) #the sentiment scores should remain the same
      puts "The new average sentiment score is: #{new_average_sentiment_score}"
    end
  end


end

end
