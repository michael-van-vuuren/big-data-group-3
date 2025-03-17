from pathlib import Path
import requests
import json

file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'
with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

attributes = ['roaster', 'roasterCountry']
nonnullable_attribute = attributes[0]
attribute_mapping = {'roasterCountry': 'country'}

roasters_dict = {}
for coffee in data:
    key_value = coffee.get(nonnullable_attribute)
    if key_value:
        roasters_dict.setdefault(key_value, {})
        for attr in attributes[1:]:
            mapped_attr = attribute_mapping.get(attr, attr) 
            roasters_dict[key_value][mapped_attr] = coffee.get(attr)

roasters_payload = [{'name': name, **attrs} for name, attrs in roasters_dict.items()]
print(roasters_payload)

url = 'http://localhost:8080/api/roasters/import'
headers = {'Content-Type': 'application/json'}
response = requests.post(url, headers=headers, json=roasters_payload)

print('Status code:', response.status_code)
print('Response body:', response.text)
