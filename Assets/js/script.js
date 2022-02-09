/*
    TO DO
===================
AUTOFILL CITIES SEARCH
----------------------
- find 3rd party api to autofill cities
- integrate into current input fields

GETTING WEATHER
-------------------
- caputre response from fetch call and parse the necessary information (current conditions & 5 day forcast)
- Style the index number
- wrote the forcast for the next 5 days, one on each card
*/
var searchDiv = $('#searchDiv');
var searchListDiv = $('#searchList');

var geo_url_path = "https://api.openweathermap.org/geo/1.0/direct"
var geo_url_params;
var geo_api_key = "&appid=a2b68520c77d3d2446b525144eb3bb43";

var weather_url_path = "https://api.openweathermap.org/data/2.5/onecall"
var weather_url_params;
var weather_api_key = "&appid=a2b68520c77d3d2446b525144eb3bb43";

var lat, lng;

var index;
if (localStorage.length > 0) {
    index = localStorage.length
    $('#currentCity').text(localStorage.getItem(index - 1) + " (" + moment().format('M/D/YYYY') + ")")

    var geo_url = constructGeoUrl(localStorage.getItem(index - 1));
    callGeocodeApi(geo_url).then(function (result) {
        var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
        callWeatherApi(weather_url).then(function (result) {
            $('#currentCity').append(
                '<img src="https://openweathermap.org/img/wn/' + result.current.icon + '.png" alt="Current Weather Type" id="dashIcon"/>',
            );

            $('#currentTemp').text("Temp: " + result.temp + "°F");
            $('#currentWind').text("Wind: " + result.wind + " MPH");
            $('#currentHumidity').text("Humidity: " + result.humidity + "%");
            $('#currentUV').text("UV Index: " + result.uv_index);

            // console.log(result.future)
            for (var i = 1; i <= 5; i++) {
                $('#cardImg' + i).attr("src", "https://openweathermap.org/img/wn/" + result.future[i].weather[0].icon + ".png");
                $('#temp' + i).text("Temp: " + result.future[i].temp.max + "°F");
                $('#wind' + i).text("Wind: " + result.future[i].temp.max + " MPH");
                $('#humidity' + i).text("Humidity: " + result.future[i].temp.max + "%");
            }
        });
    });
}
else {
    index = 0;
    // $('#currentCity').text(localStorage.getItem(index) + " (" + moment().format('M/D/YYYY') + ")")
}



loadHistory();

populateCards();

searchDiv.on('click', '#searchBtn', function (event) {
    if ($('#cityInput').val() != '') {
        localStorage.setItem(index, $('#cityInput').val())

        $('#currentCity').text(localStorage.getItem(index) + " (" + moment().format('M/D/YYYY') + ")");

        var geo_url = constructGeoUrl(localStorage.getItem(index));
        callGeocodeApi(geo_url).then(function (result) {
            var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
            callWeatherApi(weather_url).then(function (result) {
                $('#currentCity').append(
                    '<img src="https://openweathermap.org/img/wn/' + result.current.icon + '.png" alt="Current Weather Type" id="dashIcon"/>',
                );

                $('#currentTemp').text("Temp: " + result.temp + "°F");
                $('#currentWind').text("Wind: " + result.wind + " MPH");
                $('#currentHumidity').text("Humidity: " + result.humidity + "%");
                $('#currentUV').text("UV Index: " + result.uv_index);

                // console.log(result.future)
                for (var i = 1; i <= 5; i++) {
                    $('#cardImg' + i).attr("src", "https://openweathermap.org/img/wn/" + result.future[i].weather[0].icon + ".png");
                    $('#temp' + i).text("Temp: " + result.future[i].temp.max + "°F");
                    $('#wind' + i).text("Wind: " + result.future[i].temp.max + " MPH");
                    $('#humidity' + i).text("Humidity: " + result.future[i].temp.max + "%");
                }
            });
        });

        cleansePage();
        loadHistory();

        index++;
    }
    else {
        console.log("Error: No input submitted");
    }
})

