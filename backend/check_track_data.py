# backend/check_track_data.py

import pandas as pd

df = pd.read_csv(
    "datasets/track_data/indian_ocean_clean.csv"
)

print(df.columns.tolist())
print(df.head())