// Frame-based setInterval polyfill
var intervals = {};
var nextId = 0;

function setIntervalLS(callback, delayMs) {
    var id = nextId++;
    var elapsed = 0;

    var evt = script.createEvent("UpdateEvent");
    evt.bind(function(e) {
        if (!(id in intervals)) return; // cleared
        elapsed += e.getDeltaTime();
        if (elapsed >= delayMs / 1000.0) { // convert ms → seconds
            elapsed = 0;
            callback();
        }
    });

    intervals[id] = evt;
    return id;
}

function clearIntervalLS(id) {
    delete intervals[id];
}

global.textLogger.log("Hello!");
global.textLogger.log("These are custom logs...");
global.textLogger.log("Just import the TextLogger and call:");
global.textLogger.log("global.textLogger.log('text')");
global.textLogger.log("You", "can", {"use": "many"}, "arguments also.");

global.textLogger.logToScreen("You can use classic method");


// Print every second
var id = setIntervalLS(function() {
    // print("Tick at " + getTime());
    global.textLogger.log("Hello @ " + getTime());
}, 1000);

// Stop after 5 seconds
/*
var stopEvt = script.createEvent("DelayedCallbackEvent");
stopEvt.bind(function() {
    clearIntervalLS(id);
    print("Interval cleared");
});
stopEvt.delay = 5.0; // seconds
*/