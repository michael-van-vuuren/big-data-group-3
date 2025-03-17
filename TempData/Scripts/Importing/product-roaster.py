from pathlib import Path
import requests
import json

'''
Get unique products from JSON.
'''
file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

product_roaster_links = [
    {
        'beanId': coffee['beanId'], 
        'roaster': coffee['roaster']
    }
    for coffee in data if coffee.get('roaster')
]

print(product_roaster_links)

'''
Import using Backend API endpoint.
'''
url = 'http://localhost:8080/api/products/link-roasters'
headers = {'Content-Type': 'application/json'}
response = requests.post(url,
                         headers=headers,
                         json=product_roaster_links
                         )
print('Status code:', response.status_code)
print('Response body:', response.text)
