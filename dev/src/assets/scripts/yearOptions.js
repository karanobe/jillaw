export function updateYearDropdown() {
	const yearDropdown = document.querySelector("select[name='expirationYear']");

	// Remove all options except the first one
	const options = yearDropdown.querySelectorAll("option:not(:first-child)");
	options.forEach((option) => option.remove());

	const currentYear = new Date().getFullYear();

	for (let i = currentYear; i <= currentYear + 10; i++) {
		const option = document.createElement("option");
		option.textContent = i;
		option.value = i.toString().substring(2);
		yearDropdown.appendChild(option);
	}
}
