// src/scripts/googleAutocomplete.js

export let autocomplete, address1Field, address2Field, postalField;
export let avoidCreditCardFieldFocus = false;

export function initAutocomplete(countryCode = 'US') {
    address1Field = document.getElementById('shipping-address');
    address2Field = document.getElementById('unit');
    postalField = document.getElementById('zip');

    autocomplete = new google.maps.places.Autocomplete(address1Field, {
        componentRestrictions: { country: [countryCode] },
        fields: ['address_components', 'geometry'],
        types: ['address']
    });

    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
    const place = autocomplete.getPlace();
    console.log(place);
    let address1 = '', postcode = '';

    for (const component of place.address_components) {
        const componentType = component.types[0];

        switch (componentType) {
            case 'street_number':
                address1 = `${component.long_name} ${address1}`;
                break;
            case 'route':
                address1 += component.short_name;
                break;
            case 'postal_code':
                postcode = `${component.long_name}${postcode}`;
                break;
            case 'postal_code_prefix':
                postcode = `${component.long_name} ${postcode}`;
                break;
            case 'postal_code_suffix':
                postcode = `${postcode}-${component.long_name}`;
                break;
            case 'locality':
                cityInput.value = normalizeString(component.long_name);
                break;
            case 'administrative_area_level_1':
                stateDropdown.value = normalizeString(component.long_name).toLowerCase();
                if (stateDropdown.value !== normalizeString(component.long_name).toLowerCase()) {
                    stateDropdown.focus();
                    avoidCreditCardFieldFocus = true;
                }
                break;
            case 'country':
                if (countryDropdown.value !== component.short_name) {
                    countryDropdown.value = component.short_name;
                    countryDropdown.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }));
                }
                break;
        }
    }

    address1Field.value = address1;
    postalField.value = postcode;

    if (!avoidCreditCardFieldFocus) {
        document.getElementById('card-number').focus();
    }
}

function normalizeString(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
