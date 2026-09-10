import CycloneMap from "./components/CycloneMap";
import { useState } from "react";
import API from "./services/api";
import { motion } from "framer-motion";

function App() {
  const [prediction, setPrediction] = useState(null);

  const [loading, setLoading] = useState(false);
  const [risk, setRisk] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [windSpeed, setWindSpeed] = useState(null);
  const predictedPosition = prediction
    ? [prediction.lat, prediction.lon]
    : null;
  const [classification, setClassification] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [landfall, setLandfall] = useState(null);
  const [briefing, setBriefing] = useState("");
  const [storm, setStorm] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [populationRisk, setPopulationRisk] = useState(null);
  const [images, setImages] = useState({
    ir: "",
    raw: "",
    reference: "",
  });
  const runPrediction = async () => {
    setLoading(true);

    try {
      // 1. Get cyclone track
      const trackResponse = await API.get("/random-track");

      const positions = trackResponse.data.positions;
      const latestPosition = positions[positions.length - 1];

      const newCurrentPosition = [latestPosition[0], latestPosition[1]];

      // 2. Predict position
      const response = await API.post("/predict", {
        positions,
      });

      // 3. Classify cyclone
      const classifyResponse = await API.post("/classify");

      // 4. Wind Speed
      let windSpeedValue = 60;

      if (classifyResponse.data.category === "Very Severe Cyclonic Storm") {
        windSpeedValue = 170;
      } else if (classifyResponse.data.category === "Severe Cyclonic Storm") {
        windSpeedValue = 130;
      } else if (classifyResponse.data.category === "Cyclonic Storm") {
        windSpeedValue = 90;
      }

      // 5. Risk
      const riskResponse = await API.post("/risk", {
        wind_speed: windSpeedValue,
      });

      // 6. Population At Risk
      let populationRiskValue = "0.3M";

      if (riskResponse.data.risk === "CRITICAL") {
        populationRiskValue = "2.5M";
      } else if (riskResponse.data.risk === "HIGH") {
        populationRiskValue = "1.8M";
      } else if (riskResponse.data.risk === "MEDIUM") {
        populationRiskValue = "0.9M";
      }

      // 7. Recommendations
      const recResponse = await API.post("/recommendations", {
        risk: riskResponse.data.risk,
      });

      // 8. Image Analysis
      const analysisResponse = await API.post("/analyze-image");

      // 9. Landfall
      const landfallResponse = await API.post("/landfall", {
        lat: response.data.predicted_lat,
        lon: response.data.predicted_lon,
      });

      // 10. Gemini Briefing
      let briefingText = "Generating AI briefing...";

      API.post("/generate-briefing", {
        category: classifyResponse.data.category,
        risk: riskResponse.data.risk,
        landfall: landfallResponse.data.location,
        eta: `${landfallResponse.data.eta_hours} Hours`,
      })
        .then((res) => {
          setBriefing(
            res.data.briefing.replaceAll("**", "").replaceAll("*", ""),
          );
        })
        .catch(() => {
          setBriefing("AI briefing unavailable.");
        });

      // =========================
      // UPDATE EVERYTHING TOGETHER
      // =========================

      setCurrentPosition(newCurrentPosition);

      setPrediction({
        lat: response.data.predicted_lat,
        lon: response.data.predicted_lon,
      });

      setClassification(classifyResponse.data);

      setWindSpeed(windSpeedValue);

      setRisk(riskResponse.data.risk);

      setPopulationRisk(populationRiskValue);

      setRecommendations(recResponse.data.recommendations);

      setLandfall(landfallResponse.data);

      setImageAnalysis(analysisResponse.data);

      setBriefing(briefingText);

      setImages({
        ir: `http://127.0.0.1:5000/image/${analysisResponse.data.ir_image}`,
        raw: `http://127.0.0.1:5000/raw-image/${analysisResponse.data.raw_image}`,
        reference: `http://127.0.0.1:5000/reference-image/${analysisResponse.data.reference_image}`,
      });
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="p-8"
      >
        <h1 className="text-6xl font-bold mb-2">🌪 CycloneShield AI</h1>

        <p className="text-slate-400 text-lg">
          Real-Time Cyclone Intelligence & Disaster Response Platform
        </p>
        <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
          <span>🟢</span>
          System Online
        </div>
      </motion.div>
      <div className="px-8 pb-6">
        <div className="bg-red-600 rounded-2xl p-5 shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">🚨 NATIONAL CYCLONE ALERT</h2>

              <p className="text-red-100 mt-1">
                Expected Landfall:
                {landfall?.location || "Pending"}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                <span
                  className={
                    risk === "CRITICAL" ? "text-yellow-200" : "text-white"
                  }
                >
                  {risk || "UNKNOWN"}
                </span>
              </p>

              <p>ETA: {landfall?.eta_hours || "--"} Hours</p>
            </div>
          </div>
        </div>
      </div>
      {storm && (
        <div className="px-8 pb-6">
          <div className="bg-slate-900 rounded-2xl p-5">
            <h2 className="text-xl font-bold">Active Cyclone</h2>

            <p className="text-cyan-400 text-2xl mt-2">{storm.name}</p>

            <p className="text-slate-400">Storm ID: {storm.sid}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 p-8">
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
          }}
          className="bg-slate-900 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold">Current Position</h2>

          <p className="mt-4 text-3xl">
            {currentPosition ? currentPosition[0].toFixed(2) : "--"}°N
          </p>

          <p>{currentPosition ? currentPosition[1].toFixed(2) : "--"}°E</p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
          }}
          className="bg-slate-900 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold">Predicted Position</h2>

          <p className="mt-4 text-3xl">
            {prediction ? prediction.lat.toFixed(2) : "--"}°N
          </p>

          <p>{prediction ? prediction.lon.toFixed(2) : "--"}°E</p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
          }}
          className="bg-slate-900 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold">Risk Level</h2>

          <p
            className={`mt-4 text-3xl font-bold ${
              risk === "CRITICAL"
                ? "text-red-500"
                : risk === "HIGH"
                  ? "text-orange-500"
                  : risk === "MEDIUM"
                    ? "text-yellow-500"
                    : "text-green-500"
            }`}
          >
            {risk || "--"}
          </p>
        </motion.div>

        <motion.div
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
          }}
          className="bg-slate-900 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold">Model Accuracy</h2>

          <p className="mt-4 text-3xl">{prediction ? "MAE 0.107" : "--"}</p>
        </motion.div>
      </div>
      <div className="px-8 pb-4">
        <button
          onClick={runPrediction}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Predicting..." : "Run AI Prediction"}
        </button>
      </div>
      {classification && (
        <div className="px-8 pb-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">Cyclone Classification</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400">Category</p>

                <p className="text-xl font-bold">{classification.category}</p>
              </div>

              <div>
                <p className="text-slate-400">Risk</p>

                <p className="text-xl font-bold text-red-500">
                  {classification.risk}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Confidence</p>

                <p className="text-xl font-bold">
                  {classification.confidence}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {landfall && (
        <div className="px-8 pb-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">🌊 Landfall Forecast</h2>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400">Expected Location</p>

                <p className="text-xl font-bold">{landfall.location}</p>
              </div>

              <div>
                <p className="text-slate-400">ETA</p>

                <p className="text-xl font-bold">{landfall.eta_hours} Hours</p>
              </div>

              <div>
                <p className="text-slate-400">Probability</p>

                <p className="text-xl font-bold text-red-400">
                  {landfall.probability}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageAnalysis && (
        <div className="px-8 pb-8 ">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              🛰 Satellite Image Analysis
            </h2>

            <div className="flex justify-between">
              <div>
                <p className="text-slate-400">Cloud Density</p>

                <p className="text-2xl font-bold">
                  {imageAnalysis.cloud_density}%
                </p>
              </div>

              <div>
                <p className="text-slate-400">Eye Detection</p>

                <p className="text-2xl font-bold">
                  {imageAnalysis.eye_detected ? "Detected" : "Not Detected"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Confidence</p>

                <p className="text-2xl font-bold">
                  {imageAnalysis.confidence}%
                </p>
              </div>
              <div>
                <p className="text-slate-400">Pattern</p>

                <p className="text-2xl font-bold">{imageAnalysis.pattern}</p>
              </div>

              <div>
                <p className="text-slate-400">Trend</p>

                <p className="text-2xl font-bold">{imageAnalysis.trend}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {imageAnalysis && (
        <div className="px-8 pb-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              🌀 Cyclone Pattern Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-slate-400">Pattern</p>

                <p className="text-xl font-bold text-cyan-400">
                  {imageAnalysis.pattern}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Trend</p>

                <p className="text-xl font-bold text-yellow-400">
                  {imageAnalysis.trend}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Eye Detected</p>

                <p className="text-xl font-bold">
                  {imageAnalysis.eye_detected ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {images.ir && (
        <div className="px-8 pb-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              🛰 Multi-Source Satellite Fusion
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-center mb-3 font-semibold">
                  Infrared (IR)
                </h3>

                <img src={images.ir} alt="IR" className="rounded-xl w-full" />
              </div>

              <div>
                <h3 className="text-center mb-3 font-semibold">
                  Raw Satellite
                </h3>

                <img src={images.raw} alt="Raw" className="rounded-xl w-full" />
              </div>

              <div>
                <h3 className="text-center mb-3 font-semibold">
                  Reference Dataset
                </h3>

                <img
                  src={images.reference}
                  alt="Reference"
                  className="rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="px-8 pb-8">
        <div className="bg-slate-900 p-6 rounded-2xl shadow-2xl">
          {currentPosition && predictedPosition && (
            <CycloneMap
              current={currentPosition}
              predicted={predictedPosition}
            />
          )}
        </div>
      </div>
      {briefing && (
        <div className="px-8 pb-8">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              🤖 AI Emergency Briefing
            </h2>

            <div className="bg-slate-800 rounded-xl p-5 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-slate-200 leading-8 font-sans">
                {briefing}
              </pre>
            </div>
          </div>
        </div>
      )}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">Wind Speed</h3>
            <p className="text-3xl font-bold mt-2">
              {windSpeed ? `${windSpeed} km/h` : "--"}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">Category</h3>
            <p className="text-3xl font-bold mt-2">
              {classification?.category || "--"}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">Landfall Probability</h3>
            <p className="text-3xl font-bold mt-2">
              {landfall ? `${landfall.probability}%` : "--"}
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6">
            <h3 className="text-slate-400">Population At Risk</h3>
            <p className="text-3xl font-bold mt-2">{populationRisk || "--"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
