const STOCKS_BASE_URL =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
const STOCKS_SEARCH_LIMIT = 10;
const SYMBOL_PREFIX = "$";
const API_PROFILE_COMPANY_LIMIT = 3;
const SECONDARY_COLOR = "#0f9404";
const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;

const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});
const changesFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
});

const percentageFormatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

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
        let searchURL = `${STOCKS_BASE_URL}/api/v3/search?query=${searchText}&limit=${STOCKS_SEARCH_LIMIT}&exchange=NASDAQ`;
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
                    console.log(data);
                    cards = createStockCards(data);
                    let stockList = document.getElementById("stockList");

                    stockList.replaceChildren(...cards);
                }
            })
            .catch(function (data) {
                console.log(data);
                let stockList = document.getElementById("stockList");
                stockList.replaceChildren();
            });
    }
});

function createStockCards(data) {
    let cards = [];
    for (element of data) {
        let card = document.createElement("div");
        card.className = "div__card-stock card shadow cursor-pointer";
        card.id = element.symbol.toLowerCase();

        let cardBody = document.createElement("div");
        cardBody.className = "card-body";

        let titleURL = document.createElement("a");
        titleURL.className = "card-link";

        titleURL.href = "./company.html?symbol=" + element.symbol;
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

    // fix for one result to keep response format consistent when requesting
    if (symbolsFirstThree.length === 1) {
        symbolsString += ",";
    }

    //fetching first three symbols (max qty) to get company profile.
    fetch(`${STOCKS_BASE_URL}/api/v3/company/profile/${symbolsString}`)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Network response error: " + response.status);
            }
        })
        .then(function (data) {
            console.log(data);
            // check if symbols match, API does not return profile info for all symbols
            for (let i = 0; i < data.companyProfiles.length; i++) {
                for (let k = 0; k < symbolsFirstThree.length; k++) {
                    if (
                        symbolsFirstThree[k] === data.companyProfiles[i].symbol
                    ) {
                        let img = createSearchThumbnail(
                            data.companyProfiles[i].profile.image
                        );
                        cards[k].firstChild.prepend(img);

                        priceDiv = document.createElement("div");
                        priceDiv.className =
                            "div__searchResultsCompanyChanges pull-right";

                        let caret = document.createElement("i");

                        let decimalPrice = document.createElement("div");
                        decimalPrice.className = "div__search-company-price";
                        decimalPrice.innerHTML = `${currencyFormatter.format(
                            data.companyProfiles[i].profile.price
                        )} `;

                        let changesPercentageNumber =
                            document.createElement("div");
                        changesPercentageNumber.className = `div__search-company-percentage-change--${
                            data.companyProfiles[i].profile.changesPercentage >
                            0
                                ? "up"
                                : "down"
                        }`;

                        let plusSign =
                            data.companyProfiles[i].profile.changesPercentage >
                            0
                                ? "+"
                                : "";
                        changesPercentageNumber.innerHTML = `${plusSign}${percentageFormatter.format(
                            data.companyProfiles[i].profile.changesPercentage
                        )}%`;

                        let percentageChange = document.createElement("div");
                        percentageChange.className =
                            "div__search-company-stock-value-change";
                        percentageChange.innerHTML = `(${changesFormatter.format(
                            data.companyProfiles[i].profile.changes
                        )})`;

                        setTrendColor(
                            caret,
                            decimalPrice,
                            data.companyProfiles[i].profile.changes
                        );
                        priceDiv.appendChild(decimalPrice);
                        priceDiv.appendChild(percentageChange);
                        priceDiv.appendChild(caret);
                        priceDiv.appendChild(changesPercentageNumber);

                        cards[k].lastChild.append(priceDiv);
                    }
                }
            }

            symbolsWithoutProfileInfo = symbolsFirstThree.filter(
                (elm) =>
                    !data.companyProfiles
                        .map((item) => item.symbol)
                        .includes(elm)
            );

            for (symbol of symbolsWithoutProfileInfo) {
                let img = createSearchThumbnail("/img/stocki-logo-simple.png");
                cardIndex = cards
                    .map((elm) => elm.id)
                    .indexOf(symbol.toLowerCase());

                cards[cardIndex].lastChild.href = "";
                cards[cardIndex].firstChild.prepend(img);

                priceDiv = document.createElement("div");
                priceDiv.className =
                    "div__searchResultsCompanyChanges pull-right";

                let changesPercentageText = document.createElement("div");
                changesPercentageText.className =
                    "div__search-company-percentage-change--no-profile";
                changesPercentageText.innerHTML = "info not available";

                priceDiv.appendChild(changesPercentageText);
                cards[cardIndex].lastChild.append(priceDiv);
            }

            console.log(symbolsWithoutProfileInfo);
        })
        .catch(function (error) {
            console.log("error");
            console.log(error);
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
    if (stockProfile) {
        stockProfile.remove();
    }
}

/* set a caret and a trend color for stock percentages */
function setTrendColor(trend, percentage, changes) {
    if (changes > 0) {
        trend.className = "fas fa-caret-up";
        percentage.style.color = "limegreen !important";
    } else {
        trend.className = "fas fa-caret-down";
        percentage.style.color = "red";
    }
}

function createSearchThumbnail(src) {
    let img = document.createElement("img");
    img.src = src;
    img.onerror = function () {
        img.src = "./img/stocki-logo-simple.png";
    };
    img.className = "card-img-top";
    img.classList.add("img"), (img.style.width = "100px");
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

    return img;
}
