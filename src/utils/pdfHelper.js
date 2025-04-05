export const fetchCuentaPorCobrarPdf = async (id_cxc) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/cuentas-por-cobrar/${id_cxc}/pdf`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Si usas bearer token
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al generar el PDF.");
    }

    const blob = await response.blob();
    const fileURL = window.URL.createObjectURL(blob);
    window.open(fileURL, "_blank");
  } catch (error) {
    console.error("Error al descargar PDF:", error);
    alert("No se pudo descargar el PDF.");
  }
};
