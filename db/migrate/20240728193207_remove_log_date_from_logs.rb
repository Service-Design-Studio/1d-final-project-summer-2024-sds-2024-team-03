class RemoveLogDateFromLogs < ActiveRecord::Migration[7.1]
  def change
    remove_column :logs, :log_date, :date
  end
end
