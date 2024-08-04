require 'net/http'
require 'json'
class ActionablesController < ApplicationController
  before_action :set_actionable, only: %i[ show edit update destroy ]
  skip_before_action :verify_authenticity_token, only: [:create, :update, :destroy]

  # READ RESTful API
  # GET /actionables or /actionables.json
  def index
    @actionables = Actionable.all

    # transform_string function in model > analytic.rb
    @actionables = @actionables.map do |actionable|
      actionable.attributes.merge(
        'feedback_category' => Actionable.transform_string(actionable.feedback_category)
      )
    end
  end

  # GET /actionables/1 or /actionables/1.json
  def show
  end

  # GET /actionables/new
  def new
    @actionable = Actionable.new
  end

  # GET /actionables/1/edit
  def edit
  end

  # CREATE RESTful API
  # POST /actionables or /actionables.json
  def create
    @actionable = Actionable.new(actionable_params)

    respond_to do |format|
      if @actionable.save
        format.html { redirect_to actionable_url(@actionable), notice: "Actionable was successfully created." }
        format.json { render :show, status: :created, location: @actionable }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @actionable.errors, status: :unprocessable_entity }
      end
    end
  end

  # UPDATE RESTfulAPI
  # PATCH/PUT /actionables/1 or /actionables/1.json
  def update
    respond_to do |format|
      if @actionable.update(actionable_params)
        format.html { redirect_to actionable_url(@actionable), notice: "Actionable was successfully updated." }
        format.json { render :show, status: :ok, location: @actionable }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @actionable.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /actionables/1 or /actionables/1.json
  def destroy
    @actionable.destroy!

    respond_to do |format|
      format.html { redirect_to actionables_url, notice: "Actionable was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  def inference
    products = params[:product].split(',')
    sources = params[:source].split(',')
    fromDate = params[:fromDate]    
    toDate = params[:toDate]
    currentTime = Time.now()

    # Construct the query parameters
    query_params = URI.encode_www_form(
      products.map { |product| ['product', products] } +
      sources.map { |source| ['source', sources] } +
      [['from_date', fromDate], ['to_date', toDate]]
    )
    # Construct the full URL
    url = URI.parse("https://asia-southeast1-jbaaam.cloudfunctions.net/generate-actions?#{query_params}")
    response = Net::HTTP.get_response(url)
    
    #Actionable.where(:status = "new", :created_at < currentTime).destroy()
    Actionable.where("status = ? AND created_at < ?", "new", currentTime).destroy_all
    result = JSON.parse(response.body)

    render json: result
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_actionable
      @actionable = Actionable.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def actionable_params
      params.require(:actionable).permit(:action, :status, :subproduct, :actionable_category, :feedback_category, :feedback_json)
    end
end
