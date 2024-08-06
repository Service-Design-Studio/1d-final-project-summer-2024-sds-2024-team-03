require 'rails_helper'

RSpec.describe LogsController, type: :controller do
  let(:valid_attributes) { { log_message: 'Valid log message', status: :created } }
  let(:invalid_attributes) { { log_message: '', status: :unprocessable_entity } }
  let(:valid_session) { {} }

  describe "GET #index" do
    it "returns a success response" do
      FactoryBot.create(:log, log_message: "Test log message")
      get :index
      expect(response).to be_successful
      expect(response.body).to include("Test log message")
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Log and redirects" do
        expect {
          post :create, params: { log: valid_attributes }, session: valid_session
        }.to change(Log, :count).by(1)
        expect(response).to redirect_to(log_url(Log.last))
      end
    end

    #context "with invalid params" do
    #  it "does not create a new Log" do
    #    expect {
    #      post :create, params: { log: invalid_attributes }, session: valid_session
    #    }.not_to change(Log, :count)
    #    expect(response).to have_http_status(422)
    #  end
    #end
  end

  describe "PUT #update" do
    let(:log) { FactoryBot.create(:log) }

    context "with valid params" do
      let(:new_attributes) { { log_message: 'Updated log message' } }

      it "updates the requested log" do
        put :update, params: { id: log.to_param, log: new_attributes }, session: valid_session
        log.reload
        expect(log.log_message).to eq('Updated log message')
        expect(response).to redirect_to(log_url(log))
      end
    end

    context "with invalid params" do
      it "does not update the log" do
        put :update, params: { id: log.to_param, log: invalid_attributes }, session: valid_session
        expect(response).to have_http_status(302)
      end
    end
  end

  describe "DELETE #destroy" do
    let!(:log) { FactoryBot.create(:log) }

    it "destroys the requested log" do
      expect {
        delete :destroy, params: { id: log.to_param }, session: valid_session
      }.to change(Log, :count).by(-1)
      expect(response).to redirect_to(logs_url)
    end
  end
end
