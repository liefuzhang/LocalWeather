$(document).ready(function () {
    showLocalWeather();
});

function showLocalWeather() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude;
            var lon = position.coords.longitude;
            $.when(showAddress(lat,lon), showTmp(lat,lon)).then(
                (addrJson,tmpJson)=> {
                    var addr = addrJson[0].results[0].address_components;
                    var sub = addr.filter((a)=>{
                        return a.types.includes("sublocality");
                    })[0].short_name;
                    var country = addr.filter((a)=>{
                        return a.types.includes("country");
                    })[0].short_name;
                    $("#address").html(sub + ', ' + country);

                    
                    var temp = tmpJson[0].main.temp;
                    var icon = tmpJson[0].weather[0].icon;
                    $('#tmp').html(temp);
                    $('#unit').html('C');
                    $('#deg').html('&deg;');
                    $('#unit').on('click', (e)=>{
                        changeUnit();
                    });
                    $('#weatherImg')[0].src = icon;
                });
            showAddress(lat,lon);
            showTmp(lat,lon);
        });
    }
}

function changeUnit() {
    var tmp = $('#tmp').html();
    var unit = $('#unit').html();

    if (unit === 'C') {
        tmp = tmp * 9 / 5 + 32;
        $('#tmp').html(tmp);
        $('#unit').html('F');
    } else {
        tmp = (tmp - 32) * 5 / 9;
        $('#tmp').html(tmp);
        $('#unit').html('C');       
    }
}

function showAddress(lat, lon) {
    return $.ajax({
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyAoMbd0b03to_swpLXVBxWK87KDfNxoMtk`,
        dataType: 'json', 
        error: function () {
            alert("Error");
        }
    })
}

function showTmp(lat, lon) {
    return $.ajax({
        url: `https://fcc-weather-api.glitch.me/api/current?lat=${lat}&lon=${lon}`,
        dataType: 'json',
        error: () => {
            alert("Error");
        }
    })
}