// src/scripts/calculateDeliveryDate.js
export function calculateDeliveryDate(today = new Date(), businessDays = 2) {
	var _deliveryDate = today;
	var _totalDays = businessDays;
	var _months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	var _days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

	for (var _day = 1; _day <= _totalDays; _day++) {
		var _oneDay = _day * 24 * 60 * 60 * 1000;
		var _todayMilliseconds = today.getTime();
		_deliveryDate = new Date(_todayMilliseconds + _oneDay);
		var _dayOfTheWeek = _deliveryDate.getDay();
		if (_dayOfTheWeek == 0 || _dayOfTheWeek == 6) {
			_totalDays++;
		}
	}

	return _days[_deliveryDate.getDay()] + ", " + _months[_deliveryDate.getMonth()] + " " + _deliveryDate.getDate();
}
