import pandas as pd
import json

df = pd.read_csv('cue_album_codes_to_names.csv')
df.columns = ['label', 'value', 'album']

# Convert DataFrame to a list of lists
json_result = df.to_json(orient='records')


parsed_json = json.loads(json_result)

# Print each record on a new line
for record in parsed_json:
    formatted_record = '{' + ', '.join(f"{key}: {json.dumps(value)}" for key, value in record.items()) + '},'
    print(formatted_record)
