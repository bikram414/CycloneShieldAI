import os
import random


def get_random_cyclone_sample():

    ir_folder = (
        "datasets/cyclone_images/"
        "insat3d_ir_cyclone_ds/"
        "CYCLONE_DATASET_INFRARED"
    )

    raw_folder = (
        "datasets/cyclone_images/"
        "insat3d_raw_cyclone_ds/"
        "CYCLONE_DATASET_FINAL"
    )

    ref_folder = (
        "datasets/cyclone_images/"
        "insat3d_for_reference_ds/"
        "CYCLONE_DATASET"
    )

    ir_images = [
        img for img in os.listdir(ir_folder)
        if img.endswith(".jpg")
    ]

    selected = random.choice(ir_images)

    image_id = selected.split(".")[0]

    return {
        "id": image_id,
        "ir": f"{ir_folder}/{image_id}.jpg",
        "raw": f"{raw_folder}/{image_id}.jpg",
        "reference": f"{ref_folder}/{image_id}.jpeg",
    }