const { apikey, BASE_URL } = window.config;

const newsQuery = document.getElementById("search-result");
const businessNews = document.getElementById("business-news");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");

const categoryNav = document.querySelector(".category-nav");
const main = document.querySelector("main");
const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".sidebarClose");

let page = 1; // Initialize page number for business news
let isFetching = false; // Prevent multiple simultaneous fetches

//?======= Fetch and Display Business News =======?//
async function fetchBusinessNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=business&page=${page}&pageSize=4&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching top news", error);
    return [];
  }
}

function displayBusinessNews(articles) {
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
    businessNews.appendChild(blogCard);
  });

  // Ensure the scroll anchor remains at the bottom
  if (!document.querySelector("#scroll-anchor")) {
    const newAnchor = document.createElement("div");
    newAnchor.id = "scroll-anchor";
    businessNews.appendChild(newAnchor);
    observer.observe(newAnchor); // Re-observe the new anchor
  }
}

(async () => {
  try {
    const articles = await fetchBusinessNews();
    displayBusinessNews(articles);
  } catch (error) {
    console.error("Error fetching top news:", error);
  }
})();

//?======= Infinite Scrolling =======?//
const observer = new IntersectionObserver(
  async (entries) => {
    const anchor = entries[0];
    if (anchor.isIntersecting && !isFetching) {
      isFetching = true; // Prevent duplicate fetches

      try {
        // Increment page and fetch new articles
        page += 1;
        const articles = await fetchBusinessNews();

        // Check if articles are returned; if not, stop observing
        if (articles.length === 0) {
          console.warn("No more articles to fetch.");
          observer.unobserve(anchor.target); // Stop observing if no more articles
          return;
        }

        // Display new articles
        displayBusinessNews(articles);
      } catch (error) {
        console.error("Error fetching additional business news:", error);
      } finally {
        isFetching = false; // Reset fetching flag
      }
    }
  },
  {
    root: null, // Default to viewport
    rootMargin: "100px",
    threshold: 1.0, // Trigger when the anchor is fully visible
  }
);

// Check for Scroll Anchor Element
const scrollAnchor = document.querySelector("#scroll-anchor");
if (scrollAnchor) {
  observer.observe(scrollAnchor);
} else {
  console.warn("Scroll anchor element is missing or not defined.");
}

//?======= Search Query =======?//
searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    page = 1; // Reset page for new search query
    try {
      const articles = await fetchNewsQuery(query);
      main.innerHTML = ""; // Clear previous results
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
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

function displayNewsQuery(articles) {
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
    newsQuery.appendChild(blogCard);
  });
}

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
