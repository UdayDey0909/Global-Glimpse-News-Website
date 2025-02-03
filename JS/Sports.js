const { apikey, BASE_URL } = window.config;

//~========== DOM Elements ==========~//

const sportsNews = document.getElementById("sports-news");
const searchField = document.getElementById("search-field");
const searchButton = document.getElementById("search-button");
const scrollAnchor = document.querySelector("#scroll-anchor");
const body = document.querySelector("body");
const nav = document.querySelector("nav");
const modeToggle = document.querySelector(".dark-light");
const searchToggle = document.querySelector(".searchToggle");
const sidebarOpen = document.querySelector(".sidebarOpen");
const sidebarClose = document.querySelector(".sidebarClose");

//~========== Fetch and Display Sports News ==========~//

let page = 1;
let isFetching = false;

//? API URL

async function fetchSportsNews() {
  try {
    const apiUrl = `${BASE_URL}/everything?q=sports&searchIn=title,description&page=${page}&pageSize=8&apikey=${apikey}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    //? Display total results dynamically

    const totalResults = data.totalResults || 0;
    const totalResultsElement = document.getElementById("total-results");
    if (totalResultsElement) {
      totalResultsElement.textContent = `Total Sports Articles: ${totalResults}`;
    }

    return data.articles;
  } catch (error) {
    console.error("Error fetching Sports news", error);
    return [];
  }
}

//? Remove Corrupt Article

function displaySportsNews(articles) {
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

    //? Check if scrollAnchor exists for infinite scrolling

    if (scrollAnchor && sportsNews.contains(scrollAnchor)) {
      sportsNews.insertBefore(blogCard, scrollAnchor);
    } else {
      sportsNews.appendChild(blogCard);
    }
  });
}

//? Fetch & Display Sports News Cards

(async () => {
  try {
    const articles = await fetchSportsNews();
    displaySportsNews(articles);
  } catch (error) {
    console.error("Error fetching Sports News:", error);
  }
})();

//~========== Infinite Scrolling ==========~//

const observer = new IntersectionObserver(
  async (entries) => {
    const endOfResultsMessage = document.getElementById("end-of-results");
    if (entries[0].isIntersecting && !isFetching) {
      isFetching = true;
      page++;

      const articles = await fetchSportsNews();

      //? End of the results

      if (articles && articles.length > 0) {
        displaySportsNews(articles);
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
    rootMargin: "200px",
    threshold: 0.5,
  }
);

//? re-adds the anchor element at the bottom of the page

if (scrollAnchor) {
  observer.observe(scrollAnchor);
}

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

//~========== SideBar Toggle for Smaller Devices  ==========~//

/* sidebarOpen.addEventListener("click", () => {
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
}); */
