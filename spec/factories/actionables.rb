FactoryBot.define do
  factory :actionable do
    action { "MyText" }
    status { "MyString" }
    subproduct { "MyString" }
    actionable_category { "MyString" }
    feedback_category { "MyString" }
    feedback_json { "MyText" }
  end
end
