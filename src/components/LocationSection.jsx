import React, { useState, useEffect, useRef } from "react";

const LocationSection = ({ saveLocationHistory, isActive }) => {
  const [location, setLocation] = useState(null); // Track user location
  const mapRef = useRef(null); // Map container ref
  const googleMapsRef = useRef(null); // Google Maps instance ref
  const geoWatchId = useRef(null); // Geolocation watch ID
  const loadGoogleMapsScript = () => {
    if (!window.google) {
      const script = document.createElement("script");
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Load API key from .env
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=beta`;
      script.async = true;
      script.defer = true;
      script.onload = () =>
        console.log("Google Maps script loaded successfully");
      document.body.appendChild(script);
    } else {
      console.log("Google Maps script already loaded");
    }
  };

  const initializeMap = (newLocation) => {
    if (!mapRef.current || !window.google) return;

    if (!googleMapsRef.current) {
      googleMapsRef.current = new window.google.maps.Map(mapRef.current, {
        center: newLocation,
        zoom: 15,
      });
    }

    // Add a marker to the map
    if (window.google.maps.marker?.AdvancedMarkerElement) {
      new window.google.maps.marker.AdvancedMarkerElement({
        position: newLocation,
        map: googleMapsRef.current,
        title: "Current Location",
      });
    } else {
      new window.google.maps.Marker({
        position: newLocation,
        map: googleMapsRef.current,
      });
    }

    googleMapsRef.current.setCenter(newLocation);
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    geoWatchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("New location received:", newLocation);
        setLocation(newLocation);
        saveLocationHistory(newLocation); // Save to history
        initializeMap(newLocation);
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  useEffect(() => {
    if (isActive) {
      startLocationTracking();
    } else if (geoWatchId.current) {
      navigator.geolocation.clearWatch(geoWatchId.current);
      geoWatchId.current = null; // Clear geolocation tracking when inactive
    }

    return () => {
      if (geoWatchId.current) {
        navigator.geolocation.clearWatch(geoWatchId.current);
      }
    };
  }, [isActive]);

  return (
    <section id="location-section">
      <h2>My Real-Time Location</h2>
      {location ? (
        <>
          <p>
            Latitude: {location.lat}, Longitude: {location.lng}
          </p>
          <div
            ref={mapRef}
            style={{ height: "400px", width: "100%", marginTop: "20px" }}
          ></div>
        </>
      ) : (
        <p>Fetching location...</p>
      )}
    </section>
  );
};

export default LocationSection;
