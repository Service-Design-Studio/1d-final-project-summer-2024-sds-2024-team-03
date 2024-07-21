class ActionablesController < ApplicationController
  before_action :set_actionable, only: %i[ show edit update destroy ]

  # GET /actionables or /actionables.json
  def index
    @actionables = Actionable.all
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
