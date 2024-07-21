require 'rails_helper'

RSpec.describe "actionables/show", type: :view do
  before(:each) do
    assign(:actionable, Actionable.create!(
      action: "MyText",
      status: "Status",
      subproduct: "Subproduct",
      actionable_category: "Actionable Category",
      feedback_category: "Feedback Category",
      feedback_json: "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/MyText/)
    expect(rendered).to match(/Status/)
    expect(rendered).to match(/Subproduct/)
    expect(rendered).to match(/Actionable Category/)
    expect(rendered).to match(/Feedback Category/)
    expect(rendered).to match(/MyText/)
  end
end
