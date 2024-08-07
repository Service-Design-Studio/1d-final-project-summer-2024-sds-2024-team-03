When(/I click on the 'GENERATE REPORT' button/) do
  find('button', text: 'Generate Report').click
end

Then(/I should download a .pdf file to my computer/) do
  expect(downloads).to include('generated_report.pdf')
end

Then(/Generate Report button will be disabled/) do
  expect(find('button', text: 'Generate Report')['disabled']).to be_truthy
end
