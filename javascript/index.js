// Need to add LOGIN (somehow know that account corresponds to the bike...)
// If time add "service mode that will show some more information"

window.onload = async () => {
    await fetch("../dump.JSON")
        .then(res => res.json())
        .then(data => {
            // Data will change according to the sent JSON file
            lat = data["location"]["lat"]
            long = data["location"]["long"]
            battery = data["state"]["battery"]

            // Here will data be displayed in the index.html
            span = document.getElementById('batteryPerc')
            link = `"https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${lat}%2C${long}%3B${lat}%2C${long}"`

            document.getElementById("getMap").setAttribute('onclick', 'location.href=' + link + ';')
            span.innerHTML = battery + "%"
            var map = L.map("map", { zoomControl: false }).setView(
                [lat, long],
                20
            );
            L.tileLayer(
                "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=lIVs7d71OHlrFzcb54Lf",
                {
                    maxZoom: 30,
                }
            ).addTo(map);
            var circle = L.circle([lat, long], {
                color: '#008FCC',
                fillColor: '#00C0EA',
                fillOpacity: 0.5,
                radius: 2.5
            }).addTo(map);
            var circle = L.circle([lat, long], {
                color: '#008FCC',
                fillColor: '#008FCC',
                fillOpacity: 1,
                radius: 0.7
            }).addTo(map);

            batteryColor = document.getElementById('batteryColor')
            batteryColor.style.background = getColor(battery / 100)
        })
}

function getColor(value) {
    //value from 0 to 1
    var hue = ((value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

var lever = false;
function slide() {
    var top = document.getElementById("top");
    var tl = anime.timeline({
        duration: 500,
        easing: "easeInOutQuad"
    });

    if (lever == false) {
        tl.add({
            targets: top,
            height: "65vh",
        })
            .add({
                targets: "#arrow",
                rotate: "180deg",
            }, "-=500");
        lever = true;
    } else {
        tl.add({
            targets: top,
            height: "5.34045393858478vh",
        })
            .add({
                targets: "#arrow",
                rotate: "0deg",
            }, "-=500");
        lever = false;
    }
}