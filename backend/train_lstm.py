import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

# Load data
X = np.load("datasets/track_data/X.npy")
y = np.load("datasets/track_data/y.npy")

print("X:", X.shape)
print("y:", y.shape)

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# Model
model = Sequential([
    LSTM(64, input_shape=(5, 2)),
    Dense(32, activation="relu"),
    Dense(2)
])

model.compile(
    optimizer="adam",
    loss="mse",
    metrics=["mae"]
)

early_stop = EarlyStopping(
    monitor="val_loss",
    patience=3,
    restore_best_weights=True
)

history = model.fit(
    X_train,
    y_train,
    validation_split=0.2,
    epochs=20,
    batch_size=64,
    callbacks=[early_stop]
)

# Evaluate
loss, mae = model.evaluate(
    X_test,
    y_test
)

print("\nTest Loss:", loss)
print("Test MAE:", mae)

# Save model
model.save(
    "models/cyclone_path_lstm.keras"
)

print("\nModel Saved Successfully")