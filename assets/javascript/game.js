$(document).ready(function () {

    // =============================== global variabls / firebase init ==================================
    // array of team objects
    var teams = [];
    var teamsRandom = [];
    // array of words
    var wordList = [];
    var randomWordList = [];

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
    // this function creates inputs w/ bootstrap styling
    function makeInput(quantity, labelText, selector) {
        while (quantity > 0) {
            var div = $("<div>");
            div.addClass("form-group");
            var label = $("<label>");
            label.text(labelText + " " + quantity);
            var input = $("<input>");
            input.attr({
                "type": "team-name",
                "class": "form-control",
                "id": labelText.toLowerCase().replace(" ", "-") + quantity
            });
            div.append(label, input);
            $(selector).after(div);
            quantity--;
        }
    }

    // team object constructor
    function Team(name) {
        this.name = name,
            this.players = []
        this.score = 0;
        this.wins = 0;
    }

    // populates any randomArray randomly with the contents of an array
    function randomizer(array, randomArray) {
        if (array.length) {
            while (randomArray.length < array.length) {
                var randomIndex = Math.floor(Math.random() * wordList.length);
                if (!randomArray.includes(array[randomIndex])) {
                    randomArray.push(array[randomIndex]);
                }
            }
        }
    }

    // this is the timer that stops each player's turn
    function turnTimer() {
        var timer = setTimeout(function () {
            // remove buttons and switch player / team

        }, 60 * 1000);
    }

    // gets called if all the words are removed from the array - time for a new round
    function nextRound() {
        // clear timer 
        clearTimeout(timer);
    }
    // ================================= even listeners go here =========================================
    // game start button reveals the modal
    $("#game-start").on("click", function () {
        // show the modal
        $("#game-start-modal").css("display", "block");
        // hide the button
        $(this).css("display", "none");
        // make two inputs in the modal initially
        makeInput(2, "Team Name", "#team-number");
    });

    // drop down team names modal to create input fields
    $("#team-number").on("change", function () {
        numTeams = $(this).val();
        console.log(numTeams);
        // create new inputs in the modal and give them unique id's
        $(this).siblings().remove();
        makeInput(numTeams, "Team Name", "#team-number");
        console.log($("#team-number").siblings().length);
    });

    // team name submit button saves team names to the array
    $("#set-teams").on("click", function () {
        // saves the number of words per person!
        var numWords = $("#num-words").val();
        // save team names by creating a new Team instance using the constructor function and then add it to the teams array
        for (i = 1; i < $("#team-number").siblings().length; i++) {
            var newTeam = new Team($("#team-name" + i).val());
            teams.push(newTeam);
        }
        // set the number of inputs in the next modal based on number of words
        makeInput(numWords, "word", "#player-name-div");
        // populate the dropdown w/ the available teams
        teams.forEach(function (name) {
            console.log(name);
            var option = $("<option>");
            option.text(name.name);
            $("#team-select").append(option);
        })
        // hide this modal and go to the next one.
        $("#game-start-modal").css("display", "none");
        $("#player-modal").css("display", "block");
    });

    // player submit button - adds player to a team object, to be used later, and adds the words to an array
    $("#add-player").on("click", function () {
        // grabs the value from the team selected and adds the player to the team object
        var teamName = $("#team-select").val();
        var playerName = $("#player-name").val().trim();
        teams.forEach(function (team) {
            if (team.name === teamName) {
                team.players.push(playerName);
            }
        });
        // clear player name value
        $("#player-name").val("");
        // pushes all the words to the wordList array
        for (i = 1; i <= $("#player-name-div").nextAll().length; i++) {
            var newWord = $("#word" + i).val();
            $("#word" + i).val("");
            wordList.push(newWord);
            console.log(newWord);
        }
    });

    // player back button - re-populates the team name screen and resets variables

    /* Play Game button does all kinds of stuff... 
    1. wordList is randomized and saved to a new array called randomWordList
    2. an array for teams is created and randomized so that the order the teams go in will be random
    3. the modal disappears 
    4. team names and scores are put at the top of the page
    5. a new modal appears with instructions for the person whose turn it is, and a start button
    */

    $("#play-game").on("click", function () {
        // 1. 
        randomizer(wordList, randomWordList);
        console.log(randomWordList);
        // 2. 
        randomizer(teams, teamsRandom);
        console.log(teamsRandom);
        // 3.
        $("#player-modal").css("display", "none");
        // 4. 
        teamsRandom.forEach(function (team) {
            // put the team w/ score at the top of the page
        });
        // 5. 


    });


});