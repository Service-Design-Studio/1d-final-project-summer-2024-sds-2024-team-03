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
  

When("I drag a file into the Upload area") do
  file_path = Rails.root.join('features', 'valid.xlsx')
  file_content = File.read(file_path, mode: 'rb') # Read the file content in binary mode

  # Encode the file content in base64
  base64_file_content = Base64.strict_encode64(file_content)

  page.execute_script(<<-JS, base64_file_content)
    // Wait for the drop zone to be available in the DOM
    function waitForElement(selector, callback) {
      var element = document.querySelector(selector);
      if (element) {
        callback(element);
      } else {
        setTimeout(function() {
          waitForElement(selector, callback);
        }, 100);
      }
    }

    waitForElement('[data-testid="drop-zone"]', function(dropZone) {
      var dataTransfer = new DataTransfer();
      var fileContent = atob(arguments[0]); // Decode the base64 file content
      var byteArray = new Uint8Array(fileContent.length);

      for (var i = 0; i < fileContent.length; i++) {
        byteArray[i] = fileContent.charCodeAt(i);
      }

      var blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var fileInput = new File([blob], 'test.xlsx');
      dataTransfer.items.add(fileInput);

      var event = new DragEvent('drop', {
        dataTransfer: dataTransfer,
        bubbles: true,
        cancelable: true
      });

      dropZone.dispatchEvent(event);
    });
  JS
  sleep(10)
end

  

Then("a Modal should open, informing a successful upload of the Investments + Product Survey + name of my file") do
    modal_title = find('#modal-title')
    expect(modal_title).not_to be_nil
  
    # Check that the modal contains the correct text
    expected_text = "Uploaded successfully: Investments__Product Survey__valid.xlsx"
    expect(modal_title.text).to include(expected_text)
  end
  

Then(/the filters and visualizations on the other pages should make use of the uploaded data/) do
  # Add assertions to verify the filters and visualizations on other pages
end