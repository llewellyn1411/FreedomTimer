/*
	FreedomTimer.js
	Developed by Llewellyn Collins
	http://nl2bryourmind.co.za/
	version 0.1
*/
(function ($) {
	//set private variables
	var _options,
		_timeTo,
		_now,
		_config,
		_timerId,
		_elem,
		_strings = {
			modes: {
				'SHORT': 'short',
				'LONG': 'long',
				'DIGITAL': 'digital',
				'CUSTOM': 'custom'
			},
			messages: {
				'PAST': 'This date has past'
			}
		};

	//constructor
	$.fn.freedomTimer = function (config) {
		//extend default config
		_config = $.extend({}, $.fn.freedomTimer.defaults, config);;

		//set _now and _timeTo dates
		_timeTo = _getDateObj(new Date(_config.dateTo));
		_now = _getDateObj(new Date());

		//make this global
		_elem = this;

		//update view
		_update();

		//start interval
		_timerId = setInterval(function () {
			return _update();
		}, 1000);

		//return this for chaining
		return this;
	};

	//returns a date object

	function _getDateObj(date) {
		var dateObj = {
			date: date,
			time: date.getTime()
		}
		return dateObj;
	};

	//returns years html

	function _showYear(years, suffix) {
		if (years > 0) {
			return '<span id="ft-Year" class="ft-Year">' + years + suffix + '</span>';
		}
		return '';
	};

	//returns month html

	function _showMonth(months, suffix) {
		if (months > 0) {
			return '<span id="ft-Month" class="ft-Month">' + months + suffix + '</span>';
		}
		return '';
	};

	//returns week html

	function _showWeek(weeks, suffix) {
		if (weeks > 0) {
			return '<span id="ft-Week" class="ft-Week">' + weeks + suffix + '</span>';
		}
		return '';
	};

	//returns day html

	function _showDay(days, suffix) {
		if (days > 0) {
			return '<span id="ft-Day" class="ft-Day">' + days + suffix + '</span>';
		}
		return '';
	};

	//returns hour html

	function _showHour(hours, suffix) {
		if (hours >= 0) {
			return '<span id="ft-Hour" class="ft-Hour">' + hours + suffix + '</span>';
		}
		return '';
	};

	//returns minute html

	function _showMinute(minutes, suffix) {
		if (minutes >= 0) {
			return '<span id="ft-Minute" class="ft-Minute">' + minutes + suffix + '</span>';
		}
		return '';
	};

	//returns seconds html

	function _showSecond(seconds, suffix) {
		if (seconds >= 0) {
			return '<span id="ft-Second" class="ft-Second">' + seconds + suffix + '</span>';
		}
		return '';
	};

	//returns on object with the time diffrences

	function _getDateDifference() {
		var obj = {},
			years = 0,
			months = 0,
			weeks = 0,
			days = 0,
			hours = 0,
			minutes = 0,
			seconds = 0,
			hasPast = true;

		_now = _getDateObj(new Date());
		seconds = (_timeTo.time - _now.time) / 1000;
		if (seconds > 0) {
			hasPast = false;
			years = Math.floor(seconds / 365 / 12 / 7 / 24 / 60 / 60);
			if (years > 0) {
				seconds -= years * 365 * 7 * 24 * 60 * 60;
			}
			months = Math.floor(seconds / 12 / 7 / 24 / 60 / 60);
			if (months > 0) {
				seconds -= months * 7 * 24 * 60 * 60;
			}
			weeks = Math.floor(seconds / 7 / 24 / 60 / 60);
			if (weeks > 0) {
				seconds -= weeks * 7 * 24 * 60 * 60;
			}
			days = Math.floor(seconds / 24 / 60 / 60);
			if (days > 0) {
				seconds -= days * 24 * 60 * 60;
			}
			hours = Math.floor(seconds / 60 / 60);
			if (hours > 0) {
				seconds -= hours * 60 * 60;
			}
			minutes = Math.floor(seconds / 60);
			if (minutes) {
				seconds -= minutes * 60;
			}
			seconds = Math.floor(seconds);
			if (seconds < 10) {
				seconds = "0" + seconds;
			}
		}

		obj = {
			'seconds': seconds,
			'minutes': minutes,
			'hours': hours,
			'days': days,
			'weeks': weeks,
			'months': months,
			'years': years,
			'hasPast': hasPast
		}

		return obj;
	};

	//updates the view

	function _update() {
		var timeLeft = _getDateDifference();
		if (!timeLeft.hasPast) {
			var html,
				years = timeLeft.years,
				months = timeLeft.months,
				weeks = timeLeft.weeks,
				days = timeLeft.days,
				hours = timeLeft.hours,
				minutes = timeLeft.minutes,
				seconds = timeLeft.seconds;

			switch (_config.mode) {
			case _strings.modes.SHORT:
				html = _showYear(years, ' Y') + ' ' + _showMonth(months, ' M') + ' ' + _showWeek(weeks, ' W') + ' ' + _showDay(days, ' D') + ' ' + _showHour(hours, ' H') + ' ' + _showMinute(minutes, ' M') + ' ' + _showSecond(seconds, ' S');
				break;
			case _strings.modes.LONG:
				html = _showYear(years, ' Years') + ' ' + _showMonth(months, ' Months') + ' ' + _showWeek(weeks, ' Weeks') + ' ' + _showDay(days, ' Days') + ' ' + _showHour(hours, ' Hours') + ' ' + _showMinute(minutes, ' Minutes') + ' ' + _showSecond(seconds, ' Seconds');
				break;
			case _strings.modes.DIGITAL:
				html = _showYear(years, ':') + _showMonth(months, ':') + _showWeek(weeks, ':') + _showDay(days, ':') + _showHour(hours, ':') + _showMinute(minutes, ':') + _showSecond(seconds, '');
				break;
			case _strings.modes.CUSTOM:
				if (config.timeString) {
					var timeString = _config.timeString;
					timeString = timeString.replace(/%Y/g, _showYear(years, ''));
					timeString = timeString.replace(/%M/g, _showMonth(months, ''));
					timeString = timeString.replace(/%W/g, _showWeek(weeks, ''));
					timeString = timeString.replace(/%D/g, _showDay(days, ''));
					timeString = timeString.replace(/%H/g, _showHour(hours, ''));
					timeString = timeString.replace(/%m/g, _showMinute(minutes, ''));
					timeString = timeString.replace(/%S/g, _showSecond(seconds, ''));
					html = timeString;
				}
				break;
			}
			_elem.html(html);
		} else {
			_elem.html(_config.pastMessage);
		}
	};

	// Plugin defaults – added as a property on our plugin function.
	$.fn.freedomTimer.defaults = {
		mode: _strings.modes.LONG,
		timeString: '',
		pastMessage: _strings.messages.PAST
	};

}(jQuery));