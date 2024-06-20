Given("I am on any page") do
  visit('/')
end

Then('from date must fill up with the date 1 week ago from now') do
  sleep(4)
  expected_date = 1.week.ago.strftime("%d/%m/%Y")
  expect(page).to have_field('from-date', with: expected_date)
  expect(find_field('from-date').value).to eq(expected_date)
end

Then('to date must fill with the date now') do
  sleep(4)
  expected_date = Date.today.strftime("%d/%m/%Y")
  expect(page).to have_field('to-date', with: expected_date)
  expect(find_field('to-date').value).to eq(expected_date)
end

When('I click on the "From" dropdown button') do
  sleep(4)
  find("button[aria-label='Choose date, selected date is Jun 13, 2024']").click
end

Then('I should see the calendar dropdown') do
  sleep(4)
  expect(page).to have_css('.base-Popper-root') 
end

Given('I have the "From" calendar dropdown opened') do
  sleep(4)
  find("button[aria-label='Choose date, selected date is Jun 13, 2024']").click
  expect(page).to have_css('.base-Popper-root') 
end

When('I select a date') do
  sleep(4)
  find("button[data-timestamp='1718294400000']").click 
end

Then('the calendar dropdown should close') do
  sleep(4)
  expect(page).not_to have_css('.base-Popper-root')
end

Then('from date must have be in dd/mm/yyyy') do
  sleep(4)
  selected_date = find_field('from-date').value
  expect(selected_date).to match(/\d{2}\/\d{2}\/\d{4}/)
end

When('I click away from the calendar dropdown') do
  sleep(4)
  find('body').click
end
  
  