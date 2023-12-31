//1. Import
//2. Set up global variables
//3. getDepartureStations/ArrivalStations
//4. initMap
//5. country.on("click")
//6. Reset button
//7. calcTransit/DrivingRoute
//8. findWinner
//9. Dark mode

//1. Import
//Get the list of station names from another file.
import { ukStationNames } from "./stationlist.js";
import { frenchStationNames } from "./french_stationlist.js";
import { germanStationNames } from "./german_stationlist.js";

//2. Set up global variables
//These need to be set as global variables to be accessed later on in findWinner.
let transitDuration;
let drivingDuration;
let stationNames;
let map;

//3. getDepartureStations/ArrivalStations
//Set up functions to create the lists of station names.
function getDepartureStations() {
    for (let i = 0; i < stationNames.length; i++) {
        const option = document.createElement("option");
        option.textContent = stationNames[i];
        option.value = stationNames[i]
        $("#departure-name").append(option);
    }
}

function getArrivalStations() {
    for (let i = 0; i < stationNames.length; i++) {
        const option = document.createElement("option");
        option.textContent = stationNames[i];
        option.value = stationNames[i]
        $("#arrival-name").append(option);
    }
}

//4. initMap
//Initialize the map.
function initMap() {
    var directionsRenderer = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    var unitedKingdom = new google.maps.LatLng(54.483959, -2.244644);
    var mapOptions = {
        zoom: 5,
        center: unitedKingdom,
        disableDefaultUI: true,
        zoomControl: true
    }
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    directionsRenderer.setMap(map);
    $("#transit-button").on("click", function () {
        calcTransitRoute(directionsService, directionsRenderer);
    })
    $("#driving-button").on("click", function () {
        calcDrivingRoute(directionsService, directionsRenderer);
    })
}

//5. country.on("click")
// Function to set parameters depending on which country the user chooses.
$("#united-kingdom").on("click", function () {
    stationNames = ukStationNames;
    getDepartureStations();
    getArrivalStations();
    $(".country-button").hide();
    $(".main-div").show();
})

$("#france").on("click", function () {
    stationNames = frenchStationNames;
    map.setCenter(new google.maps.LatLng(47.081278, 2.397607));
    getDepartureStations();
    getArrivalStations();
    $(".country-button").hide();
    $(".main-div").show();
})

$("#germany").on("click", function () {
    stationNames = germanStationNames;
    map.setCenter(new google.maps.LatLng(51.575265, 9.924643));
    getDepartureStations();
    getArrivalStations();
    $(".country-button").hide();
    $(".main-div").show();
})

//6. Reset button
$("#reset").on("click", function () {
    location.reload(true);
})

//7. calcTransit/DrivingRoute
//Calculate the transit and driving routes and times.
function calcTransitRoute(directionsService, directionsRenderer) {
    //Get values from dropdowns
    var selectedDepartureTime = $("#departure-name").val();
    var selectedArrivalTime = $("#arrival-name").val();
    var selectedDeparture = `${selectedDepartureTime} Station`;
    var selectedArrival = `${selectedArrivalTime} Station`;

    //Route
    var transitRequest = {
        origin: selectedDeparture,
        destination: selectedArrival,
        travelMode: 'TRANSIT',
        transitOptions: {
            modes: [google.maps.TransitMode.TRAIN, google.maps.TransitMode.SUBWAY]
        }
    };
    directionsService.route(transitRequest, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
        else {
            $("#error-message").text("Sorry, no directions were found.")
        }
    });

    //Time
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [selectedDeparture],
            destinations: [selectedArrival],
            travelMode: 'TRANSIT'
        }, callback);

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var duration = element.duration.text;
                    transitDuration = element.duration.value;
                }
            }
            $("#train-label").show();
            $("#transit-time").text(duration);
            $("#transit-time").css("justify-content", "center");
            $("#drive-label").hide();
            $("#drive-time").text("");
            $("#car-image").hide();
            $("#train-image").hide();
            $("#error-message").hide();
        }
        else {
            $("#error-message").text("Sorry, no directions were found.")
        }
    }
}

function calcDrivingRoute(directionsService, directionsRenderer) {
    //Get values from dropdowns
    var selectedDepartureTime = $("#departure-name").val();
    var selectedArrivalTime = $("#arrival-name").val();
    var selectedDeparture = `${selectedDepartureTime} Station`;
    var selectedArrival = `${selectedArrivalTime} Station`;

    //Route
    var driveRequest = {
        origin: selectedDeparture,
        destination: selectedArrival,
        travelMode: 'DRIVING',
        drivingOptions: {
            departureTime: new Date(Date.now())

        }
    };
    directionsService.route(driveRequest, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
        else {
            $("#error-message").text("Sorry, no directions were found.")
        }
    });

    //Time
    var service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
        {
            origins: [selectedDeparture],
            destinations: [selectedArrival],
            travelMode: 'DRIVING'
        }, callback);

    function callback(response, status) {
        if (status == 'OK') {
            var origins = response.originAddresses;
            var destinations = response.destinationAddresses;

            for (var i = 0; i < origins.length; i++) {
                var results = response.rows[i].elements;
                for (var j = 0; j < results.length; j++) {
                    var element = results[j];
                    var duration = element.duration.text;
                    drivingDuration = element.duration.value;
                }
            }
            $("#drive-label").show();
            $("#drive-time").text(duration);
            findWinner();
        }
        else {
            $("#error-message").text("Sorry, no directions were found.")
        }
    }
}

//8. findWinner
//Display a picture showing which method of transit was fastest.
function findWinner() {
    if (transitDuration < drivingDuration) {
        $("#train-image").fadeIn(3000);
    }
    else if (drivingDuration < transitDuration) {
        $("#car-image").fadeIn(3000);
    }
}

//9. Dark mode
//Set up dark mode.
$("#dark-mode").on("click", function () {
    if ($(".toggle-dark").css("background-color") === "rgb(255, 255, 255)") {
        $(".toggle-dark").css("background-color", "black");
        $(".toggle-dark").css("color", "#FFFFFF");
        $(".text-element").css("color", "#FFFFFF");
    }
    else {
        $(".toggle-dark").css("background-color", "#FFFFFF");
        $(".toggle-dark").css("color", "black");
        $(".text-element").css("color", "black");
    }
})

//Ensure the map is initialized when the window loads.
window.initMap = initMap;
//Hide the main page when the window loads so only the selection buttons are visible.
window.onload = $(".main-div").hide();
