# features/step_definitions/upload_steps.rb

When(/I upload a valid file using the file input/) do
  # Ensure the file input is visible
  find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'valid1.csv'))
  # Trigger the change event to simulate user interaction
  page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
end
  
When(/I upload an invalid file using the file input/) do
    # Ensure the file input is visible
    find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'invalid.xlsx'))
    # Trigger the change event to simulate user interaction
    page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
  end

Then(/a Modal should open, informing a successful upload of the '(.*)' and '(.*)' and filename/) do |product, source|
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expected_text = "#{product}__#{source}__valid1.csv"
  expect(modal_title.text).to include(expected_text)
  expect(modal_title.text).to include("Uploaded successfully:")
end

Then(/a Modal should open, informing an unsuccessful upload/) do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expect(modal_title.text).to include("Error")
end

When(/I do not select any product or source/) do
  all('.filter-product-option').each do |option|
    expect(option[:'aria-selected']).to eq 'false'
  end
  all('.filter-source-option').each do |option|
    expect(option[:'aria-selected']).to eq 'false'
  end
end