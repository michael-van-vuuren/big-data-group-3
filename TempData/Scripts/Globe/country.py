import pandas as pd
import json
import os
from opencage.geocoder import OpenCageGeocode
import time

# Define file paths
data_folder = "Frontend/data"
csv_file = os.path.join(data_folder, "globe_data.csv")
json_file = os.path.join(data_folder, "coffee_locations.json")

# Ensure data folder exists
os.makedirs(data_folder, exist_ok=True)

# Read the CSV file
df = pd.read_csv(csv_file)

# Standardize column names
df.columns = df.columns.str.strip()

# Extract unique producer countries
df["Producer Country"] = df["Producer Country"].astype(str)
producer_countries = df["Producer Country"].dropna().unique()

# Initialize OpenCage API
opecage_api_key = "b47534598d7942049d70f9bc1a174639"
geocoder = OpenCageGeocode(opecage_api_key)

# Dictionary to store country coordinates
country_coordinates = {}

def get_coordinates(country):
    """Fetch latitude and longitude for a given country."""
    try:
        location = geocoder.geocode(country, timeout=10)
        if location:
            return {"lat": location[0]["geometry"]["lat"], "lng": location[0]["geometry"]["lng"]}
    except Exception as e:
        print(f"Error fetching coordinates for {country}: {e}")
    return None

# Clean country names and fetch coordinates
for entry in producer_countries:
    country_list = [c.strip() for c in entry.replace("&", ",").replace("|", ",").replace("+", ",").replace(";", ",").split(",")]
    
    for country in country_list:
        if country and country not in country_coordinates:
            coords = get_coordinates(country)
            if coords:
                country_coordinates[country] = coords
            time.sleep(1)  # Pause to avoid hitting API rate limits

# Save as JSON
with open(json_file, "w") as f:
    json.dump(country_coordinates, f, indent=4)

print(f"JSON file saved: {json_file}")
