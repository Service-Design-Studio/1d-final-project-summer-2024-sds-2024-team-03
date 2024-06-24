class CreateFeedbacks < ActiveRecord::Migration[7.1]
  def change
    create_table :feedbacks do |t|
      t.integer :user_id
      t.string :category
      t.text :content
      t.string :sentiment

      t.timestamps
    end
  end
end
