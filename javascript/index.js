var storage = window.localStorage;
const vehicle_code = storage.getItem("code")
var main = document.getElementById("main")
var form = document.getElementById("form")

window.onload = async () => {
    if (vehicle_code != null) {
        form.style.display = "None"
        main.style.display = "Block"

        var date = getDate()
        var code = vehicle_code
        var myHash = hash(date, code)
        response = await getData(date, code, myHash)

        await loadMap(response)
    } else {
        main.style.display = "None"
    }


}

async function login() {
    var date = getDate()
    var code = getCode()
    var myHash = hash(date, code)

    response = await getData(date, code, myHash)

    if (response["status_key"] != 11) {
        alert("Zadal jste neplatný kód!")
    } else {
        loadMap(response)

        main.style.display = "Block"
        form.style.display = "None"

        storage.setItem("code", code)
        location.reload();
    }
}

function unlink() {
    storage.removeItem("code");
    location.reload()
}

async function loadMap(response) {
    gps = response["log"]["gps"]
    gps = gps.split(", ")
    gps[0] = gps[0].slice(0, -2)
    gps[1] = gps[1].slice(0, -2)
    battery = response["log"]["battery_capacity"]
    km = response["log"]["mileage"]

    var span;
    span = document.getElementById('batteryPerc')
    link = `"http://www.google.com/maps/place/${gps[0]},${gps[1]}/data=!3m1!4b1"`
    document.getElementById("getMap").setAttribute('onclick', 'location.href=' + link + ';')
    span.innerHTML = battery + "%"

    span = document.getElementById('kmdriven')
    span.innerHTML = km + " km"
    var name = document.getElementById("bikeName")
    name.innerHTML = response["log"]["vehicle_code"]
    var map = L.map("map", { zoomControl: false }).setView(
        [gps[0], gps[1]],
        20
    );
    L.tileLayer(
        "https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=lIVs7d71OHlrFzcb54Lf",
        {
            maxZoom: 30,
        }
    ).addTo(map);
    var circle = L.circle([gps[0], gps[1]], {
        color: '#008FCC',
        fillColor: '#00C0EA',
        fillOpacity: 0.5,
        radius: 2.5
    }).addTo(map);
    var circle = L.circle([gps[0], gps[1]], {
        color: '#008FCC',
        fillColor: '#008FCC',
        fillOpacity: 1,
        radius: 0.7
    }).addTo(map);

    batteryColor = document.getElementById('batteryColor')
    batteryColor.style.background = getColor(battery / 100)
}

function getDate() {
    var m = new Date();
    const options = { timeZone: 'Europe/Prague', timeZoneName: 'short' }
    var dateString =
        m.getUTCFullYear() + "-" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) + "-" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        m.toLocaleTimeString("en-GB", options).slice(0, -4)

    return dateString;
}

function hash(dateString, vehicle_code) {
    var strings = dateString + "|" + vehicle_code + "|Ad0oNkQWJi7LJBsQoCqV"
    var pbHash = SHA1(strings)

    return pbHash
}

async function getData(dateString, vehicle_code, hash) {
    var config =
    {
        dttm: dateString,
        vehicle_code: vehicle_code,
        signature: hash
    }
    const response = await fetch("https://www.e-zidane.cz/api/get-last-log", {
        method: "POST",
        body: JSON.stringify(config),
    }).then(res => res.json())

    return response
}

function getCode() {
    code =
        document.getElementById("0").value +
        document.getElementById("1").value +
        document.getElementById("2").value +
        document.getElementById("3").value +
        document.getElementById("4").value

    code = code.toUpperCase()

    return code
}

function getColor(value) {
    //value from 0 to 1
    var hue = ((value) * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
}

var lever = false;
function slide() {
    var top = document.getElementById("top");
    var topText = document.getElementById('topText');
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
            }, "-=500")
            .add({
                targets: topText,
                opacity: 1,
                begin: function () {
                    document.getElementById('topText').style.display = 'flex';
                },
            }, "-=200");
        lever = true;
    } else {
        tl.add({
            targets: top,
            height: "5.34045393858478vh",
        })
            .add({
                targets: "#arrow",
                rotate: "0deg",
            }, "-=500")
            .add({
                targets: topText,
                opacity: 0,
                begin: function () {
                    document.getElementById('topText').style.display = 'none';
                },
            }, "-=100");
        lever = false;
    }
}

function SHA1(msg) {
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };
    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;
        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;
        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14) word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}