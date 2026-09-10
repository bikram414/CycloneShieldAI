from flask import Flask, request, jsonify
from flask_cors import CORS
from risk import calculate_risk
from predict import predict_position
from recommendation_engine import generate_recommendations
from classification import classify_cyclone
from image_analysis import analyze_cyclone_image
from gemini_helper import generate_briefing
from dataset_loader import get_random_cyclone_sample
from flask import send_from_directory
from track_selector import get_random_track
import random
import os
app = Flask(__name__)

CORS(app)
def determine_landfall(lat, lon):

    # Arabian Sea Region

    if lon < 60:
        return "Oman Coast"

    elif lon < 68:
        return "Pakistan Coast"

    elif lon < 73:
        return "Gujarat Coast"

    elif lon < 76:
        return "Maharashtra Coast"

    elif lon < 78:
        return "Goa-Karnataka Coast"

    # Bay of Bengal Region

    elif lon < 82:
        return "Tamil Nadu Coast"

    elif lon < 85:
        return "Andhra Pradesh Coast"

    elif lon < 88:
        return "Odisha Coast"

    else:
        return "West Bengal Coast"

@app.route("/")
def home():

    return {
        "message":
        "CycloneShield AI Backend Running"
    }

@app.route(
    "/predict",
    methods=["POST"]
)
def predict():

    data = request.json

    positions = data["positions"]

    result = predict_position(
        positions
    )

    return jsonify(result)

@app.route(
    "/risk",
    methods=["POST"]
)
def risk():

    data = request.json

    wind_speed = data["wind_speed"]

    risk = calculate_risk(
        wind_speed
    )

    return jsonify(
        {
            "risk": risk
        }
    )

@app.route("/recommendations", methods=["POST"])
def recommendations():

    data = request.json

    risk = data["risk"]

    recs = generate_recommendations(risk)

    return jsonify({
        "recommendations": recs
    })

@app.route("/classify", methods=["POST"])
def classify():

    result = classify_cyclone()

    return jsonify(result)

@app.route("/analyze-image", methods=["POST"])
def analyze_image():

    sample = get_random_cyclone_sample()

    result = analyze_cyclone_image(
        sample["ir"]
    )

    result["ir_image"] = (
        sample["id"] + ".jpg"
    )

    result["raw_image"] = (
        sample["id"] + ".jpg"
    )

    result["reference_image"] = (
        sample["id"] + ".jpeg"
    )

    return jsonify(result)



@app.route("/generate-briefing", methods=["POST"])
def briefing():

    data = request.json

    briefing = generate_briefing(
        data["category"],
        data["risk"],
        data["landfall"],
        data["eta"]
    )

    return jsonify({
        "briefing": briefing
    })

@app.route("/image/<filename>")
def get_image(filename):

    folder = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "datasets",
            "cyclone_images",
            "insat3d_ir_cyclone_ds",
            "CYCLONE_DATASET_INFRARED"
        )
    )

    print("FOLDER =", folder)
    print("FILE =", filename)

    return send_from_directory(
        folder,
        filename
    )

@app.route("/raw-image/<filename>")
def get_raw_image(filename):

    folder = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "datasets",
            "cyclone_images",
            "insat3d_raw_cyclone_ds",
            "CYCLONE_DATASET_FINAL"
        )
    )

    return send_from_directory(
        folder,
        filename
    )

@app.route("/reference-image/<filename>")
def get_reference_image(filename):

    folder = os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            "..",
            "datasets",
            "cyclone_images",
            "insat3d_for_reference_ds",
            "CYCLONE_DATASET"
        )
    )

    return send_from_directory(
        folder,
        filename
    )

@app.route("/random-track")
def random_track():
    return jsonify(get_random_track())


@app.route("/landfall", methods=["POST"])
def landfall():

    data = request.json

    lat = data["lat"]
    lon = data["lon"]

    location = determine_landfall(lat, lon)

    eta = random.randint(6, 36)

    probability = calculate_landfall_probability(lon)

    return jsonify({
        "location": location,
        "eta_hours": eta,
        "probability": probability
    })

def calculate_landfall_probability(lon):

    if lon < 74:
        return 98

    elif lon < 76:
        return 90

    elif lon < 78:
        return 80

    elif lon < 80:
        return 70

    else:
        return 60

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )

