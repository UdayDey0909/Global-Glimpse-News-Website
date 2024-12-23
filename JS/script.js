const { apikey, BASE_URL } = window.config;

//~========== DOM Elements ==========~//

const newsQuery = document.getElementById("search-result");
const topNews = document.getElementById("top-news");
const localNews = document.getElementById("local-news");
const latestNews = document.getElementById("latest-news");
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
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

//~========== Top News in India ==========~//

//? API URL

async function fetchTopNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=India&searchIn=title&pageSize=20&apikey=${apikey}`;
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

//~========== Local News in Assam ==========~//

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

//~========== Latest News in World ==========~//

async function fetchLatestNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=Latest&searchIn=title&pageSize=20&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching Latest news", error);
    return [];
  }
}

//? Fetch & Display Latest News Cards

(async () => {
  try {
    const articles = await fetchLatestNews();
    displayLatestNews(articles);
  } catch (error) {
    console.error("Error fetching Latest news:", error);
  }
})();

//? Remove Corrupt Cards

function displayLatestNews(articles) {
  latestNews.innerHTML = "";

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

    //? Create Latest News Cards

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    latestNews.appendChild(blogCard);
  });
}

//~========== Hero Section Button Smooth Scrolling ==========~//

document
  .querySelector(".start-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document
      .querySelector("#hero-section-ref")
      .scrollIntoView({ behavior: "smooth" });
  });

//~========== Horizontal Scroll & Infinite Loop ==========~//

document.addEventListener("DOMContentLoaded", () => {
  const scrollContainers = document.querySelectorAll(".article-width");

  //? Amount of Scroll

  scrollContainers.forEach((container) => {
    const scrollAmount = 200;

    //? Horizontal Scrolling

    container.addEventListener("wheel", (evt) => {
      evt.preventDefault();
      container.scrollLeft += evt.deltaY;
    });

    //? Loop articles on scroll

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
});

//! Call this function after data is dynamically populated

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

//~========== SideBar Toggle for Smaller Devices ==========~//

//? Show or hide the button based on scroll position

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    //? Show the button after scrolling down 200px
    scrollToTopBtn.style.display = "flex";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

//? Scroll smoothly to the top when the button is clicked
scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
