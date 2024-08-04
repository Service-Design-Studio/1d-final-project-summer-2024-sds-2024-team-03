class Actionable < ApplicationRecord
    validates :action, :status, :subproduct, :actionable_category, :feedback_category, :feedback_json, presence: true
  end
  