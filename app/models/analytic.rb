class Analytic < ApplicationRecord
  validates :date, presence: true
  validates :feedback, presence: true
  validates :product, presence: true
  validates :subcategory, presence: true
  validates :sentiment, presence: true
  validates :sentiment_score, presence: true
  validates :source, presence: true

  def self.transform_string(str)
    str.gsub(/([\/&])/, ' \1 ') # Insert spaces around / and &
       .split.map(&:capitalize) # Convert to title case
       .join(' ')
  end
end
