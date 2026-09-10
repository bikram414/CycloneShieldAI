import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function RecenterMap({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, 8);
    }
  }, [center, map]);

  return null;
}

function CycloneMap({ current, predicted }) {

  if (!current || !predicted) {
    return (
      <div className="h-[500px] flex items-center justify-center text-slate-400">
        Run AI Prediction to view cyclone track
      </div>
    );
  }

  const fullTrack = [
    current,
    predicted,
  ];

  const center = [
    (current[0] + predicted[0]) / 2,
    (current[1] + predicted[1]) / 2,
  ];

  return (
    <MapContainer
      center={center}
      zoom={8}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <RecenterMap center={center} />

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={current}>
        <Popup>
          Current Cyclone Position
        </Popup>
      </Marker>

      <Marker position={predicted}>
        <Popup>
          AI Predicted Position
        </Popup>
      </Marker>

      <Polyline
        positions={fullTrack}
        color="red"
      />
    </MapContainer>
  );
}

export default CycloneMap;