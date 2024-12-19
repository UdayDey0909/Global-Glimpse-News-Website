const { apikey, BASE_URL } = window.config;

//~========== DOM Elements ==========~//

const newsQuery = document.getElementById("search-result");
const topNews = document.getElementById("top-news");
const localNews = document.getElementById("local-news");
const blogContainer = document.getElementById("blog-container");
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
/* const scrollContainers = document.querySelectorAll(".article-width"); */

//~========== Top News ==========~//

//? API URL

async function fetchTopNews() {
  try {
    const apiUrl = `${BASE_URL}/top-headlines?country=us&pageSize=20&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching Top news", error);
    return [];
  }
}

//? Fetch & Display Top News Cards

(async () => {
  try {
    const articles = await fetchTopNews();
    displayTopNews(articles);
  } catch (error) {
    console.error("Error fetching Top news:", error);
  }
})();

//? Remove Corrupt Cards

function displayTopNews(articles) {
  topNews.innerHTML = "";

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

    //? Create Top News Cards

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    topNews.appendChild(blogCard);
  });
}

//~========== Local News ==========~//

//? API URL

async function fetchLocalNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=assam&searchIn=title&pageSize=20&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching top news", error);
    return [];
  }
}

//? Fetch & Display Local News Cards

(async () => {
  try {
    const articles = await fetchLocalNews();
    displayLocalNews(articles);
  } catch (error) {
    console.error("Error fetching top news:", error);
  }
})();

//? Remove Corrupt Cards

function displayLocalNews(articles) {
  localNews.innerHTML = "";

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

    //? Create Local News Cards

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    localNews.appendChild(blogCard);
  });
}

//~========== Random News in India ==========~//

async function fetchRandomNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=india&searchIn=title&pageSize=20&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

//? Fetch & Display Random India News Cards

(async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news:", error);
  }
})();

//? Remove Corrupt Cards

function displayBlogs(articles) {
  blogContainer.innerHTML = "";

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

    //? Create Random India News Cards

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    blogContainer.appendChild(blogCard);
  });
}

//~========== Horizontal Scroll ==========~//

function initializeHorizontalScroll() {
  const scrollContainers = document.querySelectorAll(".article-width");

  scrollContainers.forEach((container) => {
    if (!container || container.children.length === 0) {
      console.warn("No child elements found in container:", container);
      return; // Skip if no children exist
    }

    const articles = container.children; // Get all child articles
    const scrollAmount = 300; // Adjust based on the width of your articles

    container.addEventListener("scroll", () => {
      if (
        container.scrollLeft + container.offsetWidth >=
        container.scrollWidth - scrollAmount
      ) {
        container.appendChild(container.firstElementChild);
        container.scrollLeft -= scrollAmount;
      }

      if (container.scrollLeft <= scrollAmount) {
        container.prepend(container.lastElementChild);
        container.scrollLeft += scrollAmount;
      }
    });
  });
}

// Call this function after data is dynamically populated

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
