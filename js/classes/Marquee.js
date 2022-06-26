class Marquee {
    constructor(element) {
        this.element = element;
        this.url = STOCKS_BASE_URL + "/api/v3/quotes/nasdaq";

        this.promiseData = this.getPromiseData();
        this.render();
    }

    getPromiseData = () =>
        fetch(this.url)
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
                return _.sample(data, MARQUEE_NUMBER_OF_COMPANIES);
            })
            .catch(function (data) {
                console.error("error");
                console.error(data);
            });

    render = () => {
        this.promiseData.then((data) => {
            for (let marqueeCompany of data) {
                let marqueeCompanyDiv = document.createElement("div");
                marqueeCompanyDiv.className = "marquee-company";

                let marqueeCompanyName = document.createElement("a");
                marqueeCompanyName.className = "marquee-company-ticker";
                marqueeCompanyName.innerHTML = marqueeCompany.symbol;
                marqueeCompanyName.href =
                    "/company.html?symbol=" + marqueeCompany.symbol;
                marqueeCompanyName.title = marqueeCompany.name;
                marqueeCompanyDiv.appendChild(marqueeCompanyName);

                let marqueeCompanyPrice = document.createElement("div");
                marqueeCompanyPrice.className = "marquee-company-price";
                marqueeCompanyPrice.innerHTML = marqueeCompany.price;
                marqueeCompanyDiv.appendChild(marqueeCompanyPrice);

                let marqueeCompanyPercentage = document.createElement("div");
                let upOrDown =
                    marqueeCompany.changesPercentage > 0 ? "up" : "down";
                let plusSign = marqueeCompany.changesPercentage > 0 ? "+" : "";
                marqueeCompanyPercentage.className = `marquee-company-percentage--${upOrDown}`;
                marqueeCompanyPercentage.innerHTML = `${plusSign}${percentageFormatter.format(
                    marqueeCompany.changesPercentage
                )}%`;
                marqueeCompanyDiv.appendChild(marqueeCompanyPercentage);

                this.element.appendChild(marqueeCompanyDiv);
            }
        });
    };
}
