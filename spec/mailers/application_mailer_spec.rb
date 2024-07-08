require 'rails_helper'

RSpec.describe ApplicationMailer, type: :mailer do
  # Checking if ApplicationMailer is correctly set up with default from and layout
  it 'sets the default from email' do
    expect(ApplicationMailer.default[:from]).to eq('from@example.com')
  end

  it 'uses the correct layout' do
    expect(ApplicationMailer._layout).to eq('mailer')
  end
end
