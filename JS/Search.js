let { apikey, BASE_URL } = window.config;

const newsQuery = document.getElementById("search-result");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");

const main = document.querySelector("main");
const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".sidebarClose");

const searchResult = document.getElementById("search-result");

let page = 1; // Initialize page number for business news
let isFetching = false; // Prevent multiple simultaneous fetches

//?======= Search Query =======?//

// Extract query from URL
const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("query"); // Get 'query' parameter

// Automatically fetch and display results if a query is provided
if (initialQuery) {
  fetchAndDisplayResults(initialQuery);
}

async function fetchAndDisplayResults(query) {
  page = 1; // Reset page for new query
  try {
    const articles = await fetchNewsQuery(query);
    searchResult.innerHTML = ""; // Clear previous results
    displayNewsQuery(articles);
  } catch (error) {
    console.error("Error fetching news by query", error);
  }
}

searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    page = 1; // Reset page for new search query
    try {
      const articles = await fetchNewsQuery(query);
      searchResult.innerHTML = ""; // Clear previous results
      displayNewsQuery(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
});

async function fetchNewsQuery(query) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&page=${page}&pageSize=10&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Ensure totalResults is a number
    const totalResults =
      typeof data.totalResults === "number" ? data.totalResults : 0;

    const totalResultsElement = document.getElementById("total-results");
    if (totalResultsElement) {
      totalResultsElement.textContent = `Total "${query}" Articles: ${totalResults}`;
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

function displayNewsQuery(articles) {
  const scrollAnchor = document.querySelector("#scroll-anchor");
  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    if (!article.urlToImage) return; // Skip if no image

    const title = document.createElement("h2");
    title.textContent = article.title;
    if (article.title === "[Removed]") return; // Skip invalid titles

    const description = document.createElement("p");
    description.textContent = article.description || "Description unavailable";
    if (!article.description) return; // Skip if no description

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    // Check if scrollAnchor exists and is a child of searchResult
    if (scrollAnchor && searchResult.contains(scrollAnchor)) {
      searchResult.insertBefore(blogCard, scrollAnchor);
    } else {
      searchResult.appendChild(blogCard); // Fallback if scrollAnchor is not found
    }
  });
}

//?======= Infinite Scrolling =======?//
const observer = new IntersectionObserver(
  async (entries) => {
    const anchor = document.querySelector("#scroll-anchor");
    const query = searchField.value.trim();
    if (anchor && entries[0].isIntersecting && !isFetching && query !== "") {
      isFetching = true; // Set fetching flag
      page += 1; // Increment page

      //! Add no article to fetch console warning when the end is reached !//

      const articles = await fetchNewsQuery(query);
      fetchNewsQuery(articles);
      isFetching = false; // Reset fetching flag
    }
  },
  {
    root: null, // Observe scrolling in the viewport
    rootMargin: "100px",
    threshold: 1.0, // Trigger when the target is fully visible
  }
);

let scrollAnchor = document.querySelector("#scroll-anchor");
if (!scrollAnchor) {
  scrollAnchor = document.createElement("div");
  scrollAnchor.id = "scroll-anchor";
  searchResult.appendChild(scrollAnchor);
}
observer.observe(scrollAnchor);

//?======= Dark Mode Toggle =======?//

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark-mode");
}

modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark-mode");

  if (!body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }
});

searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

//?======= SideBar Toggle =======?//

sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});

body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("category-nav")
  ) {
    nav.classList.remove("active");
  }
});
