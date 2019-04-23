$(document).ready(function () {

    // =============================== global variabls / firebase init ==================================

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCNFZX-IHK_MymSzP9H4UmNKzbtejtjtGU",
        authDomain: "salad-bowl-6af2d.firebaseapp.com",
        databaseURL: "https://salad-bowl-6af2d.firebaseio.com",
        projectId: "salad-bowl-6af2d",
        storageBucket: "salad-bowl-6af2d.appspot.com",
        messagingSenderId: "94589801729"
    };
    firebase.initializeApp(config);

    // reference the database for use later
    var database = firebase.database();

    // =================================== page building code ===========================================

    // =============================== functions go here ================================================

    // ================================= even listeners go here =========================================
    $("#game-start").on("click", function() {
        // show the modal
        $("#game-start-modal").css("display", "block");
        // hide the button
        $(this).css("display", "none");
    });




});