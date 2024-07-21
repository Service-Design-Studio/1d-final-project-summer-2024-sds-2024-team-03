require 'rails_helper'

RSpec.describe "actionables/index", type: :view do
  before(:each) do
    assign(:actionables, [
      Actionable.create!(
        action: "MyText",
        status: "Status",
        subproduct: "Subproduct",
        actionable_category: "Actionable Category",
        feedback_category: "Feedback Category",
        feedback_json: "MyText"
      ),
      Actionable.create!(
        action: "MyText",
        status: "Status",
        subproduct: "Subproduct",
        actionable_category: "Actionable Category",
        feedback_category: "Feedback Category",
        feedback_json: "MyText"
      )
    ])
  end

  it "renders a list of actionables" do
    render
    cell_selector = Rails::VERSION::STRING >= '7' ? 'div>p' : 'tr>td'
    assert_select cell_selector, text: Regexp.new("MyText".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("Status".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("Subproduct".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("Actionable Category".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("Feedback Category".to_s), count: 2
    assert_select cell_selector, text: Regexp.new("MyText".to_s), count: 2
  end
end
