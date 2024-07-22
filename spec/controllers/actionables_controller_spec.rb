require 'rails_helper'

RSpec.describe ActionablesController, type: :controller do
    let(:valid_attributes) {
        {
          action: 'Test Action',
          status: 'open',
          subproduct: 'Test Subproduct',
          actionable_category: 'Test Category',
          feedback_category: 'Test Feedback',
          feedback_json: '{"key": "value"}'
        }
      }
    
      let(:invalid_attributes) {
        {
          action: '',
          status: '',
          subproduct: '',
          actionable_category: '',
          feedback_category: '',
          feedback_json: ''
        }
      }

  describe "GET #index" do
    it "returns a success response" do
      actionable = Actionable.create! valid_attributes
      get :index
      expect(response).to be_successful
    end
  end

  describe "GET #show" do
    it "returns a success response" do
      actionable = Actionable.create! valid_attributes
      get :show, params: { id: actionable.to_param }
      expect(response).to be_successful
    end
  end

  describe "GET #new" do
    it "returns a success response" do
      get :new
      expect(response).to be_successful
    end
  end

  describe "GET #edit" do
    it "returns a success response" do
      actionable = Actionable.create! valid_attributes
      get :edit, params: { id: actionable.to_param }
      expect(response).to be_successful
    end
  end

  describe "POST #create" do
    context "with valid parameters" do
      it "creates a new Actionable" do
        expect {
          post :create, params: { actionable: valid_attributes }
        }.to change(Actionable, :count).by(1)
      end

      it "redirects to the created actionable" do
        post :create, params: { actionable: valid_attributes }
        expect(response).to redirect_to(Actionable.last)
      end
    end

    context "with invalid parameters" do
      it "does not create a new Actionable" do
        expect {
          post :create, params: { actionable: invalid_attributes }
        }.to change(Actionable, :count).by(0)
      end

      it "renders the 'new' template" do
        post :create, params: { actionable: invalid_attributes }
        expect(response).to have_http_status(422) #422 is the response for unprocessable entity
      end
    end
  end

  describe "PATCH #update" do
    context "with valid parameters" do
      let(:new_attributes) {
        {
          action: 'Updated Action',
          status: 'closed'
        }
      }

      it "updates the requested actionable" do
        actionable = Actionable.create! valid_attributes
        patch :update, params: { id: actionable.to_param, actionable: new_attributes }
        actionable.reload
        expect(actionable.action).to eq('Updated Action')
        expect(actionable.status).to eq('closed')
      end

      it "redirects to the actionable" do
        actionable = Actionable.create! valid_attributes
        patch :update, params: { id: actionable.to_param, actionable: valid_attributes }
        expect(response).to redirect_to(actionable)
      end
    end

    context "with invalid parameters" do
      it "renders the 'edit' template" do
        actionable = Actionable.create! valid_attributes
        patch :update, params: { id: actionable.to_param, actionable: invalid_attributes }
        expect(response).to have_http_status(422) #422 is the response for unprocessable entity
      end
    end
  end

  describe "DELETE #destroy" do
    it "destroys the requested actionable" do
      actionable = Actionable.create! valid_attributes
      expect {
        delete :destroy, params: { id: actionable.to_param }
      }.to change(Actionable, :count).by(-1)
    end

    it "redirects to the actionables list" do
      actionable = Actionable.create! valid_attributes
      delete :destroy, params: { id: actionable.to_param }
      expect(response).to redirect_to(actionables_url)
    end
  end
end