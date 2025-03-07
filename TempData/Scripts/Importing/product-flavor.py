from pathlib import Path
import requests
import json

'''
Get unique products from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

product_flavor_links = [
    {
        'beanId': coffee['beanId'], 
        'flavors': coffee['flavors']
    }
    for coffee in data if coffee.get('flavors')
]

print(product_flavor_links)

'''
Import using Backend API endpoint.
'''
url = 'http://localhost:8080/api/products/link-flavors'
headers = {'Content-Type': 'application/json'}
response = requests.post(url,
                         headers=headers,
                         json=product_flavor_links
                         )
print('Status code:', response.status_code)
print('Response body:', response.text)
