from pathlib import Path
import requests
import json

'''
Get unique flavors from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

flavors_set = set()
for coffee in data:
    if 'Flavors' in coffee:
        flavors_set.update(coffee['Flavors'])

unique_flavors = list(flavors_set)
print(unique_flavors)

'''
Import using Backend API endpoint.
'''
url = 'http://localhost:8080/api/flavors/import'
headers = {'Content-Type': 'application/json'}
response = requests.post(url,
                         headers=headers,
                         json=unique_flavors
                         )
print('Status code:', response.status_code)
print('Response body:', response.text)
