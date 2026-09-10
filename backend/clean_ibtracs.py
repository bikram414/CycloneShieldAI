import pandas as pd

df = pd.read_csv(
    "datasets/track_data/ibtracs.ALL.list.v04r01.csv",
    low_memory=False
)

df = df.iloc[1:].copy()

cols = [
    "LAT",
    "LON",
    "WMO_WIND",
    "WMO_PRES"
]

for c in cols:
    df[c] = pd.to_numeric(df[c], errors="coerce")

print(df[cols].dtypes)

print("\nMissing:")
print(df[cols].isnull().sum())