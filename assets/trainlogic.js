//INITIALIZE FIREBASE

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyA4jWU7jX5qBKvu43wtW0uwnfbHwJKs6fQ",
    authDomain: "train-scheduler-homework-3c923.firebaseapp.com",
    databaseURL: "https://train-scheduler-homework-3c923.firebaseio.com",
    projectId: "train-scheduler-homework-3c923",
    storageBucket: "train-scheduler-homework-3c923.appspot.com",
    messagingSenderId: "1097324305650",
    appId: "1:1097324305650:web:5fd861f273b99e2ee0446b",
    measurementId: "G-P7JNB33PN2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

var database = firebase.database();


// Initial Values
var trainName = "";
var trainDestination = "";
var trainDepartTime = "";
var trainFrequency = "";
var trainNextArrival = "";
var trainMinutesAway = "";

var trainDepartTimeConverted = moment().format("MMM Do YY");


$("#submit-button").on("click", function () {
    event.preventDefault();

    // gather inputs collected from form

    trainName = $("#add-train").val().trim();
    trainDestination = $("#add-destination").val().trim();
    trainDepartTime = moment($("#train-depart-time").val().trim(), "HH: mm").format("X");
    trainFrequency = $("#train-frequency").val().trim();
    
    var totalMinutes = moment().diff(moment(trainDepartTime, "X"), "minutes");
    var fixedMinutes = 1440 + totalMinutes;
    var totalTrains = fixedMinutes / trainFrequency;
    var roundTrains = Math.trunc(totalTrains);
    var minutesAway = trainFrequency - (fixedMinutes - (roundTrains * trainFrequency));
    var nextTrainArrival = moment().add(minutesAway, 'minutes').format("ddd, MMM Do, h:mm a");

    database.ref().push({
        tname: trainName,
        tdestination: trainDestination,
        tnextarrival: nextTrainArrival,
        tfrequency: trainFrequency,
        tminutesaway: minutesAway,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    $('#form')[0].reset();

});

database.ref().on('child_added', function (snapshot) {

    var snapshotVal = snapshot.val();
    console.log(snapshotVal.name);
    var tBody = $('tbody');
    var tRow = $('<tr>');

    //append to the DOM 

    var displayTrainName = $("<td>").text(snapshotVal.tname);
    var displayTrainDestination = $("<td>").text(snapshotVal.tdestination);
    var displayTrainNextArrival = $("<td>").text(snapshotVal.tnextarrival);
    var displayTrainFrequency = $("<td>").text(snapshotVal.tfrequency);
    var displayTrainMinutesAway = $("<td>").text(snapshotVal.tminutesaway);

    tRow.append(displayTrainName, displayTrainDestination, displayTrainNextArrival, displayTrainFrequency, displayTrainMinutesAway);

    tBody.append(tRow);

});
