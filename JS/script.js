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

//~========== Top News in India ==========~//

//? Loads Fixed Articles for Infinite Scroll

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

//? Remove Corrupt Article

function displayTopNews(articles) {
  topNews.innerHTML = "";
  articles.forEach((article) => {
    if (
      !article.urlToImage ||
      !article.title ||
      !article.description ||
      article.title === "[Removed]"
    ) {
      return;
    }

    //? Create Article elements

    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;

    const title = document.createElement("h2");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    //? Adds the Article card

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.setAttribute("data-url", article.url);

    //? Open the article in new tab

    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    topNews.appendChild(blogCard);
  });
}

//~========== Local News in Assam ==========~//

//? Loads Fixed Articles for Infinite Scroll

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
    console.error("Error fetching Local news:", error);
  }
})();

//? Remove Corrupt Article

function displayLocalNews(articles) {
  localNews.innerHTML = "";
  articles.forEach((article) => {
    if (
      !article.urlToImage ||
      !article.title ||
      !article.description ||
      article.title === "[Removed]"
    ) {
      return;
    }

    //? Create Article elements

    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;

    const title = document.createElement("h2");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    //? Adds the Article card

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.setAttribute("data-url", article.url);

    //? Open the article in new tab

    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    localNews.appendChild(blogCard);
  });
}

//~========== Latest News in World ==========~//

//? Loads Fixed Articles for Infinite Scroll

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

//? Remove Corrupt Article

function displayLatestNews(articles) {
  latestNews.innerHTML = "";
  articles.forEach((article) => {
    if (
      !article.urlToImage ||
      !article.title ||
      !article.description ||
      article.title === "[Removed]"
    ) {
      return;
    }

    //? Create Article elements

    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card");

    const img = document.createElement("img");
    img.src = article.urlToImage;

    const title = document.createElement("h2");
    title.textContent = article.title;

    const description = document.createElement("p");
    description.textContent = article.description;

    //? Adds the Article card

    blogCard.appendChild(img);
    blogCard.appendChild(title);
    blogCard.appendChild(description);
    blogCard.setAttribute("data-url", article.url);

    //? Open the article in new tab

    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });
    latestNews.appendChild(blogCard);
  });
}

//~========== Hero Section [Read Now] Button Smooth Scrolling ==========~//

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

//~========== Search Handle & Redirect ==========~//

//? Redirects with the search query in the URL

//? Search Function
function performSearch() {
  const query = searchField.value.trim();
  if (query) {
    window.location.href = `searchResult.html?query=${encodeURIComponent(
      query
    )}`;
  } else {
    alert("Please enter a search query.");
  }
}

//? Redirects with the search query in the URL (Button and Enter Key)
searchButton.addEventListener("click", performSearch);

searchField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    performSearch();
  }
});

//? Search Toggle
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

//~========== Scroll To Top ==========~//

const scrollToTopBtn = document.getElementById("scrollToTopBtn");

//? Show or hide the button based on scroll position (down 200px)

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.style.display = "flex";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

//? Smoothly scroll to the top when clicked

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//~========== Newsletter Subscribe ==========~//

//! Dummy Feature for no backend system

document
  .getElementById("newsletter-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const emailInput = this.email;
    const feedback = document.getElementById("newsletter-feedback");
    const emailValue = emailInput.value.trim();

    if (emailValue === "") {
      feedback.textContent = "";
      return;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      feedback.textContent = "Thank you for subscribing!";
      feedback.style.color = "green";
      emailInput.value = "";
    } else {
      feedback.textContent = "Please enter a valid email address.";
      feedback.style.color = "red";
    }
  });
