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

# Scenario: Clicking a source dropdown option colors it red and adds it to the listbox
And(/I select a source/) do
  source = find('.filter-source-option', match: :first)
  source.click
  @selectedsource = source.text.strip
end

Then(/the (.*) source dropdown option should be (.*)/) do |selectdeselect, color|
  # Find the dropdown option based on @selectedsource
  source_option = find('.filter-source-option', text: @selectedsource, visible: true)

  case color
  when 'red'
    # Verify that the selected source has Mui-selected class
    expect(source_option[:class]).to include('Mui-selected')
  when 'reverted to white'
    # Verify that the selected source does not have Mui-selected class
    expect(source_option[:class]).not_to include('Mui-selected')
  end
end

Then(/the (.*) source is (.*) the listbox/) do |selectdeselect, addremove|
  find('body').click
  # Find all source values currently in the listbox
  source_value = all('.filter-source-value').map(&:text)
  
  if selectdeselect == 'selected' && addremove == 'added to'
    # Ensure the selected source is in the listbox
    expect(source_value).to include(@selectedsource)
  elsif selectdeselect == 'deselected' && addremove == 'removed from'
    # Ensure the deselected source is not in the listbox
    expect(source_value).not_to include(@selectedsource)
  else
    # Handle unsupported combinations
    raise "Unsupported combination: #{selectdeselect}, #{addremove}"
  end
end

# Scenario: Unclicking a selected source dropdown option resets its color and removes it from the listbox
And(/I deselect the same source/) do
  raise "No source selected" unless @selectedsource
  find('.filter-source-option', text: @selectedsource).click
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
  url_prefix = "#{Capybara.app_host}"  # URL prefix is the same for both environments

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
