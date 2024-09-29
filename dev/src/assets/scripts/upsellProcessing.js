/**
 * Class representing a payment processor.
 */
class PaymentProcessor {
	constructor() {
		this.lockInButton = document.querySelector(".choice");

		this.initListeners();
	}

	/**
	 * Initialize event listeners for the payment processor.
	 */
	initListeners() {
		// Radio button Offer Take
		const purchaseForm = document.querySelector(".purchase__form");
		if (purchaseForm) {
			purchaseForm.addEventListener("submit", (e) => {
				e.preventDefault();
				const selectedProduct = document.querySelector("input[name=product]:checked");
				if (selectedProduct) {
					const productId = selectedProduct.dataset.productId;
					this.processPayment(productId);
				}
			});
		}

		// Button Click Offer Take
		const upsellButtons = document.querySelectorAll(".process-upsell");
		upsellButtons.forEach((element) => {
			console.log(element);
			element.addEventListener("click", (e) => {
				e.preventDefault();
				const productId = element.dataset.productId;
				if (productId) {
					this.processPayment(productId);
				} else {
					// Process ProductID in the Page table
					this.processPayment();
				}
			});
		});

		// Offer Declined
		const nextPageButtons = document.querySelectorAll(".process-next-page");
		nextPageButtons.forEach((button) => {
			button.addEventListener("click", async (e) => {
				e.preventDefault();

				this.toggleLockInButton(false);
				window.openModal("#processing-modal");

				const requestData = this.createRequestData();

				try {
					const data = await this.postRequest("/api/next", requestData);

					console.log(data);

					if (data[0]) {
						window.location = data[0];
					} else {
						window.closeModal("#processing-modal");

						this.toggleLockInButton(true);
						alert("Sorry, no next page path set.");

						// TODO Sentry error collection
					}
				} catch (error) {
					// TODO Sentry error collection
					console.error("Request failed:", error);
				}
			});
		});
	}

	/**
	 * Process the payment for the specified product ID.
	 * @param {string} productId - The ID of the product to process the payment for.
	 * @throws Will throw an error if the productId is not provided.
	 */
	async processPayment(productId) {
		this.toggleLockInButton(false);
		window.openModal("#processing-modal");

		const charge = this.createChargeObject(productId);

		try {
			const response = await this.postRequest(charge.path, charge.data);
			this.handleResponse(response);
		} catch (error) {
			// TODO Sentry error collection
			alert("Sorry, an issue occurred that could not be recovered. Refresh and try again.");
			console.error("Request failed:", error);
		}
	}

	/**
	 * Create the charge object based on product ID and global variables.
	 * @param {string} productId - The ID of the product to create the charge object for.
	 * @returns {Object} The charge object.
	 */
	createChargeObject(productId) {
		let path;
		let data = {};

		if (!productId) {
			path = "/api/limelight/upsell";
		} else {
			path = "/api/limelight/upsell3";
			data.productId = productId;
		}

		if (typeof payPalBillingAgreementID !== "undefined" && payPalBillingAgreementID) {
			path = "/api/paypal/charge/upsell3";
			data.select = false;
		}

		if (window.optimizeExperimentId && window.optimizeVariationId) {
			data = {
				...data,
				optimizeExperimentId: window.optimizeExperimentId,
				optimizeVariationId: window.optimizeVariationId,
			};

			if (typeof domainId !== "undefined") data.domainId = domainId;
			if (typeof pathId !== "undefined") data.pathId = pathId;
			if (typeof pageId !== "undefined") data.pageId = pageId;
		}

		return {path, data};
	}

	/**
	 * Send a POST request to the specified URL with the given data.
	 * @param {string} urlPath - The path of the URL to send the request to.
	 * @param {Object} data - The data to send in the request body.
	 * @returns {Promise<Object>} The response from the server.
	 */
	async postRequest(urlPath, data) {
		const protocol = window.location.protocol;
		const apex = window.location.hostname.split(".").slice(-2).join(".");
		const url = `${protocol}//api.${apex}${urlPath}`;

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

		return response.json();
	}

	/**
	 * Handle the response from the server.
	 * @param {Object} response - The response from the server.
	 */
	handleResponse(response) {
		if (response.transaction.errorFound == 1) {
			setTimeout(() => {
				window.location = response[0];
			}, 3000);
			return;
		}

		const redirectPath = response[1] || response[0];

		if (!redirectPath) {
			window.closeModal("#processing-modal");
			this.toggleLockInButton(true);
			alert("Sorry, no next page path set.");
			return;
		}

		if (typeof pushDataLayer === "function" && window["google_tag_manager"]) {
			pushDataLayer(response.transaction, response.product, () => {
				setTimeout(() => {
					window.location.href = redirectPath;
				}, 2500);
			});
		} else {
			setTimeout(() => {
				window.location.href = redirectPath;
			}, 2500);
		}
	}

	/**
	 * Toggle the display of the lock-in button.
	 * @param {boolean} show - Whether to show or hide the lock-in button.
	 */
	toggleLockInButton(show) {
		this.lockInButton.style.display = show ? "block" : "none";
	}

	/**
	 * Create request data object with experiment and variation IDs.
	 * @returns {Object} The request data object.
	 */
	createRequestData() {
		let requestData = {};

		if (window.optimizeExperimentId && window.optimizeVariationId) {
			requestData = {
				optimizeExperimentId,
				optimizeVariationId,
			};

			if (typeof domainId !== "undefined") requestData.domainId = domainId;
			if (typeof pathId !== "undefined") requestData.pathId = pathId;
			if (typeof pageId !== "undefined") requestData.pageId = pageId;
		}

		return requestData;
	}
}

export default PaymentProcessor;

// In another file, you would import and use the class like this:
// import PaymentProcessor from './path-to-this-file';
// const paymentProcessor = new PaymentProcessor();
// paymentProcessor.init();
