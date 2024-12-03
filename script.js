const apikey = "21e2a4f51691472e9628bcca6cb4b22b";

const topNews = document.getElementById("top-news");
const localNews = document.getElementById("local-news");
const blogContainer = document.getElementById("blog-container");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");

//?======= Top News =======?//

async function fetchTopNews() {
  try {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&pageSize=4&apikey=${apikey}`;
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
    const articles = await fetchTopNews();
    displayTopNews(articles);
  } catch (error) {
    console.error("Error fetching top news:", error);
  }
})();

function displayTopNews(articles) {
  topNews.innerHTML = "";

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
    topNews.appendChild(blogCard);
  });
}

//?======= Local News =======?//

async function fetchLocalNews() {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=assam&searchIn=title&pageSize=5&apikey=${apikey}`;
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
    const articles = await fetchLocalNews();
    displayLocalNews(articles);
  } catch (error) {
    console.error("Error fetching top news:", error);
  }
})();

function displayLocalNews(articles) {
  topNews.innerHTML = "";

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
    localNews.appendChild(blogCard);
  });
}

//? Random News Blogs from data in india

async function fetchRandomNews() {
  try {
    const apiUrl = `https://newsapi.org/v2/everything?q=india&searchIn=title&pageSize=10&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching random news", error);
    return [];
  }
}

(async () => {
  try {
    const articles = await fetchRandomNews();
    displayBlogs(articles);
  } catch (error) {
    console.error("Error fetching random news:", error);
  }
})();

//? Search News Query

searchButton.addEventListener("click", async () => {
  const query = searchField.value.trim();
  if (query !== "") {
    try {
      const articles = await fetchNewsQuery(query);
      displayBlogs(articles);
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

//?Blog Card

function displayBlogs(articles) {
  blogContainer.innerHTML = "";

  articles.forEach((article) => {
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;
    if (img.src === "http://127.0.0.1:5500/null") {
      return;
    }

    const title = document.createElement("h2");
    if (article.title === "[Removed]") {
      return;
    }

    title.textContent = article.title || "Error 404";
    if (title.textContent === "Error 404") {
      return;
    }

    const description = document.createElement("p");
    description.textContent = article.description || "Article not found.";
    if (description.textContent === "Article not found.") {
      return;
    }

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    blogContainer.appendChild(blogCard);
  });
}

// Dark Mode Toggle
document.addEventListener("DOMContentLoaded", () => {
  const body = document.querySelector("body");
  const nav = document.querySelector("nav");
  const modeToggle = document.querySelector(".dark-light");
  const searchToggle = document.querySelector(".searchToggle");

  modeToggle.addEventListener("click", () => {
    modeToggle.classList.toggle("active");
    body.classList.toggle("dark-mode");
  });

  searchToggle.addEventListener("click", () => {
    searchToggle.classList.toggle("active");
  });
});
