# features/step_definitions/actionables_steps.rb

Given("I am on the Actionables Page") do
  visit '/actionables'  # Adjust this URL according to your routing
end

Then("I should see four action items widgets titled 'To Fix', 'To Keep In Mind', 'To Amplify', 'To Promote'") do
  expect(page).to have_content('To Fix')
  expect(page).to have_content('To Keep In Mind')
  expect(page).to have_content('To Promote')
  expect(page).to have_content('To Amplify')
end

Then("I should see the Date, Products, and Sources dropdown buttons") do
  expect(page).to have_selector('input[type="date"]')
  expect(page).to have_selector('button', text: 'Products')
  expect(page).to have_selector('button', text: 'Sources')
end

When("Date, Products and Sources are selected") do
  fill_in 'From', with: '15-07-2024'
  fill_in 'To', with: '22-07-2024'
  click_button 'Products'
  find('li', text: 'Contact Center').click
  click_button 'Sources'
  find('li', text: 'Call Centre').click
end

Then("I should see each widget updated with a list of action items") do
  expect(page).to have_content('Feedback in the morning sun shine on the ATM machine is too bright...')
end

Then("I should see the Date of each action item") do
  expect(page).to have_content('15-07-2024')
end

Then("I should see the Priority Level of each action item") do
  expect(page).to have_content('NEW')
  expect(page).to have_content('IN PROGRESS')
  expect(page).to have_content('DONE')
end

Then("I should see the Description of each action item") do
  expect(page).to have_content('Feedback in the morning sun shine on the ATM machine is too bright...')
end

Then("I should see a delete option for each action item") do
  expect(page).to have_selector('button', text: 'Delete')
end

Then("I should see a confirm-delete button upon hovering") do
  button = find('button', text: 'Delete')
  button.hover
  expect(page).to have_selector('button', text: 'Confirm Delete')
end

Then("I should see a clickable 'Add New Card' button on each widget") do
  expect(page).to have_selector('button', text: 'Add New Card')
end

Then("I should see an editable action item box upon clicking") do
  click_button 'Add New Card'
  expect(page).to have_selector('input[name="addAction"]')
end

Then("I should see a tag option for each action item") do
  expect(page).to have_selector('button', text: 'Tag')
end

Then("I should see an avatar icon appear upon tagging") do
  click_button 'Tag'
  expect(page).to have_selector('img.avatar')
end

When("I reselect a product with no data") do
  click_button 'Products'
  find('li', text: 'Non-Existing Product').click
end

Then("I should see four empty widgets") do
  expect(page).to have_content('No data available')
end
  