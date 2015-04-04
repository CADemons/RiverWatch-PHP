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
            alert("Date range my not extend past caurrent date");
        } else {
            _RiverWatch.startDate = getEnteredStartDate();
            _RiverWatch.endDate = getEnteredEndDate();
            showDateDisplay();
        }
    });
    $("#cancel").click(function () {
        showDateDisplay();
    });
    $("#date-display").click(showDateBar);
    initDateBar();
    showDateDisplay();
    getData();
}

function getData() {
    var times = [];
    var load = $("#load");
    load.css("visibility", "visible");
    var maxpoints = $("#resolution").val();
    var offset = $("#selector").val();
    //alert(offset);
    var timenow = new Date().getTime();
    var perpoint = offset / maxpoints;
    var timestring = "";
    var startdate;
    var enddate;
    for (var c = 0; c < maxpoints; c++) {
        var time = Math.round((timenow - offset) + perpoint * (c + 1));
        var dm = new Date(time);
        if(c === 0) {
            startdate = moment(dm);
        }
        date = dm.getDate();
        hours = dm.getHours();
        month = dm.getMonth() + 1;
        minutes = dm.getMinutes();
        qmins = 15 * Math.round(minutes / 15);
        if(qmins == 60) {
            qmins = 0;
        }
        var pad = "";
        var hpad = "";
        var mpad = "";
        if(date < 10) {
            pad = "0";
        }
        if(hours < 10) {
            hpad = "0";
        }
        if(month < 10) {
            mpad = "0";
        }
        timestring = timestring.concat(dm.getFullYear(), ".", mpad, month, ".", pad, date, ".", hpad, hours, ":", qmins, ",");
    }
    enddate = moment(dm);
    timestring = timestring.substr(0, timestring.length - 1);
    console.log(timestring);
    $.ajax({
        url: "read.php",
        type: "POST",
        data: 'times=' + encodeURIComponent(timestring),
        success: function (data, status, xhr) {
            var times = data.split(",").reverse();
            if(Math.min.apply(Math, times) - 5 > 0) {
                var dispmin = Math.round(Math.min.apply(Math, times) - 5);
            } else {
                var dispmin = 0;
            }
            var dispmax = Math.round(Math.max.apply(Math, times) + 5);
            //alert(new String(dispmax).concat(" in") + new String(dispmin).concat(" in"));
            $("#top").text(new String(dispmax).concat(" in"));
            $("#bottom").text(new String(dispmin).concat(" in"));
            $("#start").text(startdate.format('ha MMM Do YYYY'));
            $("#end").text(enddate.format('ha MMM Do YYYY'));
            var dispdiff = dispmax - dispmin;
            //alert(dispmax + " " + dispmin);
            var pointpairs = [];
            for (var c = 0; c !== times.length; c++) {
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
        }
    });
    //alert(time + JSON.stringify(times));
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
}

function getEnteredStartDate() {
    return moment([$("#start-year").val(), $("#start-month").val(), $("#start-day").val()]);
}

function getEnteredEndDate() {
    return moment([$("#end-year").val(), $("#end-month").val(), $("#end-day").val()]);
}
