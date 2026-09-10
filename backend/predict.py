import numpy as np
from tensorflow.keras.models import load_model

model = load_model(
    "backend/models/cyclone_path_lstm.keras"
)

def predict_position(positions):

    positions = np.array(
        positions
    ).reshape(1,5,2)

    prediction = model.predict(
        positions,
        verbose=0
    )

    return {
        "predicted_lat": float(prediction[0][0]),
        "predicted_lon": float(prediction[0][1])
    }