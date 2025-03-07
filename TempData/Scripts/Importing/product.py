from pathlib import Path
import requests
import json

'''
Get unique products from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

'''
Import using Backend API endpoint.
'''
url = 'http://localhost:8080/api/products/import'
headers = {'Content-Type': 'application/json'}
response = requests.post(url,
                         headers=headers,
                         json=data
                         )
print('Status code:', response.status_code)
print('Response body:', response.text)
