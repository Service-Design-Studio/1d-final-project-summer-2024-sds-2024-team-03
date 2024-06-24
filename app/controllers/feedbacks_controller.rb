class FeedbacksController < ApplicationController
    layout 'jbaaam'
    before_action :set_feedback, only: [:show, :edit, :update, :destroy]
  
    # GET /feedbacks
    def index
    #  @feedbacks = Feedback.all
    #  render json: @feedbacks
    end
  
    # GET /feedbacks/1
    def show
    end
  
    # GET /feedbacks/new
    def new
      @feedback = Feedback.new
    end
  
    # GET /feedbacks/1/edit
    def edit
    end
  
    # POST /feedbacks
    def create
      @feedback = Feedback.new(feedback_params)
  
      if @feedback.save
        redirect_to @feedback, notice: 'Feedback was successfully created.'
      else
        render :new
      end
    end
  
    # PATCH/PUT /feedbacks/1
    def update
      if @feedback.update(feedback_params)
        redirect_to @feedback, notice: 'Feedback was successfully updated.'
      else
        render :edit
      end
    end
  
    # DELETE /feedbacks/1
    def destroy
      @feedback.destroy
      redirect_to feedbacks_url, notice: 'Feedback was successfully destroyed.'
    end
  
    private
      # Use callbacks to share common setup or constraints between actions.
      def set_feedback
        @feedback = Feedback.find(params[:id])
      end
  
      # Only allow a list of trusted parameters through.
      def feedback_params
        params.require(:feedback).permit(:user_id, :category, :content, :sentiment)
      end
  end