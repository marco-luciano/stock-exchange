var urlParams = new URLSearchParams(window.location.search);

let symbol = urlParams.get("symbol");

document.title = SYMBOL_PREFIX + symbol + " - Company Info";

showLoadingCompany();

getCompanyData();

function getCompanyData() {
    fetch(`${STOCKS_BASE_URL}/api/v3/company/profile/${symbol}`)
        .then((response) => response.json())
        .then(function (data) {
            hideLoadingCompany();

            let stockList = document.getElementById("stockList");

            if (stockList.childElementCount > 0) {
                stockList.replaceChildren();
            }

            if (typeof data === "object") {
                if (Object.keys(data).length !== 0) {
                    let companyProfile = document.createElement("div");
                    companyProfile.className = "div__company-profile";
                    companyProfile.id = "companyProfile";
                    symbolImageDiv = document.createElement("div");
                    symbolImageDiv.className = "div__symbol-image";
                    symbolImage = document.createElement("img");
                    symbolImage.src = data.profile.image;
                    symbolImage.onerror = function () {
                        symbolImage.src = "/img/stocki-logo-simple.png";
                        symbolImage.style.width = "100px";
                        symbolImage.style.height = "100px";
                    };
                    symbolImage.alt = data.symbol;
                    symbolImageDiv.appendChild(symbolImage);

                    let symbolTitle = document.createElement("span");
                    symbolTitle.className = "display-5 h1__company-title";
                    symbolTitle.innerHTML = `${symbol}`;

                    let symbolPrice = document.createElement("h1");
                    symbolPrice.style.display = "inline-flex";

                    let symbolPriceTrend = document.createElement("span");
                    symbolPriceTrend.style.verticalAlign = "middle";

                    let symbolPriceNumber = document.createElement("div");
                    symbolPriceNumber.className = "display-5 h5__company-price";

                    symbolPriceNumber.innerHTML = currencyFormatter.format(
                        data.profile.price
                    );

                    symbolPrice.appendChild(symbolPriceNumber);
                    symbolPrice.style.gap = "0.5em";

                    let symbolPercentage = document.createElement("div");
                    symbolPercentage.className =
                        "display-5 div__profile-company-percentage-change";
                    symbolPercentage.innerHTML =
                        percentageFormatter.format(
                            data.profile.changesPercentage
                        ) + "%";

                    setTrendColor(
                        symbolPriceTrend,
                        symbolPercentage,
                        data.profile.changes
                    );

                    symbolPercentage.prepend(symbolPriceTrend);

                    let symbolSpan = document.createElement("span");
                    symbolSpan.className = "span__company-price";

                    symbolSpan.appendChild(symbolTitle);
                    symbolSpan.appendChild(symbolPrice);
                    symbolSpan.appendChild(symbolPercentage);

                    let companyDescriptionDiv = document.createElement("div");
                    companyDescriptionDiv.className =
                        "div__company-description";
                    companyDescription = document.createElement("p");
                    companyDescription.className = "p__company-description";

                    setReadMore(companyDescription, data.profile.description);

                    companyDescriptionDiv.appendChild(companyDescription);

                    companyProfile.appendChild(symbolImageDiv);
                    companyProfile.appendChild(symbolSpan);
                    companyProfile.appendChild(companyDescriptionDiv);

                    let container = document.querySelector(".container");

                    container.appendChild(companyProfile);

                    getCompanyHistoricalData(data);
                }
            }
        });
}

async function getCompanyHistoricalData(data) {
    await fetch(
        `${STOCKS_BASE_URL}//api/v3/historical-price-full/${data.symbol}?serietype=line`
    )
        .then((response) => response.json())
        .then(function (data) {
            plotStocks(data);
        });
}

function plotStocks(data) {
    let prices = data.historical.map((item) => item.close);
    let dates = data.historical.map((item) => item.date);

    const plotData = {
        labels: dates,
        datasets: [
            {
                label: data.symbol,
                backgroundColor: SECONDARY_COLOR,
                borderColor: SECONDARY_COLOR,
                data: prices,
            },
        ],
    };

    const config = {
        type: "line",
        data: plotData,
        options: {
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    ticks: {
                        callback: function (value, index, ticks) {
                            return "$ " + value;
                        },
                    },
                },
            },
        },
    };

    stockPlot = document.getElementById("stockPlot");

    let chart = new Chart(stockPlot.getContext("2d"), config);

    chart.width = CHART_WIDTH;
    chart.height = CHART_HEIGHT;

    stockPlot.style.display = "block";
}

function showLoadingCompany() {
    let spinner = document.createElement("div");
    spinner.className =
        "spinner-border text-success text-center spinner-company";
    spinner.id = "loading";
    container = document.querySelector(".container");
    container.appendChild(spinner);
}

function hideLoadingCompany() {
    let loading = document.getElementById("loading");
    loading.remove();
}

function setTrendColor(trend, percentage, changes) {
    if (changes > 0) {
        trend.className = "fas fa-caret-up";
    } else {
        trend.className = "fas fa-caret-down";
    }
}

function setReadMore(element, description) {
    const READ_MORE_LENGTH = 200;
    element.innerHTML = description.slice(0, READ_MORE_LENGTH);
    element.innerHTML += '<span class="read-more--dots"> ... Read more</span>';
    element.innerHTML += `<span class="read-more--text" id="readMoreCompany">${description.slice(
        READ_MORE_LENGTH
    )}</span>`;

    element.addEventListener("click", function () {
        let readMoreCompany = document.getElementById("readMoreCompany");

        if (
            readMoreCompany.style.display === "none" ||
            !readMoreCompany.style.display
        ) {
            // showing entire description, removing read more text
            readMoreCompany.previousElementSibling.style.display = "none";
            readMoreCompany.style.display = "inline";
        } else {
            // hiding entire description, adding read more text
            readMoreCompany.previousElementSibling.style.display = "inline";
            readMoreCompany.style.display = "none";
        }
    });
}
