const API_KEY = "d78d70bbc3dc76ed3d2841de71a91f6b";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const description = document.getElementById("description");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const feelsLike = document.getElementById("feelsLike");
const pressure = document.getElementById("pressure");

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Введіть місто");
        return;
    }

    getWeather(city);
});

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});

async function getWeather(city) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=ua`);

        if (!response.ok) {
            throw new Error("Місто не знайдено");
        }

        const data = await response.json();

        updateCurrentWeather(data);
        getForecast(city);
    } catch (error) {
        alert(error.message);
    }
}

function updateCurrentWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = capitalize(data.weather[0].description);
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} м/с`;
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    pressure.textContent = `${data.main.pressure} гПа`;

    changeBackground(data.weather[0].main);
}

async function getForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric&lang=ua`);
    const data = await response.json();

    const cards = document.querySelectorAll(".forecast-card");

    let index = 0;

    for (let i = 0; i < data.list.length; i += 8) {
        if (index >= cards.length) break;

        const day = data.list[i];

        cards[index].querySelector("h3").textContent = getDay(day.dt_txt);
        cards[index].querySelector("p").textContent = getDate(day.dt_txt);
        cards[index].querySelector("div").textContent = getEmoji(day.weather[0].main);
        cards[index].querySelector("b").textContent =
            `${Math.round(day.main.temp_max)}° / ${Math.round(day.main.temp_min)}°`;

        index++;
    }
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

function getDay(date) {
    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    return days[new Date(date).getDay()];
}

function getDate(date) {
    const d = new Date(date);
    return d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0");
}

function getEmoji(weather) {
    switch (weather) {
        case "Clear":
            return "☀️";
        case "Clouds":
            return "☁️";
        case "Rain":
            return "🌧️";
        case "Drizzle":
            return "🌦️";
        case "Thunderstorm":
            return "⛈️";
        case "Snow":
            return "❄️";
        case "Mist":
        case "Fog":
            return "🌫️";
        default:
            return "☁️";
    }
}

function changeBackground(weather) {
    const body = document.body;

    switch (weather) {
        case "Clear":
            body.style.backgroundImage = "url(images/sunny.jpg)";
            break;
        case "Clouds":
            body.style.backgroundImage = "url(images/cloudy.jpg)";
            break;
        case "Rain":
            body.style.backgroundImage = "url(images/rain.jpg)";
            break;
        case "Snow":
            body.style.backgroundImage = "url(images/snow.jpg)";
            break;
        default:
            body.style.backgroundImage = "url(images/sky-bg.jpg)";
            break;
    }
}



getWeather("Kyiv");

const currentDate = document.getElementById("currentDate");

const today = new Date();

const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
};

currentDate.textContent = today.toLocaleDateString("uk-UA", options);