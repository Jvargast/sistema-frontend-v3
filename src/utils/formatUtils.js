// utils/formatUtils.js

/**
 * Formatea un número a CLP (Peso Chileno)
 * @param {number} value
 * @returns {string}
 */
export const formatCLP = (value) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formatea un número con separador de miles, sin símbolo de moneda
 * @param {number} value
 * @returns {string}
 */
export const formatNumberCL = (value) => {
  return new Intl.NumberFormat("es-CL").format(value);
};
