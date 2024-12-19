import React, { useState } from "react";
import BlogSection from "./components/BlogSection";
import LocationSection from "./components/LocationSection";
import LocationHistory from "./components/LocationHistory";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles.css";

const App = () => {
  const [history, setHistory] = useState({});
  const [view, setView] = useState("realtime"); // Track the current view: 'realtime' or 'history'

  const saveLocationHistory = (location) => {
    const today = new Date().toISOString().split("T")[0];
    setHistory((prev) => ({
      ...prev,
      [today]: [...(prev[today] || []), location],
    }));
  };

  return (
    <div id="app-container">
      <Header />
      <main id="main-content">
        <div id="blog-section">
          <BlogSection />
        </div>
        <div id="location-section">
          {view === "realtime" && (
            <LocationSection
              saveLocationHistory={saveLocationHistory}
              isActive={true}
            />
          )}
          {view === "history" && (
            <LocationHistory
              history={history}
              onBack={() => setView("realtime")}
            />
          )}
        </div>
        <div id="history-section">
          <h3>Travel History</h3>
          <ul>
            {Object.keys(history).map((date) => (
              <li key={date}>
                <button onClick={() => setView("history")}>{date}</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
