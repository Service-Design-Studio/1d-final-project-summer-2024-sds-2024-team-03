Given("I am on the dashboard") do
    visit('/')
  end
  
  When("I select the hamburger menu") do
    find('#nav-hamburger').click
  end
  
  Then /^the hamburger menu should expand out to reveal (.*)$/ do |sites|
    sites =  sites.split(', ')
    sites.each do |site|
      expect(page).to have_content(site)
    end
  end
  
  # Then("the page I am currently on should be highlighted") do
  #   expect(find('.menu-item.active')).to have_content('Dashboard')
  # end
