var character = {
    characterList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    remainingList: ['mega-super', 'mega-zero', 'mega-rogue', 'mega-beast'],
    'mega-super': {
        health: 100,
        attack: 5,
        counter: 10,
    },
    'mega-zero': {
        health: 120,
        attack: 8,
        counter: 15,
    },
    'mega-rogue': {
        health: 150,
        attack: 11,
        counter: 20,
    },
    'mega-beast': {
        health: 180,
        attack: 14,
        counter: 25,
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
        var indexRemain = character.remainingList.indexOf(this.player);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }
        output.displayChosen();
        output.displayRemain();
    },
    chooseOpponent: function(char) {
        this.opponent = char;
        this.opponentChosen = true;
        var indexRemain = character.remainingList.indexOf(this.opponent);
        if (indexRemain !== -1) {
            character.remainingList.splice(indexRemain, 1);
        }
        output.displayDefault();
        output.displayRemain();
        output.displayOpponent();
    },
    attackOpponent: function() {
        if (this.playerChosen === false) {
            output.chooseCharacter();
        } else if (this.opponentChosen === false) {
            output.chooseOpponent();
        } else {
            output.displayDefault();
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
        $('#attack-text p').text(chooseOpponentText);
    },
    displayPlayerHealth: function() {
        $('.chosen .' + processing.player + ' .player .panel-footer p').text('Health ' + character[processing.player].health);
    },
    displayOpponentHealth: function() {
        $('.enemy .' + processing.opponent + ' .opponent .panel-footer p').text('Health ' + character[processing.opponent].health);
    },
    displayAttack: function() {
        var attackText = 'You attacked for ' + processing.dynamicPlayerAttack + '\n' + 'Your opponent attacked for ' + character[processing.opponent].counter;
        $('#attack-text p').text(attackText);
    },
    displayDefault: function() {
        $('#attack-text p').text('');
    },
    displayWin: function() {
        $('#attack-text p').text('Congratulations, You win!');
    },
    displayLoss: function() {
        $('#attack-text p').text('Sorry, you lose...Game Over');
    },
    hideChosen: function() {
        for (var hideCharacter in character.characterList) {
            $('.chosen .' + character.characterList[hideCharacter]).css('display', 'none');
        }
    },
    hideRemain: function() {
        for (var hideCharacter in character.characterList) {
            $('.outstanding .' + character.characterList[hideCharacter]).css('display', 'none');
        }
    },
    hideOpponent: function() {
        for (var hideCharacter in character.characterList) {
            $('.enemy .' + character.characterList[hideCharacter]).css('display', 'none');
        }
    },
    displayChosen: function() {
        this.hideChosen();
        $('.chosen .' + processing.player).css('display', 'inline-block');
    },
    displayRemain: function() {
        this.hideRemain();
        for (var remainingCharacter in character.remainingList) {
            $('.outstanding .' + character.remainingList[remainingCharacter]).css('display', 'inline-block');
        }
    },
    displayOpponent: function() {
        this.hideOpponent();
        $('.enemy .' + processing.opponent).css('display', 'inline-block');
    }
};

$(document).ready(function () {
    $('.charButton').on('click', function() {
        if (processing.playerChosen === false && processing.opponentChosen === false) {
            var characterChosen = this.value;
            processing.chooseCharacter(characterChosen);
            output.chooseOpponent();
        } else if (processing.playerChosen === true && processing.opponentChosen === false) {
            var opponentChosen = this.value;
            processing.chooseOpponent(opponentChosen);
        }
    });
    $('#attackButton').on('click', function() {
        processing.attackOpponent();
    });
});

// Initialize Game - Reset

// Play Again - Only show button upon loss or win
