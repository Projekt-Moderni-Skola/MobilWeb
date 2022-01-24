var map = L.map("map", { zoomControl: false }).setView(
[50.08804, 14.42076],
    10
  );
L.tileLayer(
    "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=lIVs7d71OHlrFzcb54Lf",
    {
        maxZoom: 18,
    }
).addTo(map);


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