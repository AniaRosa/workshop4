$(function() {
    var app = $("#app");
    function apiCall(method, path, data) {
        var settings = {
            method: method,
            url: "http://localhost:8282" + path,
            contentType: "application/json"
        };
        if (data) {
            settings.data = JSON.stringify(data);
        }
        return $.ajax(settings);
    }

    function renderBooks(books) {
        app.empty();
        books.forEach(function(book) {
            var bookElement = $("<div>");
            var bookTitle = $("<div>");
            var bookDeleteButton = $("<button>");
            var bookDetails = $("<div>");
            bookElement
                .addClass("book")
                .appendTo(app);
            bookDeleteButton
                .addClass("book-delete")
                .attr("data-id", book.id)
                .attr("data-method", "DELETE")
                .text("Usuń")
                .appendTo(bookElement);
            bookTitle
                .addClass("book-title")
                .attr("data-id", book.id)
                .attr("data-method", "GET")
                .text(book.title)
                .appendTo(bookElement);
            bookDetails
                .addClass("book-details")
                .attr("id", "details")
                .attr("data-id", book.id)
                .attr("data-method", "GET")
                .appendTo(bookElement);
        });
    }

    function fetchBooks() {
        apiCall("GET", "/books/").done(renderBooks);
    }
    function handleForm() {
        $("#bookForm").attr("data-method", "POST");
        $("#bookForm").on("submit", function(e) {
            e.preventDefault();
            var data = {};
            $(this)
                .find("input")
                .each(function() {
                    var name = $(this).attr("name");
                    data[name] = $(this).val();
                });
            makeApiCall($("#bookForm"), fetchBooks, data)
        });
    }

    function deleteBook() {
        app.on("click", "button", function () {
            makeApiCall($(this), fetchBooks);
        })
    }

    function renderBookDetails() {
        app.on("click", "div", "#details", function (e) {
            e.stopPropagation();
            var detailsDiv = $(this).next();

            function bookDetails(data) {
                detailsDiv
                    .empty()
                    .append("ID: " + data.id + "<br />")
                    .append("Autor: " + data.author + "<br />")
                    .append("ISBN: " + data.isbn + "<br />")
                    .append("Tytuł: " + data.title + "<br />")
                    .append("Wydawca: " + data.publisher + "<br />")
                    .append("Typ: " + data.type + "<br />");
            }
            makeApiCall(detailsDiv, bookDetails)
        })
    }

    function makeApiCall(element, action, data) {
        if (data) {
            apiCall(element.attr("data-method"), "/books/", data).done(action);
        } else {
            apiCall(element.attr("data-method"), "/books/" + element.attr("data-id")).done(action);
        }
    }

    fetchBooks();
    handleForm();
    deleteBook();
    renderBookDetails();

});