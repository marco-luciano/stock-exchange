const MARQUEE_NUMBER_OF_COMPANIES = 9;

fetch(STOCKS_BASE_URL + "/api/v3/quotes/nasdaq")
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network response error: " + response.status);
        }
    })
    .then(function (data) {
        let marqueeData = _.sample(data, MARQUEE_NUMBER_OF_COMPANIES);

        let divMarquee = document.createElement("div");
        divMarquee.className = "marquee-content";

        for (marqueeCompany of marqueeData) {
            let marqueeCompanyDiv = document.createElement("div");
            marqueeCompanyDiv.className = "marquee-company";

            let marqueeCompanyName = document.createElement("div");
            marqueeCompanyName.className = "marquee-company-ticker";
            marqueeCompanyName.innerHTML = marqueeCompany.symbol;
            marqueeCompanyDiv.appendChild(marqueeCompanyName);

            let marqueeCompanyPrice = document.createElement("div");
            marqueeCompanyPrice.className = "marquee-company-price";
            marqueeCompanyPrice.innerHTML = marqueeCompany.price;
            marqueeCompanyDiv.appendChild(marqueeCompanyPrice);

            /*let marqueeCompanyDifference = document.createElement("div");
            marqueeCompanyDifference.className = "marquee-company-difference";
            marqueeCompanyDifference.innerHTML = `${changesFormatter.format(
                marqueeCompany.change
            )}`;
            marqueeCompanyDiv.appendChild(marqueeCompanyDifference);*/

            let marqueeCompanyPercentage = document.createElement("div");
            let upOrDown = marqueeCompany.changesPercentage > 0 ? "up" : "down";
            let plusSign = marqueeCompany.changesPercentage > 0 ? "+" : "";
            marqueeCompanyPercentage.className = `marquee-company-percentage--${upOrDown}`;
            marqueeCompanyPercentage.innerHTML = `${plusSign}${percentageFormatter.format(
                marqueeCompany.changesPercentage
            )}%`;
            marqueeCompanyDiv.appendChild(marqueeCompanyPercentage);

            divMarquee.appendChild(marqueeCompanyDiv);
        }

        document.querySelector(".marquee").appendChild(divMarquee);
    })
    .catch(function (data) {
        console.log("error");
        console.log(data);
    });