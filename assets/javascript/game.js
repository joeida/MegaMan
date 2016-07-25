var character = {
    characterList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    remainingList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    'mega-super': {
        health: 130,
        attack: 7,
        counter: 34,
        alive: true
    },
    'mega-zero': {
        health: 140,
        attack: 8,
        counter: 31,
        alive: true
    },
    'mega-rogue': {
        health: 150,
        attack: 18,
        counter: 15, 
        alive: true
    },
    'mega-beast': {
        health: 180,
        attack: 15,
        counter: 15,
        alive: true
    }
};

var processing = {
    player: '',
    playerChosen: false,
    opponent: '',
    opponentChosen: false,
    dynamicPlayerAttack: 0,
    win: false,
    loss: false,
    chooseCharacter: function(char) {
        this.player = char;
        this.playerChosen = true;
        character[this.player].chosen = true;
        var indexRemain = character.remainingList.indexOf(this.player);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }
        output.displayChosen();
        output.displayRemain();
    },
    chooseOpponent: function(char) {
        this.opponent = char;
        if (this.player === this.opponent) {
            this.opponent = '';
            return;
        }
        this.opponentChosen = true;
        character[this.opponent].chosen = true;
        var indexRemain = character.remainingList.indexOf(this.opponent);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }
        output.clearOutput();
        output.displayRemain();
        output.displayOpponent();
    },
    attackOpponent: function() {
        if (this.playerChosen === false) {
            output.chooseCharacter();
        } else if (this.opponentChosen === false) {
            output.chooseOpponent();
        } else if (character[this.player].alive === false) {
            return;
        } else if (this.dynamicPlayerAttack > character[this.opponent].health && character[this.player].health < character[this.opponent].counter) {
            this.dynamicPlayerAttack += character[this.player].attack;
            character[this.opponent].health -= processing.dynamicPlayerAttack;
            output.displayAttack();
            output.displayPlayerHealth();
            output.displayOpponentHealth();
        } else {
            this.dynamicPlayerAttack += character[this.player].attack;
            character[this.player].health -= character[this.opponent].counter;
            character[this.opponent].health -= processing.dynamicPlayerAttack;
            output.displayAttack();
            output.displayPlayerHealth();
            output.displayOpponentHealth();
        }
    },
    resetOpponentChosen: function() {
        this.opponent = '';
        this.opponentChosen = false;
    }
};


var output = {
    chooseCharacter: function() {
        var chooseCharacterText = 'Please Choose a Character';
        $('#attack-text p').text(chooseCharacterText);
    },
    chooseOpponent: function() {
        var chooseOpponentText = 'Please Choose an Opponent';
        $('#attack-text p').css('color', 'red');
        $('#attack-text p').text(chooseOpponentText);
    },
    displayPlayerHealth: function() {
        $('.chosen .' + processing.player + ' .player .panel-footer p').text('Health ' + character[processing.player].health);
    },
    displayOpponentHealth: function() {
        $('.enemy .' + processing.opponent + ' .opponent .panel-footer p').text('Health ' + character[processing.opponent].health);
    },
    displayAttack: function() {
        var attackText = 'You attacked for ' + processing.dynamicPlayerAttack + '\nYour opponent attacked for ' + character[processing.opponent].counter;
        $('#attack-text p').text(attackText);
    },
    clearOutput: function() {
        $('#attack-text p').text('');
    },
    displayWinRound: function() {
        $('#attack-text p').text('You attacked for ' + processing.dynamicPlayerAttack + '\nYour opponent attacked for ' + character[processing.opponent].counter + '\nWell Done...You Defeated This Opponent!\nChoose another opponent.');
        $('#attack-text p').css('color', 'blue');
    },
    displayWinGame: function() {
        $('#attack-text p').text('Congratulations!  You Defeated All Your Opponents and Win The Game!\nPress Below to Play Again.');
        $('#attack-text p').css('color', 'green');
    },
    displayLoss: function() {
        $('.chosen .' + processing.player + ' .player').css('background-color', 'red');
        $('#attack-text p').text('Sorry, you lose...Game Over\nPress Below to Play Again.');
    },
    displayChosen: function() {
        for (var hideCharacter in character.characterList) {
            $('.chosen .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        $('.chosen .' + processing.player).css('display', 'inline-block');
    },
    displayRemain: function() {
        for (var hideCharacter in character.characterList) {
            $('.outstanding .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        for (var remainingCharacter in character.remainingList) {
            $('.outstanding .' + character.remainingList[remainingCharacter]).css('display', 'inline-block');
        }
    },
    displayOpponent: function() {
        for (var hideCharacter in character.characterList) {
            $('.enemy .' + character.characterList[hideCharacter]).css('display', 'none');
        }
        $('.enemy .' + processing.opponent).css('display', 'inline-block');
    },
    clearOpponent: function() {
        $('.enemy .' + processing.opponent).css('display', 'none');
    },
    hideAttackButton: function() {
        $('#attackButton').css('display', 'none');
    }
};

output.chooseCharacter();
var characterCurrent = '';
var opponentCurrent = '';
$(document).ready(function () {
    $('.charButton').on('click', function() {
        if (processing.playerChosen === false && processing.opponentChosen === false) {
            characterCurrent = this.value;
            processing.chooseCharacter(characterCurrent);
            output.chooseOpponent();
        }
        if (processing.playerChosen === true && processing.opponentChosen === false) {
            opponentCurrent = this.value;
            processing.chooseOpponent(opponentCurrent);
        }
    });
    $('#attackButton').on('click', function() {
        processing.attackOpponent();
        if (character[opponentCurrent].health <= 0) {
            output.displayWinRound();
            output.displayPlayerHealth();
            output.displayOpponentHealth();
            output.clearOpponent();
            character[opponentCurrent].alive = false;
            processing.resetOpponentChosen();
            if (character.remainingList.length < 1) {
                output.displayWinGame();
                output.hideAttackButton();
            }
        } else if (character[characterCurrent].health <= 0) {
            output.displayLoss();
            output.hideAttackButton();
            character[characterCurrent].alive = false;
        }
    });
});

// Initialize Game - Reset

// Play Again - Only show button upon loss or win
