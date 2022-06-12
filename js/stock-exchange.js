const STOCKS_BASE_URL =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
const STOCKS_SEARCH_LIMIT = 10;
const SYMBOL_PREFIX = "$";
const API_PROFILE_COMPANY_LIMIT = 3;

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
        titleURL.className = "card-link";

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

    let symbols = data.map((element) => element.symbol);

    let limit = Math.min(cards.length, API_PROFILE_COMPANY_LIMIT);
    symbolsFirstThree = symbols.slice(0, limit);

    let symbolsString = symbolsFirstThree.join(",");

    //fetching first three symbols (max qty) to get company profile. 
    fetch(`${STOCKS_BASE_URL}/api/v3/company/profile/${symbolsString}`)
    .then((response) => response.json())
    .then(function (data) {

        // check if symbols match, API does not return profile info for all symbols
        for (let i = 0; i < data.companyProfiles.length; i++) {
            for (let k = 0; k < symbolsFirstThree.length; k++) {
                if(symbolsFirstThree[k] === data.companyProfiles[i].symbol) {
                    let img = document.createElement("img");
                    img.src = data.companyProfiles[i].profile.image;
                    img.className = "card-img-top";
                    img.style.width = "100px";
                    img.style.height = "100px";
                    img.style.objectFit = "cover";
                    img.style.objectPosition = "center";
                    img.style.borderRadius = "0";
                    img.style.border = "1px solid #ddd";
                    img.style.borderBottom = "none";
                    img.style.borderTopLeftRadius = "10px";
                    img.style.borderTopRightRadius = "10px";
                    img.style.borderBottomLeftRadius = "10px";
                    img.style.borderBottomRightRadius = "10px";
                    img.style.boxShadow = "0px 0px 10px #ddd";
                    img.style.marginBottom = "10px";
                    img.style.marginTop = "10px";
                    cards[k].firstChild.prepend(img);
                }
            }
        }
    });

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
