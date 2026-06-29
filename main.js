// ------ header & scrollTop ------

const header = document.getElementById("header");
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ------ burger & aside ------

const burgerBtn = document.getElementById("burger");
const mobileAside = document.querySelector("aside.mobile-menu");

if (burgerBtn && mobileAside) {
  burgerBtn.addEventListener("click", () => {
    burgerBtn.classList.toggle("active");
    mobileAside.classList.toggle("active");
  });

  const menuLinks = mobileAside.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      burgerBtn.classList.remove("active");
      mobileAside.classList.remove("active");
    });
  });
}

// ------ DESTINATIONS ------

const destinationsGrid = document.getElementById("destinationsGrid");
const filterButtons = document.querySelectorAll(".filter-btn");

let allDestinations = [];

//მონაცემები ჩამოტვირთვა
async function loadDestinations() {
  try {
    const response = await fetch("./city.json");
    if (!response.ok) {
      throw new Error(`შეცდომა : ${response.status}`);
    }

    allDestinations = await response.json();

    renderCards(allDestinations);
    setupFilters();
  } catch (error) {
    destinationsGrid.innerHTML = `<p class="weather-loading">მონაცემების ჩატვირთვა ვერ მოხერხდა...</p>`;
  }
}

//  ქარდების ეკრანზე გამოტანა
function renderCards(places) {
  destinationsGrid.innerHTML = "";

  places.forEach((place) => {
    const card = document.createElement("article");
    card.classList.add("destination-card", "reveal");

    card.innerHTML = `
      <img src="${place.image}" alt="${place.title}" class="card-img">
      <div class="card-body">
        <h3>${place.title}</h3>
        <p>${place.description}</p>
        <span class="card-tag">
          <i class="${place.icon}"></i> ${place.tag}
        </span>
      </div>
    `;
    destinationsGrid.appendChild(card);
  });
}

//  ღილაკების ფილტრი
function setupFilters() {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const selectedCategory = button.getAttribute("data-filter");

      if (selectedCategory === "all") {
        renderCards(allDestinations);
      } else {
        const filteredPlaces = allDestinations.filter(
          (place) => place.tag === selectedCategory,
        );
        renderCards(filteredPlaces);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", loadDestinations);

// ------ Weather ------

const WEATHER_API_KEY = "aa0c20251ebc3f38d2c641a8da7f7e88";

const weatherCities = [
  { name: "Tbilisi", displayName: "თბილისი" },
  { name: "Batumi", displayName: "ბათუმი" },
  { name: "Stepantsminda", displayName: "ყაზბეგი" },
  { name: "Kutaisi", displayName: "ქუთაისი" },
];

//  ქალაქის ამინდი
async function loadWeather() {
  const weatherGrid = document.getElementById("weatherGrid");

  try {
    let weatherCardsHTML = "";

    for (const city of weatherCities) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.name},GE&units=metric&lang=ka&appid=${WEATHER_API_KEY}`;

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Fetch failed");

        const data = await response.json();

        const temp = Math.round(data.main.temp);
        const desc = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        weatherCardsHTML += `
          <div class="weather-card">
            <div class="weather-city">${city.displayName}</div>
            <img src="${iconUrl}" alt="${desc}" class="weather-icon">
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</div>
          </div>
        `;
      } catch (cityError) {
        console.error(`შეცდომა ქალაქზე: ${city.name}`, cityError);

        weatherCardsHTML += `
          <div class="weather-card">
            <div class="weather-city">${city.displayName}</div>
            <div class="weather-desc" style="margin-top: 20px; color: red;">ვერ ჩაიტვირთა</div>
          </div>
        `;
      }
    }

    weatherGrid.innerHTML = weatherCardsHTML;
  } catch (globalError) {
    console.error("ამინდის სრული ჩატვირთვა ვერ მოხერხდა:", globalError);
    weatherGrid.innerHTML = `<div class="weather-loading">ამინდის პროგნოზი დროებით მიუწვდომელია.</div>`;
  }
}

/* --------  COOKIE ----------- */
const cookieBox = document.getElementById("cookie");
const acceptBtn = document.getElementById("acceptCookie");

if (!localStorage.getItem("cookieAccepted")) {
  cookieBox.classList.add("show");
}

acceptBtn.addEventListener("click", () => {
  localStorage.setItem("cookieAccepted", "true");
  cookieBox.classList.remove("show");
});

// ჩატვირთვა
document.addEventListener("DOMContentLoaded", () => {
  if (typeof loadDestinations === "function") {
    loadDestinations();
  }

  if (typeof loadWeather === "function") {
    loadWeather();
  }
});
