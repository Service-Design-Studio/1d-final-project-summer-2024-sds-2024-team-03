class AnalyticsController < ApplicationController
  before_action :set_analytic, only: %i[ show edit update destroy ]

  def filter_products
    #@products = Analytic.select(:product).distinct
    @products = private_filter(:product)
    render json: @products
  end

  def filter_sources
    @sources = private_filter(:source)
    render json: @sources
  end

  def get_sentiment_scores
    # Need to add to private below to allow these params?
    @sentiment_scores = private_get_sentiment_scores(params[:fromDate], params[:toDate], params[:product], params[:source])
    render json: @sentiment_scores
  end
  

  def get_overall_sentiment_scores
    @overall_sentiment_scores = private_get_sentiment_scores(params[:fromDate], params[:toDate], params[:product], params[:source])
                                .select("date, AVG(CAST(sentiment_score AS numeric)) AS avg_sentiment_score")
                                .group(:date)
    render json: @overall_sentiment_scores
  end

  def get_sentiments_sorted
    @sentiments_sorted = private_get_sentiments(params[:fromDate], params[:toDate], params[:product], params[:source])
                  .group(:product, :subcategory)
                  .order('MAX(CAST(sentiment_score AS numeric)) DESC')
    render json: @sentiments_sorted
  end
  

  def get_sentiments_distribution
    @sentiments_distribution = private_get_sentiments(params[:fromDate], params[:toDate], params[:product], params[:source])
                              .group(:sentiment)
                              .count
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
      Analytic.select(attribute).distinct
    end

    def private_get_sentiment_scores(fromDate, toDate, products, sources)
      fromDate = Date.strptime(fromDate, '%d/%m/%Y')
      toDate = Date.strptime(toDate, '%d/%m/%Y')
      products = params[:product].split(',')
      sources = params[:source].split(',')
      Analytic.where(date: fromDate..toDate)
              .where(product: products)
              .where(source: sources)
              .select(:sentiment_score, :date, :product, :subcategory)
    end

    # feedback, source for digging, sentiment_score for sorting
    def private_get_sentiments(fromDate, toDate, products, sources)
      fromDate = Date.strptime(fromDate, '%d/%m/%Y')
      toDate = Date.strptime(toDate, '%d/%m/%Y')
      products = params[:product].split(',')
      sources = params[:source].split(',')
      Analytic.where(date: fromDate..toDate)
              .where(product: products)
              .where(source: sources)
              .select(:sentiment, :date, :product, :subcategory, :feedback,  :source, :sentiment_score)
    end

    # Only allow a list of trusted parameters through.
    def analytic_params
      params.require(:analytic).permit(:date, :feedback, :product, :subcategory, :sentiment, :sentiment_score, :source)
    end
end
