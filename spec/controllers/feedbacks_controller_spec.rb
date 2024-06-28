# spec/controllers/feedbacks_controller_spec.rb
require 'rails_helper'

RSpec.describe FeedbacksController, type: :controller do
  let!(:feedback) { create(:feedback) }

  describe "GET #index" do
    it "returns a success response" do
      get :index
      expect(response).to be_successful
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      get :show, params: { id: feedback.id }
      expect(response).to be_successful
    end
  end

  describe "GET #new" do
    it "returns a success response" do
      get :new
      expect(response).to be_successful
    end
  end

  describe "POST #create" do
    it "creates a new Feedback" do
      expect {
        post :create, params: { feedback: attributes_for(:feedback) }
      }.to change(Feedback, :count).by(1)
    end

    it "redirects to the created feedback" do
      post :create, params: { feedback: attributes_for(:feedback) }
      expect(response).to redirect_to(Feedback.last)
    end
  end

  describe "GET #edit" do
    it "returns a success response" do
      get :edit, params: { id: feedback.id }
      expect(response).to be_successful
    end
  end

  describe "PUT #update" do
    it "updates the requested feedback" do
      put :update, params: { id: feedback.id, feedback: { content: "Updated content" } }
      feedback.reload
      expect(feedback.content).to eq("Updated content")
    end

    it "redirects to the feedback" do
      put :update, params: { id: feedback.id, feedback: { content: "Updated content" } }
      expect(response).to redirect_to(feedback)
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested feedback" do
      expect {
        delete :destroy, params: { id: feedback.id }
      }.to change(Feedback, :count).by(-1)
    end

    it "redirects to the feedbacks list" do
      delete :destroy, params: { id: feedback.id }
      expect(response).to redirect_to(feedbacks_url)
    end
  end
end
