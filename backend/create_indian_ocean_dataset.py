import pandas as pd

df = pd.read_csv(
    "datasets/track_data/ibtracs.ALL.list.v04r01.csv",
    low_memory=False
)

# remove units row
df = df.iloc[1:].copy()

# keep only North Indian Ocean cyclones
df = df[df["BASIN"] == "NI"]

# keep only required columns
df = df[
    [
        "SID",
        "NAME",
        "ISO_TIME",
        "LAT",
        "LON"
    ]
]

# convert coordinates
df["LAT"] = pd.to_numeric(df["LAT"], errors="coerce")
df["LON"] = pd.to_numeric(df["LON"], errors="coerce")

# remove invalid rows
df = df.dropna()

print(df.head())
print("\nRows:", len(df))

df.to_csv(
    "datasets/track_data/indian_ocean_clean.csv",
    index=False
)

print("\nSaved Successfully")