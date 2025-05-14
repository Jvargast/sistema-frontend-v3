import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const GooglePlacesInput = ({
  onSelect,
  placeholder = "Ingrese la dirección",
}) => {
  const [predictions, setPredictions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places)
      return;

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();

    const handleInput = (e) => {
      const value = e.target.value;
      if (!value) {
        setPredictions([]);
        return;
      }

      autocompleteService.getPlacePredictions(
        { input: value, componentRestrictions: { country: "cl" } },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPredictions(results);
          } else {
            setPredictions([]);
          }
        }
      );
    };

    const inputEl = inputRef.current;
    inputEl.addEventListener("input", handleInput);

    return () => {
      inputEl.removeEventListener("input", handleInput);
    };
  }, []);

  const handleSelect = async (placeId, description) => {
    try {
      const { Place } = await window.google.maps.importLibrary("places");
      const place = await Place.fetchFields({
        placeId,
        fields: ["formatted_address"],
      });

      const address = place?.formatted_address || description;
      onSelect(address);
      inputRef.current.value = address;
      setPredictions([]);
    } catch (err) {
      console.error("❌ Error al obtener detalles del lugar:", err);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
        Dirección*
      </label>
      <input
        ref={inputRef}
        placeholder={placeholder}
        required
        style={{
          width: "100%",
          height: "56px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          padding: "0 12px",
          fontSize: "16px",
          backgroundColor: "#fff",
          color: "#000",
        }}
      />
      {predictions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderTop: "none",
            maxHeight: "200px",
            overflowY: "auto",
            zIndex: 10,
            margin: 0,
            padding: 0,
            listStyle: "none",
          }}
        >
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() =>
                handleSelect(prediction.place_id, prediction.description)
              }
              style={{
                padding: "10px 12px",
                cursor: "pointer",
              }}
            >
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

GooglePlacesInput.propTypes = {
  onSelect: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default GooglePlacesInput;
