json.extract! log, :id, :log_date, :log_message, :created_at, :updated_at
json.url log_url(log, format: :json)
