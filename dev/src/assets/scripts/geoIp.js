// src/scripts/geoip.js

import { isCountryInList } from './countryCodes.js';
import { updateStateDropdown } from './stateOptions.js';
import { initAutocomplete } from './googleAutocomplete.js'

export let ipCountry;

export function handleGeoipResponse(geoipResponse) {
    console.log(geoipResponse);
    if ('country' in geoipResponse) {
        ipCountry = geoipResponse.country.iso_code;

        const urlParams = new URLSearchParams(window.location.search);
        const utmSource = urlParams.get('utm_source');

        if (isCountryInList(ipCountry)) {
            console.log(ipCountry);
            _selectCountry(ipCountry);
            updateStateDropdown();
            google.maps.event.addDomListener(window, 'load', function() {
                initAutocomplete(ipCountry);
            });
        }
    } else {
        console.log('country not in response');
    }
}

export function handleError(err) {
    console.error(err);
}

function _selectCountry(countryCode) {
    const selectElement = document.querySelector('#country');
    selectElement.value = countryCode;

    const event = new Event('change', {
        bubbles: true,
        cancelable: true
    });

    selectElement.dispatchEvent(event);
}
