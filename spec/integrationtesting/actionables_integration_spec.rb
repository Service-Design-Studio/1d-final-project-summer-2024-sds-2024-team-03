require 'rails_helper'

RSpec.describe AnalyticsController, type: :controller do
  before(:all) do
    WebMock.allow_net_connect!
  end

  after(:all) do
    WebMock.disable_net_connect!(allow_localhost: true)
  end
  
  let(:invalid_attributes) {
    { date: nil, feedback: nil, product: nil, subcategory: nil, sentiment: nil, sentiment_score: nil, source: nil }
  }

  let(:valid_attributes) {
    { date: '15/08/2024', feedback: 'Great product', product: 'Others', subcategory: 'CSS', sentiment: 'Frustrated', sentiment_score: '0.9', source: 'Problem Solution Survey' }
  }
  # Additional setup like defining user authentication can be added here if necessary

  describe "Gets the initial overall sentiment score" do
    it "retrieves sentiment scores" do
      get :get_sentiment_scores, params: { product: 'Cards', source: 'CSS', fromDate: '11/06/2024', toDate: '12/06/2024' }
      expect(response).to be_successful
      
      json_response = JSON.parse(response.body)
      sentiment_scores = json_response.map { |record| record['sentiment_score'].to_f }
      average_sentiment_score = (sentiment_scores.sum / sentiment_scores.size).round(1)
      expect(average_sentiment_score).to eq(4.2)
      puts "The initial average sentiment score is: #{average_sentiment_score}"
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


  describe "Uploading a valid file on the upload page" do
    it "but it does not have the subcategory and sources" do
      # Ensure you have the correct setup for real uploads in test environment
      file = fixture_file_upload('features\model_cucumber\valid\Cashline__CSS__valid_Problem Solution Survey.csv', 'text/csv')
      post :uploads, params: { file: file }
      sleep(90) #waits for 10 seconds
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response['url']).to include("https://storage.googleapis.com/")
    end

    it "handles no file selected" do
      post :uploads
      expect(response).to have_http_status(422) #422 is the response for unprocessable entity
    end
  end


  describe "Gets the final overall sentiment score" do
    it "retrieves sentiment scores" do
      get :get_sentiment_scores, params: { product: 'Cards', source: 'CSS', fromDate: '11/06/2024', toDate: '12/06/2024' }
      expect(response).to be_successful
      
      json_response = JSON.parse(response.body)
      sentiment_scores = json_response.map { |record| record['sentiment_score'].to_f }
      new_average_sentiment_score = (sentiment_scores.sum / sentiment_scores.size).round(1)
      expect(average_sentiment_score).not_to eq(new_average_sentiment_score)
      puts "The new average sentiment score is: #{new_average_sentiment_score}"
    end
  end

  describe "Gets the final latest date" do
    it "fetches earliest and latest dates" do
      get :get_earliest_latest_dates
      json_response = JSON.parse(response.body)
      expect(json_response["earliest_date"]).to eq('01/03/2024')
      expect(json_response["latest_date"]).to eq('13/06/2024')
      puts "The new latest date is: #{json_response["latest_date"]}"
    end
  end

end
