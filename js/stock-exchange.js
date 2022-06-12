const STOCKS_BASE_URL =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
const STOCKS_SEARCH_LIMIT = 10;
const SYMBOL_PREFIX = "$";

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

    removeStockProfileInfo();

    let searchText = document.getElementById("inputStockSearch").value;

    if (searchText !== "") {
        let searchURL = `${STOCKS_BASE_URL}/api/v3/search?query=${searchText}&amp;limit=${STOCKS_SEARCH_LIMIT}&amp;exchange=NASDAQ`;
        let stockList = document.getElementById("companyProfile");

        if (stockList) {
            stockList.replaceChildren();
            document.getElementById("stockPlot").style.display = "none";
        }

        showLoading();
        fetch(searchURL)
            .then((response) => response.json())
            .then(function (data) {
                hideLoading();
                if (typeof data === "object") {
                    let cards = [];

                    cards = createStockCards(data);
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
        let title = document.createElement("h5");
        title.innerHTML = formatSymbol(element.symbol);
        title.className = "card-title";
        title.setAttribute("color", "red");

        let subtitle = document.createElement("h6");
        subtitle.innerText = element.name;
        subtitle.className = "card-subtitle";

        cardBody.appendChild(title);
        cardBody.appendChild(subtitle);
        titleURL.appendChild(cardBody);
        card.appendChild(titleURL);
        cards.push(card);
    }

    return cards;
}

function showLoading() {
    let searchBox = document.getElementById("stockList");
    let loading = document.createElement("div");
    loading.className = "div__loading text-center";
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
    symbolFormatted = "<b>" + SYMBOL_PREFIX + symbol + "</b>";
    return symbolFormatted;
}

function removeStockProfileInfo() {
    let params = new URLSearchParams(window.location.search);
    params ?? params.delete();
    let stockProfile = document.getElementById("companyProfile");
    if(stockProfile) {
        stockProfile.remove();
    }
    
}
