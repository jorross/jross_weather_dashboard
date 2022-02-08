/*
    TO DO
===================
AUTOFILL CITIES SEARCH
----------------------
- find 3rd party api to autofill cities
- integrate into current input fields

GETTING COORDINATES
---------------------
- set up project on google api server
- enable geocode api
- set up variables for url path and api key and user params
                                                 ^ -> capture user inputs and append to url string           
- make api call to convert cities to geocodes

GETTING WEATHER
-------------------
- get api key for weather api
- create path variable including api key and lat/long found from the geocode api call
- caputre response from fetch call and parse the necessary information (current conditions & 5 day forcast)
- write the current conditions on to the html dashboard container
- wrote the forcast for the next 5 days, one on each card
*/
var searchDiv = $('#searchDiv');
var searchListDiv = $('#searchList');

var geo_url_path = "https://maps.googleapis.com/maps/api/geocode/json"
var geo_url_params = "?address="
var geo_api_key = "&key=AIzaSyCAhY-AP5wzYt1ngWZ86qHYzoUsYKnoQmE";

var weather_url_path = "https://api.openweathermap.org/data/2.5/onecall"
var weather_url_params;
var weather_api_key = "&appid=a2b68520c77d3d2446b525144eb3bb43";

var lat, lng;

var index;
if (localStorage.length > 0) {
    index = localStorage.length
    $('#currentCity').text(localStorage.getItem(index - 1) + " (" + moment().format('M/D/YYYY') + ")")

    var geo_url = constructGeoUrl(localStorage.getItem(index - 1));
    callGeocodeApi(geo_url).then(function(result) {
        var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
        callWeatherApi(weather_url);
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

        var geo_url = constructGeoUrl(localStorage.getItem(index - 1));
        callGeocodeApi(geo_url).then(function(result) {
            var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
            callWeatherApi(weather_url);
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
    var inputSplit = user_input.split(" ");
    for (var i = 0; i < inputSplit.length; i++) {
        if (i < inputSplit.length - 1) {
            geo_url_params += inputSplit[i] + "+";
        }
        else {
            geo_url_params += inputSplit[i];
        }
    };
    return geo_url_path + geo_url_params + geo_api_key;
}

function constructWeatherUrl(lat, long) {

    weather_url_params = "?lat=" + lat + "&lon=" + long;

    return weather_url_path + weather_url_params + weather_api_key;
}

function callGeocodeApi(requestUrl) {
    return fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            lat = data.results[0].geometry.location.lat;
            lng = data.results[0].geometry.location.lng;
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
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            var payload = {}
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
            '<img src="" alt="" id="cardImg"' + i + '/>',
            '<p class="card-text" id="temp"' + i + '>Temp: </p>',
            '<p class="card-text" id="wind"' + i + '>Wind: </p>',
            '<p class="card-text" id="humidity"' + i + '>Humidity: </p>'
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
    callGeocodeApi(geo_url).then(function(result) {
        var weather_url = constructWeatherUrl(result.lat.toFixed(2), result.lng.toFixed(2));
        callWeatherApi(weather_url);
    });
})

searchListDiv.on('click', '.btn-danger', function (event) {
    localStorage.clear();
    location.reload();
})