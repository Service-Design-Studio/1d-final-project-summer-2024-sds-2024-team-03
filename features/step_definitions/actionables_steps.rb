# Scenario: Normal view
Then(/I should see a '\+' button/) do
  expect(page).to have_css('button[aria-label="Add"]')
end

Then(/3 actionable statuses titled 'GENERATED ACTIONS', 'IN PROGRESS', 'DONE'/) do
  expect(page).to have_content('GENERATED ACTIONS')
  expect(page).to have_content('IN PROGRESS')
  expect(page).to have_content('DONE')
end

Then(/each of the actionable statuses have 4 types of actionable categories 'To Fix', 'To Keep In Mind', 'To Amplify', 'To Promote'/) do
  # Under 'Generated Actions'
  within('#GENERATED-ACTIONS-panel1d-header') do
    expect(page).to have_content('To Fix')
  end
  within('#GENERATED-ACTIONS-panel2d-header') do
    expect(page).to have_content('To Keep In Mind')
  end
  within('#GENERATED-ACTIONS-panel3d-header') do
    expect(page).to have_content('To Amplify')
  end
  within('#GENERATED-ACTIONS-panel4d-header') do
    expect(page).to have_content('To Promote')
  end
  # Under 'In Progress'
  within('#IN-PROGRESS-panel1d-header') do
    expect(page).to have_content('To Fix')
  end
  within('#IN-PROGRESS-panel2d-header') do
    expect(page).to have_content('To Keep In Mind')
  end
  within('#IN-PROGRESS-panel3d-header') do
    expect(page).to have_content('To Amplify')
  end
  within('#IN-PROGRESS-panel4d-header') do
    expect(page).to have_content('To Promote')
  end
  # Under 'Done'
  within('#DONE-panel1d-header') do
    expect(page).to have_content('To Fix')
  end
  within('#DONE-panel2d-header') do
    expect(page).to have_content('To Keep In Mind')
  end
  within('#DONE-panel3d-header') do
    expect(page).to have_content('To Amplify')
  end
  within('#DONE-panel4d-header') do
    expect(page).to have_content('To Promote')
  end
end

Then(/all actionables remain the same/) do
  expect(page).to have_content(@GeneratedActionsCount)  
  expect(page).to have_content(@InProgressCount)  
  expect(page).to have_content(@DoneCount)
end

# Scenario: Get GENERATED ACTIONS (Yes)
And(/I click on the 'GENERATE ACTIONABLES' button/) do
  click_button('Generate Actionables')
end

Then(/I should see a confirmation dialog/) do
  expect(page).to have_content('Are you sure? This will replace all current Generated Actions.')
end

And(/when I click 'YES'/) do
  click_button('Yes')
end

Then(/I should see an indication it is '(.*)'/) do |status|
  expect(page).to have_content(status)
end

And(/I look at the count for 'IN PROGRESS' and 'DONE'/) do
  @InProgressCount = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'IN PROGRESS').text
  @DoneCount = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'DONE').text
end

And(/I look at the count for 'GENERATED ACTIONS', 'IN PROGRESS', and 'DONE'/) do
  @GeneratedActionsCount = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'GENERATED ACTIONS').text
  @InProgressCount = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'IN PROGRESS').text
  @DoneCount = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'DONE').text
end

And(/the 'GENERATED ACTIONS' is not empty/) do
  text = find('.MuiChip-label.MuiChip-labelMedium.css-11lqbxm', text: 'GENERATED ACTIONS').text
  match_data = text.match(/GENERATED ACTIONS: (\d+)/)
  count = match_data[1].to_i if match_data
  expect(count).to be > 0
end

And(/the other actionable statuses '(.*)' and '(.*)' remain the same/) do |status1, status2|
  expect(page).to have_content(@InProgressCount)  
  expect(page).to have_content(@DoneCount)
end

# Scenario: Get GENERATED ACTIONS (No)
And(/when I click 'NO'/) do
  click_button('No')
end

