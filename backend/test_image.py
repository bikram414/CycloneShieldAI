import cv2

image = cv2.imread(
    "datasets/cyclone_images/insat3d_ir_cyclone_ds/CYCLONE_DATASET_INFRARED/25.jpg"
)

print(image is not None)