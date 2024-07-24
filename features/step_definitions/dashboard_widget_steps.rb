Given(/the following feedback exists/) do |feedback_table|
  feedback_table.hashes.each do |feedback|
    Analytic.create(
      date: feedback['date'],
      feedback: feedback['feedback'],
      product: feedback['product'],
      subcategory: feedback['subcategory'],
      sentiment: feedback['sentiment'],
      sentiment_score: feedback['sentiment_score'],
      source: feedback['source']
    )
  end
end

Then(/(.*) seed feedback should exist/) do |n_seeds|
  expect(Analytic.count).to eq(n_seeds.to_i)
end

Then(/^(.*) bar is colored (.*)$/) do |sentiment, color|
  element = find("p.MuiTypography-root.MuiTypography-body1", text: /#{sentiment}/)

  # Navigate to the correct div with the background color
  parent_div = element.find(:xpath, "ancestor::div[contains(@class, 'MuiBox-root css-34ji4n')]")
  child_div = parent_div.find(:xpath, "descendant::div[contains(@class, 'MuiBox-root css-15yuoy2')]")
  color_div = child_div.find(:xpath, "descendant::div[contains(@class, 'css-') and contains(@class, 'MuiBox-root')]")
  
  # Get the computed background color style
  background_color = color_div.native.style('background-color')

  case color
    when "red"
      expect(background_color).to eq("rgba(255, 0, 0, 1)")
    when "orange"
      expect(background_color).to eq("rgba(255, 165, 0, 1)")
    when "grey"
      expect(background_color).to eq("rgba(169, 169, 169, 1)")
    when "green"
      expect(background_color).to eq("rgba(0, 128, 0, 1)")
    when "darkgreen"
      expect(background_color).to eq("rgba(0, 100, 0, 1)")
    else
      raise "Unknown color: #{color}"
  end
end

And(/All Products are selected/) do
  select_all_products
end

And(/the products selected are: '(.*)'/) do |products|
  select_products(products.split(', '))
end

And(/All Sources are selected/) do
  select_all_sources
end

And(/the sources selected are: '(.*)'/) do |sources|
  select_sources(sources.split(', '))
end

When(/Past 6 Months are selected/) do
  url = "#{Capybara.app_host}"
  @dates = get_earliest_and_latest_dates(url)
  latest_date = Date.parse(@dates[:latest_date])
  latest_date_text = latest_date.strftime("%d-%m-%Y")
  start_date = Date.parse(@dates[:latest_date]) << 6
  start_date_text = start_date.strftime("%d-%m-%Y")
  set_date_range(start_date_text, latest_date_text)
end

When(/the date is set from '(.*)' to '(.*)'/) do |start_date, end_date|
  set_date_range(start_date, end_date)
end

Then(/I should see the overall sentiment score as '(.*)'/) do |expected_score|
  full_text = find('#overall-sentiment-score').text
  actual_score = full_text.split("\n")[1]
  expect(actual_score).to eq(expected_score)
end

Then(/I should see the percentage change as '(.*)'/) do |expected_change|
  # Find the element containing the percentage change text
  element = find('h6.MuiTypography-subtitle1', text: expected_change)
  
  # Verify the text content
  expect(element).to have_text(expected_change)
  
  # Verify the color
  if expected_change.include?("▲")
    parent_element = element.find(:xpath, "ancestor::div[1]")
    parent_class_attribute = parent_element[:class]
    expect(parent_class_attribute).to include('css-16aw65f') # green color
  elsif expected_change.include?("▼")
    parent_element = element.find(:xpath, "ancestor::div[1]")
    parent_class_attribute = parent_element[:class]
    expect(parent_class_attribute).to include('css-19iv31y') # red color
  elsif expected_change.include?("Not Applicable")
    parent_element = element.find(:xpath, "ancestor::div[1]")
    parent_class_attribute = parent_element[:class]
    expect(parent_class_attribute).to include('css-1cvl920') # grey color
  end
end

Then(/I should see the distribution of sentiment as '(.*)'/) do |expected_distribution|
  # Find the element containing the sentiment distribution
  full_text = find('#sentiment-distribution').text
  # Extract the numerical values from the string, including zeros
  actual_distribution = full_text.scan(/\b(\d+\.\d+|\d+(?=%))/).flatten.join(', ')
  # Compare the extracted numbers with the expected distribution
  expect(actual_distribution).to eq(expected_distribution)
end

Then(/I should see the distribution of sentiment add up to '(.*)'/) do |distribution_sum|
  full_text = find('#sentiment-distribution').text
  actual_distribution = full_text.scan(/\b(\d+\.\d+|\d+(?=%))/).flatten.join(', ')
  actual_values = actual_distribution.split(', ').map(&:to_f)

  expected_sum = distribution_sum.to_f
  tolerance = 0.11 # account for rounding error

  expect((actual_values.sum - expected_sum).abs).to be <= tolerance
end

# Scenario: Clicking on sentiment score widget redirects to Analytics page
When(/I click on the '(.*)' widget/) do |widget_id|
  find("##{widget_id}").click
end

Then(/I should be redirected to '(.*)' page/) do |expected_title|
  page_title = find('h1')
  actual_title = page_title.text.strip
  expect(actual_title).to eq(expected_title)
end



# helper methods
def select_all_products
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  dropdown.click  # Open the dropdown to see the options

  # Wait for options to be visible
  page.has_css?('.filter-product-option', wait: 1) 

  # Select all options by clicking each one
  all('.filter-product-option').each do |option|
    option.click
  end

  # Wait a moment for any JS processing
  sleep(0.1)

  # Click outside to close the dropdown if necessary
  find('body').click
end


def select_products(products)
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  using_wait_time(1) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown to see the options
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Loop through each product, find it in the dropdown by text, and click to select
  products.each do |product|
    find('.MuiMenuItem-root', text: product, match: :prefer_exact).click
  end

  # Click outside to close the dropdown if necessary
  # This step depends on whether your dropdown closes automatically upon selection or not
  find('body').click(x: 0, y: 200)
end


def select_all_sources
  # Open the dropdown for sources
  find('#filter-source').click

  page.has_css?('.filter-source-option', wait: 1)

  # Select all options by clicking each one
  all('.filter-source-option').each do |option|
    option.click
  end

  # Wait a moment for any JS processing
  sleep(0.1)

  # Close dropdown by clicking outside of it
  find('body').click
end

def select_sources(sources)
  # Ensure the dropdown is interactable
  dropdown = find('#filter-source')
  using_wait_time(1) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Iterate through the sources to select
  sources.each do |source|
    find('.MuiMenuItem-root', text: source, match: :prefer_exact).click
  end

  # Close dropdown by clicking outside of it
  find('body').click
end

def set_date_range(start_date, end_date)
  # Fill in the 'From Date' input
  find('#from-date').set(start_date)
  # Fill in the 'To Date' input
  find('#to-date').set(end_date)
  find('body').click # to close date picker if it stays open
end
