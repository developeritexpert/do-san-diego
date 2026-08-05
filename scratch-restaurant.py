import uuid
import yaml
import os
import shutil

# 1. Create restaurantEntry type
stay_entry_path = 'config/project/entryTypes/stayEntry--de0bd869-f21d-46e5-aa74-ca11132b4993.yaml'
with open(stay_entry_path, 'r') as f:
    stay_entry = yaml.safe_load(f)

new_uid = str(uuid.uuid4())
stay_entry['handle'] = 'restaurantEntry'
stay_entry['name'] = 'Restaurant Entry'
# Generate new UIDs for field layout and tabs
layout_key = list(stay_entry['fieldLayouts'].keys())[0]
new_layout_uid = str(uuid.uuid4())
stay_entry['fieldLayouts'][new_layout_uid] = stay_entry['fieldLayouts'].pop(layout_key)

for tab in stay_entry['fieldLayouts'][new_layout_uid]['tabs']:
    tab['uid'] = str(uuid.uuid4())
    for el in tab['elements']:
        el['uid'] = str(uuid.uuid4())

restaurant_entry_path = f'config/project/entryTypes/restaurantEntry--{new_uid}.yaml'
with open(restaurant_entry_path, 'w') as f:
    yaml.dump(stay_entry, f, sort_keys=False)

# 2. Update restaurants section
restaurants_section_path = 'config/project/sections/restaurants--d32f2708-7d30-4a14-a8bc-5514eeba7dac.yaml'
with open(restaurants_section_path, 'r') as f:
    restaurants_section = yaml.safe_load(f)

# Add new entry type to section
restaurants_section['entryTypes'].append({'uid': new_uid})

# Change template to _shared/listing-page.twig
site_key = list(restaurants_section['siteSettings'].keys())[0]
restaurants_section['siteSettings'][site_key]['template'] = '_shared/listing-page.twig'

with open(restaurants_section_path, 'w') as f:
    yaml.dump(restaurants_section, f, sort_keys=False)

print("Created restaurantEntry and updated restaurants section.")
