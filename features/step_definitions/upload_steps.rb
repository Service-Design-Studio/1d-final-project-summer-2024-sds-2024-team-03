# features/step_definitions/upload_steps.rb

When(/I upload a valid file using the file input/) do
  # Ensure the file input is visible
  find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'valid1.xlsx'))
  # Trigger the change event to simulate user interaction
  page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
end
  
When(/I upload an invalid file using the file input/) do
    # Ensure the file input is visible
    find('input[type="file"]', visible: false).set(Rails.root.join('features/testfiles', 'invalid.xlsx'))
    # Trigger the change event to simulate user interaction
    page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
  end

Then(/a Modal should open, informing a successful upload of the '(.*)' + '(.*)' + filename/) do |product, source|
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expected_text = "#{product}__#{source}__valid.xlsx"
  expect(modal_title.text).to include(expected_text)
  expect(modal_title.text).to include("Uploaded successfully:")
end

Then(/a Modal should open, informing a successful upload/) do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil
  expect(modal_title.text).to include("Uploaded successfully:")
end

Then(/a Modal should open, informing an unsuccessful upload/) do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expect(modal_title.text).to include("Invalid")
end

When(/I upload multiple valid files using the file input/) do
  # Ensure the file inputs are visible and set the files
  files = [
    Rails.root.join('features/testfiles', 'valid1.xlsx'),
    Rails.root.join('features/testfiles', 'valid2.xlsx')
  ]

  file_input = find('input[type="file"]', visible: false)
  files.each do |file|
    attach_file(file_input[:id], file, make_visible: true)
  end
end
