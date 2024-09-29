// countdown.js

/**
 * Initializes and starts countdown timers for all elements with the specified class.
 * @param {string} className - The class of the elements where the timers will be displayed.
 * @param {number} duration - The duration of the countdown in seconds.
 * @param {number} speed - The speed of the countdown interval in milliseconds.
 */
export function startCountdownTimers(className, duration, speed = 100) {
	const spdVal = 10;
	let cntDown = duration * spdVal;

	const updateTimers = () => {
		cntDown--;
		if (cntDown < 0) return;

		const mn = String(Math.floor(cntDown / spdVal / 60)).padStart(2, "0");
		const sc = String(Math.floor((cntDown / spdVal) % 60)).padStart(2, "0");
		const ms = String(Math.floor(cntDown % spdVal)).padStart(2, "0");

		const result = `${mn}:${sc}`;
		const elements = document.querySelectorAll(`.${className}`);
		elements.forEach((element) => {
			element.innerText = result;
		});
	};

	setInterval(updateTimers, speed);
}
