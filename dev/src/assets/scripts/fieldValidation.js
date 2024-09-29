// Validity.js

/**
 * Validates form fields against regular expressions
 * @param {object} fieldRules
 * @constructor
 */
export function Validity(fieldRules) {
	if (typeof fieldRules !== "object") {
		throw new Error("fieldRules is expected to be an Object and is required");
	}

	// Contains form field data
	this.formData = {};
	// Contains an array of form errors
	this.formError = [];
	// Rules for the form fields
	this.fieldRules = fieldRules;
}

Validity.prototype = {
	// 1. Validate field against Field Rules
	validate: function () {
		// Clear
		this.formData = {};
		this.formError = [];

		// Loop through rules
		for (let fieldName in this.fieldRules) {
			if (this.fieldRules.hasOwnProperty(fieldName)) {
				// Select field
				let field = document.querySelector(`[name=${fieldName}]`);

				// Get field value
				let value = field ? field.value : "";

				if (fieldName === "creditCardNumber") {
					// If credit card, remove non-digit characters
					value = value.replace(/\D/g, "");
				}

				if (value != null) {
					// This checks for both null and undefined
					value = value.toLowerCase();
				}

				// Remove previous border styling
				field.style.border = "1px solid #cecccc";

				// Get field rules
				let rule = this.fieldRules[fieldName];

				// Add form data to object
				this.formData[fieldName] = value;

				// Check if Required
				if (rule.indexOf("required") !== -1) {
					if (value === "" || value == undefined) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "required",
							failedMessage: "Field Required",
						});
					}
				}

				// Check if Credit Card Number
				if (rule.indexOf("credit card number") !== -1) {
					if (!/[0-9\-]/.test(value)) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "credit card number",
							failedMessage: "Field should only contain Numbers & Hyphens",
						});
					}
				}

				// Check if Number
				if (rule.indexOf("numbers") !== -1) {
					if (!/^\d+$/.test(value)) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "numbers",
							failedMessage: "Field should only contain Numbers",
						});
					}
				}

				// Check if Letters
				if (rule.indexOf("letters") !== -1) {
					if (!/^[a-zA-Z]+$/.test(value)) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "letters",
							failedMessage: "Field should only contain Letters",
						});
					}
				}

				// Check if numbers, letters, spaces, periods, hyphens
				if (rule.indexOf("numbers letters spaces periods hyphens") !== -1) {
					if (!/^[0-9a-zA-Z\s-.]+$/.test(value)) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "numbers letters",
							failedMessage: "Field should only contain Numbers, Letters, Periods, Spaces & Hyphens",
						});
					}
				}

				// Check if Email Address
				if (rule.indexOf("email") !== -1) {
					// Remove first and last spaces if found
					value = value.trim();

					if (!/^([\w_\.\-\+])+\@([\w\-]+\.)+([\w]{2,10})+$/.test(value)) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "email",
							failedMessage: "Field should be formatted like an Email Address",
						});
					}
				}

				// Check if Email Address matches
				if (rule.indexOf("match") !== -1) {
					let emailField = document.querySelector("[name=emailAddress]");
					let confirmEmailField = document.querySelector("[name=confirmEmailAddress]");

					if (emailField && confirmEmailField && emailField.value !== confirmEmailField.value) {
						this.formError.push({
							fieldName: fieldName,
							failedRule: "match",
							failedMessage: "Field should match Email Address",
						});
					}
				}
			}
		}

		this.error();
	},

	// 2. Check for errors return boolean
	error: function () {
		let errorField = document.querySelector(".error-message");

		if (this.formError.length) {
			for (let error of this.formError) {
				// Select & add border to field with error
				let fieldSelect = document.querySelector(`[name=${error.fieldName}]`);
				// Add Red borders around
				fieldSelect.style.border = "2px solid #ff0000";

				// Detect first found Error
				if (this.formError.indexOf(error) === 0) {
					// Focus on the first field in form that contains Error
					fieldSelect.focus();
					// Show Error Div
					errorField.style.display = "block";

					console.log(error.failedMessage);
					// Insert Error Message
					errorField.innerHTML = error.failedMessage;
					// Scroll Page to Error Message Div
					errorField.scrollIntoView({behavior: "smooth"});

					// Get the current position of the error field
					const errorFieldPosition = errorField.getBoundingClientRect().top + window.pageYOffset;

					// Scroll to the position 10 pixels above the error field
					window.scrollTo({
						top: errorFieldPosition - 10,
						behavior: "smooth",
					});
				}
			}
		} else {
			// Clear error message
			errorField.innerHTML = "";
			// Hide Error Message Div
			errorField.style.display = "none";
		}
	},

	// 3. Return back if form is valid or not
	valid: function () {
		return this.formError.length === 0;
	},

	// Returns back formData
	data: function () {
		return this.formData;
	},
};
