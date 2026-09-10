import os

folder = "datasets/cyclone_images/insat3d_ir_cyclone_ds/CYCLONE_DATASET_INFRARED"

files = os.listdir(folder)

print("Total items:", len(files))

for f in files[:50]:
    print(f)