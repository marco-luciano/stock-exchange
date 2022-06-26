class SearchResult {
    constructor(element, exchange = "NASDAQ") {
        this.element = element;
        this.searchText = "";

        this.baseUrl = `${STOCKS_BASE_URL}/api/v3/search?query=`;
        this.url = this.baseUrl;
        this.limit = STOCKS_SEARCH_LIMIT;
        this.exchange = exchange;
    }

    renderResults = (event) => {
        if (event === "undefined") {
            this.searchText = event.target.value.trim();
        } else {
            this.searchText = document
                .getElementById("inputStockSearch")
                .value.trim();
        }

        // if search key is empty, we don't need to search
        if (this.searchText.length > 0) {
            this.createUrl();
            this.removeStockProfileInfo();

            let companyProfile = document.getElementById("companyProfile");

            if (companyProfile) {
                companyProfile.replaceChildren();
                document.getElementById("stockPlot").style.display = "none";
            }

            this.showLoading();

            this.getPromiseSearchData();
        }
    };

    removeStockProfileInfo = () => {
        let params = new URLSearchParams(window.location.search);
        params ?? params.delete();
        let stockProfile = document.getElementById("companyProfile");
        if (stockProfile) {
            stockProfile.remove();
        }
    };

    createUrl = () => {
        this.url = this.baseUrl + `${this.searchText}&limit=${this.limit}`;

        if (this.exchange) {
            this.url += `&exchange=${this.exchange}`;
        }
    };

    hideLoading = () => {
        let loading = document.getElementsByClassName("div__loading");
        this.element.removeChild(loading[0]);
    };

    showLoading = () => {
        let loading = document.createElement("div");
        loading.className = "div__loading text-center";
        let spinner = document.createElement("div");
        spinner.className = "spinner-border text-success";
        loading.appendChild(spinner);
        this.element.appendChild(loading);
    };

    createStockCards = (data) => {
        if (!data) {
            return;
        }

        let cards = [];
        for (let element of data) {
            let card = document.createElement("div");
            card.className = "div__card-stock card shadow cursor-pointer";
            card.id = element.symbol.toLowerCase();

            let cardBody = document.createElement("div");
            cardBody.className = "card-body";

            let titleURL = document.createElement("a");
            titleURL.className = "card-link";

            titleURL.href = "./company.html?symbol=" + element.symbol;
            let title = document.createElement("h5");

            title.innerHTML = this.highlightSearchText(
                this.formatSymbol(element.symbol)
            );

            title.className = "card-title";
            title.setAttribute("color", "red");

            let subtitle = document.createElement("h6");
            subtitle.innerHTML = this.highlightSearchText(element.name);

            subtitle.className = "card-subtitle";

            cardBody.appendChild(title);
            cardBody.appendChild(subtitle);
            titleURL.appendChild(cardBody);
            card.appendChild(titleURL);
            cards.push(card);
        }

        let symbols = data.map((element) => element.symbol);

        let limit = Math.min(cards.length, API_PROFILE_COMPANY_LIMIT);
        let symbolsFirstThree = symbols.slice(0, limit);

        let symbolsString = symbolsFirstThree.join(",");

        // fix for one result to keep response format consistent when requesting
        if (symbolsFirstThree.length === 1) {
            symbolsString += ",";
        }

        //fetching first three symbols (max qty) to get company profile.
        this.getCompanyProfiles(symbolsString, symbolsFirstThree, cards);

        return cards;
    };

    getPromiseSearchData = () => {
        let data = fetch(this.url)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(
                        "Network response error: " + response.status
                    );
                }
            })
            .then((data) => {
                this.hideLoading();
                if (typeof data === "object" && data.length > 0) {
                    let cards = [];
                    cards = this.createStockCards(data);
                    this.element.replaceChildren(...cards);
                } else {
                    this.element.replaceChildren();
                }
            })
            .catch(function (data) {
                console.error(data);
                this.element.replaceChildren();
            });

        return data;
    };

    formatSymbol = (symbol) => {
        let symbolFormatted = "<b>" + SYMBOL_PREFIX + symbol + "</b>";
        return symbolFormatted;
    };

    createSearchThumbnail = (src) => {
        let img = document.createElement("img");
        img.src = src;
        img.onerror = function () {
            img.src = "./img/stocki-logo-simple.png";
        };
        img.className = "card-img-top";
        img.classList.add("img"), (img.style.width = "100px");

        return img;
    };

    /* set a caret and a trend color for stock percentages */
    setTrendColor = (trend, changes) => {
        trend.className = changes > 0 ? "fa fa-caret-up" : "fa fa-caret-down";
    };

    getCompanyProfiles(symbolsString, symbolsFirstThree, cards) {
        fetch(`${STOCKS_BASE_URL}/api/v3/company/profile/${symbolsString}`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error(
                        "Network response error: " + response.status
                    );
                }
            })
            .then((data) => {
                // check if symbols match, API does not return profile info for all symbols
                for (let i = 0; i < data.companyProfiles.length; i++) {
                    for (let k = 0; k < symbolsFirstThree.length; k++) {
                        if (
                            symbolsFirstThree[k] ===
                            data.companyProfiles[i].symbol
                        ) {
                            let img = this.createSearchThumbnail(
                                data.companyProfiles[i].profile.image
                            );
                            cards[k].firstChild.prepend(img);

                            let priceDiv = document.createElement("div");
                            priceDiv.className =
                                "div__searchResultsCompanyChanges pull-right";

                            let caret = document.createElement("i");

                            let decimalPrice = document.createElement("div");
                            decimalPrice.className =
                                "div__search-company-price";
                            decimalPrice.innerHTML = `${currencyFormatter.format(
                                data.companyProfiles[i].profile.price
                            )} `;

                            let changesPercentageNumber =
                                document.createElement("div");
                            changesPercentageNumber.className = `div__search-company-percentage-change--${
                                data.companyProfiles[i].profile
                                    .changesPercentage > 0
                                    ? "up"
                                    : "down"
                            }`;

                            let plusSign =
                                data.companyProfiles[i].profile
                                    .changesPercentage > 0
                                    ? "+"
                                    : "";
                            changesPercentageNumber.innerHTML = `${plusSign}${percentageFormatter.format(
                                data.companyProfiles[i].profile
                                    .changesPercentage
                            )}%`;

                            let percentageChange =
                                document.createElement("div");
                            percentageChange.className =
                                "div__search-company-stock-value-change";
                            percentageChange.innerHTML = `(${changesFormatter.format(
                                data.companyProfiles[i].profile.changes
                            )})`;

                            this.setTrendColor(
                                caret,
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

                let symbolsWithoutProfileInfo = symbolsFirstThree.filter(
                    (elm) =>
                        !data.companyProfiles
                            .map((item) => item.symbol)
                            .includes(elm)
                );

                for (symbol of symbolsWithoutProfileInfo) {
                    let img = this.createSearchThumbnail(
                        "/img/stocki-logo-simple.png"
                    );
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
            })
            .catch(function (error) {
                console.error("error");
                console.error(error);
            });
    }

    highlightSearchText = (text) => {
        let regex = new RegExp(this.searchText, "gi");
        return text.toString().replace(regex, `<mark>$&</mark>`);
    };
}
