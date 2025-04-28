// WorldMap.js
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { AlertCircle } from "lucide-react";
import countries from "world-countries";

// Map numeric country ID to ISO A2 and ISO A2 to country name
const numericToA2 = {};
const codeToName = {};
countries.forEach((country) => {
  if (country.ccn3) {
    numericToA2[parseInt(country.ccn3)] = country.cca2;
  }
  codeToName[country.cca2] = country.name.common;
});

const COLOR_SCALE = [
  { min: 0, max: 0, color: "#EAEAEA" },
  { min: 1, max: 2, color: "#4CAF50" },
  { min: 3, max: 10, color: "#FFEB3B" },
  { min: 11, max: 20, color: "#FF9800" },
  { min: 21, max: Infinity, color: "#FF5722" },
];

const getColorByValue = (value) => {
  if (value === undefined || value === null) return "#EAEAEA";
  for (const range of COLOR_SCALE) {
    if (value >= range.min && value <= range.max) {
      return range.color;
    }
  }
  return "#EAEAEA";
};

const WorldMap = () => {
  const [countryData, setCountryData] = useState({});
  const [worldGeoData, setWorldGeoData] = useState(null);
  const [tooltip, setTooltip] = useState({ visible: false, content: "", x: 0, y: 0 });
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        const res = await fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json");
        const world = await res.json();
        const geo = feature(world, world.objects.countries);
        setWorldGeoData(geo);
      } catch (err) {
        setError("Failed to load map data");
      }
    };
    fetchGeoData();
  }, []);

  const fetchCountryData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/geolocation/country`);
      const data = await res.json();
      setCountryData(data);
    } catch (err) {
      console.error("API error, using fallback", err);
      setCountryData({ US: 2, CN: 1, RU: 1, FR: 1, GB: 1, JP: 1 });
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCountryData();
  }, []);

  const topCountries = Object.entries(countryData)
    .map(([code, value]) => ({
      code,
      name: codeToName[code] || code,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const renderMap = () => {
    if (!worldGeoData) return null;

    const projection = d3.geoEqualEarth().scale(250).translate([640, 350]);
    const pathGenerator = d3.geoPath().projection(projection);

    return worldGeoData.features.map((feature) => {
      const countryCode = numericToA2[feature.id];
      const value = countryData[countryCode?.toUpperCase()];
      const fillColor = getColorByValue(value);
      const countryName = codeToName[countryCode] || countryCode || "Unknown";
      return (
        <path
          key={feature.id}
          d={pathGenerator(feature)}
          fill={fillColor}
          stroke="#fff"
          strokeWidth="0.5"
          onMouseEnter={(e) => {
            setTooltip({
              visible: true,
              content: `${countryName}: ${value || 0} attacker${value === 1 ? "" : "s"}`,
              x: e.nativeEvent.offsetX,
              y: e.nativeEvent.offsetY,
            });
          }}
          onMouseMove={(e) => {
            setTooltip((prev) => ({ ...prev, x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }));
          }}
          onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
        />
      );
    });
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold">Attacker Geolocation</h2>
        <button 
          onClick={fetchCountryData} 
          disabled={isRefreshing}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-2 rounded flex items-center transition-colors"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
          {isRefreshing && (
            <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
      </div>

      <div
        ref={mapRef}
        className="relative bg-white border rounded shadow-sm"
        style={{ height: 600 }}
      >
        {error ? (
          <div className="flex items-center justify-center h-full text-red-500">
            <AlertCircle className="w-5 h-5 mr-2" /> {error}
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 1280 720" className="bg-gray-50">
            <g>{renderMap()}</g>
          </svg>
        )}

        {tooltip.visible && (
          <div
            className="absolute z-10 bg-black text-white px-2 py-1 rounded text-xs pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y - 10, transform: "translate(-50%, -100%)" }}
          >
            {tooltip.content}
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow text-xs border border-black">
          <div className="font-bold mb-1">Top 5 Countries:</div>
          <ul className="list-disc list-inside">
            {topCountries.map((entry, idx) => (
              <li key={idx}>
                {entry.name}: {entry.value} attacker{entry.value !== 1 ? "s" : ""}
              </li>
            ))}
          </ul>
        </div>

        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded shadow text-xs border border-black">
          <div className="font-bold mb-1">Map Key:</div>
          <div className="grid grid-cols-2 gap-2">
            {COLOR_SCALE.map((range, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: range.color }}></div>
                <span>
                  {range.min === 0 && range.max === 0
                    ? "0"
                    : range.max === Infinity
                    ? `${range.min}+`
                    : `${range.min}–${range.max}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;