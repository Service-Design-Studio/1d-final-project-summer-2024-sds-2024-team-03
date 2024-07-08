require 'rails_helper'

RSpec.describe ApplicationCable::Connection, type: :channel do
  # Test to ensure ApplicationCable::Connection inherits from ActionCable::Connection::Base
  it 'inherits from ActionCable::Connection::Base' do
    expect(ApplicationCable::Connection).to be < ActionCable::Connection::Base
  end
end
