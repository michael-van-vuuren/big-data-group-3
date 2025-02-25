import json
import re

with open('./data/coffee-bean-products-v1.json', 'r') as f:
    coffee_data = json.load(f)

'''
Step 1. Rename keys (use cmd+F or regex)
# new_name_map = {
#     'Region/Area': 'Producer Region',
#     'General Tag': 'Producer Tag',
#     'Processing Method': 'Process',
#     'Elevation (MASL)': 'Elevation',
#     'Origin Country': 'Producer Country',
#     'Image URL': 'Image'
# }
'''

'''
Step 2. Order columns
'''
def reorder_json_keys(json_data, key_order):
    reordered_data = []
    for entry in json_data:
        reordered_entry = {key: entry[key] for key in key_order if key in entry}
        reordered_data.append(reordered_entry)
    return reordered_data

key_order = [
    # product info
    'Bean ID', 
    'Name', 
    'Date Added',  
    'Variety', 
    'Roast Degree',
    'Price', 
    'Gram', 
    'Price per Cup', 
    'Bulk Price per Cup', 
    'Availability', 
    'Webpage', 
    'Image', 
    'Flavors',
    # roast info
    'Roaster', 
    'Roaster Country',
    # 'Roaster Region' # Dropped
    # process info
    'Process', 
    'Process Tag', 
    # production info
    'Producer', 
    'Producer Tag', 
    'Producer Country', 
    'Producer Region',
    'Elevation'
]

reordered_coffee_data = reorder_json_keys(coffee_data, key_order)

'''
Step 3. Split delimited strings into arrays 
'''

def clean(entry, key):
    v = entry.get(key, '')
    if not v:
        return None

    v_split = re.split(r'[,\/-]', re.sub(r'\s*([,\/-])\s*', r'\1', v))
    cleaned_values = {i.strip().title() for i in v_split if i.strip()}
    
    if cleaned_values: 
        return list(cleaned_values)
    else:
        return None

for entry in reordered_coffee_data:
    for key in ['Producer Region', 'Producer Country', 'Producer Tag', 'Roast Degree', 'Roaster Country', 'Process Tag']:
        entry[key] = clean(entry, key)         

with open('./data/coffee-bean-products-v2.json', 'w', encoding='utf-8') as f:
    json.dump(reordered_coffee_data, f, ensure_ascii=False, indent=4)
