require 'rails_helper'

RSpec.describe "logs/index", type: :view do
  before(:each) do
    assign(:logs, [
      Log.create!(
        log_message: "MyText"
      ),
      Log.create!(
        log_message: "MyText"
      )
    ])
  end

  it "renders a list of logs" do
    render
    cell_selector = Rails::VERSION::STRING >= '7' ? 'div>p' : 'tr>td'
    assert_select cell_selector, text: Regexp.new("MyText".to_s), count: 2
  end
end
