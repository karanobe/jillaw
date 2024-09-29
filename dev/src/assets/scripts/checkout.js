import {updateStateDropdown} from "./stateOptions.js";
import {updateYearDropdown} from "./yearOptions.js";
import {getCreditCardType, addCreditCardIcon} from "./creditCardTypeDetection.js";
import {getStateFromZip} from "./getStateFromZip.js";
import {Validity} from "./fieldValidation.js";
import {startCountdownTimers} from "./countdown.js";

class CheckoutProduct {
	constructor(product_data, country_config) {
		if (!product_data || typeof product_data !== "object") {
			throw new Error("Invalid product data: product_data must be an object.");
		}

		const requiredProperties = [
			"term",
			"retail_price",
			"offer_price",
			"quantity",
			"type",
			"shipping",
			"vip_offer_price",
			"vip_term",
			"vip_shipping",
			"tax",
			"product_name",
			"vip_rebill_cycle",
			"product_rights_symbol",
			"product_slogan",
			"product_image",
		];

		for (const property of requiredProperties) {
			if (!(property in product_data)) {
				throw new Error(`Missing required property: ${property}`);
			}
		}

		this.term = product_data.term;
		this.retail_price = product_data.retail_price;
		this.offer_price = product_data.offer_price;
		this.quantity = product_data.quantity;
		this.type = product_data.type;
		this.shipping = product_data.shipping;
		this.vip_offer_price = product_data.vip_offer_price;
		this.vip_term = product_data.vip_term;
		this.vip_shipping = product_data.vip_shipping;
		this.tax = product_data.tax;
		this.product_name = product_data.product_name;
		this.vip_rebill_cycle = product_data.vip_rebill_cycle;
		this.product_rights_symbol = product_data.product_rights_symbol;
		this.product_slogan = product_data.product_slogan;
		this.product_image = product_data.product_image;

		this._selectedCountry = "US";
		this._smartShip = 0;

		this.country_config = country_config;

		this.initialize();
	}

