class Actionable < ApplicationRecord
    validates :action, :status, :subproduct, :actionable_category, :feedback_category, :feedback_json, presence: true
    def self.transform_string(str)
      str.gsub(/([\/&])/, ' \1 ') # Insert spaces around / and &
         .split.map(&:capitalize) # Convert to title case
         .join(' ')
    end
  end
  