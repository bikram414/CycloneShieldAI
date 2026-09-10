# backend/check_image_path.py

import os

for root, dirs, files in os.walk(
    "datasets/cyclone_images"
):
    if "25.jpg" in files:
        print(
            os.path.join(root, "25.jpg")
        )