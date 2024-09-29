// src/scripts/updateEstimatedDeliveryDate.js
import {calculateDeliveryDate} from "./calculateDeliveryDate.js";

export function updateEstimatedDeliveryDate(businessDays) {
	const now = new Date();
	const nowUTC = new Date(now.toISOString()); // This ensures 'now' is in UTC

	// TODO move selector up
	const estimatedArrivalDate = document.querySelector(".estimated-arrival__date");
	estimatedArrivalDate.innerHTML = calculateDeliveryDate(nowUTC, businessDays);
}
