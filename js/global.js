const STOCKS_BASE_URL =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com";
const STOCKS_SEARCH_LIMIT = 10;
const SYMBOL_PREFIX = "$";
const API_PROFILE_COMPANY_LIMIT = 3;
const SECONDARY_COLOR = "#0f9404";
const CHART_WIDTH = 800;
const CHART_HEIGHT = 500;
const MARQUEE_NUMBER_OF_COMPANIES = 9;

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
