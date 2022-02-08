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

    $('#currentCity').text(localStorage.getItem(index) + " (" + moment().format('MMMM DD YYYY') + ")");

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

    $('#currentCity').text($(this).text() + " (" + moment().format('MM/DD/YYYY') + ")");
})

searchListDiv.on('click', '.btn-danger', function (event) {
    localStorage.clear();
    location.reload();
})