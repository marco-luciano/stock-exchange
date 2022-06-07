const STOCKS_BASE_URL =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
const STOCKS_SEARCH_LIMIT = 10;

let search = document.getElementById("btnStockSearch");
let inputStockSearch = document.getElementById("inputStockSearch");
var lastSymbol = "";

inputStockSearch.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();

        // Enter key on input works as button click, makes Fibonacci calculation
        document.getElementById("btnStockSearch").click();
    }
});

search.addEventListener("click", function () {
    let searchText = document.getElementById("inputStockSearch").value;

    if (searchText !== "") {
        let searchURL = `${STOCKS_BASE_URL}/api/v3/search?query=${searchText}&amp;limit=${STOCKS_SEARCH_LIMIT}&amp;exchange=NASDAQ`;
        let stockList = document.getElementById("stockList");
        stockList.replaceChildren();
        showLoading();
        fetch(searchURL)
            .then((response) => response.json())
            .then(function (data) {
                hideLoading();
                console.log(data);
                console.log(typeof data);
                if (typeof data === "object") {
                    let cards = [];

                    cards = createStockCards(data);
                    console.log("card", cards);
                    let stockList = document.getElementById("stockList");

                    stockList.replaceChildren(...cards);
                }
            });
    }
});

function createStockCards(data) {
    let cards = [];
    for (element of data) {
        let card = document.createElement("div");
        card.className = "div__card-stock card shadow cursor-pointer";

        let cardBody = document.createElement("div");
        cardBody.className = "card-body";

        let titleURL = document.createElement("a");
        titleURL.href = "/company.html?symbol=" + element.symbol;
        titleURL.target = "_blank";
        let title = document.createElement("h5");
        title.innerHTML = formatSymbol(element.symbol);
        title.className = "card-title";
        title.setAttribute("color", "red");

        let subtitle = document.createElement("h6");
        subtitle.innerText = element.name;
        subtitle.className = "card-subtitle";

        titleURL.appendChild(title);
        cardBody.appendChild(titleURL);
        cardBody.appendChild(subtitle);
        card.appendChild(cardBody);
        cards.push(card);
    }

    return cards;
}

function showLoading() {
    let searchBox = document.getElementById("stockList");
    let loading = document.createElement("div");
    loading.className = "div__loading text-center foo";
    let spinner = document.createElement("div");
    spinner.className = "spinner-border text-success";
    loading.appendChild(spinner);
    searchBox.appendChild(loading);
}

function hideLoading() {
    let searchBox = document.getElementById("stockList");
    let loading = document.getElementsByClassName("div__loading");
    searchBox.removeChild(loading[0]);
}

function formatSymbol(symbol) {
    symbolFormatted = "<b>$" + symbol + "</b>";
    return symbolFormatted;
}

function addLink(link) {
    linkElement.innerText = "View on Yahoo Finance";
    return linkElement;
}
