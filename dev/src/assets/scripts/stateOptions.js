import {updateEstimatedDeliveryDate} from "./updateEstimatedDeliveryDate.js";

/**
 * Updates the state dropdown and related information based on the selected country.
 * @param {string} selectedCountry - The selected country code.
 * @param {HTMLElement} zipLabel - The zip/postal code label element.
 * @param {number} smartShip - The smartShip value (0 or 1).
 * @param {Object} checkoutProduct - The CheckoutProduct instance.
 * @param {Object} config - The configuration object for state options and placeholders.
 */
export function updateStateDropdown(selectedCountry, zipLabel, config) {
	console.log(`selected country ${selectedCountry}`);
	console.log(config);
	const countryConfig = config[selectedCountry];
	if (!countryConfig) {
		console.error(`No configuration found for country: ${selectedCountry}`);
		return;
	}

	const {placeholder, stateOptions, estimatedDeliveryDays} = countryConfig;

	zipLabel.placeholder = placeholder;

	updateEstimatedDeliveryDate(estimatedDeliveryDays);

	const stateDropdown = document.querySelector("#state");
	stateDropdown.innerHTML = "";

	stateOptions.forEach((state, index) => {
		const option = document.createElement("option");
		if (index === 0) {
			option.value = "";
			option.text = state;
			option.disabled = true;
			option.selected = true;
		} else {
			option.value = state.toLowerCase();
			option.text = state;
		}
		stateDropdown.appendChild(option);
	});
}
