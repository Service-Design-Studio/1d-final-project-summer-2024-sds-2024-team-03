Then (/I should see an error message '(.*)'/) do |msg|
    expect(page).to have_content(msg)
end
