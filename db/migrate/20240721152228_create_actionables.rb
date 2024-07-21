class CreateActionables < ActiveRecord::Migration[7.1]
  def change
    create_table :actionables do |t|
      t.text :action
      t.string :status
      t.string :subproduct
      t.string :actionable_category
      t.string :feedback_category
      t.text :feedback_json

      t.timestamps
    end
  end
end
