// src/scripts/countryCodes.js

export const countryCodes = [
    'US', // United States
    'CA', // Canada
    'AU', // Australia
    'NZ', // New Zealand
    'SE', // Sweden
    'IE', // Ireland
    'ES', // Spain
    'DE', // Germany
    'FR', // France
    'UK', // United Kingdom
    'GB', // United Kingdom
    'ZA', // South Africa
    'MX', // Mexico
    'PH', // Philippines
    'NO'  // Norway
];

export function isCountryInList(countryCode) {
    return countryCodes.includes(countryCode);
}
