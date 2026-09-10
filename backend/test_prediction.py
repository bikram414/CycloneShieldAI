import numpy as np
from tensorflow.keras.models import load_model

# Load model
model = load_model(
    "models/cyclone_path_lstm.keras"
)

# Load dataset
X = np.load(
    "datasets/track_data/X.npy"
)

y = np.load(
    "datasets/track_data/y.npy"
)

# Pick one sample
sample = X[0].reshape(1,5,2)

prediction = model.predict(sample)

print("\nPast 5 Positions:")
print(X[0])

print("\nActual Next Position:")
print(y[0])

print("\nPredicted Next Position:")
print(prediction[0])