import json
import re
import inflect
from unidecode import unidecode

'''
Step 1. Convert tasting notes wheel to tasting notes ordered list (by word count)
'''
with open('./data/tasting-notes-wheel.json', 'r') as f:
    json_data = json.load(f)

def process_notes(data):
    """Extracts all items from the JSON, sorts them by word count (descending) and alphabetically."""
    result = []
    for _, subcategories in data["Notes"].items():        
        for _, items in subcategories.items():
            sorted_items = sorted(items, key=lambda x: (-len(x.split()), x))
            result.extend(sorted_items) 
    return result

sorted_list = process_notes(json_data)
print(sorted_list)

'''
Step 2. Find matches in tasting notes keys of coffee bean data JSON
'''
def preprocess_text(text):
    text = unidecode(text.lower())
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    return text

def singularize(word):
    return word if word in no_singularization else (p.singular_noun(word) or word)

def match_flavors(text):
    words = preprocess_text(text).split()
    words = [singularize(word) for word in words]
    matched = set()
    text_string = ' '.join(words)

    for phrase in sorted_list:
        lowercase_phrase = phrase.lower()
        if lowercase_phrase in text_string or lowercase_phrase.replace(' ', '') in text_string:
            matched.add(phrase)
            text_string = text_string.replace(lowercase_phrase, '').replace(lowercase_phrase.replace(' ', ''), '')

    unmatched_words.update(text_string.split())

    return list(matched)

def resolve_flavors(flavors):
    singular_flavors = {f for f in flavors if len(f.split()) == 1}
    for f1 in singular_flavors:
        for f2 in flavors - {f1}:
            combined = f1 + " " + f2
            reversed_combined = f2 + " " + f1
            if combined in sorted_list:
                if f1 in flavors: flavors.remove(f1)
                if f2 in flavors: flavors.remove(f2)
                flavors.add(combined)
            elif reversed_combined in sorted_list:
                if f1 in flavors: flavors.remove(f1)
                if f2 in flavors: flavors.remove(f2)
                flavors.add(reversed_combined)
    return flavors

def process_coffee_data(coffee_data):
    to_be_removed = set()
    deleted_entry_count = 0
    for entry in coffee_data:
        flavors = set()
        for key in ['Tasting Notes', 'General Tasting Notes']:
            if key in entry and entry[key]:
                flavors.update(match_flavors(entry[key]))
            del entry[key]

        if flavors:
            entry['Flavors'] = list(resolve_flavors(flavors))
        else:
            to_be_removed.update(entry['Bean ID'])
            deleted_entry_count += 1

    filtered_coffee_data = [entry for entry in coffee_data if entry['Bean ID'] not in to_be_removed]
    print(f'Deleted {deleted_entry_count} entries that did not have taste note information.')
    return filtered_coffee_data

p = inflect.engine()
no_singularization = {"citrus"}

unmatched_words = set()

with open('./data/coffee-bean-products-raw.json', 'r') as f:
    coffee_data = json.load(f)

processed_data = process_coffee_data(coffee_data)

with open('./data/coffee-bean-products-v1.json', 'w') as f:
    json.dump(processed_data, f, indent=4)

with open('./data/unmatched-words.txt', 'w') as f:
    f.write('\n'.join(sorted(unmatched_words)))
