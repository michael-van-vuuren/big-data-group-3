import json
import unicodedata
from pathlib import Path


def normalize_string(value):
    if value is None or not isinstance(value, str):
        return value
    normalized = unicodedata.normalize('NFD', value)
    return ''.join([char for char in normalized if not unicodedata.combining(char)]).lower()

def normalize_json(data):
    if isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, (str, list)):
                data[key] = normalize_json(value)
            else:
                data[key] = normalize_string(value)
    elif isinstance(data, list):
        return [normalize_json(item) for item in data]
    elif isinstance(data, str):
        return normalize_string(data)
    return data

file_path = Path(__file__).resolve().parents[2] / 'coffee-bean-products-v2.json'

with open(file_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

normalized_data = normalize_json(data)

normalized_file_path = Path(__file__).resolve().parents[2] / 'normalized-coffee-bean-products.json'
with open(normalized_file_path, 'w', encoding='utf-8') as f:
    json.dump(normalized_data, f, indent=4, ensure_ascii=False)
