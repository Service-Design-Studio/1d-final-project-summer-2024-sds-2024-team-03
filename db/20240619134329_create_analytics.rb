class CreateAnalytics < ActiveRecord::Migration[7.1]
  def change
    create_table :analytics, if_not_exists: true do |t|
      t.string :date
      t.string :feedback
      t.string :product
      t.string :subcategory
      t.string :sentiment
      t.string :sentiment_score
      t.string :source

      t.timestamps
    end
  end
end
