from unidecode import unidecode
from pymongo import MongoClient
import pandas as pd

big_df = pd.read_csv('all_cue_cards.csv')
client = MongoClient("mongodb+srv://jake123:GRBcVTSxB2AXh9H6@cluster0.ojx9tbc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

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

big_df['NormalName'] = big_df['Name'].apply(remove_accents_unidecode)
big_df['NormalName'] = big_df['NormalName'].str.lower()

db = client['test']
collection = db['cardnames']

list_of_dicts = big_df.to_dict(orient='records')

result = collection.insert_many(list_of_dicts)