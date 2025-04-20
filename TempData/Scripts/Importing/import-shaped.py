from pathlib import Path
import requests
import json
import time

file_path = Path(__file__).resolve().parents[2] / 'shaped-coffee-bean-products.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

payload = [entry["product"] for entry in data]

print(json.dumps(payload, indent=2))

def add_products(payload):
    '''Add products using Backend API endpoint.'''
    url = 'http://localhost:8080/api/products/import'
    headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()

        print('Status code:', response.status_code)
        print('Response body:', response.text)
    except requests.exceptions.HTTPError as http_err:
        print('HTTP error occurred:', http_err)
        print('Response content:', response.text)
    except requests.exceptions.RequestException as req_err:
        print('Request error occurred:', req_err)
    except Exception as err:
        print('Unexpected error:', err)
    finally:
        end_time = time.time()
        print(f'Time taken: {end_time - start_time:.4f} seconds')

add_products(payload)
