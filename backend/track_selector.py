# backend/track_selector.py

import pandas as pd
import random


df = pd.read_csv(
    "datasets/track_data/indian_ocean_clean.csv"
)


def get_random_track():

    cyclone_ids = df["SID"].unique()

    random_sid = random.choice(cyclone_ids)

    cyclone = df[
        df["SID"] == random_sid
    ]

    cyclone = cyclone.sort_values(
        "ISO_TIME"
    )

    if len(cyclone) < 6:
        return get_random_track()

    positions = cyclone[
        ["LAT", "LON"]
    ].values.tolist()

    return {
        "sid": random_sid,
        "name": cyclone.iloc[0]["NAME"],
        "positions": positions[-5:]
    }