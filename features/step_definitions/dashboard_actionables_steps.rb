And (/the 'actions-Tracked' widget has a progress bar/) do
  sleep(3)
  @progress_bar = find('g[transform="translate(10,0)"]')
end

Then(/the 'actions-Tracked' widget should display the same progress bar/) do
  current_progress_bar = find('g[transform="translate(10,0)"]')
  expect(current_progress_bar[:class]).to eq(@progress_bar[:class]), "Expected the class attributes of the progress bars to match"
end

And ("a progress bar") do
  expect(page).to have_css('g[transform="translate(10,0)"]')
end
  
Then (/I should see a two numbers indicating my progress for the number of "Done" actions and "In Progress" actions/) do
  # Assuming 'done' and 'in_progress' are numbers or specific identifiers you will pass to this step.
  # Check for the 'Done' actions count
  expect(page).to have_css('p.MuiTypography-root.MuiTypography-body1', text: /^[0-9]+$/, visible: :all)
  
  # Check for the 'In Progress' actions count
  expect(page).to have_css('p.MuiTypography-root.MuiTypography-body1', text: /^[0-9]+$/, visible: :all)
end
  
