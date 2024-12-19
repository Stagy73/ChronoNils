import React, { useState, useRef, useEffect } from "react";

const LocationHistory = ({ history, onBack }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const mapRef = useRef(null); // Reference for the Google Map
  const mapInstance = useRef(null); // Store the map instance to reuse
  const pathRef = useRef(null); // Store the polyline instance for cleanup

  const renderMap = (locations) => {
    if (!locations || locations.length === 0) {
      return <p>No location data available for this day.</p>;
    }

    // Initialize Google Maps if it's not already initialized
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: locations[0],
        zoom: 14,
      });
    } else {
      mapInstance.current.setCenter(locations[0]);
      mapInstance.current.setZoom(14);
    }

    // Clear previous overlays (markers and polylines)
    if (pathRef.current) {
      pathRef.current.setMap(null);
    }

    // Add "Start" and "End" markers
    if (window.google.maps.marker?.AdvancedMarkerElement) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: locations[0],
        map: mapInstance.current,
        title: "Start",
      });

      new window.google.maps.marker.AdvancedMarkerElement({
        position: locations[locations.length - 1],
        map: mapInstance.current,
        title: "End",
      });
    } else {
      new window.google.maps.Marker({
        position: locations[0],
        map: mapInstance.current,
        label: "S",
      });

      new window.google.maps.Marker({
        position: locations[locations.length - 1],
        map: mapInstance.current,
        label: "E",
      });
    }

    // Draw a polyline for the driving route
    pathRef.current = new window.google.maps.Polyline({
      path: locations,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    pathRef.current.setMap(mapInstance.current);
  };

  useEffect(() => {
    // Load the Google Maps script dynamically if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyADbLZ2kuszoijOA2vMqyaH3aOZAWJ63ik&libraries=geometry,v=beta`;
      script.async = true;
      script.onload = () => console.log("Google Maps script loaded");
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  useEffect(() => {
    // Render the map whenever the selected day changes
    if (selectedDay && history[selectedDay]) {
      renderMap(history[selectedDay]);
    }
  }, [selectedDay]);

  return (
    <section id="location-history">
      <h2>Location History</h2>
      <button
        onClick={onBack}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0078d7",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Back to Real-Time Geolocation
      </button>
      {Object.keys(history).length > 0 ? (
        <ul>
          {Object.keys(history).map((day) => (
            <li key={day}>
              <button
                onClick={() => setSelectedDay(day)}
                style={{
                  background: "none",
                  color: "blue",
                  textDecoration: "underline",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {day}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No location history available.</p>
      )}
      {selectedDay && (
        <div>
          <h3>Driving Route for {selectedDay}</h3>
          <div
            ref={mapRef}
            style={{ height: "400px", width: "100%", marginTop: "20px" }}
          ></div>
        </div>
      )}
    </section>
  );
};

export default LocationHistory;
