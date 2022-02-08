var searchDiv = $('#searchDiv');
var searchListDiv = $('#searchList');

var index;

searchDiv.on('click', '#searchBtn', function(event) {
    event.preventDefault();
    
    localStorage.setItem(index, $('#cityInput').val())

    location.reload();

    $('#currentCity').text($('#cityInput').val() + " (" + moment().format('MMMM DD YYYY') + ")");

    index++;
})

if (localStorage.length > 0) {
    index = localStorage.length;
    $('#currentCity').text(localStorage.getItem(index-1) + " (" + moment().format('MM/DD/YYYY') + ")");

    for (var i=0; i<localStorage.length; i++) {
        searchListDiv.append(
            '<button class="btn btn-secondary col-9 mx-3 my-2">'+localStorage.getItem(i)+'</button>'
        )
    }
    searchListDiv.append(
        '<button class="btn btn-danger col-9 mx-3 my-2">Clear History</button>'
    )
}
else {
    index = 0;
    searchListDiv.append(
        '<button class="btn btn-danger col-9 mx-3 my-2">Clear History</button>'
    )
}

searchListDiv.on('click', '.btn-danger', function(event) {
    localStorage.clear();
    location.reload();
})