require 'rails_helper'

RSpec.describe LogsController, type: :controller do
  describe "GET #index" do
    it "returns a success response" do
      FactoryBot.create(:log)
      get :index
      expect(response).to be_successful
      expect(response.body).to include("Test log message")
    end
  end

  describe "POST #create" do
    context "with valid params" do
      let(:valid_attributes) { { log_message: 'Valid log message', status: 'active' } }

      it "creates a new Log and redirects" do
        expect {
          post :create, params: { log: valid_attributes }
        }.to change(Log, :count).by(1)
        expect(response).to redirect_to(log_url(Log.last))
      end
    end

    context "with invalid params" do
      let(:invalid_attributes) { { log_message: '', status: 'inactive' } }

      it "returns a failure response (unprocessable entity)" do
        post :create, params: { log: invalid_attributes }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "PUT #update" do
    let(:log) { FactoryBot.create(:log) }
    let(:new_attributes) { { log_message: "Updated log message" } }

    context "with valid params" do
      it "updates the requested log" do
        put :update, params: { id: log.id, log: new_attributes }
        log.reload
        expect(log.log_message).to eq("Updated log message")
        expect(response).to redirect_to(log_url(log))
      end
    end

    context "with invalid params" do
      it "returns a failure response (unprocessable entity)" do
        put :update, params: { id: log.id, log: { log_message: '' } }
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "DELETE #destroy" do
    let!(:log) { FactoryBot.create(:log) }

    it "destroys the requested log" do
      expect {
        delete :destroy, params: { id: log.id }
      }.to change(Log, :count).by(-1)
      expect(response).to redirect_to(logs_url)
    end
  end
end
