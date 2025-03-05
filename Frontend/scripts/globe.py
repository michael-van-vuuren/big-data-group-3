import json
import pandas as pd
from collections import Counter

# Define the file path
json_file_path = "TempData/coffee-bean-products-v2.json"  # Adjust path as needed

# Load the JSON file
with open(json_file_path, "r", encoding="utf-8") as file:
    data = json.load(file)

# Extract relevant fields with safe handling for NoneType
raw_data = [
    {
        "Name": entry.get("Name", "N/A"),
        "Variety": entry.get("Variety", "N/A"),
        "Flavors": ", ".join(entry.get("Flavors", []) if isinstance(entry.get("Flavors"), list) else []),
        "Producer Country": entry.get("Producer Country", [])
    }
    for entry in data
]

# Create a mapping of variety to the most common producer country
variety_country_map = {}
for entry in raw_data:
    variety = entry["Variety"]
    countries = entry["Producer Country"]
    if not isinstance(countries, list):
        continue  # Skip invalid data
    # Do not count duplicates if already present in the list (optional: remove duplicates before counting)
    countries_unique = countries  # Alternatively: list(set(countries))
    if variety not in variety_country_map:
        variety_country_map[variety] = []
    variety_country_map[variety].extend(countries_unique)

# Select the most common producer country for each variety
for variety, country_list in variety_country_map.items():
    most_common_country = Counter(country_list).most_common(1)[0][0]  # Get the most frequent country
    variety_country_map[variety] = most_common_country

# Apply the mapping to the dataset so each entry has only one Producer Country per variety
cleaned_data = [
    {
        "Name": entry["Name"],
        "Variety": entry["Variety"],
        "Flavors": entry["Flavors"],
        "Producer Country": variety_country_map.get(entry["Variety"], "Unknown")
    }
    for entry in raw_data
]

# Convert to a DataFrame for analysis
df = pd.DataFrame(cleaned_data)

# Option 1: If you want to keep all rows (with the mapped Producer Country)
df.to_csv("Frontend/data/globe_data_all.csv", index=False)
print("All data saved to 'Frontend/data/globe_data_all.csv'")
print(df.head())

# Option 2: If you want to have only one row per variety (no duplicates in variety)
df_unique = df.drop_duplicates(subset=["Variety"]).reset_index(drop=True)
df_unique.to_csv("Frontend/data/globe_data.csv", index=False)
print("Unique variety data saved to 'Frontend/data/globe_data.csv'")
print(df_unique.head())