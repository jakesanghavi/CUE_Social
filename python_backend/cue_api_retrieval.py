import requests
import json
import time
from wakepy import keep
import os
import pandas as pd
from pymongo import MongoClient
from unidecode import unidecode

CUE_CODES_API_ENDPOINT = 'XXXXX'
CUE_CARD_DETAIL_API_PREFIX = 'XXXXXXX'
MONGOSRV = 'XXXXXXXXX'

def remove_accents_unidecode(text):
    """
    Removes accents from team names, specifically Montreal
    Parameters
    ----------
    text (str): the text to be normalized

    Returns
    -------
    The normalized text
    """
    return unidecode(text)

def fetch_card_details(card, max_retries=3, backoff_factor=0.5):
    url = f"{CUE_CARD_DETAIL_API_PREFIX}{card}"
    
    os.makedirs("cue_cards", exist_ok=True)
    filepath = os.path.join("cue_cards", f"{card}.json")
    
    # Skip if the file already exists
    if os.path.exists(filepath):
        print(f"File {filepath} already exists. Skipping...")
        return
    
    for retry in range(max_retries):
        try:
            response = requests.get(url)
            if response.status_code == 200:                
                with open(filepath, 'w') as file:
                    json.dump(card_details, file, indent=4)
                    
                return response.json()  # or response.text if you're expecting text
            else:
                print(f"Request failed with status {response.status_code}. Retrying...")
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}. Retrying...")

        # Exponential backoff
        wait_time = backoff_factor * (2 ** retry)
        print(f"Waiting {wait_time} seconds before retrying...")
        time.sleep(wait_time)
    
    raise Exception(f"Max retries exceeded with {card}")

def transform_type_and_rarity(row):
    type_words = row['type'].split()
    if len(type_words) == 2:
        return pd.Series({'type': type_words[0], 'rarity': type_words[1]})
    else:
        return pd.Series({'type': 'Standard', 'rarity': row['type']})

# List of API endpoints - in this case just the list of card codes
api_urls = [
    CUE_CODES_API_ENDPOINT
]

# List to hold the combined JSON data
combined_data = []

for url in api_urls:
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()  # Convert the response to JSON
        combined_data.append(data)  # Add the JSON data to the list
    else:
        print(f"Failed to fetch data from {url}")

# new list to hold the full card data (rarity, name, ability, etc.) for all cards
full_cards = []

with keep.presenting():
    for i, card in enumerate(data):
        try:
            card_details = fetch_card_details(card)
            if ((i + 1) % 50 == 0):
                print(f"{i+1} - Card name: {card_details['name']}")
            full_cards.append(card_details)
        except Exception as e:
            print(e)

def extract_card_details(directory):
    # List to store the extracted data
    data = []

    # Iterate through each file in the directory
    for filename in os.listdir(directory):
        if filename.endswith(".json"):
            filepath = os.path.join(directory, filename)
            
            # Read the JSON file
            with open(filepath, 'r') as file:
                card_details = json.load(file)
                
                # Extract the desired fields
                card_code = card_details.get('code')
                card_name = card_details.get('name')
                card_type = card_details.get('type')
                
                # Append the data as a new row
                data.append({
                    'code': card_code,
                    'name': card_name,
                    'type': card_type
                })

    # Create a DataFrame from the list of data
    df = pd.DataFrame(data)
    return df

# Specify the directory containing the JSON files
directory = "cue_cards"

# Extract the card details and create a DataFrame
card_df = extract_card_details(directory)
    
# Apply the transformation to each row
card_df[['type', 'rarity']] = card_df.apply(transform_type_and_rarity, axis=1)

card_df.columns = ['Code', 'Name', 'Rarity', 'Type']

card_df['NormalName'] = card_df['Name'].apply(remove_accents_unidecode)
card_df['NormalName'] = card_df['NormalName'].str.lower()

client = MongoClient(MONGOSRV)

db = client['test']
collection = db['cardnamesofficial']

list_of_dicts = card_df.to_dict(orient='records')

result = collection.insert_many(list_of_dicts)