import os

folder = "datasets/cyclone_images"

for root, dirs, files in os.walk(folder):
    print(root, len(files))