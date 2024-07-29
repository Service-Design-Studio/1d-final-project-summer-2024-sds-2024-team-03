class AddStatusToLogs < ActiveRecord::Migration[7.1]
  def change
    add_column :logs, :status, :string
  end
end
