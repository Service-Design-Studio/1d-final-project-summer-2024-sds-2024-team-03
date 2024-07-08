require 'rails_helper'

RSpec.describe AnalyticsController, type: :controller do
  let(:invalid_attributes) {
    { date: nil, feedback: nil, product: nil, subcategory: nil, sentiment: nil, sentiment_score: nil, source: nil }
  }

  let(:valid_session) { {} }

  describe "POST #uploads" do
    it "handles file upload" do
      file = fixture_file_upload('/files/test_image.png', 'image/png')
      post :uploads, params: { file: file }
      expect(response).to have_http_status(:ok)
    end

    it "handles no file selected" do
      post :uploads
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "GET #get_earliest_latest_dates" do
    it "fetches earliest and latest dates" do
      get :get_earliest_latest_dates
      expect(response).to be_successful
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
      get :get_sentiment_scores, params: { product: 'Product X', source: 'Survey', fromDate: '2021-01-01', toDate: '2021-01-31' }
      expect(response).to be_successful
    end
  end

  describe "GET #get_overall_sentiment_scores" do
    it "retrieves overall sentiment scores" do
      get :get_overall_sentiment_scores, params: { product: 'Product X', source: 'Survey', fromDate: '2021-01-01', toDate: '2021-01-31' }
      expect(response).to be_successful
    end
  end

  describe "GET #get_sentiments_sorted" do
    it "retrieves sorted sentiments" do
      get :get_sentiments_sorted, params: { product: 'Product X', source: 'Survey', fromDate: '2021-01-01', toDate: '2021-01-31' }
      expect(response).to be_successful
    end
  end

  describe "GET #get_sentiments_distribution" do
    it "retrieves sentiments distribution" do
      get :get_sentiments_distribution, params: { product: 'Product X', source: 'Survey', fromDate: '2021-01-01', toDate: '2021-01-31' }
      expect(response).to be_successful
    end
  end

  describe "PATCH #update" do
    let(:analytic) { Analytic.create! valid_attributes }

    it "updates the requested analytic" do
      patch :update, params: { id: analytic.id, analytic: { feedback: "Updated feedback" } }, session: valid_session
      expect(response).to redirect_to(analytic_url(analytic))
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
