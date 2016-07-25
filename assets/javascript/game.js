// Character attributes
var character = {
    characterList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    remainingList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    'mega-super': {
        health: 130,
        attack: 14,
        counter: 25,
        alive: true
    },
    'mega-zero': {
        health: 140,
        attack: 14,
        counter: 16,
        alive: true
    },
    'mega-rogue': {
        health: 150,
        attack: 14,
        counter: 16, 
        alive: true
    },
    'mega-beast': {
        health: 160,
        attack: 14,
        counter: 20,
        alive: true
    }
};

// Game actions to be processed
var processing = {
    player: '',
    playerChosen: false,
    opponent: '',
    opponentChosen: false,
    dynamicPlayerAttack: 0,
    win: false,
    loss: false,

    // Set character to use during game
    chooseCharacter: function(char) {
        this.player = char;
        this.playerChosen = true;
        character[this.player].chosen = true;
        var indexRemain = character.remainingList.indexOf(this.player);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }

        // Output characters onto screen
        output.displayChosen();
        output.displayRemain();
    },

    // Set opponent to fight in round
    chooseOpponent: function(char) {
        this.opponent = char;
        if (this.player === this.opponent) {
            this.opponent = '';
            return;
        }
        this.opponentChosen = true;
        character[this.opponent].chosen = true;

        // remmove character from remaining character list
        var indexRemain = character.remainingList.indexOf(this.opponent);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }

        // Output characters onto screen
        output.clearOutput();
        output.displayRemain();
        output.displayOpponent();
    },

    // Attack processing
    attackOpponent: function() {

        // Check if character chosen and take action
        if (this.playerChosen === false) {
            output.chooseCharacter();

        // Check if opponent chosen and take action
        } else if (this.opponentChosen === false) {
            output.chooseOpponent();

        // Check if character alive and return if not
        } else if (character[this.player].alive === false) {
            return;

        // Check if player attack bigger than opponent health and player health less than opponent attack and process only attack
        } else if (this.dynamicPlayerAttack > character[this.opponent].health && character[this.player].health < character[this.opponent].counter) {
            this.dynamicPlayerAttack += character[this.player].attack;
            character[this.opponent].health -= processing.dynamicPlayerAttack;

            // Output character health statistics and attack onto screen
            output.displayAttack();
            output.displayPlayerHealth();
            output.displayOpponentHealth();

        // Process attack and counter attack
        } else {
            this.dynamicPlayerAttack += character[this.player].attack;
            character[this.player].health -= character[this.opponent].counter;
            character[this.opponent].health -= processing.dynamicPlayerAttack;

            // Output character health statistics and attack onto screen
            output.displayAttack();
            output.displayPlayerHealth();
            output.displayOpponentHealth();
        }
    },

    // Reset opponent chosen field - to be used after opponent is defeated to go to next round
    resetOpponentChosen: function() {
        this.opponent = '';
        this.opponentChosen = false;
    }
};

// Output items to HTML
var output = {
    // Prompt for user to choose character
    chooseCharacter: function() {
        var chooseCharacterText = 'Please Choose a Character';
        $('#attack-text p').text(chooseCharacterText);
    },

    // Prompt for user to choose opponent
    chooseOpponent: function() {
        var chooseOpponentText = 'Please Choose an Opponent';
        $('#attack-text p').css('color', 'red');
        $('#attack-text p').text(chooseOpponentText);
    },

    // Display player health statistics
    displayPlayerHealth: function() {
        $('.chosen .' + processing.player + ' .player .panel-footer p').text('Health ' + character[processing.player].health);
    },

    // Display opponent health statistics
    displayOpponentHealth: function() {
        $('.enemy .' + processing.opponent + ' .opponent .panel-footer p').text('Health ' + character[processing.opponent].health);
    },

    // Display attack text
    displayAttack: function() {
        var attackText = 'You attacked for ' + processing.dynamicPlayerAttack + '\nYour opponent attacked for ' + character[processing.opponent].counter;
        $('#attack-text p').text(attackText);
    },

    // Clear attack output
    clearOutput: function() {
        $('#attack-text p').text('');
    },

    // Display game winning round text
    displayWinRound: function() {
        $('#attack-text p').text('You attacked for ' + processing.dynamicPlayerAttack + '\nYour opponent attacked for ' + character[processing.opponent].counter + '\nWell Done...You Defeated This Opponent!\nChoose another opponent.');
        $('#attack-text p').css('color', 'blue');
    },

    // Display game winning text
    displayWinGame: function() {
        $('#attack-text p').text('Congratulations!  You Defeated All Your Opponents and Win The Game!\nPress Below to Play Again.');
        $('#attack-text p').css('color', 'green');
    },

    // Display Game loss text
    displayLoss: function() {
        $('.chosen .' + processing.player + ' .player').css('background-color', 'red');
        $('#attack-text p').text('Sorry, you lose...Game Over\nPress Below to Play Again.');
    },

    // Display chosen character
    displayChosen: function() {
        for (var hideCharacter in character.characterList) {
            $('.chosen .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        $('.chosen .' + processing.player).css('display', 'inline-block');
    },

    // Display remaining characters left
    displayRemain: function() {
        for (var hideCharacter in character.characterList) {
            $('.outstanding .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        for (var remainingCharacter in character.remainingList) {
            $('.outstanding .' + character.remainingList[remainingCharacter]).css('display', 'inline-block');
        }
    },

    // Display opponent character
    displayOpponent: function() {
        for (var hideCharacter in character.characterList) {
            $('.enemy .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        $('.enemy .' + processing.opponent).css('display', 'inline-block');
    },

    // Hide opponent character - to be used after win
    clearOpponent: function() {
        $('.enemy .' + processing.opponent).css('display', 'none');
    },

    // Hide attack button - to be used after win or lose
    hideAttackButton: function() {
        $('#attackButton').css('display', 'none');
    }
};

// Ask user to choose character
output.chooseCharacter();
var characterCurrent = '';
var opponentCurrent = '';
$(document).ready(function () {

    // Process character button input
    $('.charButton').on('click', function() {

        // Process when character not chosen
        if (processing.playerChosen === false && processing.opponentChosen === false) {
            characterCurrent = this.value;
            processing.chooseCharacter(characterCurrent);
            output.chooseOpponent();
        }

        // Process when opponent not chosen
        if (processing.playerChosen === true && processing.opponentChosen === false) {
            opponentCurrent = this.value;
            processing.chooseOpponent(opponentCurrent);
        }
    });

    // Process attack button input
    $('#attackButton').on('click', function() {
        processing.attackOpponent();

        // Process win round
        if (character[opponentCurrent].health <= 0) {
            output.displayWinRound();
            output.displayPlayerHealth();
            output.displayOpponentHealth();
            output.clearOpponent();
            character[opponentCurrent].alive = false;
            processing.resetOpponentChosen();

            // Process win game
            if (character.remainingList.length < 1) {
                output.displayWinGame();
                output.hideAttackButton();
            }

        // Process loss
        } else if (character[characterCurrent].health <= 0) {
            output.displayLoss();
            output.hideAttackButton();
            character[characterCurrent].alive = false;
        }
    });
});
