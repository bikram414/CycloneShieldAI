import os
import cv2
import numpy as np

DATASET = (
    "datasets/cyclone_images/"
    "insat3d_ir_cyclone_ds/"
    "CYCLONE_DATASET_INFRARED"
)

eye_count = 0
spiral_count = 0
disorganized_count = 0

files = [
    f for f in os.listdir(DATASET)
    if f.endswith(".jpg")
]

for file in files:

    path = os.path.join(DATASET, file)

    image = cv2.imread(path)

    gray = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2GRAY
    )

    cloud_density = (
        np.mean(gray) / 255
    ) * 100

    dark_pixels = np.sum(
        gray < 60
    )

    eye_score = (
        dark_pixels / gray.size
    ) * 100

    if eye_score > 1.5:
        eye_count += 1

    elif cloud_density > 50:
        spiral_count += 1

    else:
        disorganized_count += 1

total = (
    eye_count +
    spiral_count +
    disorganized_count
)

print({
    "eye": round(
        eye_count * 100 / total,
        2
    ),
    "spiral": round(
        spiral_count * 100 / total,
        2
    ),
    "disorganized": round(
        disorganized_count * 100 / total,
        2
    )
})