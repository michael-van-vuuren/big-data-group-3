import json
import mysql.connector

# Connect to the MySQL database
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='Snivy1dude$',
    database='coffee_database'
)
cursor = conn.cursor()

# Open and load the JSON file
with open('processed_coffee_data_v2.json', 'r') as file:
    data = json.load(file)

# Prepare your bulk insert query (adjust column names and order to match your table)
insert_query = """
INSERT INTO coffee_profile (
    bean_id, date_added, roaster, roast_degree, origin_country,
    region_area, elevation, variety, processing_method, producer,
    tasting_notes, general_tasting_notes, general_tag, process_tag,
    price, gram, price_per_cup, bulk_price_per_cup, roaster_region,
    roaster_country, availability, name, webpage, image_url
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# Map JSON keys to the table columns
records = [
    (
        item["Bean ID"],
        item["Date Added"],
        item["Roaster"],
        item["Roast Degree"],
        item["Origin Country"],
        item["Region/Area"],
        item["Elevation (MASL)"],
        item["Variety"],
        item["Processing Method"],
        item["Producer"],
        item["Tasting Notes"],
        item["General Tasting Notes"],
        item["General Tag"],
        item["Process Tag"],
        item["Price"],
        item["Gram"],
        item["Price per Cup"],
        item["Bulk Price per Cup"],
        item["Roaster Region"],
        item["Roaster Country"],
        item["Availability"],
        item["Name"],
        item["Webpage"],
        item["Image URL"]
    )
    for item in data
]

# Execute bulk insert in one transaction
cursor.executemany(insert_query, records)
conn.commit()

cursor.close()
conn.close()

print("Data imported successfully!")
