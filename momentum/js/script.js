import playList from './playList.js';

// alert('Приложение доступно только на английском языке, но уже идет работа над его оптимизацией');
window.addEventListener('DOMContentLoaded', () => {
    const weatherIcon = document.querySelector('.weather-icon'),
          temperature = document.querySelector('.temperature'),
          wind = document.querySelector('.wind'),
          humidity = document.querySelector('.humidity'),
          weatherDescription = document.querySelector('.weather-description'),

          city = document.querySelector('.city'),

          audio = document.querySelector('audio'),
          audioPanel = document.querySelector('.control-panel'),
          audioBtn = document.querySelector('.play'),
          audioPrev = document.querySelector('.play-prev'),
          audioNext = document.querySelector('.play-next'),
          timeline = document.querySelector(".timeline"),
          timePanel = document.querySelector('.time-play'),
          volumeContainer = document.querySelector(".volume-container .volume"),
          volumeSlider = document.querySelector(".control-panel .volume-slider"),
          volumeBtn = document.querySelector('.volume-button'),
          playListContainer = document.querySelector('.play-list'),

          name = document.querySelector('.greeting-container .name'),
          quote = document.querySelector('.quote-text'),
          author = document.querySelector('.quote-author'),
          changeButton = document.querySelector('.change-quote'),

          time = getTimeOfDay(),
          prevButton = document.querySelector('.slide-prev'),
          nextButton = document.querySelector('.slide-next'),
          random = getRandomNum(),
          body = document.body,
          img = new Image();

    let isPlay = false,
        listArr = [],
        playNum = 0;

    //Event
    window.addEventListener('beforeunload', () => setLocalStorage('name', name));
    window.addEventListener('load', () => getLocalStorage('name', name));
    window.addEventListener('beforeunload', () => setLocalStorage('city', city));
    window.addEventListener('load', () => getLocalStorage('city', city));
    window.addEventListener('load', getLocalStorageWeather);

    city.addEventListener('keypress', setCity);
    changeButton.addEventListener('click', (e) => {
        e.preventDefault();
        getQuotes(Math.floor(Math.random() * (20 - 1) + 1));
    });


    playListContainer.addEventListener('click', (e) => {
        playByClick(e.target, 0);
        playByClick(e.target, 1);
        playByClick(e.target, 2);
        playByClick(e.target, 3);
    });

    audio.addEventListener("loadeddata",() => {
        document.querySelector(".time-play .length").textContent = getTimeCodeFromNum(audio.duration);
        audio.volume = .55;
    }, false);
    audio.addEventListener("ended",() => {
        document.querySelector(".time-play .length").textContent = getTimeCodeFromNum(audio.duration);
        localStorage.audioTime = 0;
        playAudio(playNum + 1);
        toggleActive(playNum + 1);
    }, false);
    audioBtn.addEventListener('click', () => {
        toggleBtn()
        playAudio(playNum);
    });
    audioPrev.addEventListener('click', () => {
        localStorage.audioTime = 0;
        changeSound(-1)
    });
    audioNext.addEventListener('click', () => {
        localStorage.audioTime = 0;
        changeSound(1)
    });
    timeline.addEventListener("click", e => {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
        audio.currentTime = timeToSeek;
    }, false);
    volumeContainer.addEventListener('mouseover', (e) => {
        volumeSlider.style.left = '-110px';
        volumeSlider.style.width = '120px';
    });
    window.addEventListener('click', (e) => {
        if(e.target !== audioPanel && e.target !== volumeContainer && e.target !==volumeSlider) {
            volumeSlider.style.left = '0';
            volumeSlider.style.width = '0';
        }
    })
    audioPanel.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('l')
        const sliderWidth = window.getComputedStyle(volumeSlider).width;
        const newVolume = e.offsetX / parseInt(sliderWidth);
        audio.volume = newVolume;
        document.querySelector(".control-panel .volume-percentage").style.width = newVolume * 100 + '%';
    });

    setInterval(() => {
        const progressBar = document.querySelector(".progress");
        progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
        document.querySelector(".time-play .current").textContent = getTimeCodeFromNum(
        audio.currentTime
        );
    }, 500);

    volumeBtn.addEventListener("click", () => {
        audio.muted = !audio.muted;
        if (audio.muted) {
            volumeContainer.classList.remove("icono-volumeMedium");
            volumeContainer.classList.add("icono-volumeMute");
        } else {
            volumeContainer.classList.add("icono-volumeMedium");
            volumeContainer.classList.remove("icono-volumeMute");
        }
    });

    //Time & Day

    function showTime() {
        const time = document.querySelector('.time');
        const date = new Date();
        const currentTime = date.toLocaleTimeString();


        time.textContent = currentTime;
        setTimeout(showTime, 1000);
    }
    showTime();

    function showDate() {
        const date = document.querySelector('.date'),
              data = new Date(),
              options = {month: 'long', day: 'numeric', weekday: 'long'};

        const currentDate = `${data.toLocaleDateString('en', options)}`;

        date.textContent = currentDate;
    }
    showDate();

    function showGreeting() {
        const greetingSpan = document.querySelector('.greeting'),
              greetingText = `Good ${time}, `;

        greetingSpan.textContent = greetingText;
    }
    showGreeting();

    function getTimeOfDay() {
        const arrOfDayEn = ['morning', 'afternoon', 'evening', 'night'],
              date = new Date(),
              hours = date.getHours();
        let timeOfDay;

        if(hours >= 6 && hours <=11) {
            timeOfDay = arrOfDayEn[0];
        } else if (hours >= 12 && hours <=17) {
            timeOfDay = arrOfDayEn[1];
        } else if (hours >= 18 && hours <=23) {
            timeOfDay = arrOfDayEn[2];
        } else if (hours >= 24 && hours <=5) {
            timeOfDay = arrOfDayEn[3];
        }
        return timeOfDay;
    }

    //Local Storage

    function setLocalStorage(value, arg) {
        localStorage.setItem(value, arg.value);
    }

    function getLocalStorage(value, arg) {
        if(localStorage.getItem(value)) {
          arg.value = localStorage.getItem(value);
        }
    }

    //Background

    function getRandomNum() {
        let num = Math.floor(Math.random() * (20 - 1) + 1);
            return num;
    }


    function setBg(x) {
        img.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/${typeof(x) !== 'string' && x < 10 ? '0' + x : x}.jpg`;
        img.onload = () => {
            body.style.backgroundImage = `url(${img.src})`;
        };
        nextButton.addEventListener('click', (e) => {
            if(x > 19) {
                setBg(1);
            } else {
                setBg(x + 1);
            }
        });
        prevButton.addEventListener('click', (e) => {
            if(x < 2) {
                setBg(20);
            } else {
                setBg(x - 1);
            }
        });
    }
    setBg(random);

    //Weather

    async function getWeather(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city || city.value}&lang=en&appid=6f40e26632c80a5f4f1283a7b631139c&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        if(city.value === '' || city.value === undefined || city.value !== data.name || city.value !== localStorage.city) {
            temperature.textContent = "We can't find this city:(";
            humidity.textContent = '';
            weatherDescription.textContent = '';
            wind.textContent = '';
        }
        weatherIcon.className = 'weather-icon owf';

        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.floor(data.main.temp)}°C`;
        wind.textContent = `Wind speed: ${Math.floor(data.wind.speed)}m/s`;
        humidity.textContent = `Humidity: ${Math.floor(data.main.humidity)}%`;
        weatherDescription.textContent = data.weather[0].description;
        console.log(city)

    }

    function getLocalStorageWeather() {
        getWeather(localStorage.city);
        console.log(localStorage.city)
    }

    function setCity(event) {
        if (event.code === 'Enter') {
            getWeather(city.value);
        }
    }

    //Quotes

    function getQuotes(i) {
        const quotes = "data.json";
        fetch(quotes)
            .then(res => res.json())
            .then(data => {
                quote.textContent = `\"${data[i].text}\"`;
                author.textContent = data[i].author;
            })
            .catch();
    }
    getQuotes(Math.floor(Math.random() * (20 - 1) + 1));

    //Audio

    playList.forEach(el => {
        listArr.push(el.title);
    });
    listArr.forEach((item, i) => {
        const li = document.createElement('li');
        li.textContent = item;
        li.classList.add('play-item');
        li.classList.add(`item-${i}`);
        playListContainer.appendChild(li);
    });

    let loop = ()=> {
        localStorage.audioTime = audio.currentTime;
        requestAnimationFrame(loop);
    }
        requestAnimationFrame(loop)


    function playAudio(n) {
        audio.src = playList[n].src;
        audio.currentTime = 0;
        if(!isPlay) {
            audio.play();
            audio.currentTime = localStorage.audioTime || 0;
        } else {
            audio.pause();
            audio.currentTime = localStorage.audioTime
        }

        toggleActive(n);
    }

    function playByClick(target, n) {
        if(target.classList.contains(`item-${n}`)) {
            toggleActive();
            toggleBtn();
            playAudio(n);
        }
    }

    function toggleBtn () {
        volumeBtn.style.visibility = 'visible';
        timePanel.style.visibility = 'visible';
        audioBtn.classList.toggle('pause');
        if(audioBtn.classList.contains('pause')) {
            isPlay = false;
        } else {
            isPlay = true;
        }
    }

    function toggleActive(playNum) {
        let sounds = playListContainer.getElementsByClassName("play-item");
        for(let i = 0; i < sounds.length; i++) {
            if(playNum === i && !isPlay) {
                sounds[i].classList.add('item-active');
            } else if (playNum > i || playNum < i) {
                sounds[i].classList.remove('item-active');
            } else {
                sounds[i].classList.remove('item-active');
            }
        }
    }

    function changeSound(i) {
        playNum = playNum + i;
        if(playNum < 0) {
            playNum = playList.length - 1;
        } else if (playNum > playList.length - 1) {
            playNum = 0;
        }

        playAudio(playNum);
    }

    function getTimeCodeFromNum(num) {
        let seconds = parseInt(num);
        let minutes = parseInt(seconds / 60);
        seconds -= minutes * 60;
        const hours = parseInt(minutes / 60);
        minutes -= hours * 60;

        if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
        return `${String(hours).padStart(2, 0)}:${minutes}:${String(
          seconds % 60
        ).padStart(2, 0)}`;
      }
})