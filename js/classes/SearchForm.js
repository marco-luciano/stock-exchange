class SearchForm {
    constructor(element) {
        this.element = element;

        //SearchForm internal elements
        this.inputStockSearch = document.createElement("input");
        this.btnStockSearch = document.createElement("button");

        // Magnifier fa icon is used for the search button
        this.magnifier = document.createElement("i");

        this.createInput();
        this.createButton();
    }

    createInput() {
        this.inputStockSearch.className = "form-control input__stock-search";
        this.inputStockSearch.type = "search";
        this.inputStockSearch.id = "inputStockSearch";
        this.inputStockSearch.placeholder = "Search companies and symbols";
        this.element.appendChild(this.inputStockSearch);
    }

    createButton() {
        this.btnStockSearch.className = "btn btn__stock btn__stock-search";
        this.btnStockSearch.id = "btnStockSearch";

        this.magnifier.className = "fa-solid fa-magnifying-glass";

        this.btnStockSearch.appendChild(this.magnifier);
        this.element.appendChild(this.btnStockSearch);
    }
}
