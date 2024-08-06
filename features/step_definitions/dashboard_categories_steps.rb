And (/I should see 5 subcategories with the most negative sentiments/) do
    expect(page).to have_content("digiPortfolio > Technical / System Related") 
    expect(page).to have_content("digiPortfolio > Charges / Fees & Interest")
    expect(page).to have_content("digiPortfolio > Ui / Ux")
    expect(page).to have_content("Vickers > Staff Related")
    expect(page).to have_content("digiPortfolio > Process Related")
end

And(/with the 5 most negative sentiments sorted in descending order/) do
    parent_elements = all("g[transform='translate(250,10)']")
    parent_element = parent_elements.first
    
    content = parent_element.text.gsub(/\s+/, ' ').strip  # Replace multiple spaces and newlines with a single space
    
    expected_text = [
    "digiPortfolio > Technical / System Related",
    "digiPortfolio > Charges / Fees & Interest",
    "digiPortfolio > Ui / Ux",
    "Vickers > Staff Related",
    "digiPortfolio > Process Related"
    ].join(' ')
    
    expect(content).to include(expected_text)
end  

When (/there are less than 5 categories in the category graph/) do
    expect(page).to have_no_css("g[transform='translate(0,122)']")
end

Then (/I should see only those categories/) do
    expect(page).to have_content("Vickers > Others")
    expect(page).to have_content("Vickers > Process Related")
end
