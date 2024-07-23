require 'rails_helper'

RSpec.describe AnalyticsController, type: :controller do
  let(:invalid_attributes) {
    { date: nil, feedback: nil, product: nil, subcategory: nil, sentiment: nil, sentiment_score: nil, source: nil }
  }

  let(:valid_attributes) {
    { date: '15/08/2024', feedback: 'Great product', product: 'Others', subcategory: 'asd', sentiment: 'Frustrated', sentiment_score: '0.9', source: 'Problem Solution Survey' }
  }

  let(:valid_session) { {} }

  describe "POST #uploads" do
    it "handles file upload" do
      # Mock the GoogleCloudStorageService to prevent actual API calls
      storage_mock = instance_double("GoogleCloudStorageService")
      allow(GoogleCloudStorageService).to receive(:new).and_return(storage_mock)
      allow(storage_mock).to receive(:upload_file).and_return("http://example.com/fake_url")

      file = fixture_file_upload('files/test.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      post :uploads, params: { file: file }

      expect(response).to have_http_status(:ok)
      expect(JSON.parse(response.body)['url']).to eq("http://example.com/fake_url")
    end


    it "handles no file selected" do
      post :uploads
      expect(response).to have_http_status(422) #422 is the response for unprocessable entity
    end
  end

  describe "GET #get_earliest_latest_dates" do
    it "fetches earliest and latest dates" do
      get :get_earliest_latest_dates
      json_response = JSON.parse(response.body)
      expect(json_response["earliest_date"]).to eq('01/04/2023')
      expect(json_response["latest_date"]).to eq('31/08/2024')
    end
  end

  describe "GET #filter_products" do
    it "returns filtered products" do
      get :filter_products
      expect(response).to be_successful
    end
  end

  describe "GET #filter_sources" do
    it "returns filtered sources" do
      get :filter_sources
      expect(response).to be_successful
    end
  end

  describe "GET #get_sentiment_scores" do
    it "retrieves sentiment scores" do
      get :get_sentiment_scores, params: { product: 'Others', source: 'Problem Solution Survey', fromDate: '13/08/2024', toDate: '15/08/2024' }
      
      expect(response).to be_successful
      
      json_response = JSON.parse(response.body)
      sentiment_scores = json_response.map { |record| record['sentiment_score'].to_f }
      average_sentiment_score = (sentiment_scores.sum / sentiment_scores.size).round(1)

      
      expect(average_sentiment_score).to eq(2.2)
    end
  end


  describe "GET #get_overall_sentiment_scores" do
    it "retrieves overall sentiment scores" do
      get :get_overall_sentiment_scores, params: { product: 'Others', source: 'Problem Solution Survey', fromDate: '13/08/2024', toDate: '15/08/2024' }
      json_response = JSON.parse(response.body)
  
      sentiment_scores = json_response.map { |record| record['sentiment_score'].to_f }
      average_sentiment_score = (sentiment_scores.sum / sentiment_scores.size).round(1)
  
      expect(average_sentiment_score).to eq(2.2)
    end
  end

  describe "GET #get_sentiments_sorted" do
  it "retrieves sorted sentiments" do
    get :get_sentiments_sorted, params: { product: 'Others', source: 'Problem Solution Survey', fromDate: '13/08/2024', toDate: '15/08/2024' }
    json_response = JSON.parse(response.body)

    expected_response = [
      {
        "date" => "13/08/2024",
        "feedback" => "Too busy",
        "feedback_category" => "Staff Related",
        "product" => "Others",
        "sentiment" => "Satisfied",
        "sentiment_score" => "4.5",
        "source" => "Problem Solution Survey",
        "subcategory" => "Others"
      },
      {
        "date" => "15/08/2024",
        "feedback" => "Thank you",
        "feedback_category" => "Staff Related",
        "product" => "Others",
        "sentiment" => "Unsatisfied",
        "sentiment_score" => "2.1",
        "source" => "Problem Solution Survey",
        "subcategory" => "compliments"
      },
      {
        "date" => "13/08/2024",
        "feedback" => "So far is a good service from the staff handled my matter",
        "feedback_category" => "Staff Related",
        "product" => "Others",
        "sentiment" => "Unsatisfied",
        "sentiment_score" => "2.0",
        "source" => "Problem Solution Survey",
        "subcategory" => "customer service issues"
      },
      {
        "date" => "13/08/2024",
        "feedback" => "Faster than expected process : A+",
        "feedback_category" => "Staff Related",
        "product" => "Others",
        "sentiment" => "Frustrated",
        "sentiment_score" => "0.3",
        "source" => "Problem Solution Survey",
        "subcategory" => "Others"
      }
    ]
    expect(json_response).to eq(expected_response)
  end
end


  describe "GET #get_sentiments_distribution" do
    it "retrieves sentiments distribution" do
      get :get_sentiments_distribution, params: { product: 'Others', source: 'Problem Solution Survey', fromDate: '13/08/2024', toDate: '15/08/2024' }
      json_response = JSON.parse(response.body)
      sentiment_order = ["Frustrated", "Unsatisfied", "Neutral", "Satisfied", "Excited"]
      total_count = json_response.map { |item| item["count"] }.sum.to_f
      sentiment_percentages = Hash.new(0.0)
      json_response.each do |item|
        sentiment_percentages[item["sentiment"]] = (item["count"] / total_count * 100).round(1)
      end
      formatted_output = sentiment_order.map { |sentiment| sentiment_percentages[sentiment] }.join(", ")
      expect(formatted_output).to eq("25.0, 50.0, 0.0, 25.0, 0.0")
    end
  end

 # Testing private method indirectly
  describe "private_filter usage" do
    it "calls private_filter for products" do
      expect(controller).to receive(:private_filter).with(:product).and_call_original
      get :filter_products
    end

    it "calls private_filter for sources" do
      expect(controller).to receive(:private_filter).with(:source).and_call_original
      get :filter_sources
    end
  end
end
