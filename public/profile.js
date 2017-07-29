var imgBookReq = document.getElementsByClassName("book-req-img");
var imgBookGive = document.getElementsByClassName("book-give-img");
var headerBookReq = document.querySelector(".book-req-header");
var headerBookGive = document.querySelector(".book-give-header");
var btnSubmitSearch = document.getElementById("submit-search");
var querySearch = document.getElementById("query-search");
var divResult = document.querySelector(".list-books-add");

for (var i = 0; i < imgBookReq.length; i++) {
    imgBookReq[i].addEventListener("mouseover", function(e) {
        var bookId = e.target.getAttribute("id");
        var allBookReq = document.querySelectorAll(".book-req");
        for (var i = 0; i < allBookReq.length; i++) {
            allBookReq[i].setAttribute("style", "display: none");
        }
        document.getElementById("book-req-" + bookId).setAttribute("style", "display: block");
        //document.getElementById("book-req-" + bookId).classList.toggle("active");
    });
    /*
    imgBookReq[i].addEventListener("mouseout", function(e) {
        var bookId = e.target.getAttribute("id");
        document.getElementById("book-req-" + bookId).setAttribute("style", "display: none");
    });
    */
}

for (var i = 0; i < imgBookGive.length; i++) {
    imgBookGive[i].addEventListener("mouseover", function(e) {
        var bookId = e.target.getAttribute("id");
        var allBookGive = document.querySelectorAll(".book-give");
        for (var i = 0; i < allBookGive.length; i++) {
            allBookGive[i].setAttribute("style", "display: none");
        }
        document.getElementById("book-give-" + bookId).setAttribute("style", "display: block");
    });
    /*
    imgBookGive[i].addEventListener("mouseout", function(e) {
        var bookId = e.target.getAttribute("id");
        document.getElementById("book-give-" + bookId).setAttribute("style", "display: none");
    });
    */
}

if (headerBookReq) {
    headerBookReq.addEventListener("click", function() {
        document.querySelector(".book-req-container").classList.toggle("inactive");
    });
}
    
if (headerBookGive) {
    headerBookGive.addEventListener("click", function() {
        document.querySelector(".book-give-container").classList.toggle("inactive");
    });
}
    

function parseDataBookAdd(data) {
    divResult.innerHTML = "";
    data = JSON.parse(data);
    for (var i = 0; i < data.items.length; i++) {
        var bookOption = document.createElement("div");
        bookOption.className = "one-book-add";
        var bookId = data.items[i].id || "NA";
        var title = data.items[i].volumeInfo.title || "NA";
        var publishedDate = data.items[i].volumeInfo.publishedDate || "NA";
        if (data.items[i].volumeInfo.imageLinks) var image = data.items[i].volumeInfo.imageLinks.smallThumbnail;
        else var image = "NA";
        if (data.items[i].volumeInfo.authors) var authors = data.items[i].volumeInfo.authors.join(" | ");
        else var authors = ["NA"];
        
        bookOption.innerHTML = '<img src="' + image + '">' + 
        "<div><h3>" + title + "</h3><strong>Authors:</strong> " + authors +  "<br><strong>Published in:</strong> " + publishedDate +
        '<br><form action="/api/books" method="POST">' + 
        //bookOption.innerHTML += '<form action="/api/books" method="POST">' + 
        '<input name="bookId" type="hidden" value="' + bookId + '"></input>' + 
        '<input name="title" type="hidden" value="' + title + '"></input>' + 
        '<input name="authors" type="hidden" value="' + authors + '"></input>' + 
        '<input name="publishedDate" type="hidden" value="' + publishedDate + '"></input>' + 
        '<input name="image" type="hidden" value="' + image + '"></input>' +
        '<br><input type="submit" value="Add this book"></form></div>';

        divResult.appendChild(bookOption);
    }
}

if (btnSubmitSearch) {
    btnSubmitSearch.addEventListener("click", function() {
        ajaxRequest("GET", baseUrl + "/api/search/" + querySearch.value, parseDataBookAdd);
    });
}
