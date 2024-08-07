When(/I click on the 'GENERATE REPORT' button/) do
  sleep(3)
  find('button', text: 'GENERATE REPORT').click
end

Then("I should download a .pdf file to my computer") do
  sleep(3)
  puts("#{$download_directory}")
  expect(Dir.glob("#{$download_directory}").length).to be_positive
end


Then(/Generate Report button will be disabled/) do
  expect(find('button', text: 'GENERATE REPORT')['tabindex']).to eq('-1')
end
