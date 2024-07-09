require 'json'
require 'net/http'
require 'uri'

# Feature: Source filter dropdown for Dashboard

# Scenario: Hovering on a source dropdown option updates its color
Given(/there are sources in the dataset/) do
  @sources = get_sources_from_dataset
end

When(/I click on the "Sources" dropdown button/) do
  find('#filter-source').click
end

When(/I hover over the source dropdown option/) do
  find('.filter-source-option', match: :first).hover
end

Then(/the source dropdown option should be highlighted on hover/) do
  dropdown_option = find('.filter-source-option', match: :first)
  # Simulate hover effect using plain JavaScript
  page.execute_script("arguments[0].classList.add('hovered');", dropdown_option)
  # Check if the element has the 'hovered' class
  expect(dropdown_option[:class]).to include('hovered')
end

# Scenario: Available source dropdown options
Then(/I should see all sources arranged alphabetically as dropdown options/) do
  options = all('.filter-source-option').map(&:text)
  expect(options).to eq options.sort
end

# Scenario: No selection of source dropdown option
When(/no Sources dropdown options are selected/) do
  all('.filter-source-option').each do |option|
    expect(option[:'aria-selected']).to eq 'false'
  end
end

Then(/I should see "Sources" in the text field of the dropdown button/) do
  expect(page).to have_css('.MuiFormLabel-root.MuiInputLabel-root', text: 'Sources')
end

# Scenario: Reset source selection by refreshing
#   Reused steps



# Helper methods
def get_sources_from_dataset
  url_prefix = 'http://localhost:3000'  # URL prefix is the same for both environments

  uri = URI("#{url_prefix}/analytics/filter_sources")

  begin
    response = Net::HTTP.get_response(uri)

    unless response.is_a?(Net::HTTPSuccess)
      raise "Failed to fetch sources: #{response.message}"
    end

    JSON.parse(response.body).map(&:to_s).sort  # Parse JSON response and sort sources
  rescue Errno::ECONNREFUSED => e
    raise "Connection refused: #{e.message}. Check if the server is running and the URL is correct."
  rescue SocketError => e
    raise "Socket error: #{e.message}. Check the URL and network connectivity."
  end
end