	initialize() {
		const setupListeners = () => {
			this.setupCheckoutButtonListeners();
			this.setupZipCodeChangeListener();
			this.setupCreditCardInputListeners();
			this.setupCountryChangeListener();
			this.setupSmartShipListener();
			this.setupPhoneNumberInputRestriction();
			// this.setupGeoIPListener();
			this.setupEstimateArrivalDate();
			this.updateSmartShip();

			const durationInSeconds = 10 * 60; // 10 minutes
			const timerClassName = "countdown";

			startCountdownTimers(timerClassName, durationInSeconds);

			// Update Year Dropdown to add current year + 10 years
			updateYearDropdown();
		};

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", setupListeners);
		} else {
			setupListeners();
		}
	}

	set selectedCountry(value) {
		this._selectedCountry = value;
	}

	get shipping_price() {
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.shipping[index].price;
	}

	get vip_shipping_price() {
		const index = this.vip_shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.vip_shipping[index].price;
	}

	get duty_fee() {
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.shipping[index].dutyFee;
	}

	get original_shipping_price() {
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.shipping[index].originalShippingPrice;
	}

	get saved_price() {
		let saved_price = (this.retail_price - this.offer_price).toFixed(2);
		return `$${saved_price}`;
	}

	get onetime_vs_vip_saved_price() {
		return this.offer_price - this.vip_offer_price;
	}

	get savings_total() {
		let onetime_vs_vip_saved_price = this.offer_price - this.vip_offer_price;
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		let original_shipping_price = this.shipping[index].originalShippingPrice;

		return onetime_vs_vip_saved_price + original_shipping_price;
	}

	get total_price() {
		let shipping_price = this.shipping_price;
		let duty_fee = this.duty_fee;
		let total_price = parseFloat(this.offer_price + shipping_price + this.tax + duty_fee);
		return `$${total_price.toFixed(2)} USD`;
	}

	get vip_saved_price() {
		let vip_saved_price = (this.retail_price - this.vip_offer_price).toFixed(2);
		return `$${vip_saved_price}`;
	}

	get vip_duty_fee() {
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.vip_shipping[index].dutyFee;
	}

	get vip_original_shipping_price() {
		const index = this.shipping.findIndex((obj) => obj.country === this._selectedCountry);
		return this.vip_shipping[index].originalShippingPrice;
	}

	get vip_total_price() {
		let vip_shipping_price = this.vip_shipping_price;
		let duty_fee = this.duty_fee;
		let vip_total_price = this.vip_offer_price + vip_shipping_price + this.tax + duty_fee;
		return `$${vip_total_price.toFixed(2)} USD`;
	}

	updateValues(mapping_select_to_property) {
		for (let key in mapping_select_to_property) {
			if (mapping_select_to_property.hasOwnProperty(key)) {
				this.setInnerHTML(key, mapping_select_to_property[key]);
			}
		}
	}

	setInnerHTML(className, name) {
		let value = this[name];
		let insert = this[name];

		for (let i = 0; i < document.getElementsByClassName(className).length; i++) {
			if (name === "count") {
				insert = `${this["quantity"]}`;
			}

			if (name === "quantity") {
				insert = `${this[name]} ${this["type"]}`;
			}

			if (
				name === "retail_price" ||
				name === "offer_price" ||
				name === "vip_offer_price" ||
				name === "tax" ||
				(name === "shipping_price" && typeof value === "number" && value !== 0.0) ||
				(name === "vip_shipping_price" && typeof value === "number" && value !== 0.0) ||
				(name === "duty_fee" && typeof value === "number" && value !== 0.0) ||
				(name === "vip_duty_fee" && typeof value === "number" && value !== 0.0) ||
				(name === "onetime_vs_vip_saved_price" && typeof value === "number" && value !== 0.0) ||
				(name === "original_shipping_price" && typeof value === "number" && value !== 0.0) ||
				(name === "vip_original_shipping_price" && typeof value === "number" && value !== 0.0) ||
				(name === "savings_total" && typeof value === "number" && value !== 0.0)
			) {
				insert = `$${this[name].toFixed(2)}`;
			}

			if (name === "shipping_price" || name === "vip_shipping_price") {
				if (value === 0.0) {
					insert = "FREE";
					const target = document.getElementsByClassName("strike");
					for (let i = 0; i < target.length; i++) {
						target[i].style.display = "inline-table";
					}
				}

				if (value > 0.0) {
					const target = document.getElementsByClassName("strike");
					for (let i = 0; i < target.length; i++) {
						target[i].style.display = "none";
					}
				}
			}

			if (typeof value === "function") {
				insert = value();
			}

			if ((name === "duty_fee" || name === "vip_duty_fee") && value === 0) {
				const dutyFeeTableRows = document.querySelectorAll(".duty-fee-table-row");
				for (let i = 0; i < dutyFeeTableRows.length; i++) {
					dutyFeeTableRows[i].style.display = "none";
				}
			}

			if ((name === "duty_fee" || name === "vip_duty_fee") && value > 0) {
				const dutyFeeTableRows = document.querySelectorAll(".duty-fee-table-row");
				for (let i = 0; i < dutyFeeTableRows.length; i++) {
					dutyFeeTableRows[i].style.display = "";
				}
			}

			if ((name === "original_shipping_price" || name === "vip_original_shipping_price") && value === 0.0) {
				const target = document.getElementsByClassName("original_shipping_price");
				for (let i = 0; i < target.length; i++) {
					target[i].style.display = "none";
				}
			}

			if ((name === "original_shipping_price" || name === "vip_original_shipping_price") && value > 0.0) {
				const target = document.getElementsByClassName("original_shipping_price");
				for (let i = 0; i < target.length; i++) {
					target[i].style.display = "";
				}
			}

			if (name === "product_image") {
				document.getElementsByClassName(className)[i].src = insert;
			} else {
				document.getElementsByClassName(className)[i].innerHTML = insert;
			}
		}
	}

	updateSmartShip() {
		if (this._smartShip === 0) {
			this.updateValues(this.mapping_select_to_property_onetime);
		}

		if (this._smartShip === 1) {
			this.updateValues(this.mapping_select_to_property_subscribe);
		}
	}

	get mapping_select_to_property_onetime() {
		return {
			"checkout__product-count": "count",
			"checkout__product-retail-price": "retail_price",
			"checkout__product-offer-price": "offer_price",
			"checkout__product-saved-price": "saved_price",
			"checkout__product-total-price": "total_price",
			"checkout__product-shipping-price": "shipping_price",
			"checkout__product-quantity": "quantity",
			"checkout__product-name": "product_name",
			"checkout__product-rebill-cycle": "vip_rebill_cycle",
			"checkout__product-rights-symbol": "product_rights_symbol",
			"checkout__product-slogan": "product_slogan",
			"checkout__term-text": "term",
			// "checkout__product-image": "product_image",
			"checkout__product-duty-fee": "duty_fee",
			"checkout__product-vip-savings": "onetime_vs_vip_saved_price",
			"checkout__product-original-shipping-price": "original_shipping_price",
			"checkout__product-total_savings": "savings_total",
		};
	}

	get mapping_select_to_property_subscribe() {
		return {
			"checkout__product-count": "count",
			"checkout__product-retail-price": "retail_price",
			"checkout__product-offer-price": "vip_offer_price",
			"checkout__product-saved-price": "vip_saved_price",
			"checkout__product-total-price": "vip_total_price",
			"checkout__product-shipping-price": "vip_shipping_price",
			"checkout__product-quantity": "quantity",
			"checkout__product-name": "product_name",
			"checkout__product-rebill-cycle": "vip_rebill_cycle",
			"checkout__product-rights-symbol": "product_rights_symbol",
			"checkout__product-slogan": "product_slogan",
			"checkout__term-text": "vip_term",
			// "checkout__product-image": "product_image",
			"checkout__product-duty-fee": "vip_duty_fee",
			"checkout__product-vip-savings": "onetime_vs_vip_saved_price",
			"checkout__product-original-shipping-price": "vip_original_shipping_price",
			"checkout__product-total_savings": "savings_total",
		};
	}

	setupCheckoutButtonListeners() {
		const fieldRules = {
			firstName: ["required", "numbers letters spaces periods hyphens"],
			lastName: ["required", "numbers letters spaces periods hyphens"],
			emailAddress: ["required", "email"],
			shippingAddress1: ["required"],
			shippingAddress2: ["not required"],
			shippingCity: ["required", "numbers letters spaces periods hyphens"],
			shippingState: ["required"],
			shippingCountry: ["required", "numbers letters spaces periods hyphens"],
			phoneNumber: ["required", "numbers letters spaces periods hyphens"],
			shippingZip: ["required", "numbers letters spaces periods hyphens"],
			creditCardNumber: ["required", "credit card number"],
			creditCardType: ["required", "letters"],
			expirationMonth: ["required", "numbers"],
			expirationYear: ["required", "numbers"],
			cvv: ["required", "numbers letters"],
		};

		const validator = new Validity(fieldRules);

		document.querySelectorAll(".checkout-button").forEach((button) => {
			button.addEventListener("click", (e) => {
				e.preventDefault();
				validator.validate();

				if (validator.valid()) {
					openModal("#processing-modal");
					let formData = Object.assign(validator.data(), {switch: this._smartShip});

					// Submit Payment
					this.submitPayment(formData);
				} else {
					console.log("Form is invalid");
					// Hide Processing Modal
					closeModal("#processing-modal");
				}
			});
		});
	}

	async submitPayment(data) {
		try {
			const protocol = window.location.protocol;
			const apex = window.location.hostname.split(".").slice(-2).join(".");
			const url = `${protocol}//api.${apex}/api/payment`;

			// Function to extract hostname and path from the current URL
			function getCurrentPageInfo() {
				const currentUrl = new URL(window.location.href);
				return {
					hostname: currentUrl.hostname,
					path: currentUrl.pathname,
				};
			}

			const pageInfo = getCurrentPageInfo();

			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Referrer-Hostname": pageInfo.hostname,
					"Referrer-Path": pageInfo.path,
				},
				body: JSON.stringify(data),
				credentials: "include", // Ensure cookies are included
			});

			const resp = await response.json();

			if (resp.status === true) {
				if (typeof pushDataLayer === "function" && window["google_tag_manager"]) {
					pushDataLayer(resp.transaction, resp.product, function (id) {
						window.location.href = resp[0];
					});
				} else {
					window.location.href = resp[0];
				}
			} else {
				document.querySelector(".payment-form__next-button").disabled = false;
				closeModal("#processing-modal");

				const errorMessage = document.querySelector(".error-message");
				if (errorMessage) {
					errorMessage.style.display = "block";
					errorMessage.innerHTML = resp.error_message;
				}

				// Get the current position of the error field
				const errorFieldPosition = errorMessage.getBoundingClientRect().top + window.pageYOffset;

				// Scroll to the position 10 pixels above the error field
				window.scrollTo({
					top: errorFieldPosition - 10,
					behavior: "smooth",
				});
			}
		} catch (error) {
			console.error("Error:", error);
			closeModal("#processing-modal");

			const errorMessage = document.querySelector(".error-message");
			if (errorMessage) {
				errorMessage.style.display = "block";
				errorMessage.innerHTML = error;
			}

			// Get the current position of the error field
			const errorFieldPosition = errorMessage.getBoundingClientRect().top + window.pageYOffset;

			// Scroll to the position 10 pixels above the error field
			window.scrollTo({
				top: errorFieldPosition - 10,
				behavior: "smooth",
			});
		}
	}

	setupZipCodeChangeListener() {
		const zipCodeInput = document.querySelector("[name=shippingZip]");
		zipCodeInput.addEventListener("change", (e) => {
			const stateAbbr = getStateFromZip(e.target.value);
			const shippingStateSelect = document.querySelector("[name=shippingState]");
			const options = shippingStateSelect.options;

			for (let i = 0; i < options.length; i++) {
				if (options[i].value === stateAbbr) {
					options[i].selected = true;
					break;
				}
			}
		});
	}

	setupCreditCardInputListeners() {
		const creditCardInput = document.querySelector('[name="creditCardNumber"]');
		const creditCardTypeInput = document.getElementById("credit-card-type");

		if (creditCardInput && creditCardTypeInput) {
			creditCardInput.addEventListener("blur", this.handleCreditCardInputEvent);
			creditCardInput.addEventListener("input", this.handleCreditCardInputEvent);
			creditCardInput.addEventListener("keyup", this.handleCreditCardInputEvent);
			creditCardInput.addEventListener("change", this.handleCreditCardInputEvent);
		}
	}

	handleCreditCardInputEvent(event) {
		const cardNumber = event.target.value.replace(/-/g, "");
		const type = getCreditCardType(cardNumber);
		const creditCardTypeInput = document.getElementById("credit-card-type");

		creditCardTypeInput.value = type;

		const formattedCardNumber = cardNumber
			.replace(/\D/g, "")
			.match(/.{1,4}|^$/g)
			.join("-");

		event.target.value = formattedCardNumber;

		addCreditCardIcon(type);
	}

	selectCountry() {
		const selectElement = document.querySelector("#country");

		selectElement.value = this._selectedCountry;

		const event = new Event("change", {
			bubbles: true,
			cancelable: true,
		});

		selectElement.dispatchEvent(event);
	}

	setupCountryChangeListener() {
		const countrySelect = document.querySelector("#country");
		const zipLabel = document.querySelector('label[for="zip"]');

		if (countrySelect) {
			countrySelect.addEventListener("change", () => {
				this._selectedCountry = countrySelect.value;
				updateStateDropdown(this._selectedCountry, zipLabel, this.country_config);
			});
		}
	}

	setupSmartShipListener() {
		const inputs = document.querySelectorAll('input[name^="subscription"]');
		inputs.forEach((input) => {
			input.addEventListener("change", () => {
				document.querySelector(".subscribe__disclaimer").style.display = input.checked ? "block" : "none";

				this._smartShip = input.checked ? 1 : 0;
				this.updateSmartShip();

				const targetElement = document.querySelector(".checkout-box__heading--step2");
				const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset;

				window.scrollTo({
					top: offsetTop,
					behavior: "smooth",
				});

				document.getElementById("card-number").focus();
			});
		});
	}

	setupPhoneNumberInputRestriction() {
		const phoneNumberInput = document.getElementById("phone-number");
		phoneNumberInput?.addEventListener("input", function () {
			this.value = this.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
		});
	}

	setupGeoIPListener() {
		const response = geoip2.country(
			(geoipResponse) => {
				if ("country" in geoipResponse) {
					this._selectedCountry = geoipResponse.country.iso_code;

					this.selectCountry();

					const zipLabel = document.querySelector('label[for="zip"]');

					updateStateDropdown(this._selectedCountry, zipLabel, this.country_config);
				}
			},
			(e) => {
				console.error(e);
			},
		);
	}
	setupEstimateArrivalDate() {
		const zipLabel = document.querySelector('label[for="zip"]');
		updateStateDropdown(this._selectedCountry, zipLabel, this.country_config);
	}
}

export default CheckoutProduct;
