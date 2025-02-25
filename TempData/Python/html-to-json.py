from bs4 import BeautifulSoup
import json
import re

def html_table_to_json(input_file, output_file):
    # every object in JSON array must have these
    required_keys = {
        "Bean ID": None,
        "Date Added": None,
        "Roaster": None,
        "Roast Degree": None,
        "Origin Country": None,
        "Region/Area": None,
        "Elevation (MASL)": None,
        "Variety": None,
        "Processing Method": None,
        "Producer": None,
        "Tasting Notes": None,
        "General Tasting Notes": None,
        "General Tag": None,
        "Process Tag": None,
        "Price": None,
        "Gram": None,
        "Price per Cup": None,
        "Bulk Price per Cup": None,
        "Roaster Region": None,
        "Roaster Country": None,
        "Availability": None,
        "Name": None,
        "Webpage": None,
        "Image URL": None
    }

    with open(input_file, 'r', encoding='utf-8') as file:
        soup = BeautifulSoup(file.read(), 'html.parser')
    
    table = soup.find('table', {'id': 'filterable-table'})
    headers = [th.text.strip() for th in table.find_all('th')]
    exclude = {'Roast Name', 'Image'}
    
    rows = []
    for tr in table.find('tbody').find_all('tr'):
        cells = tr.find_all('td')
        row_data = required_keys.copy()
        
        for i, cell in enumerate(cells):
            text = re.sub(r'\s+', ' ', ' '.join(cell.stripped_strings).strip()) or None
            if text == '-':
                text = None
            link = cell.find('a', href=True)
            img = cell.find('img', src=True)
            
            if headers[i] == 'Roast Name' and link:
                row_data['Name'] = text
                row_data['Webpage'] = link['href'] if link['href'] else None
            elif headers[i] == 'Image' and img:
                row_data['Image URL'] = img['src'] if img['src'] else None
            elif headers[i] not in exclude:
                row_data[headers[i]] = text
        
        rows.append(row_data)
    
    with open(output_file, 'w', encoding='utf-8') as json_file:
        json.dump(rows, json_file, indent=4, ensure_ascii=False)

input_path = './coffee-bean-products.html'
output_path = './coffee-bean-products.json'

print('Converting HTML to JSON...')
html_table_to_json(input_path, output_path)
print('All done!')
