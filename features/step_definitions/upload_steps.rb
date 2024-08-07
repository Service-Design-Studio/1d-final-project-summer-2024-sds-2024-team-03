# features/step_definitions/upload_steps.rb

When(/I upload a valid file using the file input/) do
  # Ensure the file input is visible
  find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'valid1.csv'))
  # Trigger the change event to simulate user interaction
  page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
end
  
When(/I upload an invalid file using the file input/) do
    # Ensure the file input is visible
    find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'seed_table.txt'))
    # Trigger the change event to simulate user interaction
    page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
  end

Then(/a Modal should open, informing a successful upload of the '(.*)' and '(.*)' and filename/) do |subcategory, source|
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expected_text = "#{subcategory}__#{source}__valid1.csv"
  expect(modal_title.text).to include(expected_text)
  expect(modal_title.text).to include("Uploaded successfully")
end

Then(/I should be alerted "(.*)"/) do |message|
  modal = find('#modal-title')
  expect(modal).not_to be_nil
  modal_text = modal.text
  expect(modal_text).to include(message)
end

When(/I do not select any subcategory or source/) do
  expect(page).to have_css('.MuiFormLabel-root.MuiInputLabel-root', text: 'Subcategory')
  expect(page).to have_css('.MuiFormLabel-root.MuiInputLabel-root', text: 'Sources')
end

And(/I select a subcategory and source/) do
  find('#uploaddata-filter-subcategory').click
  subcategory = find('.subcategory-option', match: :first)
  @selectedsubcategory = subcategory.text.strip
  subcategory.click

  find('#filter-source').click
  source = find('.filter-source-option', match: :first)
  @selectedsource = source.text.strip
  source.click
end

When(/I click on the "Subcategories" dropdown button/) do
  find('#uploaddata-filter-subcategory').click
end

When(/I hover over a subcategory dropdown option/) do
  expect(page).to have_selector('.subcategory-option', visible: true, wait: 1)
  button = find('.subcategory-option', text: "Cashline")
  button.hover
end

Then(/the subcategory dropdown option should be highlighted on hover/) do
  button = find('.subcategory-option', text: "Cashline")
  # Verify the color change by checking the computed style
  new_background_color = page.evaluate_script("window.getComputedStyle(arguments[0]).backgroundColor;", button)
  expect(new_background_color).to satisfy { |color| 
  color == 'rgba(0, 0, 0, 0)' || color == 'rgba(0, 0, 0, 0.04)'
}
  page.execute_script("arguments[0].dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));", button)
end

And(/there are subcategories in the dataset/) do
  url = "#{Capybara.app_host}"
  @subcategories = get_subcategories_from_dataset(url)
end

Then(/I should see all (\d+) subcategories arranged alphabetically as dropdown options/) do |count|
  expected_subcategories = @subcategories.reject(&:empty?)
  options = all('.subcategory-option').map(&:text).reject(&:empty?)
  expect(options).to eq options.sort
  expect(options.size).to eq count.to_i
  expect(options).to match_array(expected_subcategories)
end

When(/no Subcategories dropdown options are selected/) do
  all('.subcategory-option').each do |option|
    expect(option[:'aria-selected']).to eq 'false'
  end
end

Then(/I should see "Subcategories" in the text field of the dropdown button/) do
  expect(page).to have_css('.MuiFormLabel-root.MuiInputLabel-root', text: 'Subcategory')
end

And(/the subcategories selected are: '(.*)'/) do |subcategories|
  select_subcategories(subcategories.split(', '))
end



# Helper methods
def get_subcategories_from_dataset(base_url)
  url = URI("#{base_url}/analytics/filter_subcategory")
  response = Net::HTTP.get_response(url)
  JSON.parse(response.body).map(&:to_s).sort
rescue StandardError => e
  raise "Failed to fetch products: #{e.message}"
end

def select_subcategories(subcategories)
  # Ensure the dropdown is visible and interactable
  dropdown = find('#uploaddata-filter-subcategory')
  using_wait_time(1) do
    expect(page).not_to have_css('.MuiBackdrop-root')
  end
  dropdown.click  # Open the dropdown to see the options
  expect(page).to have_css('.MuiMenuItem-root', wait: 1)

  # Loop through each product, find it in the dropdown by text, and click to select
  subcategories.each do |subcategory|
    find('.MuiMenuItem-root', text: subcategory, match: :prefer_exact).click
  end

  # Click outside to close the dropdown if necessary
  # This step depends on whether your dropdown closes automatically upon selection or not
  find('body').click(x: 0, y: 200)
end
