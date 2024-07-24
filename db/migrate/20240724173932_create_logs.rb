class CreateLogs < ActiveRecord::Migration[7.1]
  def change
    drop_table :logs, if_exists: true
    create_table :logs do |t|
      t.date :log_date
      t.text :log_message

      t.timestamps
    end
  end
end
