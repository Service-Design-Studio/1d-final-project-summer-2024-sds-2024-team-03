class AnalyticsController < ApplicationController
  before_action :set_analytic, only: %i[ show edit update destroy ]

  def filter_products
    @products = private_filter(:Product)
    render json: @products
  end

  def filter_sources
    @sources = private_filter(:Source)
    render json: @sources
  end

  def get_sentiment_scores
    # Need to add to private below to allow these params?
    @sentiment_scores = Analytic.select(:Sentiment_Score, :Date, :Product, :Subcategory)
              .where(Date: params[:fromDate]..params[:toDate])
              .where(Product: params[:Product])
              .where(Source: params[:Source])
    render json: @sentiment_scores
  end
  

  def get_overall_sentiment_scores
    @overall_sentiment_scores = Analytic.select("Date, AVG(CAST(Sentiment_Score AS numeric)) AS Avg_Sentiment_Score")
    .where(Date: params[:fromDate]..params[:toDate])
    .where(Product: params[:Product])
    .where(Source: params[:Source])
    .group(:Date)
    
    render json: @overall_sentiment_scores
  end

  def get_sentiments_sorted
    @sentiments_sorted = private_get_sentiments(params[:fromDate], params[:toDate], params[:Product], params[:Source])
                        .group(:Sentiment, :Date, :Product, :Subcategory, :Feedback,  :Source)
                        .order('MAX(CAST(Sentiment_Score AS numeric)) DESC')
    render json: @sentiments_sorted
  end
  

  def get_sentiments_distribution
    @sentiments_distribution = private_get_sentiments(params[:fromDate], params[:toDate], params[:Product], params[:Source])
                              .count(:Sentiment)
                              .group(:Sentiment_Score, :Date, :Product, :Subcategory, :Feedback,  :Source,)
    render json: @sentiments_distribution
  end

  # Bubble graph => donut chart
  # Arent the bubbles actionables??

  # GET /analytics or /analytics.json
  def index
    #add to logger index
    Rails.logger.info("=> Analytics.index.............")
    @analytics = Analytic.all
  end

  # GET /analytics/1 or /analytics/1.json
  def show
  end

  # GET /analytics/new
  def new
    @analytic = Analytic.new
  end

  # GET /analytics/1/edit
  def edit
  end

  # POST /analytics or /analytics.json
  def create
    @analytic = Analytic.new(analytic_params)

    respond_to do |format|
      if @analytic.save
        format.html { redirect_to analytic_url(@analytic), notice: "Analytic was successfully created." }
        format.json { render :show, status: :created, location: @analytic }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @analytic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /analytics/1 or /analytics/1.json
  def update
    respond_to do |format|
      if @analytic.update(analytic_params)
        format.html { redirect_to analytic_url(@analytic), notice: "Analytic was successfully updated." }
        format.json { render :show, status: :ok, location: @analytic }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @analytic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /analytics/1 or /analytics/1.json
  def destroy
    @analytic.destroy!

    respond_to do |format|
      format.html { redirect_to analytics_url, notice: "Analytic was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_analytic
      @analytic = Analytic.find(params[:id])
    end

    def private_filter(attribute)
      Analytic.select(attribute).distinct.pluck(attribute)
    end

    # feedback, Source for digging, sentiment_score for sorting
    def private_get_sentiments(fromDate, toDate, products, sources)
      fromDate = Date.strptime(fromDate, '%d/%m/%Y')
      toDate = Date.strptime(toDate, '%d/%m/%Y')
      products = products.split(',')
      sources = sources.split(',')
      Analytic.select(:Sentiment, :Date, :Product, :Subcategory, :Feedback,  :Source, :Sentiment_Score)
              .where(Date: fromDate..toDate)
              .where(Product: products)
              .where(Source: sources)
    end

    # Only allow a list of trusted parameters through.
    def analytic_params
      params.require(:analytic).permit(:Date, :Feedback, :Product, :Subcategory, :Sentiment, :Sentiment_Score, :Source, :Feedback_Category)
    end
end
