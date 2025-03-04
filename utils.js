/**
 * Checks if an ID is a valid Israeli ID
 * @param {string} id - ID to check
 * @returns {boolean}
 */
export function isValidIsraeliID(id) {
  const cleanId = id.replace(/\D/g, ""); // Remove non-digits
  if (!/^\d{9}$/.test(cleanId)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    let digit = parseInt(cleanId[i]) * ((i % 2) + 1);
    sum += digit > 9 ? digit - 9 : digit;
  }
  return sum % 10 === 0;
}

/**
 * Checks if a phone number is valid (Israeli mobile)
 * @param {string} phone - Phone number to check
 * @returns {boolean}
 */
export function isValidPhone(phone) {
  const validPrefixes = [
    "050",
    "052",
    "053",
    "054",
    "057",
    "058",
    "059",
    "077",
  ];
  return (
    /^05[0-9]{8}$/.test(phone) && validPrefixes.includes(phone.slice(0, 3))
  );
}
