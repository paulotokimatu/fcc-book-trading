var divBookList = document.querySelector(".books-list");
var isLoggedIn = document.querySelector("#is-logged-in");

function parseAllBooksData(data) {
    data = JSON.parse(data);
    for (var i = 0; i < data.length; i++ ) {
        var oneBook = document.createElement("div");
        oneBook.className = "one-book";
        var oneBookHTML = '<form action="' + baseUrl + '/trade/request" method="POST">' +
            '<img src="' + data[i].image + '" alt="' + data[i].title + '">' +
            '<input name="owner" type="hidden" value="' + data[i].owner + '"></input>' +
            '<input name="_id" type="hidden" value="' + data[i]._id + '"></input>';
        
        var oneBookDetail = document.createElement("div");
        oneBookDetail.className = "one-book-details";
        var oneBookDetailHTML = '<strong>Title:</strong> ' + data[i].title + '<br><strong>Authors</strong>: ' + 
            data[i].authors.join(" | ") + '<br><strong>Owner:</strong> <a href="' + baseUrl + 
            '/users/' + data[i].owner + '">' + data[i].owner + '</a><br>';
        if (isLoggedIn && isLoggedIn.value !== data[i].owner) oneBookDetailHTML  += '<br><button>Request trade</button></form>';
        oneBookDetail.innerHTML = oneBookDetailHTML;
        
        oneBook.innerHTML = oneBookHTML;
        divBookList.appendChild(oneBook);
        oneBook.appendChild(oneBookDetail);
    }
}
ajaxRequest("GET", baseUrl + "/api/books/all", parseAllBooksData);
