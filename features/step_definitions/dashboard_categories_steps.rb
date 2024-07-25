And (/I should see 5 subcategories with the most negative sentiments/) do
    expect(page).to have_content("United Trust (UT) products > Application Related") 
    expect(page).to have_content("NonUT products > Fee Related")
    expect(page).to have_content("NonUT products > Application Related")
    expect(page).to have_content("United Trust (UT) products > Staff Related")
    expect(page).to have_content("null > Staff Related")
end

And(/with the 5 most negative sentiments sorted in descending order/) do
    parent_elements = all("g[transform='translate(250,10)']")
    parent_element = parent_elements.first
    
    content = parent_element.text.gsub(/\s+/, ' ').strip  # Replace multiple spaces and newlines with a single space
    
    expected_text = [
      'United Trust (UT) products > Application Related',
      'NonUT products > Fee Related',
      'NonUT products > Application Related',
      'United Trust (UT) products > Staff Related',
      'null > Staff Related'
    ].join(' ')
    
    expect(content).to include(expected_text)
end  

When (/there are less than 5 categories in the category graph/) do
    expect(page).to have_no_css("g[transform='translate(0,122)']")
end

Then (/I should see only those categories/) do
    expect(page).to have_content("null > Staff Related")
end