# Scenario: Details of actionable items
Then(/I should see the 'Subcategory' of each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_content('Subcategory:')
  end
end

And(/I should see the 'Feedback Category' of each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_content('Feedback Category:')
  end
end

And(/I should see the content of each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_css('.MuiTypography-root.css-192jg4b')
  end
end

And(/I should see a button to 'CHANGE STATUS' of each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_button('Change Status')
  end
end

And(/I should see a button to 'VIEW DATA' of each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_button('View Data')
  end
end

And(/I should see a button to delete each actionable/) do
  within('.MuiPaper-root.css-k1bx92') do
    expect(page).to have_css('[data-testid="DeleteTwoToneIcon"]')
  end
end

And(/I reinitialise the actionables/) do
  step("the date is set from '21/05/2024' to '31/05/2024'")
  step("the sources selected are: 'CSS'")
  step("the products selected are: 'Investments'")
  step("I click on the 'GENERATE ACTIONABLES' button")
  step("I should see a confirmation dialog")
  step("when I click 'YES'")
  sleep(2)
  step("I refresh the page")
end

# Scenario: Delete actionable
When(/I see an actionable/) do
  @ActionableText = first('div.MuiTypography-root.MuiTypography-h6.css-192jg4b').text
end

And(/I click the delete icon for an actionable/) do
  within(first('.MuiPaper-root.css-k1bx92')) do
    find('[data-testid="DeleteTwoToneIcon"]').click
  end
end

Then(/I should not see the actionable/) do
  expect(page).not_to have_content(@ActionableText)
end

# Scenario: 'CHANGE STATUS' on actionable
And(/I click the 'CHANGE STATUS' button of the actionable/) do
  within(first('.MuiPaper-root.css-k1bx92')) do
    find('[id="demo-positioned-button"]').click
  end
end

Then(/I should see the button 'Done'/) do
  expect(page).to have_css('span.MuiTypography-root.css-yb0lig', text: 'Done')
end

And(/when I click 'Done'/) do
  find('span.MuiTypography-root.css-yb0lig', text: 'Done').click
end

Then(/I should see that actionable moved to the 'DONE' status/) do
  within('div.MuiPaper-root[id^="DONE-To Fix-"]') do
    expect(page).to have_content(@ActionableText)
  end
end

# Scenario: 'VIEW DATA' on actionable
And(/I click on the 'VIEW DATA' button of an actionable/) do
  click_button('View Data')
end

Then(/I should see a dialog popup where I can see all the relevant feedbacks contributing to that action/) do
  expect(page).to have_css('.MuiTableCell-root.css-148yu7y', text: 'Feedback')
end

# Scenario: Manually add actionable
When(/I click on the plus icon to manually add an actionable/) do
  find('button[aria-label="Add"]').click
end

Then(/I enter my action 'Improve latency', enter my subcategory 'digiPortfolio', enter my feedback category 'Features' and enter my actionable category 'To Fix', and click 'ADD'/) do
  fill_in 'actionID', with: 'Improve latency'
  
  find('#detailed-sentimentscoregraph-filter-subcategory').click
  expect(page).to have_css('ul[role="listbox"]')
  step("I click on 'digiPortfolio'")

  find('#detailed-sentimentscoregraph-filter-feedbackcategory').click
  expect(page).to have_css('ul[role="listbox"]')
  step("I click on 'Features'")

  execute_script("document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).click();")

  within(first('label.MuiFormControlLabel-root.css-1jaw3da')) do
    execute_script("arguments[0].click();", find('span.MuiButtonBase-root'))
  end
  
  click_button('Add')
end

Then(/I should see that actionable with that action, subcategories, feedback categories under the 'In Progress' status under the actionable category I chose/) do
  expect(page).to have_content('Improve latency')
end

# Scenario: Refresh preserves all actionables

# Scenario: Unable to generate actions due to unselected product and source

Then(/Generate Actions button will be disabled/) do
  within('.MuiBox-root.css-69i1ev') do
    expect(page).to have_css('button.css-hg6d3z[disabled]')
  end
end

# Scenario: Unable to generate actions due to insufficient data
And(/I should see a message '(.*)'/) do |message|
  expect(page).to have_content(message)
end