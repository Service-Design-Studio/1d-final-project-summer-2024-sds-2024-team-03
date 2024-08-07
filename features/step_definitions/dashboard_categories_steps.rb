And (/I should see 5 subcategories with the most positive sentiments/) do
    expect(page).to have_content("digiPortfolio > Others") 
    expect(page).to have_content("digiPortfolio > Rewards")
    expect(page).to have_content("Vickers > Technical / System Related")
    expect(page).to have_content("digiPortfolio > Saving / Investment Plans")
    expect(page).to have_content("digiPortfolio > Technical / System Related")
end

And(/with the 5 most positive sentiments sorted in descending order/) do
    parent_elements = all("g[transform='translate(250,10)']")
    parent_element = parent_elements.first
    all_children = parent_element.all('g[transform="translate(0,0)"]')
    correct_child = all_children[1]
    
    content = correct_child.text.gsub(/\s+/, ' ').strip

    expected_text = [
        "digiPortfolio > Others",
        "digiPortfolio > Rewards",
        "Vickers > Technical / System Related",
        "digiPortfolio > Saving / Investment Plans",
        "digiPortfolio > Technical / System Related",
    ].reverse
    expected_text = expected_text.join(' ')
    
    expect(content).to include(expected_text)
end  

When (/there are less than 5 categories in the category graph/) do
    expect(page).to have_no_css("g[transform='translate(0,122)']")
end

Then (/I should see only those categories/) do
    expect(page).to have_content("Vickers > Others")
    expect(page).to have_content("Vickers > Process Related")
end
