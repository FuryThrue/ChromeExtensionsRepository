var TIME_ALERT_KEY = "timeOfAlert", IS_ENABLE_KEY = "isEnable", PERIOD_IN_MINUTES_KEY = "periodInMinutes";

var periodItem = localStorage.getItem(PERIOD_IN_MINUTES_KEY);
var periodInMinutes = periodItem === null ? 5 : parseInt(periodItem);

var timeOfAlert, firstInterval, otherInterval;

var isEnabled = Boolean(localStorage.getItem(IS_ENABLE_KEY));
if (isEnabled) {
    startTimer();
}

function startTimer() {
    var item = localStorage.getItem(TIME_ALERT_KEY);
    if (item === null)
        startMainTimer();
    else
    {
        var parsedTime = parseInt(item);
        var timeNow = new Date().getTime();
        if (parsedTime < timeNow)
            startMainTimer();
        else
        {
            var firstPeriodInMinutes = parsedTime - timeNow;
            firstInterval = setInterval(firstIntervalFunc, firstPeriodInMinutes);
        }
    }
}

function stopTimer() {
    localStorage.clear();
    clearInterval(firstInterval);
    clearInterval(otherInterval);
}

function startMainTimer() {
    otherInterval = setInterval(otherIntervalsFunc, periodInMinutes * 1000 * 60);
    setNewTimeOfAlert();
}

function firstIntervalFunc() {
    otherIntervalsFunc();
    otherInterval = setInterval(otherIntervalsFunc, periodInMinutes * 1000 * 60);
    clearInterval(firstInterval);
}

function otherIntervalsFunc() {
    alert("Самое время отвлечься и подвигаться!");
    setNewTimeOfAlert();
}

function setNewTimeOfAlert() {
    timeOfAlert = new Date().getTime() + periodInMinutes * 1000 * 60;
    localStorage.setItem(TIME_ALERT_KEY, timeOfAlert);
}

chrome.runtime.onMessage.addListener(function(request,sender,sendResponse)
{
    if (request.period !== undefined) {
        periodInMinutes = parseInt(request.period);
        localStorage.setItem(PERIOD_IN_MINUTES_KEY, periodInMinutes);
    }

    if (request.stopTimer !== undefined) {
        isEnabled = Boolean(request.stopTimer);
        localStorage.setItem(IS_ENABLE_KEY, isEnabled);
        if (isEnabled)
            startTimer();
        else
            stopTimer();
    }
});