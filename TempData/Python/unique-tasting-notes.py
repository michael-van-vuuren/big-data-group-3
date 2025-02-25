import json
import sys

def read_json(input_path):
    try:
        with open(input_path, 'r') as file:
            data = json.load(file)
            return data
    except FileNotFoundError:
        print(f'Error: File not found at {input_path}')
        sys.exit()
    except json.JSONDecodeError:
        print(f'Error: Invalid JSON format in {input_path}')
        sys.exit()
    
def extract_tasting_notes(data, key):
    notes_set = set()
    for item in data:
        if notes := item.get(key, ''):
            notes_set.update(s.strip() for s in notes.split(','))
    return notes_set

def write_to_file(filename, notes_set):
    with open(filename, 'w', encoding='utf-8') as f:
        f.write('\n'.join(sorted(notes_set)))

input_path = './coffee-bean-products.json'

data = read_json(input_path)

general_tasting_notes = extract_tasting_notes(data, 'General Tasting Notes')
tasting_notes = extract_tasting_notes(data, 'Tasting Notes')

write_to_file('general_tasting_notes.txt', general_tasting_notes)
write_to_file('tasting_notes.txt', tasting_notes)
