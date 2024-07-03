import pandas as pd
import requests
from bs4 import BeautifulSoup

for album in albums:
    # URL of the website with the tables
    url = f'https://cards-the-universe-and-everything.fandom.com/wiki/{album}'  # replace with the target URL

    # Request the webpage
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')

    # Find all tables on the webpage
    tables = soup.find_all('table')

    # List to hold each table's DataFrame
    dfs = []

    # Iterate through each table and read it into a DataFrame
    for table in tables:
        dfs.append(pd.read_html(str(table))[0])  # read_html returns a list of DataFrames

    # Concatenate all DataFrames into one big DataFrame
    big_df = pd.concat(dfs, ignore_index=True)
    
    big_df.columns = ['Code', 'Name', 'Rarity', 'Type']

    # Save the combined DataFrame to a CSV file
    big_df.to_csv(f'{album}.csv', index=False)
    
dfs = []

for album in albums:
    df = pd.read_csv(f'{album}.csv')
    dfs.append(df)
    
big_df = pd.concat(dfs, ignore_index=True)

big_df.to_csv('all_cue_cards.csv', index=False)