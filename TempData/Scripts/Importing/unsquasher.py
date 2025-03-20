from pathlib import Path
import json

def expand_attributes(data, attributes_to_expand):
    '''
    Expand attributes in the data that are strings into lists.
    The string will be split on commas to form a list.
    '''
    for obj in data:
        for attr in attributes_to_expand:
            if attr in obj and isinstance(obj[attr], str):
                obj[attr] = [item.strip() for item in obj[attr].split(',')]
    return data

input_file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products.json'
output_file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products.json'

with open(input_file_path, 'r', encoding='utf-8') as f:
    json_data = json.load(f)

attributes = ['producer']
processed_data = expand_attributes(json_data, attributes)

with open(output_file_path, 'w', encoding='utf-8') as f:
    json.dump(processed_data, f, indent=4)
