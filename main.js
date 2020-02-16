$(function () {
    $.ajax({
        url: 'https://swapi.co/api/people/4',
        method: "GET"
    }).done(function (result) {
        console.log(result);
    });
})