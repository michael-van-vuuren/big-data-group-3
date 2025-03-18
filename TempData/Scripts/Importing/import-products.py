from pathlib import Path
import requests
import json

'''
Get unique products from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'test-coffee-bean-products.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

payload = data

print(payload)

def add_products(payload):
    '''Add products using Backend API endpoint.'''
    url = 'http://localhost:8080/api/products/import'
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url,
                            headers=headers,
                            json=payload
                            )
    print('Status code:', response.status_code)
    print('Response body:', response.text)

def update_products(payload):
    '''Update products using Backend API endpoint.'''
    url = 'http://localhost:8080/api/products/import'
    headers = {'Content-Type': 'application/json'}
    response = requests.put(url,
                            headers=headers,
                            json=payload
                            )
    print('Status code:', response.status_code)
    print('Response body:', response.text)

add_products(payload)
# update_products(payload)
