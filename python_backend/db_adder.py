from pymongo import MongoClient
import pandas as pd

big_df = pd.read_csv('all_cue_cards.csv')

# Connect to MongoDB
client = MongoClient("mongodb+srv://<username>:<password>@<app_connection>/?retryWrites=true&w=majority&appName=<appName>")
db = client['test']
collection = db['cardnames']

list_of_dicts = big_df.to_dict(orient='records')

result = collection.insert_many(list_of_dicts)