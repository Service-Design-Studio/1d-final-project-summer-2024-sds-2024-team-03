Given("I am on page") do
  visit('/')
end

When("I select the hamburger menu") do
  sleep(4)
  find('#nav-hamburger').click
end

Then("the hamburger menu should expand out to reveal {string}") do |sites|
  sleep(4)
  sites.split(', ').each do |site|
    expect(page).to have_content(site)
  end
end
