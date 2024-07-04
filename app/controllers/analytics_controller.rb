class AnalyticsController < ApplicationController
  before_action :set_analytic, only: %i[ show edit update destroy ]

  def get_earliest_latest_dates
    query = Analytic.where("TO_DATE(date, 'DD/MM/YYYY') IS NOT NULL")
                            .order("TO_DATE(date, 'DD/MM/YYYY')")
    @earliest_date = query.first.pluck("TO_DATE(date, 'DD/MM/YYYY')")
    @latest_date = query.last.pluck("TO_DATE(date, 'DD/MM/YYYY')")
    render json: { earliest_date: @earliest_date, latest_date: @latest_date }
  end

  def filter_products
    @products = private_filter(:product)
    render json: @products
  end

  def filter_sources
    @sources = private_filter(:source)
    render json: @sources
  end

  def get_sentiment_scores
    # SentimentScoreGraph (detailed)
    products = params[:product].split(',')
    sources = params[:source].split(',')
    @sentiment_scores = Analytic.select(:sentiment_score, :date, :product, :subcategory, :feedback_category)
                                .where("TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY')", params[:fromDate], params[:toDate])
                                .where(product: products)
                                .where(source: sources)
    render json: @sentiment_scores
  end
  

  def get_overall_sentiment_scores
    products = params[:product].split(',')
    sources = params[:source].split(',')
    @overall_sentiment_scores = Analytic.select(:date, 'CAST(AVG(CAST(sentiment_score AS numeric)) AS text) AS sentiment_score')
                                        .where("TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY')", params[:fromDate], params[:toDate])
                                        .where(product: products)
                                        .where(source: sources)
                                        .group(:date)
    render json: @overall_sentiment_scores
  end
  

  def get_sentiments_sorted
    # Categorisation: feedback, source for digging
    products = params[:product].split(',')
    sources = params[:source].split(',')
    @sentiments_sorted =Analytic.select('*')
                                .where("TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY')", params[:fromDate], params[:toDate])
                                .where(product: products)
                                .where(source: sources)
                                .order('CAST(sentiment_score AS numeric) DESC')
    render json: @sentiments_sorted
  end
  

  def get_sentiments_distribution
    # Overview 
    products = params[:product].split(',')
    sources = params[:source].split(',')
    @sentiments_distribution = Analytic.select(:sentiment, 'COUNT(sentiment)')
                                      .where("TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY')", params[:fromDate], params[:toDate])
                                      .where(product: products)
                                      .where(source: sources)
                                      .group(:sentiment)
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

    # Only allow a list of trusted parameters through.
    def analytic_params
      params.require(:analytic).permit(:date, :feedback, :product, :subcategory, :feedback_category, :sentiment, :sentiment_score, :source)
    end
end
