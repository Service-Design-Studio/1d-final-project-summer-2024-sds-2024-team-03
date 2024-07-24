And (/I should see 5 subcategories with the most positive sentiments/) do
    parent_elements = all("g[transform='translate(250,10)']")  # Get all matching elements
    parent_element = parent_elements.first  # Select the first element
    expect(page).to have_content("null > Staff Related")
    expect(page).to have_content("United Trust (UT) products > Staff Related")
    expect(page).to have_content("NonUT products > Application Related")
    expect(page).to have_content("NonUT products > Fee Related")
    expect(page).to have_content("United Trust (UT) products > Application Related")
end


And (/with the 5 most positive sentiments sorted in descending order/) do
    parent_elements = all("g[transform='translate(250,10)']")  # Get all matching elements
    parent_element = parent_elements.first  # Select the first element
    content = parent_element.text
    expect(text).to match(/United Trust \(UT\) products > Application Related.*NonUT products > Application Related.*NonUT products > Fee Related.*United Trust \(UT\) products > Staff Related.*null > Staff Related/m)
end


When (/there is less than 5 categories in the category graph/) do
    parent_elements = all("g[transform='translate(250,10)']")  # Get all matching elements
    parent_element = parent_elements.first  # Select the first element
    expect(page).to have_content("null > Staff Related")
end


Then (/I should see only those categories/) do
    parent_elements = all("g[transform='translate(250,10)']")  # Get all matching elements
    parent_element = parent_elements.first  # Select the first element
    expect(page).to have_content("null > Staff Related")
end
    
