var chartModel;

function init() {
    $('#resolution').keydown(function (event) {
        var keypressed = event.keyCode || event.which;
        if(keypressed === 13) {
            getData();
        }
    });
    chartModel = new Chart($("#heightChart").get(0).getContext("2d"));
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
    $.ajax({
        url: "read.php",
        type: "POST",
        data: "times=" + encodeURIComponent(timestring),
        success: function (data, status, xhr) {
            var heights = data.split(",").reverse();
            var times = timestring.split(",");
            var data = {
                labels: times,
                datasets: [{
                        label: "Depth",
                        fillColor: "rgba(70,117,182,0.2)",
                        strokeColor: "rgba(70,117,182,1)",
                        data: heights
                    }]
            };
            chartModel.Line(data, {
                animation: false,
                beizerCurve: false,
                pointDot: false
            });
            load.css("visibility", "hidden");
        }
    });
    //alert(time + JSON.stringify(times));
}
