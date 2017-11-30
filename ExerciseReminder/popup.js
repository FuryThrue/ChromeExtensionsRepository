'use strict';

document.getElementById('changerButton').addEventListener('click', changeTimerStatus);

var TIME_ALERT_KEY = "timeOfAlert", IS_ENABLE_KEY = "isEnable", PERIOD_IN_MINUTES_KEY = "periodInMinutes";

var launch = "Запустить", cancel = "Отменить", timer;
var timerElement = document.getElementById("timer");
var selector = document.getElementById("selector");
var changerButton = document.getElementById("changerButton")

var isEnabled = Boolean(localStorage.getItem(IS_ENABLE_KEY));
if (isEnabled) {
    selector.disabled = true;
    startTimer();
}
else {
    stopTimer();
    selector.disabled = false;
}

var periodItem = localStorage.getItem(PERIOD_IN_MINUTES_KEY);
var periodInMinutes = periodItem === null ? 5 : parseInt(periodItem);
selector.value = periodInMinutes;

function startTimer() {
    setMinutes();
    timer = setInterval(setMinutes, 1000);
    changerButton.innerText = cancel;
}

function stopTimer() {
    clearInterval(timer);
    changerButton.innerText = launch;

    timerElement.innerHTML = "Остановлено";
    changerButton.innerText = launch;
}



function setMinutes() {
    var now = new Date().getTime();

    var item = localStorage.getItem(TIME_ALERT_KEY);
    var timeOfAlert = parseInt(item);

    var timerElement = document.getElementById("timer");
    var distanceUnixTime = timeOfAlert - now;
    if (distanceUnixTime > 0) {
        var minutes = Math.floor((distanceUnixTime % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distanceUnixTime % (1000 * 60)) / 1000);

        var secondsString = seconds < 10 ? "0" + seconds : seconds;
        timerElement.innerHTML = minutes + ":" + secondsString;
    }
    else
        timerElement.innerHTML = selector.value +":00";
}

function changeTimerStatus() {
    isEnabled = !isEnabled;
    if (isEnabled) {
        selector.disabled = true;
        chrome.runtime.sendMessage({stopTimer: isEnabled, period: selector.value});
        startTimer();
    }
    else {
        stopTimer();
        chrome.runtime.sendMessage({stopTimer: isEnabled});
        selector.disabled = false;
    }
}