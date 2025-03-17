from pathlib import Path
import json

def squash_attributes(data, attributes_to_squash):
    '''
    Squash attributes in the data that are lists into a single string.
    If the list has more than one element, they will be joined by a comma.
    '''
    for obj in data:
        for attr in attributes_to_squash:
            if attr in obj and isinstance(obj[attr], list):
                obj[attr] = ', '.join(obj[attr])
    return data



input_file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'
output_file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(input_file_path, 'r', encoding='utf-8') as f:
    json_data = json.load(f)

attributes = ['processTag', 'producerTag', 'roasterCountry']
processed_data = squash_attributes(json_data, attributes)

with open(output_file_path, 'w', encoding='utf-8') as f:
    json.dump(processed_data, f, indent=4)
