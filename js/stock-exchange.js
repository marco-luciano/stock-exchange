const form = new SearchForm(document.getElementById("searchForm"));
const marquee = new Marquee(document.getElementById("marqueeContainer"));
const searchResults = new SearchResult(document.getElementById("stockList"));

form.inputStockSearch.onsearch = function (event) {
    searchResults.renderResults(event);
};
document
    .getElementById("btnStockSearch")
    .addEventListener("click", function (event) {
        form.inputStockSearch.onsearch();
    });
