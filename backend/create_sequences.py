import pandas as pd
import numpy as np

df = pd.read_csv(
    "datasets/track_data/indian_ocean_clean.csv"
)

df = df.sort_values(
    ["SID", "ISO_TIME"]
)

sequence_length = 5

X = []
y = []

for sid in df["SID"].unique():

    storm = df[df["SID"] == sid]

    coords = storm[["LAT", "LON"]].values

    if len(coords) < sequence_length + 1:
        continue

    for i in range(len(coords) - sequence_length):

        X.append(
            coords[i:i+sequence_length]
        )

        y.append(
            coords[i+sequence_length]
        )

X = np.array(X)
y = np.array(y)

print("X Shape:", X.shape)
print("y Shape:", y.shape)

np.save("datasets/track_data/X.npy", X)
np.save("datasets/track_data/y.npy", y)

print("Saved Successfully")