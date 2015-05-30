/* global moment */

var _RiverWatch = {};

function init() {
    $("#update").click(function () {
        //getData();
        if(!getEnteredStartDate().isValid() || !getEnteredEndDate().isValid()) {
            alert("Invalid date");
        } else if(getEnteredEndDate().isBefore(getEnteredStartDate(), "day")) {
            alert("Start date may not be after end date");
        } else if(getEnteredEndDate().isAfter(moment(), "day")) {
            alert("Date range my not extend past current date");
        } else {
            _RiverWatch.startDate = getEnteredStartDate();
            if(getEnteredEndDate().isSame(moment(), "day")) {
                _RiverWatch.endDate = moment();
            } else {
                _RiverWatch.endDate = getEnteredEndDate().hours(23).minutes(59).seconds(59);
            }
            _RiverWatch.maxPoints = $("#max-points").val();
            getData();
        }
    });
    $("#cancel").click(function () {
        showDateDisplay();
    });
    $("#date-display").click(showDateBar);
    initDateBar();
    getData();
}

function getData() {
    var load = $("#load");
    load.css("visibility", "visible");
    var totalTime = _RiverWatch.endDate.diff(_RiverWatch.startDate, "minutes");
    var interval = 15;
    if(_RiverWatch.maxPoints > 0) {
        interval *= Math.ceil(totalTime / (interval * _RiverWatch.maxPoints));
    }
    var timestring = "";
    var points = 0;
    var newDate = _RiverWatch.startDate.clone();
    while(!newDate.isAfter(_RiverWatch.endDate)) {
        newDate.subtract(newDate.minutes() % 15, "minutes")
        timestring = timestring.concat(newDate.format("YYYY.MM.DD.HH:m") + ",");
        points++;
        newDate.add(interval, "minutes");
    }
    timestring = timestring.substr(0, timestring.length - 1);
    console.log(timestring);
    $.ajax({
        url: "read.php",
        type: "POST",
        data: 'times=' + encodeURIComponent(timestring),
        success: function (data, status, xhr) {
            console.log(data);
            var times = data.split(",");
            var dispmin = Math.round(Math.min.apply(Math, times)) - 5;
            if(dispmin < 0) {
                dispmin = 0;
            }
            var dispmax = Math.round(Math.max.apply(Math, times)) + 5;
            $("#top").text(new String(dispmax).concat(" in"));
            $("#bottom").text(new String(dispmin).concat(" in"));
            $("#start").text(_RiverWatch.startDate.format("ddd MMM Do YYYY"));
            $("#end").text(_RiverWatch.endDate.format("ddd MMM Do YYYY"));
            var dispdiff = dispmax - dispmin;
            var pointpairs = [];
            for(var c = 0; c !== times.length; c++) {
                pointpairs[c] = new String("").concat(10 + c * (600 / (times.length - 1)), ",", 300 - (dispmin + (times[c] - dispmin) * 300 / dispdiff));
            }
            pointpairs[times.length] = "610,300";
            pointpairs[times.length + 1] = "10,300";
            pointpairs[times.length + 2] = pointpairs[0];
            //alert(pointpairs);
            var pointstring = pointpairs.join(" ");
            console.log(pointstring);
            $("#data").attr("points", pointstring);
            load.css("visibility", "hidden");
            showDateDisplay();
        }
    });
}

function showDateDisplay() {
    var startString = _RiverWatch.startDate.format("dddd MMMM Do YYYY");
    var endString = _RiverWatch.endDate.format("dddd MMMM Do YYYY");
    $("#date-display").html("From <b>" + startString + "</b> to <b>" + endString + "</b> (Click to edit)");
    $("#date-bar").hide();
    $("#date-display").show();
}

function showDateBar() {
    $("#start-year").val(_RiverWatch.startDate.year());
    $("#start-month").val(_RiverWatch.startDate.month());
    $("#start-day").val(_RiverWatch.startDate.date());
    $("#end-year").val(_RiverWatch.endDate.year());
    $("#end-month").val(_RiverWatch.endDate.month());
    $("#end-day").val(_RiverWatch.endDate.date());
    $("#max-points").val(_RiverWatch.maxPoints);
    $("#date-display").hide();
    $("#date-bar").show();
}

function initDateBar() {
    _RiverWatch.endDate = moment();
    var year = moment().year();
    var month = moment().month();
    var date = moment().date();
    if(month === 1 && date === 29) {
        _RiverWatch.startDate = moment([year - 1, month, date - 1]);
    } else {
        _RiverWatch.startDate = moment([year - 1, month, date]);
    }
    _RiverWatch.maxPoints = 10000;
}

function getEnteredStartDate() {
    return moment([$("#start-year").val(), $("#start-month").val(), $("#start-day").val()]);
}

function getEnteredEndDate() {
    return moment([$("#end-year").val(), $("#end-month").val(), $("#end-day").val()]);
}
