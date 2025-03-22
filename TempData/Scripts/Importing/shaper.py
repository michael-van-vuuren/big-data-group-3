from pathlib import Path
import json

def shape(entry):
    return {
        "product": {
            "beanId": entry.get("beanId"),
            "name": entry.get("name"),
            "image": entry.get("image"),
            "webpage": entry.get("webpage"),
            "gram": entry.get("gram"),
            "roastDegree": entry.get("roastDegree"),
            "availability": entry.get("availability", "").upper() if entry.get("availability") else None,
            "price": entry.get("price"),
            "pricePerCup": entry.get("pricePerCup"),
            "bulkPricePerCup": entry.get("bulkPricePerCup"),
            "roaster": {
                "name": entry.get("roaster"),
                "country": entry.get("roasterCountry")
            } if entry.get("roaster") else None,
            "process": {
                "name": entry.get("process"),
                "tag": entry.get("processTag")
            } if entry.get("process") else None,
            "flavors": [{"name": flavor} for flavor in (entry.get("flavors") or [])],
            "producers": [
                {
                    "name": producer,
                    "elevation": entry.get("elevation"),
                    "tag": entry.get("producerTag"),
                    "regions": [{"name": region} for region in (entry.get("producerRegion") or [])],
                    "countries": [{"name": country} for country in (entry.get("producerCountry") or [])]
                }
                for producer in (entry.get("producer") or [])
            ]
        }
    }

input_file = Path(__file__).resolve().parents[2] / 'normalized-coffee-bean-products.json'
output_file = Path(__file__).resolve().parents[2] / 'shaped-coffee-bean-products.json'

with open(input_file, 'r', encoding='utf-8') as f:
    data = json.load(f)

shaped_data = [shape(entry) for entry in data]

with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(shaped_data, f, indent=4, ensure_ascii=False)

print(f'Shaped data saved to {output_file}')
