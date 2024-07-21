require 'rails_helper'

RSpec.describe "actionables/new", type: :view do
  before(:each) do
    assign(:actionable, Actionable.new(
      action: "MyText",
      status: "MyString",
      subproduct: "MyString",
      actionable_category: "MyString",
      feedback_category: "MyString",
      feedback_json: "MyText"
    ))
  end

  it "renders new actionable form" do
    render

    assert_select "form[action=?][method=?]", actionables_path, "post" do

      assert_select "textarea[name=?]", "actionable[action]"

      assert_select "input[name=?]", "actionable[status]"

      assert_select "input[name=?]", "actionable[subproduct]"

      assert_select "input[name=?]", "actionable[actionable_category]"

      assert_select "input[name=?]", "actionable[feedback_category]"

      assert_select "textarea[name=?]", "actionable[feedback_json]"
    end
  end
end
