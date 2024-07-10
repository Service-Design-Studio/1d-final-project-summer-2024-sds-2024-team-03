# features/step_definitions/upload_steps.rb

Given('I am on the Upload page') do
  visit root_path
  sleep(0.3)
  find('#nav-hamburger').click
  within('.MuiList-root.MuiList-padding') do
    find('.MuiListItemText-primary', text: "Upload Data").click
  end
  find('.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.css-1yxmbwk').click
  sleep(0.3)
end

Then('I should still be on the Upload Page') do
  expect(current_path).to eq('/') # Adjust this to the actual path of your Upload page
end
  

When("I upload a valid file using the file input") do
  # Ensure the file input is visible
  find('input[type="file"]', visible: false).set(Rails.root.join('features', 'valid.xlsx'))
  # Trigger the change event to simulate user interaction
  page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
end
  
When("I upload an invalid file using the file input") do
    # Ensure the file input is visible
    find('input[type="file"]', visible: false).set(Rails.root.join('features', 'invalid_data.xlsx'))
    # Trigger the change event to simulate user interaction
    page.execute_script("document.querySelector('input[type=\"file\"]').dispatchEvent(new Event('change'))")
  end


Then("a Modal should open, informing a successful upload of the Investments + Product Survey + name of my file") do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expected_text = "Investments__Product Survey__valid.xlsx"
  expect(modal_title.text).to include(expected_text)
  expect(modal_title.text).to include("Uploaded successfully:")
end

Then("a Modal should open, informing a successful upload") do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil
#  expect(modal_title.text).to include("Uploaded successfully:")
end

Then("a Modal should open, informing an unsuccessful upload") do
  modal_title = find('#modal-title')
  expect(modal_title).not_to be_nil

  # Check that the modal contains the correct text
  expect(modal_title.text).to include("Invalid")
end


When("I upload multiple files") do
    # Paths to the files to be uploaded
    file_paths = [
      Rails.root.join('features', 'valid.xlsx').to_s,
      Rails.root.join('features', 'valid2.xlsx').to_s
    ]
  
    # Find the file input element
    input = find('input[type="file"]', visible: false)
  
    # Use JavaScript to set multiple files
    page.execute_script(<<-JS, file_paths)
      var input = document.querySelector('input[type="file"]');
      var fileList = new DataTransfer();
  
      // Loop through the file paths and add each file to the DataTransfer object
      arguments[0].forEach(function(filePath) {
        var fileName = filePath.split('/').pop();
        var fileContent = new Blob([''], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
        var file = new File([fileContent], fileName);
        fileList.items.add(file);
      });
  
      // Assign the DataTransfer object to the input element
      input.files = fileList.files;
  
      // Trigger the change event
      input.dispatchEvent(new Event('change', { bubbles: true }));
    JS
  end
  
  
