import json
from pathlib import Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd


# Extract product info
def product_to_text(product, weights=None):
    def get_nested(d, *keys):
        for key in keys:
            d = d.get(key) if isinstance(d, dict) else None
        return d or ""

    if weights is None:
        weights = {
            "name": 1,
            "roaster_name": 1,
            "roaster_country": 4,
            "process": 3,
            "flavor": 5,
            "producer_name": 2,
            "producer_tag": 1,
            "region": 3,
            "producer_country": 4
        }

    parts = []

    # Product name
    parts.extend([product.get("name", "")] * weights["name"])

    # Roaster
    parts.extend([get_nested(product, "roaster", "name")] * weights["roaster_name"])
    parts.extend([get_nested(product, "roaster", "country")] * weights["roaster_country"])

    # Process
    parts.extend([get_nested(product, "process", "name")] * weights["process"])
    parts.extend([get_nested(product, "process", "tag")] * weights["process"])

    # Flavors
    for flavor in product.get("flavors", []):
        parts.extend([flavor.get("name", "")] * weights["flavor"])

    # Producers
    for producer in product.get("producers", []):
        parts.extend([producer.get("name", "")] * weights["producer_name"])
        parts.extend([producer.get("tag", "")] * weights["producer_tag"])
        for region in producer.get("regions", []):
            parts.extend([region.get("name", "")] * weights["region"])
        for country in producer.get("countries", []):
            parts.extend([country.get("name", "")] * weights["producer_country"])

    return " ".join(filter(None, parts))



# Load products
def load_products(json_path, weights=None):
    path = Path(json_path)
    with open(path, "r", encoding="utf-8") as f:
        raw_data = json.load(f)

    products = []
    texts = []

    for item in raw_data:
        product = item.get("product", {})
        products.append(product)
        texts.append(product_to_text(product, weights))

    return products, texts



# Algorithm
class CoffeeRecommender:
    def __init__(self, json_path, weights=None):
        self.weights = weights
        self.products, self.texts = load_products(json_path, weights)
        self.vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        self.tfidf_matrix = self.vectorizer.fit_transform(self.texts)

    def recommend(self, new_product, top_k=5):
        new_text = product_to_text(new_product, self.weights)
        new_vec = self.vectorizer.transform([new_text])
        sims = cosine_similarity(new_vec, self.tfidf_matrix).flatten()
        top_indices = np.argsort(sims)[::-1][:top_k]
        return [(self.products[i], sims[i]) for i in top_indices]



def product_to_row(product, score):
    def get_nested(d, *keys):
        for key in keys:
            d = d.get(key) if isinstance(d, dict) else None
        return d or ""

    name = product.get("name", "")
    roaster = get_nested(product, "roaster", "name")
    roaster_country = get_nested(product, "roaster", "country")
    process = get_nested(product, "process", "name")

    flavors = ", ".join({f.get("name", "") for f in product.get("flavors", []) if f.get("name")})
    producers = ", ".join({
        p.get("name", "")
        for p in product.get("producers", [])
        if p.get("name")
    })
    producer_countries = ", ".join({
        c.get("name", "")
        for p in product.get("producers", [])
        for c in p.get("countries", [])
        if c.get("name")
    })

    return {
        "Name": name,
        "Roaster": roaster,
        "Roaster Country": roaster_country,
        "Process": process,
        "Flavors": flavors,
        "Producers": producers,
        "Producer Country": producer_countries,
        "Score": round(score, 3)
    }

custom_weights = {
    "name": 1,
    "roaster_name": 1,
    "roaster_country": 4,
    "process": 3,
    "flavor": 5,
    "producer_name": 2,
    "producer_tag": 1,
    "region": 3,
    "producer_country": 4
}

recommender = CoffeeRecommender("./shaped-coffee-bean-products.json", weights=custom_weights)

new_input = {
    "name": None,
    "roaster": {"name": None, "country": "japan"},
    "process": {"name": None, "tag": None},
    "flavors": [{"name": "lemon"}, {"name": "berry"}],
    "producers": [
        {
            "name": None,
            "tag": None,
            "regions": [{"name": None}],
            "countries": [{"name": "ethiopia"}]
        }
    ]
}

print("Recommendations:")
recommendations = recommender.recommend(new_input, top_k=6)
rows = [product_to_row(prod, score) for prod, score in recommendations]
df = pd.DataFrame(rows)
print(df.to_string(index=False))


# Exporting to use in Java 
# (ideally would create a Python REST API and the Python server would recompute tf-idf as a CRON job)

# Save tf-idf matrix
np.save("./Tfidf/tfidf_matrix.npy", recommender.tfidf_matrix.toarray())

# Save idf vector
np.save("./Tfidf/idf.npy", recommender.vectorizer.idf_)

# Save vocabulary
with open("./Tfidf/vocab.json", "w", encoding="utf-8") as f:
    vocab = {key: int(value) for key, value in recommender.vectorizer.vocabulary_.items()}
    json.dump(vocab, f, ensure_ascii=False, indent=2)
