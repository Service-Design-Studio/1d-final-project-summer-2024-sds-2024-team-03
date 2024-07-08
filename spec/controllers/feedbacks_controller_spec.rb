require 'rails_helper'

RSpec.describe FeedbacksController, type: :controller do
  let(:invalid_attributes) {
    { date: nil, feedback: nil, product: nil, subcategory: nil, sentiment: nil, sentiment_score: nil, source: nil }
  }

  let(:valid_session) { {} }

  describe "GET #index" do
    it "populates an array of feedbacks" do
      feedback = Feedback.create! valid_attributes
      get :index, params: {}, session: valid_session
      expect(assigns(:feedbacks)).to eq([feedback])
    end
  end

  describe "GET #show" do
    it "assigns the requested feedback as @feedback" do
      feedback = Feedback.create! valid_attributes
      get :show, params: {id: feedback.to_param}, session: valid_session
      expect(assigns(:feedback)).to eq(feedback)
    end
  end

  describe "GET #new" do
    it "assigns a new feedback as @feedback" do
      get :new, params: {}, session: valid_session
      expect(assigns(:feedback)).to be_a_new(Feedback)
    end
  end

  describe "POST #create" do
    context "with valid params" do
      it "creates a new Feedback" do
        expect {
          post :create, params: { feedback: valid_attributes }, session: valid_session
        }.to change(Feedback, :count).by(1)
        expect(response).to redirect_to(Feedback.last)
        expect(flash[:notice]).to match(/successfully created/)
      end
    end

    context "with invalid params" do
      it "re-renders the 'new' template" do
        post :create, params: { feedback: invalid_attributes }, session: valid_session
        expect(response).to render_template("new")
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested feedback" do
      feedback = Feedback.create! valid_attributes
      expect {
        delete :destroy, params: {id: feedback.to_param}, session: valid_session
      }.to change(Feedback, :count).by(-1)
      expect(response).to redirect_to(feedbacks_url)
    end
  end


  describe "PATCH #update" do
    let(:feedback) { Feedback.create! valid_attributes }

    context "with valid params" do
      let(:new_attributes) {
        { content: 'Updated content.' }
      }

      it "updates the requested feedback" do
        patch :update, params: { id: feedback.id, feedback: new_attributes }, session: valid_session
        feedback.reload
        expect(feedback.content).to eq('Updated content.')
        expect(response).to redirect_to(feedback)
        expect(flash[:notice]).to match(/successfully updated/)
      end
    end

    context "with invalid params" do
      it "re-renders the 'edit' template" do
        patch :update, params: { id: feedback.id, feedback: invalid_attributes }, session: valid_session
        expect(response).to render_template("edit")
      end
    end
  end


  describe "DELETE #destroy" do
    let!(:feedback) { Feedback.create! valid_attributes }

    it "destroys the requested feedback" do
      expect {
        delete :destroy, params: { id: feedback.id }, session: valid_session
      }.to change(Feedback, :count).by(-1)
      expect(response).to redirect_to(feedbacks_url)
      expect(flash[:notice]).to match(/successfully destroyed/)
    end
  end

  # Testing private method indirectly
  describe "private method #set_feedback" do
    let!(:feedback) { Feedback.create! valid_attributes }

    it "loads the correct feedback" do
      get :edit, params: { id: feedback.id }, session: valid_session
      expect(assigns(:feedback)).to eq(feedback)
    end
  end
end
