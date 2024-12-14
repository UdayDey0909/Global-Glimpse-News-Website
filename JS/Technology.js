const { apikey, BASE_URL } = window.config;

//~========== DOM Elements ==========~//

const searchResult = document.getElementById("search-result");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");
const scrollAnchor = document.querySelector("#scroll-anchor");
const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".sidebarClose");

//~========== Fetch and Display Business News ==========~//

let page = 1;
let isFetching = false;

//?======= Search Query =======?//

const urlParams = new URLSearchParams(window.location.search);
const initialQuery = urlParams.get("query"); // Get 'query' parameter

// Automatically fetch and display results if a query is provided
if (initialQuery) {
  fetchAndDisplayResults(initialQuery);
}

async function fetchAndDisplayResults(query) {
  page = 1; // Reset page for new query
  try {
    const articles = await fetchSearchResult(query);
    searchResult.innerHTML = ""; // Clear previous results
    fetchSearchResult(articles);
  } catch (error) {
    console.error("Error fetching news by query", error);
  }
}

//? API URL

async function fetchSearchResult(query) {
  try {
    const apiUrl = `${BASE_URL}/everything?q=${encodeURIComponent(
      query
    )}&searchIn=title,description&page=${page}&pageSize=8&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    //? Display total results dynamically

    const totalResults = data.totalResults || 0;
    const totalResultsElement = document.getElementById("total-results");
    if (totalResultsElement) {
      totalResultsElement.textContent = `Total ${query} Articles: ${totalResults}`;
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

//? Remove Corrupt Cards

function displaySearchResult(articles) {
  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    if (!article.urlToImage) return;

    const title = document.createElement("h2");
    title.textContent = article.title;
    if (article.title === "[Removed]") return;

    const description = document.createElement("p");
    description.textContent = article.description;
    if (!article.description) return;

    //? Create Searched News Cards

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    //? Check if scrollAnchor exists for infinite scrolling

    if (scrollAnchor && searchResult.contains(scrollAnchor)) {
      searchResult.insertBefore(blogCard, scrollAnchor);
    } else {
      searchResult.appendChild(blogCard);
    }
  });
}

/* (async () => {
  try {
    const articles = await fetchSearchResult();
    displaySearchResult(articles);
  } catch (error) {
    console.error("Error fetching ${query} News:", error);
  }
})();

searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    page = 1; // Reset page for new search query
    try {
      const articles = await fetchSearchResult(query);
      searchResult.innerHTML = ""; // Clear previous results
      displaySearchResult(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
}); */

//~========== Infinite Scrolling ==========~//

const observer = new IntersectionObserver(
  async (entries) => {
    const endOfResultsMessage = document.getElementById("end-of-results");
    if (entries[0].isIntersecting && !isFetching) {
      isFetching = true;
      page++;

      const articles = await fetchSearchResult();

      //? End of the results

      if (articles.length > 0) {
        displaySearchResult(articles);
      } else {
        if (endOfResultsMessage) {
          endOfResultsMessage.style.display = "block";
        }
        observer.unobserve(scrollAnchor);
      }

      isFetching = false;
    }
  },
  {
    root: null,
    rootMargin: "100px",
    threshold: 0.7,
  }
);

//? re-adds the anchor element at the bottom of the page

if (scrollAnchor) {
  observer.observe(scrollAnchor);
}

//~========== Search Handle & Redirect ==========~//

//? Redirects with the search query in the URL

searchButton.addEventListener("click", () => {
  const query = searchField.value.trim();
  if (query) {
    window.location.href = `searchResult.html?query=${encodeURIComponent(
      query
    )}`;
  } else {
    console.warn("Search query is empty");
  }
});

//?Search Button

searchToggle.addEventListener("click", () => {
  searchToggle.classList.toggle("active");
});

//~========== Dark Mode  ==========?//

//? Stores the user preferences

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark-mode") {
  body.classList.add("dark-mode");
}

//? Toggle Between Dark & Light Mode

modeToggle.addEventListener("click", () => {
  modeToggle.classList.toggle("active");
  body.classList.toggle("dark-mode");

  if (!body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "light-mode");
  } else {
    localStorage.setItem("mode", "dark-mode");
  }
});

//~========== SideBar Toggle for Smaller Devices ==========~//

sidebarOpen.addEventListener("click", () => {
  nav.classList.add("active");
});

//? Tap anywhere to close the sidebar

body.addEventListener("click", (e) => {
  let clickedElm = e.target;

  if (
    !clickedElm.classList.contains("sidebarOpen") &&
    !clickedElm.classList.contains("category-nav")
  ) {
    nav.classList.remove("active");
  }
});
