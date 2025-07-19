import PropTypes from "prop-types";
import { Dialog, Box, Typography, Button } from "@mui/material";
import { MapContainer } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import AutocompleteDireccion from "../pedido/AutocompleteDireccion";
import reverseGeocode from "../../utils/reverseGeocode";
import OrigenSelectorMap from "./OrigenSelectorMap";

export default function DialogSeleccionarOrigen({
  open,
  onClose,
  origen,
  setOrigen,
}) {
  const [direccion, setDireccion] = useState("");
  const skipEffect = useRef(false);

  const handleSetCoords = ({ lat, lng }) => {
    if (lat && lng) {
      skipEffect.current = true;
      setOrigen({ lat, lng });
    }
  };

  useEffect(() => {
    if (skipEffect.current) {
      skipEffect.current = false;
      return;
    }
    let isMounted = true;
    reverseGeocode(origen).then((dir) => {
      if (isMounted) setDireccion(dir);
    });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line
  }, [origen.lat, origen.lng]);

  useEffect(() => {
    if (!open) {
      setDireccion("");
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Selecciona el punto de origen
        </Typography>
        <AutocompleteDireccion
          direccion={direccion}
          setDireccion={setDireccion}
          setCoords={handleSetCoords}
        />
        <MapContainer
          center={origen}
          zoom={14}
          style={{ height: 340, width: "100%", borderRadius: 16 }}
        >
          <OrigenSelectorMap origen={origen} setOrigen={setOrigen} />
        </MapContainer>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={onClose}
          fullWidth
          autoFocus
        >
          Confirmar origen
        </Button>
      </Box>
    </Dialog>
  );
}

DialogSeleccionarOrigen.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  origen: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
  }).isRequired,
  setOrigen: PropTypes.func.isRequired,
};
