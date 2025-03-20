from pathlib import Path
import requests
import json
import time

'''
Get unique products from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

payload = data

print(payload)

def add_products(payload):
    '''Add products using Backend API endpoint.'''
    url = 'http://localhost:8080/api/products/import'
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    response = requests.post(url, headers=headers, json=payload)
    end_time = time.time()

    print('Status code:', response.status_code)
    print('Response body:', response.text)
    print(f'Time taken: {end_time - start_time:.4f} seconds')

def update_products(payload):
    '''Update products using Backend API endpoint.'''
    url = 'http://localhost:8080/api/products/import'
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    response = requests.post(url, headers=headers, json=payload)
    end_time = time.time()

    print('Status code:', response.status_code)
    print('Response body:', response.text)
    print(f'Time taken: {end_time - start_time:.4f} seconds')


add_products(payload)
# update_products(payload)
