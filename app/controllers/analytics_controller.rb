class AnalyticsController < ApplicationController
  layout 'jbaaam'
  skip_before_action :verify_authenticity_token, only: [:uploads]
  #before_action :set_analytic, only: %i[ show edit update destroy ]
  
  def uploads
    print("AnalyticsController uploads")
    file = params[:file]

    if file
      service = GoogleCloudStorageService.new('jbaaam_upload')
      destination_path = "uploads/#{file.original_filename}"

      url = service.upload_file(file, destination_path)
      render json: { message: "File uploaded successfully", url: url }, status: :ok
    else
      render json: { error: "No file selected" }, status: :unprocessable_entity
    end
  end

  def get_earliest_latest_dates
    @earliest_date = Analytic.select(:date)
                              .order(Arel.sql("TO_DATE(date, 'DD/MM/YYYY') ASC"))
                                .pluck(:date)
                                .first
    @latest_date = Analytic.select(:date)
                            .order(Arel.sql("TO_DATE(date, 'DD/MM/YYYY') DESC"))
                            .pluck(:date)
                            # because db got an issue, first is null
                            .second
    render json: { "earliest_date": @earliest_date, "latest_date": @latest_date }
  end

  def filter_products
    @products = [ "Cards", "Unsecured Loans", "Secured Loans", "Digital Channels", "Investments", "DBS Treasures", "Self-Service Banking", "Insurance", "Deposits", "Contact Center", "Webpages", "Remittance", "Others"]
    render json: @products
  end

  def filter_subcategory
    @subcategory = ["Debit Card", "Credit Card", "Cashline", "Personal Loan", "Renovation Loan", "Education Loan", "Car Loan", "Mortgage/Home Loan", "DigiBank App", "Internet Banking(iBanking)", "Paylah!", "digiPortfolio", "Non-Unit Trust/Equities", "Unit Trust", "Vickers", "Treasures Relationship Manager(RM)", "DBS Wealth Planning Manager", "DBS Treasures (General)", "SSB", "VTM(Video Teller Machine)", "Phone Banking", "Coin Deposit Machine", "General Insurance", "Life Insurance", "DBS Deposit Account", "Payments", "PayNow", "Cheque", "GIRO", "digiVault", "DBS Hotline", "DBS Branches/Staff","Contact Center", "Websites", "Overseas Transfer", "Others"]
    render json: @subcategory
  end

  def filter_sources
    @sources = ["Service Request", "CSS", "5 Star Logout", "Social Media", "Problem Solution"]
    render json: @sources
  end

  def get_sentiment_scores
    # SentimentScoreGraph (detailed), Sunburst, SentimentCategoriesGraph
    products = params[:product].split(',')
    sources = params[:source].split(',')
    @sentiment_scores = Analytic.select(:sentiment_score, :date, :product, :subcategory, :feedback_category, :feedback, :source)
                                .where("TO_DATE(date, 'DD/MM/YYYY') BETWEEN TO_DATE(?, 'DD/MM/YYYY') AND TO_DATE(?, 'DD/MM/YYYY')", params[:fromDate], params[:toDate])
                                .where(product: products)
                                .where(source: sources)

    # transform_string in model > analytic.rb
    @sentiment_scores = @sentiment_scores.map do |score|
      score.attributes.merge(
        'feedback_category' => Analytic.transform_string(score.feedback_category)
      )
    end
    render json: @sentiment_scores
  end
  

  def get_overall_sentiment_scores
    # Overview
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
                                .order(Arel.sql('CAST(sentiment_score AS numeric) DESC'))
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

  # GET /analytics or /analytics.json
  def index
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
