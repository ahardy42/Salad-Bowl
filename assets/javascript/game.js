$(document).ready(function () {

    // =============================== global variabls / firebase init ==================================
    // array of team objects and indeces to control whose turn it is
    var teams = [];
    var teamIndex = 0;
    var currentTeam;
    var currentPlayer;
    // array of words
    var wordList = [];
    var randomWordList = [];
    var wordIndex = 0;
    // round of the game
    var gameRound = 1;
    var turnTime = 10;
    var count;
    var countDown;
    var timer;
    // htmlstring for the instructions
    var instructions = ["ROUND 1: You may use as many words as you want, but DON'T SAY <span class='font-italic'>the</span> WORD", "ROUND 2: You can only act out the word", "ROUND 3: you may say <em>ONE</em> word (not <em>the</em> word though)"];

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
                "class": "form-control " + labelText.toLowerCase().replace(" ", "-") + "-field",
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
            this.players = [],
            this.score = 0,
            this.wins = 0,
            this.numPlayers = this.players.length,
            this.playerIndex = 0
    }

    // populates any randomArray randomly with the contents of an array
    // from https://gomakethings.com/how-to-shuffle-an-array-with-vanilla-js/
    // Fischer-Yates algorithm
    // to keep a copy of the original use var randomArray = randomizer(array.slice()); 
    function randomizer(array) {
        var currentIndex = array.length;
        var temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;

    };

    // this is the timer that stops each player's turn
    function turnTimer() {
        timer = setTimeout(function () {
            // remove buttons and switch player / team
            $("#skip").css("display", "none");
            $("#correct").css("display", "none");
            $("#word").css("display", "none");
            // increment the teamIndex unless you're at the end of the teams array, then go back to beginning
            if (teamIndex === teams.length - 1) {
                teamIndex = 0;
            } else {
                teamIndex++;
            }
            // increment the player index for the current team unless you're at the end of the array
            if (currentTeam.playerIndex === currentTeam.players.length - 1) {
                currentTeam.playerIndex = 0;
            } else {
                currentTeam.playerIndex++;
            }
            // change the current team using teamIndex variable
            currentTeam = teams[teamIndex];
            console.log(currentTeam);
            // update display to show the current player and instructions
            $("#instructions").css("display", "block");
            $("#go").css("display", "block");
            // display current player and instructions
            instructionCardFill(currentTeam.players[currentTeam.playerIndex], instructions[gameRound - 1]);
            clearInterval(countDown);
        }, turnTime * 1000);
    }


    // countdown timer
    function countDownTimer() {
        count = turnTime;
        $("#instructions").text(count);
        countDown = setInterval(function () {
            count--;
            $("#instructions").text(count);
        }, 1000);
    }

    // gets called if all the words are removed from the array - time for a new round
    function nextRound() {
        // clear timer 
        clearTimeout(timer);
        // remove buttons and switch player / team
        $("#skip").css("display", "none");
        $("#correct").css("display", "none");
        $("#word").css("display", "none");
        // update display to show the current player and instructions
        $("#instructions").css("display", "block");
        $("#go").css("display", "block");
        // increment the teamIndex unless you're at the end of the teams array, then go back to beginning
        if (teamIndex === teams.length - 1) {
            teamIndex = 0;
        } else {
            teamIndex++;
        }
        // increment the player index for the current team unless you're at the end of the array
        if (currentTeam.playerIndex === currentTeam.players.length - 1) {
            currentTeam.playerIndex = 0;
        } else {
            currentTeam.playerIndex++;
        }
        // change the current team using teamIndex variable
        currentTeam = teams[teamIndex];
        console.log(currentTeam);
        // display current player and instructions
        instructionCardFill(currentTeam.players[currentTeam.playerIndex], instructions[gameRound - 1]);
        clearInterval(countDown);
        console.log(count);
        // re-set the randomWord array with random words from the wordList
        randomWordList = randomizer(wordList.slice());
    }

    // game over function.  clears the timer and displays the winning team and the score
    function gameOver() {
        clearInterval(countDown);
        clearTimeout(timer);
        // figure out who won
        var highScore = 0;
        var winningTeam;
        console.log("teams are", teams);
        teams.forEach(function(team) {
            if (parseInt(team.score) > highScore) {
                highScore = parseInt(team.score);
                winningTeam = team.name;
                console.log("high score is", highScore);
                console.log("winning team is", winningTeam);
            }
        });
        // create the win screen
        $("#winner").text(winningTeam);
        $("#winning-team-score").text("You crushed it with " + highScore + " points!");
        // show the screen
        $(".win-screen").css("display", "block");
    }

    // this populates the instruction card with the player name and instructions based on the round
    function instructionCardFill(player, round) {
        $("#player-name-instructions").text(player);
        $("#instructions").html(round);
    }
    // ================================= even listeners go here =========================================
    // game start button reveals the modal
    $("#game-start").on("click", function () {
        // show the modal
        $("#game-start-modal").css("display", "block");
        // hide the button
        $(".button").css("display", "none");
        // make two inputs in the modal initially
        makeInput(2, "Team Name", "#team-number-div");
    });

    // drop down team names modal to create input fields
    $("body").on("change", "#team-number", function () {
        numTeams = $(this).val();
        console.log(numTeams);
        // create new inputs in the modal and give them unique id's
        $(this).siblings().remove();
        makeInput(numTeams, "Team Name", "#team-number-div");
    });

    // team name submit button saves team names to the array
    $("#set-teams").on("click", function () {
        // first check to see if all fields have values, if they do, run normal function. 
        //if they don't just notifiy the user that they need to fill in the input
        if ($("#num-words").val() === "" || $(".team-name-field").val().trim() === "") {
            alert("you need to fill out all the forms sucker!");
        } else {
            // saves the number of words per person!
            var numWords = $("#num-words").val();
            // save team names by creating a new Team instance using the constructor function and then add it to the teams array
            for (i = 1; i < $("#team-number").parent().siblings().length; i++) {
                var newTeam = new Team($("#team-name" + i).val());
                teams.push(newTeam);
                console.log("teams:", teams);
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
            // reset values of all inputs to have no value
            for (i = 1; i < $("#team-number").parent().siblings().length; i++) {
                $("#team-name" + i).val("");
            }

            // hide this modal and go to the next one.
            $("#game-start-modal").css("display", "none");
            $("#player-modal").css("display", "block");
            console.log(teams);
        }
    });

    // player submit button - adds player to a team object, to be used later, and adds the words to an array
    $("#add-player").on("click", function () {
        if ($("#player-name").val().trim() === "" || $(".word-field").val().trim() === "") {
            alert("you need to fill out all the forms sucker!");
        } else if ($("#team-select").val() === "Choose Team") {
            alert("pick a proper team " + $("#player-name").val().trim());
        } else {
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
            }
        }
        console.log(teams);
    });

    // player back button - re-populates the team name screen and resets variables
    $("#back-button").on("click", function () {
        // delete all Team instances and reset num words
        teams = [];
        numWords = 0;
        wordList = [];
        // empty created inputs on the following modal
        $("#team-select").empty();
        $("#team-select").append("<option id='choose-team'>Choose Team</option>"); // add back the select team option
        $("#player-name-div").nextAll().remove();
        // hide this modal and go to the next one.
        $("#game-start-modal").css("display", "block");
        $("#player-modal").css("display", "none");
    });


    $("#play-game").on("click", function () {
        // find any teams w/out players and prevent game start until each team has at least one player
        var hasPlayers = true;
        teams.forEach(function (team) {
            if (team.players.length === 0) {
                hasPlayers = false;
            }
        });
        if (hasPlayers) {
            // 1. 
            randomWordList = randomizer(wordList.slice());
            console.log("random word list is", randomWordList);
            // 3.
            $("#player-modal").css("display", "none");
            // 4. 
            $(".scores").css("display", "block");
            teams.forEach(function (team, index) {
                // put the team w/ score at the top of the page
                var p = $("<p>");
                p.attr("id", "team-" + team.name + "-score");
                p.text(team.name + " your team has " + team.score + " points!");
                $("#scores-heading").after(p);
            });
            // 5. 
            $(".player-card").css("display", "block");
            $("#skip, #word, #correct").css("display", "none");
            // now it is team-1 player index 0's turn and it's round 1
            currentPlayer = teams[0].players[0];
            instructionCardFill(currentPlayer, instructions[0]);
            currentTeam = teams[0];
        } else {
            alert("all teams need players sucka!");
        }
        console.log(currentPlayer);
    });

    $("#go").on("click", function () {
        // start the timers
        countDownTimer();
        turnTimer();
        // display the current word
        $("#word").css("display", "block");
        $("#word").text(randomWordList[wordIndex]);
        // display the correct and skip buttons and hide the let's party button
        $("#skip").css("display", "block");
        $("#correct").css("display", "block");
        $("#go").css("display", "none");
    });

    // onclick for clicking the button "correct" which incrememnts the score, and the word. 
    // also checks to see if the round is over afterward, which will trigger the next round
    // and, checks to see if the game is over, in which case, a score-board is shown.
    $("#correct").on("click", function () {
        $("#word").css("color", "black"); // change color to black if it's not black (might be red)
        // add one point to the current team's points tally and update page
        currentTeam.score++;
        $("#team-" + currentTeam.name + "-score").text(currentTeam.name + " your team has " + currentTeam.score + " points!");
        // remove the word from the random word list
        randomWordList.splice(wordIndex, 1);
        // check if there are any more words left after this word
        if (randomWordList.length === 0) {
            gameRound++;
            nextRound();
            if (gameRound > 3) {
                // hide the player card
                $(".player-card").css("display", "none");
                // game over screen
                gameOver();
            }
        } else if (randomWordList.length === wordIndex) { // start at the skipped words now
            wordIndex = 0;
            $("#word").text(randomWordList[wordIndex]); // update the word after starting at the beginning
        } else {
            $("#word").text(randomWordList[wordIndex]); // update the word
        }
        console.log("word list", randomWordList);
    });

    // onclick for skip
    $("#skip").on("click", function () {
        // move on to the next word, unless it's the last word
        if (randomWordList.length > wordIndex + 1) {
            wordIndex++;
            $("#word").text(randomWordList[wordIndex]); // update the word
        } else {
            $("#word").css("color", "red"); // give an indication this is the last word
        }
        console.log("word list", randomWordList);
        console.log("word is", randomWordList[wordIndex]);
        console.log("word index is", wordIndex);
    });


});