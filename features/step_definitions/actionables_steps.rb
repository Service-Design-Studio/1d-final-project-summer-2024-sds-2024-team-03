# Scenario: Normal view
Then(/a '\+' button/) do
  expect(page).to have_select("+")
end

Then(/3 actionable statuses titled 'GENERATED ACTIONS', 'IN PROGRESS', 'DONE'/) do
  expect(page).to have_content('GENERATED ACTIONS')
  expect(page).to have_content('IN PROGRESS')
  expect(page).to have_content('DONE')
end

Then(/each of the actionable statuses have 4 types of actionable categories 'To Fix', 'To Keep In Mind', 'To Amplify', 'To Promote'/) do
  within('.status-container') do
    expect(page).to have_content('To Fix')
    expect(page).to have_content('To Keep In Mind')
    expect(page).to have_content('To Amplify')
    expect(page).to have_content('To Promote')
  end
end

Then(/'No data' in the 'GENERATED ACTIONS'/) do
  within('.generated-actions') do
    expect(page).to have_content('No data')
  end
end

Then(/all actionables remain the same/) do
  expect(page).to have_css('.actionable', count: 6)  
end

# Scenario: Get GENERATED ACTIONS (Yes)
Given(/I look at the actionable statuses 'IN PROGRESS', 'DONE'/) do
  expect(page).to have_css('.in-progress')
  expect(page).to have_css('.done')
end

And(/I click on the 'GENERATE ACTIONABLES' button/) do
  click_button('GENERATE ACTIONABLES')
end

Then(/I should see a confirmation dialog/) do
  expect(page).to have_content('Are you sure?')
end

And(/when I click 'YES'/) do
  click_button('YES')
end

Then(/I should see an indication it is '(.*)'/) do |status|
  expect(page).to have_content(status)
end

And(/the 'GENERATED ACTIONS' is not empty/) do
  generated_actions_section = find('.generated-actions')
  expect(generated_actions_section).not_to be_empty
end

And(/the other actionable statuses '(.*)' and '(.*)' remain the same/) do |status1, status2|
  within('.in-progress') do
    expect(page).to have_css('.actionable', count: 2)  
  end
  within('.done') do
    expect(page).to have_css('.actionable', count: 3)  #
  end
end

# Scenario: Get GENERATED ACTIONS (No)
Given(/I look at the actionable statuses 'GENERATED ACTIONS', 'IN PROGRESS', 'DONE'/) do
  expect(page).to have_css('.generated-actions')
  expect(page).to have_css('.in-progress')
  expect(page).to have_css('.done')
end

And(/when I click 'NO'/) do
  click_button('NO')
end

# Scenario: Details of actionable items
Then(/I should see the 'Subcategory' of each actionable/) do
  expect(page).to have_content('Subcategory:')
end

And(/I should see the 'Feedback Category' of each actionable/) do
  expect(page).to have_content('Feedback Category:')
end

And(/I should see the content of each actionable/) do
  expect(page).to have_css('.action-content')
end

And(/I should see a button to 'CHANGE STATUS' of each actionable/) do
  expect(page).to have_button('Change Status')
end

And(/I should see a button to 'VIEW DATA' of each actionable/) do
  expect(page).to have_button('View Data')
end

And(/I should see a button to delete each actionable/) do
  delete_buttons = all('.actionable .delete-button')
  expect(delete_buttons).not_to be_empty
end

# Scenario: Delete actionable
When(/I see an actionable/) do
  # Find an actionable
  actionable = find('.actionable')
  expect(actionable).not_to be_nil
end

And(/I click the delete icon for an actionable/) do
  find('.actionable .delete-button').click
end

Then(/I should not see the actionable/) do
  expect(page).not_to have_css('.actionable')
end

# Scenario: 'CHANGE STATUS' on actionable
And(/I click the 'CHANGE STATUS' button of the actionable/) do
  find('.actionable .change-status-button').click
end

Then(/I should see the button 'Done'/) do
  expect(page).to have_select('Done')
end

And(/I should see the button 'In Progress' if the actionable is in 'GENERATED ACTIONS'/) do
  if find('.actionable').ancestor('.generated-actions')
    expect(page).to have_button('In Progress')
  end
end

And(/when I click 'Done'/) do
  click_button('Done')
end

Then(/I should see that actionable moved to the 'DONE' status/) do
  done_actionable = find('.done .actionable')
  expect(done_actionable).not_to be_nil
end

# Scenario: 'VIEW DATA' on actionable
And(/I click on the 'VIEW DATA' button of an actionable/) do
  find('.actionable .view-data').click
end

Then(/I should see a dialog popup where I can see all the relevant feedbacks contributing to that action/) do
  expect(page).to have_css('.dialog .feedbacks')
end

# Scenario: Manually add actionable
When(/I click on the '+' to manually add an actionable/) do
  find('.add-actionable').click
end

Then(/I enter my action 'Improve latency', enter my subcategory 'digiPortfolio', enter my feedback category 'Technical \/ System Related' and enter my actionable category 'To Keep In Mind', and click 'ADD'/) do
  fill_in 'Action', with: 'Improve latency'
  fill_in 'Subcategory', with: 'digiPortfolio'
  fill_in 'Feedback Category', with: 'Technical / System Related'
  fill_in 'Actionable Category', with: 'To Keep In Mind'
  click_button 'ADD'
end

Then(/I should see that actionable with that action, subcategories, feedback categories under the 'In Progress' status under the actionable category I chose/) do
  within('.in-progress .to-fix') do
    expect(page).to have_content('New Actionable')
  end
end

# Scenario: Refresh preserves all actionables

# Scenario: Unable to generate actions due to unselected product and source

Then(/Generate Actions button will be disabled/) do
  expect(find_button('Generate Actions')).to be_disabled
end

# Scenario: Unable to generate actions due to insufficient data
And(/I should see 'There are no actionables to be generated from this data.'/) do
  expect(page).to have_content('There are no actionables to be generated from this data.')
end