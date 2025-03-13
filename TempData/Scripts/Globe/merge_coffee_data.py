import pandas as pd
import json
import os

# Corrected file paths
base_path = os.path.dirname(os.path.abspath(__file__))  # Get script directory
csv_file_path = os.path.join(base_path, "../data/globe_data.csv")  # Adjusted path
json_file_path = os.path.join(base_path, "../data/coffee_locations.json")  # Adjusted path
output_json_path = os.path.join(base_path, "../data/merged_coffee_data.json")  # Output file

# Check if files exist
if not os.path.exists(csv_file_path):
    print(f"❌ CSV file not found: {csv_file_path}")
    exit()
if not os.path.exists(json_file_path):
    print(f"❌ JSON file not found: {json_file_path}")
    exit()

# Load CSV data
df = pd.read_csv(csv_file_path)
df.columns = df.columns.str.strip()  # Clean column names

# Load JSON data (country coordinates)
with open(json_file_path, "r") as json_file:
    location_data = json.load(json_file)

# List to store merged data
merged_data = []

# Iterate through CSV rows and match with coordinates
for _, row in df.iterrows():
    country = str(row["Producer Country"]).strip() if pd.notna(row["Producer Country"]) else "Unknown"
    variety = str(row["Variety"]).strip() if pd.notna(row["Variety"]) else "Unknown"
    name = str(row["Name"]).strip() if pd.notna(row["Name"]) else "Unknown"
    
    if country in location_data:  
        merged_data.append({
            "name": name,
            "variety": variety,
            "country": country,
            "lat": location_data[country]["lat"],
            "lng": location_data[country]["lng"]
        })

# Save merged data as JSON
if merged_data:
    with open(output_json_path, "w") as json_output:
        json.dump(merged_data, json_output, indent=4)
    print(f"✅ Merged data saved to: {output_json_path}")
else:
    print("❌ No matching data found. Check country names.")