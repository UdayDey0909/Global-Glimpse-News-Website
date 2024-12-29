const { apikey, BASE_URL } = window.config;

//~========== DOM Elements ==========~//

const latestNews = document.getElementById("latestNews");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");
const scrollAnchor = document.querySelector("#scroll-anchor");
const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".sidebarClose");

//~========== Fetch and Display Latest News ==========~//

let page = 1;
let isFetching = false;

//? API URL

async function fetchLatestNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=Latest&searchIn=title,description&page=${page}&pageSize=8&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    //? Display total results dynamically

    const totalResults = data.totalResults || 0;
    const totalResultsElement = document.getElementById("total-results");
    if (totalResultsElement) {
      totalResultsElement.textContent = `Total Latest Articles: ${totalResults}`;
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching Latest news", error);
    return [];
  }
}

//? Remove Corrupt Cards

function displayLatestNews(articles) {
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
    blogCard.setAttribute("data-url", article.url);
    blogCard.addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    //? Check if scrollAnchor exists for infinite scrolling

    if (scrollAnchor && latestNews.contains(scrollAnchor)) {
      latestNews.insertBefore(blogCard, scrollAnchor);
    } else {
      latestNews.appendChild(blogCard);
    }
  });
}

//? Fetch & Display Latest News Cards

(async () => {
  try {
    const articles = await fetchLatestNews();
    displayLatestNews(articles);
  } catch (error) {
    console.error("Error fetching Latest News:", error);
  }
})();

//~========== Infinite Scrolling ==========~//

const observer = new IntersectionObserver(
  async (entries) => {
    const endOfResultsMessage = document.getElementById("end-of-results");
    if (entries[0].isIntersecting && !isFetching) {
      isFetching = true;
      page++;

      const articles = await fetchLatestNews();

      //? End of the results

      if (articles && articles.length > 0) {
        displayLatestNews(articles);
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
