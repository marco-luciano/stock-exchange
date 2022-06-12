const SECONDARY_COLOR = "#0f9404";
const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;
var urlParams = new URLSearchParams(window.location.search);

let symbol = urlParams.get("symbol");

document.title = SYMBOL_PREFIX + symbol + " - Company Info";

showLoadingCompany();

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

                let formatter = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: data.profile.currency,
                    minimumFractionDigits: 2,
                });

                symbolPriceNumber.innerHTML = formatter.format(
                    data.profile.price
                );

                symbolPrice.appendChild(symbolPriceTrend);
                symbolPrice.appendChild(symbolPriceNumber);
                symbolPrice.style.gap = "0.5em";

                let changesFormatter = new Intl.NumberFormat("en-US", {
                    maximumSignificantDigits: 2,
                });

                let symbolPercentage = document.createElement("div");
                symbolPercentage.className = "display-5 h5__company-percentage";
                symbolPercentage.innerHTML =
                    changesFormatter.format(data.profile.changesPercentage) +
                    "0%";

                if (data.profile.changes > 0) {
                    symbolPriceTrend.className = "fas fa-caret-up";
                    symbolPriceTrend.style.color = "limegreen";
                    symbolPercentage.style.color = "limegreen";
                } else {
                    symbolPriceTrend.className = "fas fa-caret-down";
                    symbolPriceTrend.style.color = "red";
                    symbolPercentage.style.color = "red";
                }

                let symbolSpan = document.createElement("span");
                symbolSpan.className = "span__company-price";
                symbolSpan.appendChild(symbolTitle);
                symbolSpan.appendChild(symbolPrice);
                symbolSpan.appendChild(symbolPercentage);

                let companyDescriptionDiv = document.createElement("div");
                companyDescriptionDiv.className = "div__company-description";
                companyDescription = document.createElement("p");
                companyDescription.className = "p__company-description";
                companyDescription.innerHTML = data.profile.description;
                companyDescriptionDiv.appendChild(companyDescription);

                companyProfile.appendChild(symbolImageDiv);
                companyProfile.appendChild(symbolSpan);
                companyProfile.appendChild(companyDescriptionDiv);

                let container = document.querySelector(".container");

                container.appendChild(companyProfile);

                fetch(
                    `${STOCKS_BASE_URL}//api/v3/historical-price-full/${data.symbol}?serietype=line`
                )
                    .then((response) => response.json())
                    .then(function (data) {
                        plotStocks(data);
                    });
            }
        }
    });

function plotStocks(data) {
    let prices = data.historical.map((item) => item.close);
    let dates = data.historical.map((item) => item.date);

    const datae = {
        labels: dates,
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: SECONDARY_COLOR,
                borderColor: SECONDARY_COLOR,
                data: prices,
            },
        ],
    };

    const config = {
        type: "line",
        data: datae,
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

function showLoadingCompany(){
    let spinner = document.createElement("div");
    spinner.className = "spinner-border text-success text-center";
    spinner.id = "loading";
    spinner.style.position = "relative";
    spinner.style.left = "50%";
    container = document.querySelector(".container");
    container.appendChild(spinner);
}

function hideLoadingCompany(){
    let loading = document.getElementById("loading");
    loading.remove();
}