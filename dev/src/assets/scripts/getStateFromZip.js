// zipToState.js

/**
 * Zip to State
 * @param {number|string} zipCode
 * @returns {boolean|string}
 */
export function getStateFromZip(zipCode) {
  let stateAbbr = null;

  // Ensure you don't parse codes that start with 0 as octal values
  zipCode = parseInt(zipCode, 10);

  // Code blocks alphabetized by state
  if (zipCode >= 35000 && zipCode <= 36999) {
    stateAbbr = "AL";
  } else if (zipCode >= 99500 && zipCode <= 99999) {
    stateAbbr = "AK";
  } else if (zipCode >= 85000 && zipCode <= 86999) {
    stateAbbr = "AZ";
  } else if (zipCode >= 71600 && zipCode <= 72999) {
    stateAbbr = "AR";
  } else if (zipCode >= 90000 && zipCode <= 96699) {
    stateAbbr = "CA";
  } else if (zipCode >= 80000 && zipCode <= 81999) {
    stateAbbr = "CO";
  } else if (zipCode >= 6000 && zipCode <= 6999) {
    stateAbbr = "CT";
  } else if (zipCode >= 19700 && zipCode <= 19999) {
    stateAbbr = "DE";
  } else if (zipCode >= 32000 && zipCode <= 34999) {
    stateAbbr = "FL";
  } else if (zipCode >= 30000 && zipCode <= 31999) {
    stateAbbr = "GA";
  } else if (zipCode >= 96700 && zipCode <= 96999) {
    stateAbbr = "HI";
  } else if (zipCode >= 83200 && zipCode <= 83999) {
    stateAbbr = "ID";
  } else if (zipCode >= 60000 && zipCode <= 62999) {
    stateAbbr = "IL";
  } else if (zipCode >= 46000 && zipCode <= 47999) {
    stateAbbr = "IN";
  } else if (zipCode >= 50000 && zipCode <= 52999) {
    stateAbbr = "IA";
  } else if (zipCode >= 66000 && zipCode <= 67999) {
    stateAbbr = "KS";
  } else if (zipCode >= 40000 && zipCode <= 42999) {
    stateAbbr = "KY";
  } else if (zipCode >= 70000 && zipCode <= 71599) {
    stateAbbr = "LA";
  } else if (zipCode >= 3900 && zipCode <= 4999) {
    stateAbbr = "ME";
  } else if (zipCode >= 20600 && zipCode <= 21999) {
    stateAbbr = "MD";
  } else if (zipCode >= 1000 && zipCode <= 2799) {
    stateAbbr = "MA";
  } else if (zipCode >= 48000 && zipCode <= 49999) {
    stateAbbr = "MI";
  } else if (zipCode >= 55000 && zipCode <= 56999) {
    stateAbbr = "MN";
  } else if (zipCode >= 38600 && zipCode <= 39999) {
    stateAbbr = "MS";
  } else if (zipCode >= 63000 && zipCode <= 65999) {
    stateAbbr = "MO";
  } else if (zipCode >= 59000 && zipCode <= 59999) {
    stateAbbr = "MT";
  } else if (zipCode >= 27000 && zipCode <= 28999) {
    stateAbbr = "NC";
  } else if (zipCode >= 58000 && zipCode <= 58999) {
    stateAbbr = "ND";
  } else if (zipCode >= 68000 && zipCode <= 69999) {
    stateAbbr = "NE";
  } else if (zipCode >= 88900 && zipCode <= 89999) {
    stateAbbr = "NV";
  } else if (zipCode >= 3000 && zipCode <= 3899) {
    stateAbbr = "NH";
  } else if (zipCode >= 7000 && zipCode <= 8999) {
    stateAbbr = "NJ";
  } else if (zipCode >= 87000 && zipCode <= 88499) {
    stateAbbr = "NM";
  } else if (zipCode >= 10000 && zipCode <= 14999) {
    stateAbbr = "NY";
  } else if (zipCode >= 43000 && zipCode <= 45999) {
    stateAbbr = "OH";
  } else if (zipCode >= 73000 && zipCode <= 74999) {
    stateAbbr = "OK";
  } else if (zipCode >= 97000 && zipCode <= 97999) {
    stateAbbr = "OR";
  } else if (zipCode >= 15000 && zipCode <= 19699) {
    stateAbbr = "PA";
  } else if (zipCode >= 300 && zipCode <= 999) {
    stateAbbr = "PR";
  } else if (zipCode >= 2800 && zipCode <= 2999) {
    stateAbbr = "RI";
  } else if (zipCode >= 29000 && zipCode <= 29999) {
    stateAbbr = "SC";
  } else if (zipCode >= 57000 && zipCode <= 57999) {
    stateAbbr = "SD";
  } else if (zipCode >= 37000 && zipCode <= 38599) {
    stateAbbr = "TN";
  } else if (
    (zipCode >= 75000 && zipCode <= 79999) ||
    (zipCode >= 88500 && zipCode <= 88599)
  ) {
    stateAbbr = "TX";
  } else if (zipCode >= 84000 && zipCode <= 84999) {
    stateAbbr = "UT";
  } else if (zipCode >= 5000 && zipCode <= 5999) {
    stateAbbr = "VT";
  } else if (zipCode >= 22000 && zipCode <= 24699) {
    stateAbbr = "VA";
  } else if (zipCode >= 20000 && zipCode <= 20599) {
    stateAbbr = "DC";
  } else if (zipCode >= 98000 && zipCode <= 99499) {
    stateAbbr = "WA";
  } else if (zipCode >= 24700 && zipCode <= 26999) {
    stateAbbr = "WV";
  } else if (zipCode >= 53000 && zipCode <= 54999) {
    stateAbbr = "WI";
  } else if (zipCode >= 82000 && zipCode <= 83199) {
    stateAbbr = "WY";
  } else {
    stateAbbr = false;
  }
  return stateAbbr;
}
