import requests
import json
import time

CUE_CODES_API_ENDPOINT = 'XXXXX'
CUE_CARD_DETAIL_API_PREFIX = 'XXXXXXX'

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

# Iterate over all card codes
for card in data:
    # Short sleep to not rate limit the API
    time.sleep(0.2)
    # Get the endpoint for the specific card code
    url = f"{CUE_CARD_DETAIL_API_PREFIX}{card}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()  # Convert the response to JSON
        print(f"Card name: {data['name']}")
        full_cards.append(data)  # Add the JSON data to the list
    else:
        print(f"Failed to fetch data from {url}")


# Save the combined JSON data of all of the cards to a file
with open("combined_data.json", "w") as f:
    json.dump(full_cards, f, indent=4)
