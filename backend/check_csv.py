import pandas as pd

df = pd.read_csv("datasets/cyclone_images/insat_3d_ds - Sheet.csv")

print(df.head())
print("\n")
print(df.columns)
print("\nRows:", len(df))