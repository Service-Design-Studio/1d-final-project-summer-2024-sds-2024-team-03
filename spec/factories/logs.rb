# spec/factories/logs.rb
FactoryBot.define do
  factory :log do
    log_message { "Data classification completed and added to database." }
    status { "ok" }
  end
end
