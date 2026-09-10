import pandas as pd

df = pd.read_csv(
    "datasets/track_data/ibtracs.ALL.list.v04r01.csv",
    low_memory=False
)

print("Total Rows:", len(df))
print("\nColumns:\n")
print(df.columns.tolist())

print("\nFirst 5 Rows:\n")
print(df.head())