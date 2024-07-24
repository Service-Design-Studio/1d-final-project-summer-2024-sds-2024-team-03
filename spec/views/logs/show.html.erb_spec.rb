require 'rails_helper'

RSpec.describe "logs/show", type: :view do
  before(:each) do
    assign(:log, Log.create!(
      log_message: "MyText"
    ))
  end

  it "renders attributes in <p>" do
    render
    expect(rendered).to match(/MyText/)
  end
end
