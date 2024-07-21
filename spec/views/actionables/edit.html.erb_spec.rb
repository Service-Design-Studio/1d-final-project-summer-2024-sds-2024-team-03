require 'rails_helper'

RSpec.describe "actionables/edit", type: :view do
  let(:actionable) {
    Actionable.create!(
      action: "MyText",
      status: "MyString",
      subproduct: "MyString",
      actionable_category: "MyString",
      feedback_category: "MyString",
      feedback_json: "MyText"
    )
  }

  before(:each) do
    assign(:actionable, actionable)
  end

  it "renders the edit actionable form" do
    render

    assert_select "form[action=?][method=?]", actionable_path(actionable), "post" do

      assert_select "textarea[name=?]", "actionable[action]"

      assert_select "input[name=?]", "actionable[status]"

      assert_select "input[name=?]", "actionable[subproduct]"

      assert_select "input[name=?]", "actionable[actionable_category]"

      assert_select "input[name=?]", "actionable[feedback_category]"

      assert_select "textarea[name=?]", "actionable[feedback_json]"
    end
  end
end
