jQuery(document).ready(function($) {
	//Declare golbal variables
	var lat, lon, location;
	var temp_c, temp_f, weather, weatherIcon, dailyLowF, dailyHighF, dailyLowC, dailyHighC, forecastTxt, forecastTxtMetric;
	var plusOneIcon, plusTwoIcon, plusThreeIcon, plusOneforecastTxt, plusTwoforecastTxt, plusThreeforecastTxt;
	var plusOneforecastTxtMetric, plusTwoforecastTxtMetric, plusThreeforecastTxtMetric;
	var plusOneDailyHighF, plusTwoDailyHighF, plusThreeDailyHighF, plusOneDailyHighC, plusTwoDailyHighC, plusThreeDailyHighC;
	var plusOneDailyLowF, plusTwoDailyLowF, plusThreeDailyLowF, plusOneDailyLowC, plusTwoDailyLowC, plusThreeDailyLowC;

	var degC = String.fromCharCode(176) + "C";
	var degF = String.fromCharCode(176) + "F";
	var weatherIcons = {
		chanceflurries: "wi-rain-mix",
		chancerain: "wi-raindrops",
		chancesleet: "wi-snowflake-cold",
		chancesnow: "wi-snowflake-cold",
		chancetstorms: "wi-lightning",
		clear: "wi-day-sunny",
		cloudy: "wi-cloudy",
		flurries: "wi-rain-mix",
		fog: "wi-fog",
		hazy: "wi-day-haze",
		mostlycloudy: "wi-cloudy",
		mostlysunny: "wi-day-sunny-overcast",
		partlycloudy: "wi-day-cloudy",
		partlysunny: "wi-day-sunny-overcast",
		sleet: "wi-sleet",
		rain: "wi-rain",
		snow: "wi-snow",
		sunny: "wi-day-sunny",
		tstorms: "wi-thunderstorm",
		nt_chanceflurries: "wi-night-alt-showers",
		nt_chancerain: "wi-night-alt-showers",
		nt_chancesleet: "wi-night-alt-sleet",
		nt_chancesnow: "wi-night-alt-snow",
		nt_chancetstorms: "wi-night-alt-thunderstorm",
		nt_clear: "wi-night-clear",
		nt_cloudy: "wi-night-alt-cloudy",
		nt_flurries: "wi-night-alt-rain-mix",
		nt_fog: "wi-night-fog",
		nt_hazy: "wi-night-fog",
		nt_mostlycloudy: "wi-night-alt-cloudy",
		nt_partlycloudy: "wi-night-alt-partly-cloudy",
		nt_sleet: "wi-night-alt-sleet",
		nt_rain: "wi-night-alt-rain",
		nt_snow: "wi-night-alt-snow",
		nt_tstorms: "wi-night-alt-thunderstorm",
		unknown: "wi-na"
	};
	var locationsArray = [];

	//Check if navigator.geolocation is supported by browser
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, fail);
		console.log("Geolocation supported");
	} else {
		console.log("Geolocation not supported");
	}
	//If navigator.geolocation is supported and the user allows access to location
	function success(position) {
		lat = position.coords.latitude;
		lon = position.coords.longitude;
		console.log("Geo browser success - Lat = " + lat + " Lon = " + lon);
		$.get("https://api.wunderground.com/api/878e77b9c3411d19/geolookup/conditions_v11/astronomy/forecast/q/" + lat + "," + lon + ".json", function(data) {
			getWeather(data);
			futureWeather(data);
		});
	}
	//If the browser isnt supported and/or the user declines the use of their location
	function fail() {
		console.log("Geo browser fail");
		$.get("https://api.wunderground.com/api/878e77b9c3411d19/geolookup/conditions_v11/astronomy/forecast/q/autoip.json", function(data) {
			getWeather(data);
			futureWeather(data);	
		});
	}
	
	//Input value using jQuery UI autocomplete to locate location and send data to getWeather() to update the DOM
	$("input[name='location']").on("keyup", function(e) {
		if($(this).val().length > 2) {
			locationsArray = [];
			var value = "https://autocomplete.wunderground.com/aq?cb=?&query=" + $(this).val();
			$.getJSON(value).done(function(data) {
				data.RESULTS.forEach(function(city) {
					if(city.name.indexOf(",") !== -1) {
						locationsArray.push(city.name);
					}
				});
			});
		}
		$(this).autocomplete({
			minLength: 3,
			delay: 500,
		   	source: locationsArray,
		   	select: function(event, ui){
		    	var autoCity = ui.item.value;
		   		$.get("https://api.wunderground.com/api/878e77b9c3411d19/geolookup/conditions_v11/astronomy/forecast/q/" + autoCity + ".json", function(data) {
					getWeather(data);
					futureWeather(data);	
					$("input[name='location']").val("");
				});
		   	},
		   	response: function(event, ui) {
		   		if(ui.content.length === 0 && $("input[name='location']").val().length > 3) {
		   			$("#warningMessage").text("No results found");
		   		} else
		   			$("#warningMessage").empty();
		   	}
		});
	});	

	//Function to get weather and display to DOM. Data will depend on how the JSON URL was created above
	function getWeather(data) {
		// console.log(data);
		if(data.response.error) {
			alert(data.response.error.description);
		}
		var windSpeed = data.current_observation.wind_mph;
		var windDir = data.current_observation.wind_dir;
		var sunriseHour = data.sun_phase.sunrise.hour;
		var sunriseMin = data.sun_phase.sunrise.minute;
		var sunsetHour = data.sun_phase.sunset.hour;
		var sunsetMin = data.sun_phase.sunset.minute;
		var today = data.forecast.txt_forecast.forecastday[0].title;
		location = data.current_observation.display_location.full;
		temp_c = data.current_observation.temp_c;
		temp_f = data.current_observation.temp_f;
		weather = data.current_observation.weather;
		dailyHighC = data.forecast.simpleforecast.forecastday[0].high.celsius; 
		dailyLowC = data.forecast.simpleforecast.forecastday[0].low.celsius;
		dailyHighF = data.forecast.simpleforecast.forecastday[0].high.fahrenheit; 
		dailyLowF = data.forecast.simpleforecast.forecastday[0].low.fahrenheit;
		weatherIcon = data.current_observation.icon;

		forecastTxtMetric = data.forecast.txt_forecast.forecastday[0].fcttext_metric;
		forecastTxt = data.forecast.txt_forecast.forecastday[0].fcttext;

		$("#degC").prop("checked", true);
		toggleTemp();

		$("#currentLocation").text(location);
		if($("#currentLocation").text().length > 27) {
			$("#currentLocation").removeClass("currentLocationOneLine").addClass("currentLocationTwoLines");
		} else {
			$("#currentLocation").removeClass("currentLocationTwoLines").addClass("currentLocationOneLine");
		}
		
		$(".forecast p").html("Today " + "<span><strong>" + today + "</strong></span>");
		$("#currentWindSpeed").html("<i class='wi wi-strong-wind'></i><span> " + windSpeed + " mph " + windDir + "</span>");
		$("#astronomy .sunrise").html("<i class='wi wi-sunrise'></i> 0" + sunriseHour + ":" + sunriseMin);
		$("#astronomy .sunset").html("<i class='wi wi-sunset'></i> " + sunsetHour + ":" + sunsetMin);
		// comment below
		$("#currentWeather").text(weather + ", " + temp_c + degC);
		$("#currentWeather").prepend("<span><i class='wi " + weatherIcons[weatherIcon] + "'></i></span> ");
		$("#forecastTxt").text(forecastTxtMetric);
		$("#highLow .high span").text(dailyHighC + degC);		
		$("#highLow .low span").text(dailyLowC + degC);	
		// comment above
	}

	function futureWeather(data) {
		var plusOneDay = data.forecast.simpleforecast.forecastday[1].date.weekday_short;
		var plusOneMonth = data.forecast.simpleforecast.forecastday[1].date.monthname_short;
		var plusOneDate = data.forecast.simpleforecast.forecastday[1].date.day;
		var plusOneHumid = data.forecast.simpleforecast.forecastday[1].avehumidity;
		plusOneIcon = data.forecast.simpleforecast.forecastday[1].icon;
		plusOneforecastTxtMetric = data.forecast.txt_forecast.forecastday[2].fcttext_metric;
		plusOneforecastTxt = data.forecast.txt_forecast.forecastday[2].fcttext;
		plusOneDailyHighC = data.forecast.simpleforecast.forecastday[1].high.celsius; 
		plusOneDailyLowC = data.forecast.simpleforecast.forecastday[1].low.celsius;
		plusOneDailyHighF = data.forecast.simpleforecast.forecastday[1].high.fahrenheit; 
		plusOneDailyLowF = data.forecast.simpleforecast.forecastday[1].low.fahrenheit;

		var plusTwoDay = data.forecast.simpleforecast.forecastday[2].date.weekday_short;
		var plusTwoMonth = data.forecast.simpleforecast.forecastday[2].date.monthname_short;
		var plusTwoDate = data.forecast.simpleforecast.forecastday[2].date.day;
		var plusTwoHumid = data.forecast.simpleforecast.forecastday[2].avehumidity;
		plusTwoIcon = data.forecast.simpleforecast.forecastday[2].icon;
		plusTwoforecastTxtMetric = data.forecast.txt_forecast.forecastday[4].fcttext_metric;
		plusTwoforecastTxt = data.forecast.txt_forecast.forecastday[4].fcttext;
		plusTwoDailyHighC = data.forecast.simpleforecast.forecastday[2].high.celsius; 
		plusTwoDailyLowC = data.forecast.simpleforecast.forecastday[2].low.celsius;
		plusTwoDailyHighF = data.forecast.simpleforecast.forecastday[2].high.fahrenheit; 
		plusTwoDailyLowF = data.forecast.simpleforecast.forecastday[2].low.fahrenheit;

		var plusThreeDay = data.forecast.simpleforecast.forecastday[3].date.weekday_short;
		var plusThreeMonth = data.forecast.simpleforecast.forecastday[3].date.monthname_short;
		var plusThreeDate = data.forecast.simpleforecast.forecastday[3].date.day;
		var plusThreeHumid = data.forecast.simpleforecast.forecastday[3].avehumidity;
		plusThreeIcon = data.forecast.simpleforecast.forecastday[3].icon;
		plusThreeforecastTxtMetric = data.forecast.txt_forecast.forecastday[6].fcttext_metric;
		plusThreeforecastTxt = data.forecast.txt_forecast.forecastday[6].fcttext;
		plusThreeDailyHighC = data.forecast.simpleforecast.forecastday[3].high.celsius; 
		plusThreeDailyLowC = data.forecast.simpleforecast.forecastday[3].low.celsius;
		plusThreeDailyHighF = data.forecast.simpleforecast.forecastday[3].high.fahrenheit; 
		plusThreeDailyLowF = data.forecast.simpleforecast.forecastday[3].low.fahrenheit;

		toggleTemp();

		$("#plusOne p").text(plusOneDay + ", " + plusOneMonth + " " + plusOneDate);
		$("#plusTwo p").text(plusTwoDay + ", " + plusTwoMonth + " " + plusTwoDate);
		$("#plusThree p").text(plusThreeDay + ", " + plusThreeMonth + " " + plusThreeDate);
		// comment below
		$("#plusOne .plusForecast").html("<span><i class='wi " + weatherIcons[plusOneIcon] + "'></i></span> " +
			"<div>" + plusOneforecastTxtMetric + "</div>");
		$("#plusTwo .plusForecast").html("<span><i class='wi " + weatherIcons[plusTwoIcon] + "'></i></span> " +
			"<div>" + plusTwoforecastTxtMetric + "</div>");
		$("#plusThree .plusForecast").html("<span><i class='wi " + weatherIcons[plusThreeIcon] + "'></i></span> " +
			"<div>" + plusThreeforecastTxtMetric + "</div>");

		$("#plusOne .plusHighLow .high span").text(plusOneDailyHighC + degC);
		$("#plusOne .plusHighLow .low span").text(plusOneDailyLowC + degC);
		$("#plusTwo .plusHighLow .high span").text(plusTwoDailyHighC + degC);
		$("#plusTwo .plusHighLow .low span").text(plusTwoDailyLowC + degC);
		$("#plusThree .plusHighLow .high span").text(plusThreeDailyHighC + degC);
		$("#plusThree .plusHighLow .low span").text(plusThreeDailyLowC + degC);
		// comment above
		$("#plusOne .plusHighLow .humid span").text(plusOneHumid + "%");
		$("#plusTwo .plusHighLow .humid span").text(plusTwoHumid + "%");
		$("#plusThree .plusHighLow .humid span").text(plusThreeHumid + "%");
	}

	function toggleTemp() {
		$("input[type='radio']").on("click", function() {
			if($("#degF").prop("checked")) {
				$("#currentWeather").text(weather + ", " + temp_f + degF);
				$("#currentWeather").prepend("<span><i class='wi " + weatherIcons[weatherIcon] + "'></i></span> ");
				$("#highLow .high span").text(dailyHighF + degF);		
				$("#highLow .low span").text(dailyLowF + degF);	
				$("#forecastTxt").text(forecastTxt);

				$("#plusOne .plusForecast").html("<span><i class='wi " + weatherIcons[plusOneIcon] + "'></i></span> " +
					"<div>" + plusOneforecastTxt + "</div>");
				$("#plusTwo .plusForecast").html("<span><i class='wi " + weatherIcons[plusTwoIcon] + "'></i></span> " +
					"<div>" + plusTwoforecastTxt + "</div>");
				$("#plusThree .plusForecast").html("<span><i class='wi " + weatherIcons[plusThreeIcon] + "'></i></span> " +
					"<div>" + plusThreeforecastTxt + "</div>");

				$("#plusOne .plusHighLow .high span").text(plusOneDailyHighF + degF);
				$("#plusOne .plusHighLow .low span").text(plusOneDailyLowF + degF);
				$("#plusTwo .plusHighLow .high span").text(plusTwoDailyHighF + degF);
				$("#plusTwo .plusHighLow .low span").text(plusTwoDailyLowF + degF);
				$("#plusThree .plusHighLow .high span").text(plusThreeDailyHighF + degF);
				$("#plusThree .plusHighLow .low span").text(plusThreeDailyLowF + degF);
				// console.log("Deg F checked");
			} else {
				$("#currentWeather").text(weather + ", " + temp_c + degC);
				$("#currentWeather").prepend("<span><i class='wi " + weatherIcons[weatherIcon] + "'></i></span> ");
				$("#highLow .high span").text(dailyHighC + degC);		
				$("#highLow .low span").text(dailyLowC + degC);	
				$("#forecastTxt").text(forecastTxtMetric);

				$("#plusOne .plusForecast").html("<span><i class='wi " + weatherIcons[plusOneIcon] + "'></i></span> " +
					"<div>" + plusOneforecastTxtMetric + "</div>");
				$("#plusTwo .plusForecast").html("<span><i class='wi " + weatherIcons[plusTwoIcon] + "'></i></span> " +
					"<div>" + plusTwoforecastTxtMetric + "</div>");
				$("#plusThree .plusForecast").html("<span><i class='wi " + weatherIcons[plusThreeIcon] + "'></i></span> " +
					"<div>" + plusThreeforecastTxtMetric + "</div>");

				$("#plusOne .plusHighLow .high span").text(plusOneDailyHighC + degC);
				$("#plusOne .plusHighLow .low span").text(plusOneDailyLowC + degC);
				$("#plusTwo .plusHighLow .high span").text(plusTwoDailyHighC + degC);
				$("#plusTwo .plusHighLow .low span").text(plusTwoDailyLowC + degC);
				$("#plusThree .plusHighLow .high span").text(plusThreeDailyHighC + degC);
				$("#plusThree .plusHighLow .low span").text(plusThreeDailyLowC + degC);
				// console.log("Deg C checked");
			}
		});
	}
});