Given /the following feedback exists/ do |feedback_table|
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

Then /(.*) seed feedback should exist/ do |n_seeds|
  expect(Analytic.count).to eq(n_seeds.to_i)
end

Given /I am on the Dashboard page/ do
  visit root_path
  sleep(3)
end


When /No Products are selected/ do
end


And /All Products are selected/ do
  select_all_products
end

And /the products selected are: '(.*)'/ do |products|
  select_products(products.split(', '))
end

And /All Sources are selected/ do
  select_all_sources
end

And /the sources selected are: '(.*)'/ do |sources|
  select_sources(sources.split(', '))
end

When /the date is set from '(.*)' to '(.*)'/ do |start_date, end_date|
  set_date_range(start_date, end_date)

end

Then /I should see the overall sentiment score as '(.*)'/ do |expected_score|
  sleep(7)
  full_text = find('#overall-sentiment-score').text
  actual_score = full_text.split("\n")[1]
  expect(actual_score).to eq(expected_score)

end

Then /I should see the distribution of sentiment as '(.*)'/ do |expected_distribution|
  # Find the element containing the sentiment distribution
  full_text = find('#sentiment-distribution').text

  # Extract the numerical values from the string, including zeros
  actual_distribution = full_text.scan(/\b(\d+\.\d+|\d+(?=%))/).flatten.join(', ')

  # Compare the extracted numbers with the expected distribution
  expect(actual_distribution).to eq(expected_distribution)
end





def select_all_products
  # Ensure the dropdown is visible and interactable
  dropdown = find('#filter-product')
  dropdown.click  # Open the dropdown to see the options
  sleep(4)

  # Wait for options to be visible
  page.has_css?('.filter-product-option')

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
  dropdown.click  # Open the dropdown to see the options
  sleep(4)

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
  sleep(4)

  page.has_css?('.filter-source-option')

  # Select all options by clicking each one
  all('.filter-source-option').each do |option|
    option.click
  end

  # Optionally, click outside the dropdown to close it
  find('body').click
end


def select_sources(sources)
  # Ensure the dropdown is interactable
  dropdown = find('#filter-source')
  dropdown.click  # Open the dropdown
  sleep(4)

  # Iterate through the sources to select
  sources.each do |source|
    # Use the text of the source to find and click the corresponding option
    find('.MuiMenuItem-root', text: source, match: :prefer_exact).click
  end

  # Close the dropdown by clicking outside of it
  find('body').click
end


def set_date_range(start_date, end_date)
  sleep(0.2)
  # Fill in the 'From Date' input
  find('#from-date').set(start_date)
  sleep(0.2)
  # Fill in the 'To Date' input
  find('#to-date').set(end_date)
  sleep(0.2)
  # Additional actions like submitting the form or clicking away to trigger any validations or updates can be added here
  find('body').click # to close date picker if it stays open
end