function constructGeoUrl(params) {
    var user_input = params;
    var inputSplit;
    if (user_input.includes(" ")) {
        inputSplit = user_input.split(" ");
        for (var i = 0; i < inputSplit.length; i++) {
            if (i === 0) {
                geo_url_params = "?q=";
            }
            if (i < inputSplit.length - 1) {
                geo_url_params += inputSplit[i] + "+";
            }
            else {
                geo_url_params += inputSplit[i];
            }
        };
    }
    else {
        geo_url_params = "?q=" + user_input;
    }
    
    return geo_url_path + geo_url_params + geo_api_key;
}

function constructWeatherUrl(lat, long) {

    weather_url_params = "?lat=" + lat + "&lon=" + long + "&units=imperial";

    return weather_url_path + weather_url_params + weather_api_key;
}

function callGeocodeApi(requestUrl) {
    return fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            lat = data[0].lat;
            lng = data[0].lon;
            var payload = {
                "lat": lat,
                "lng": lng
            }
            return payload;
        });
}

function callWeatherApi(requestUrl) {
    return fetch(requestUrl)
        .then(function (response) {
            // console.log(response);
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            var payload = {
                "temp": data.current.temp,
                "wind": data.current.wind_speed,
                "humidity": data.current.humidity,
                "uv_index": data.current.uvi,
                "current": data.current.weather[0],
                "future": data.daily
            }
            return payload;
        });
}

function loadHistory() {
    if (localStorage.length > 0) {
        for (var i = 0; i < localStorage.length; i++) {
            searchListDiv.append(
                '<button class="btn btn-secondary col-9 mx-3 my-2">' + localStorage.getItem(i) + '</button>'
            )
        }
    }
    addClearButton();
}

function populateCards() {
    for (var i = 1; i <= 5; i++) {
        $("#cardTitle" + i).text(moment().add(i, "days").format('M/D/YYYY'));
        $("#cardText" + i).append(
            '<img src="" alt="" id="cardImg' + i + '" />',
            '<p class="card-text" id="temp' + i + '">Temp: </p>',
            '<p class="card-text" id="wind' + i + '">Wind: </p>',
            '<p class="card-text" id="humidity' + i + '">Humidity: </p>'
        );
    }
}

function cleansePage() {
    $('#searchList').children().remove();
}

function addClearButton() {
    searchListDiv.append(
        '<button class="btn btn-danger col-9 mx-3 my-2">Clear History</button>'
    )
}

searchListDiv.on('click', '.btn-secondary', function (event) {
    event.preventDefault();

    $('#currentCity').text($(this).text() + " (" + moment().format('M/D/YYYY') + ")");

    var geo_url = constructGeoUrl($(this).text());
    callGeocodeApi(geo_url).then(function (result) {
        var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
        callWeatherApi(weather_url).then(function (result) {
            $('#currentCity').append(
                '<img src="https://openweathermap.org/img/wn/' + result.current.icon + '.png" alt="Current Weather Type" id="dashIcon"/>',
            );

            $('#currentTemp').text("Temp: " + result.temp + "°F");
            $('#currentWind').text("Wind: " + result.wind + " MPH");
            $('#currentHumidity').text("Humidity: " + result.humidity + "%");
            $('#currentUV').text("UV Index: " + result.uv_index);

            // console.log(result.future)
            for (var i = 1; i <= 5; i++) {
                $('#cardImg' + i).attr("src", "https://openweathermap.org/img/wn/" + result.future[i].weather[0].icon + ".png");
                $('#temp' + i).text("Temp: " + result.future[i].temp.max + "°F");
                $('#wind' + i).text("Wind: " + result.future[i].temp.max + " MPH");
                $('#humidity' + i).text("Humidity: " + result.future[i].temp.max + "%");
            }
        });
    });
})

searchListDiv.on('click', '.btn-danger', function (event) {
    localStorage.clear();
    location.reload();
})