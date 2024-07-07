require 'rails_helper'

RSpec.describe AnalyticsController, type: :controller do
  let(:valid_attributes) {
    { date: '2021-01-01', feedback: 'Positive feedback', product: 'Product X', subcategory: 'Category Y', sentiment: 'Positive', sentiment_score: '50', source: 'Survey' }
  }

  let(:invalid_attributes) {
    { date: nil, feedback: nil }
  }

  let(:valid_session) { {} }

  describe "GET #index" do
    it "populates an array of analytics" do
      analytic = Analytic.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:analytics)).to eq([analytic])
    end
  end

  describe "GET #show" do
    it "assigns the requested analytic as @analytic" do
      analytic = Analytic.create! valid_attributes
      get :show, params: {id: analytic.to_param}, session: valid_session
      expect(assigns(:analytic)).to eq(analytic)
    end
  end

  describe "GET #new" do
    it "assigns a new analytic as @analytic" do
      get :new, params: {}, session: valid_session
      expect(assigns(:analytic)).to be_a_new(Analytic)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Analytic" do
        expect {
          post :create, params: {analytic: valid_attributes}, session: valid_session
        }.to change(Analytic, :count).by(1)
      end

      it "redirects to the created analytic" do
        post :create, params: {analytic: valid_attributes}, session: valid_session
        expect(response).to redirect_to(Analytic.last)
      end
    end

    context "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: {analytic: invalid_attributes}, session: valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested analytic" do
      analytic = Analytic.create! valid_attributes
      expect {
        delete :destroy, params: {id: analytic.to_param}, session: valid_session
      }.to change(Analytic, :count).by(-1)
      expect(response).to redirect_to(analytics_url)
    end
  end
end
