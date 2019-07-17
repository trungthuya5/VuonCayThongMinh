$(function () {

    var root = $("html, body");
    //console.log(root.offset().top);

    // Khởi tạo cấu hình
    $(".d1").addClass("bg-on");
    $(".d2").addClass("bg-on");
    $(".d3").addClass("bg-on");
    $(".d4").addClass("bg-on");
    $(".d5").addClass("bg-on");


    // Cấu hình menu
    $(".top-menu ul li a").click(function (event) {
        event.preventDefault();
        if ($.attr(this, "href").indexOf("#") != -1 && $.attr(this, "href") != "#") {
            root.animate({
                scrollTop: $($.attr(this, "href")).offset().top - 76
            }, 1000);
        }
    });

    // Giao tiếp server
    
    var socket = io();

    socket.on("maybom", (msg) => {
        console.log("maybom" + msg)
        $("#val1").val(msg);

    })

    socket.on("dulieu", (msg) => {
        console.log(msg)

        google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Độ ẩm đất');

      data.addRows(msg);

      var options = {
        hAxis: {
          title: 'Thời gian'
        },
        vAxis: {
          title: 'Độ ẩm đất'
        },
        backgroundColor: '#f1f8e9'
      };

      var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
      chart.draw(data, options);
    }
    
    })
    socket.on("doamdat", (msg) => {
        console.log("doamdat" + msg)
        $("#doamdat").text("Độ ẩm hiện tại: " +msg);
        
    })
   
    socket.on("esp8266", function (result) {
        if (result == "led1on") {
            $("button.d1").removeClass("bg-off").addClass("bg-on");
        } else if (result == "led2on") {
            $("button.d2").removeClass("bg-off").addClass("bg-on");
        } else if (result == "led3on") {
            $("button.d3").removeClass("bg-off").addClass("bg-on");
        } else if (result == "led4on") {
            $("button.d4").removeClass("bg-off").addClass("bg-on");
        } else if (result == "led1off") {
            $("button.d1").removeClass("bg-on").addClass("bg-off");
        } else if (result == "led2off") {
            $("button.d2").removeClass("bg-on").addClass("bg-off");
        } else if (result == "led3off") {
            $("button.d3").removeClass("bg-on").addClass("bg-off");
        } else if (result == "led4off") {
            $("button.d4").removeClass("bg-on").addClass("bg-off");
        } else if (result == "allledon") {
            $("button.d1").removeClass("bg-off").addClass("bg-on");
            $("button.d2").removeClass("bg-off").addClass("bg-on");
            $("button.d3").removeClass("bg-off").addClass("bg-on");
            $("button.d4").removeClass("bg-off").addClass("bg-on");
        } else if (result == "allledoff") {
            $("button.d1").removeClass("bg-on").addClass("bg-off");
            $("button.d2").removeClass("bg-on").addClass("bg-off");
            $("button.d3").removeClass("bg-on").addClass("bg-off");
            $("button.d4").removeClass("bg-on").addClass("bg-off");
        }
    })

    // Xử lý sự kiện click button
    $("button.d1").click(function (event) {
        event.preventDefault();
        if ($("button.d1").hasClass("bg-off")) {
            $("button.d1").removeClass("bg-off")
            $("button.d1").addClass("bg-on")
            socket.emit("esp8266", "led1on")
        } else {
            $("button.d1").addClass("bg-off")
            $("button.d1").removeClass("bg-on")
            socket.emit("esp8266", "led1off")
        }
    })

    $("button.d2").click(function (event) {
        event.preventDefault();
        if ($("button.d2").hasClass("bg-off")) {
            $("button.d2").removeClass("bg-off")
            $("button.d2").addClass("bg-on")
            socket.emit("esp8266", "led2on")
        } else {
            $("button.d2").addClass("bg-off")
            $("button.d2").removeClass("bg-on")
            socket.emit("esp8266", "led2off")
        }
    })

    $("button.d3").click(function (event) {
        event.preventDefault();
        if ($("button.d5").hasClass("bg-on")) return;
        if ($("button.d3").hasClass("bg-off")) {
            $("button.d3").removeClass("bg-off")
            $("button.d3").addClass("bg-on")
            socket.emit("esp8266", "led3on")
        } else {
            $("button.d3").addClass("bg-off")
            $("button.d3").removeClass("bg-on")
            socket.emit("esp8266", "led3off")
        }
    })

    $("button.d4").click(function (event) {
        event.preventDefault();
        if ($("button.d4").hasClass("bg-off")) {
            $("button.d1").removeClass("bg-off").addClass("bg-on")
            $("button.d2").removeClass("bg-off").addClass("bg-on")
            $("button.d3").removeClass("bg-off").addClass("bg-on")
            $("button.d4").removeClass("bg-off").addClass("bg-on")
            socket.emit("esp8266", "allledon")
        } else {
            $("button.d1").removeClass("bg-on").addClass("bg-off")
            $("button.d2").removeClass("bg-on").addClass("bg-off")
            $("button.d3").removeClass("bg-on").addClass("bg-off")
            $("button.d4").removeClass("bg-on").addClass("bg-off")

            socket.emit("esp8266", "allledoff")
        }
    })

    $("button.d5").click(function (event) {
        event.preventDefault();
        if ($("button.d5").hasClass("bg-off")) {
            $("button.d5").removeClass("bg-off").addClass("bg-on")
            socket.emit("esp8266", "led4on")
        } else {
            $("button.d5").addClass("bg-off").removeClass("bg-on")
            socket.emit("esp8266", "led4off")
        }
    })

    $("button.submit").click(function (event) {
        event.preventDefault();

        var val = $("#val1").val();
        socket.emit("maybom", val)
    })

});




