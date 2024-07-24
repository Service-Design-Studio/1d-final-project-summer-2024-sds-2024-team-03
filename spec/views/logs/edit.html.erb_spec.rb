require 'rails_helper'

RSpec.describe "logs/edit", type: :view do
  let(:log) {
    Log.create!(
      log_message: "MyText"
    )
  }

  before(:each) do
    assign(:log, log)
  end

  it "renders the edit log form" do
    render

    assert_select "form[action=?][method=?]", log_path(log), "post" do

      assert_select "textarea[name=?]", "log[log_message]"
    end
  end
end
