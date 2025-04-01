import json
import os

# File Paths (Adjusted correctly)
BASE_PATH = "src/data"
PRODUCTS_FILE = os.path.join(BASE_PATH, "coffee-bean-products-v2.json")
TASTING_NOTES_FILE = os.path.join(BASE_PATH, "tasting-notes-wheel.json")
OUTPUT_FILE = os.path.join(BASE_PATH, "quiz-data.json")


def load_json(file_path):
    """Safely load a JSON file."""
    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except Exception as e:
        print(f"❌ Error loading {file_path}: {e}")
        return None


def merge_data(products, tasting_notes):
    """Merge product and flavor notes data into quiz-friendly format."""
    quiz_data = []

    for bean in products:
        # Defensive checks with fallbacks
        bean_id = bean.get("beanId", "N/A")
        name = bean.get("name", "Unknown")
        variety = bean.get("variety", "Unknown")
        roast = bean.get("roastDegree", "Unknown")
        flavors = bean.get("flavors", [])
        price = bean.get("price", "0")
        producer = bean.get("producer", "Unknown")
        process = bean.get("process", "Unknown")
        country_list = bean.get("producerCountry")
        country = country_list[0] if isinstance(country_list, list) and country_list else "Unknown"
        webpage = bean.get("webpage", "")
        image = bean.get("image", "")

        # Categorize flavors using tasting notes
        categorized_flavors = {}
        if "Notes" in tasting_notes:
            for category, subcategories in tasting_notes["Notes"].items():
                for subcategory, flavor_list in subcategories.items():
                    matched_flavors = [flavor for flavor in flavors if flavor in flavor_list]
                    if matched_flavors:
                        if category not in categorized_flavors:
                            categorized_flavors[category] = []
                        categorized_flavors[category].extend(matched_flavors)

        # Final data structure
        quiz_data.append({
            "id": bean_id,
            "name": name,
            "variety": variety,
            "roast": roast,
            "price": price,
            "process": process,
            "producer": producer,
            "country": country,
            "webpage": webpage,
            "image": image,
            "flavors": flavors,
            "categorized_flavors": categorized_flavors
        })

    return quiz_data


# Load Data
products_data = load_json(PRODUCTS_FILE)
tasting_notes_data = load_json(TASTING_NOTES_FILE)

# Merge & Save
if products_data and tasting_notes_data:
    merged_quiz_data = merge_data(products_data, tasting_notes_data)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as output_file:
        json.dump(merged_quiz_data, output_file, indent=4, ensure_ascii=False)

    print(f"✅ Quiz data successfully saved to: {OUTPUT_FILE}")
else:
    print("❌ Failed to load input files.")