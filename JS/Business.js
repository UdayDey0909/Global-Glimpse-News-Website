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

async function fetchBusinessNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=business&searchIn=title&pageSize=5&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching top news", error);
    return [];
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

function displayBusinessNews(articles) {
  businessNews.innerHTML = "";

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    if (img.src === "http://127.0.0.1:5500/null") {
      return;
    }

    const title = document.createElement("h2");
    title.textContent = article.title;
    if (article.title === "[Removed]") {
      return;
    }

    const description = document.createElement("p");
    description.textContent = article.description || "Null";
    if (description.textContent === "Null") {
      return;
    }
    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    businessNews.appendChild(blogCard);
  });
}

//?======= Search Query =======?//

searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayNewsQuery(articles);
    } catch (error) {
      console.log("Error fetching news by query", error);
    }
  }
});

async function fetchNewsQuery(query) {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=${query}&pageSize=10&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

function displayNewsQuery(articles) {
  main.innerHTML = "";

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    if (img.src === "http://127.0.0.1:5500/null") {
      return;
    }

    const title = document.createElement("h2");
    title.textContent = article.title;
    if (article.title === "[Removed]") {
      return;
    }

    const description = document.createElement("p");
    description.textContent = article.description || "Null";
    if (description.textContent === "Null") {
      return;
    }
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
