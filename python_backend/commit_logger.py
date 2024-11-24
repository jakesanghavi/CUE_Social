import pandas as pd
from io import StringIO

'''
Generate git commit log with desired info. Change --since as needed:
git log --since="last year" --pretty=format:'%h,%an,%ad,%s' --date=format:'%Y-%m-%d' --shortstat | sed '/^$/d' > log.csv
'''

with open('log.csv', 'r') as file:
    content = file.read()

# Replace the newline delimiter with commas
# Ensure we only replace newlines that should be treated as delimiters
content = content.replace('\n', ',').replace(',,', '\n')

content_list = content.split(',')

newlist = []
running_el = []

for i in range(len(content_list)):
    if len(content_list[i]) == 7 and len(running_el) != 0:
        newlist.append(running_el[:7])
        running_el = [content_list[i]]
    else:
        running_el.append(content_list[i])
else:
    newlist.append(running_el[:7])
    
out_df = pd.DataFrame(data=newlist, columns=['ID', 'Author', 'Date', 'Description', 'File Changed', 'Insertions', 'Deletions'])
out_df = out_df.drop(columns=['ID', 'Author'])
out_df = out_df.sort_values(by=['Date'], ascending=True)

out_df['Insertions'] = out_df['Insertions'].replace(["", "None", None], "0 insertions(+)")
out_df['Deletions'] = out_df['Deletions'].replace(["", "None", None], "0 deletions(-)")

out_df = out_df.applymap(lambda x: x.strip() if isinstance(x, str) else x)
out_df = out_df.reset_index(drop=True)

out_df.to_csv('all_commits_log.csv', index=False)

'''Pretty print for discord message: https://www.tablesgenerator.com/text_tables#'''