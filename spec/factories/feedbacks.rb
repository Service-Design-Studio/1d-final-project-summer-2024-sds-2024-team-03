# spec/factories/feedbacks.rb
FactoryBot.define do
    factory :feedback do
      user_id { 1 }
      category { "General" }
      content { "This is a test feedback." }
      sentiment { "Positive" }
    end
  end
  