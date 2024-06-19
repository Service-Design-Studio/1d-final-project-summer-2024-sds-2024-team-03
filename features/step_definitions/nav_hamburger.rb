Given("I am on the dashboard") do
    visit('/feedbacks')
  end
  
  When("I select the hamburger menu") do
    find('#nav-hamburger').click
  end
  
  Then("the hamburger menu should expand out to reveal {string}, {string}, {string}, {string}") do |dashboard, analytics, actions, editor|
    expect(page).to have_content(dashboard)
    expect(page).to have_content(analytics)
    expect(page).to have_content(actions)
    expect(page).to have_content(editor)
  end
  
  Then("the page I am currently on should be highlighted") do
    expect(find('.menu-item.active')).to have_content('Dashboard')
  end