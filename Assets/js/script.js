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

var index;
if (localStorage.length > 0){
    index = localStorage.length
}
else {
    index = 0;
}


loadHistory();

searchDiv.on('click', '#searchBtn', function (event) {
    localStorage.setItem(index, $('#cityInput').val())

    $('#currentCity').text(localStorage.getItem(index) + " (" + moment().format('M/D/YYYY') + ")");

    cleansePage();
    loadHistory();

    index++;
})

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
})

searchListDiv.on('click', '.btn-danger', function (event) {
    localStorage.clear();
    location.reload();
})