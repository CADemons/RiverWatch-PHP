function getData() {
                var times = [];
                var load = document.getElementById("load");
                load.style.visibility = "visible";
                var maxpoints = document.getElementById("resolution").value;
                var offset = document.getElementById("selector").value;
                //alert(offset);
                var timenow = new Date().getTime();
                var perpoint = offset / maxpoints;
                var timestring = "";
                var startdate;
                var enddate;
                for (var c = 0; c < maxpoints; c++) {
                    var time = Math.round((timenow - offset) + perpoint * (c + 1));
                    var dm = new Date(time);
                    if (c === 0) {
                        startdate = moment(dm);
                    }
                    date = dm.getDate();
                    hours = dm.getHours();
                    month = dm.getMonth() + 1;
                    minutes = dm.getMinutes();
                    qmins = 15 * Math.round(minutes / 15);
                    if (qmins == 60) {
                        qmins = 0;
                    }
                    var pad = "";
                    var hpad = "";
                    var mpad = "";
                    if (date < 10) {
                        pad = "0";
                    }
                    if (hours < 10) {
                        hpad = "0";
                    }
                    if (month < 10) {
                        mpad = "0";
                    }
                    timestring = timestring.concat(dm.getFullYear(), ".", mpad, month, ".", pad, date, ".", hpad, hours, ":", qmins, ",");
                }
                enddate = moment(dm);
                timestring = timestring.substr(0, timestring.length - 1);
                console.log(timestring);
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function() {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        //alert(xmlhttp.responseText);
                        var times = xmlhttp.responseText.split(",").reverse();
                        if (Math.min.apply(Math, times) - 5 > 0) {
                            var dispmin = Math.round(Math.min.apply(Math, times) - 5);
                        } else {
                            var dispmin = 0;
                        }
                        var dispmax = Math.round(Math.max.apply(Math, times) + 5);
                        //alert(new String(dispmax).concat(" in") + new String(dispmin).concat(" in"));
                        document.getElementById("top").textContent = new String(dispmax).concat(" in");
                        document.getElementById("bottom").textContent = new String(dispmin).concat(" in");
                        document.getElementById("start").textContent = startdate.format('ha MMM Do YYYY');
                        document.getElementById("end").textContent = enddate.format('ha MMM Do YYYY');
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
                        document.getElementById("data").setAttribute("points", pointstring);
                        load.style.visibility = "hidden";
                    }
                }
                xmlhttp.open("POST", "read.php", true);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send('times=' + encodeURIComponent(timestring));
                //alert(time + JSON.stringify(times));
            }
            