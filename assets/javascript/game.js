var currentGuessedWordDisplay = '';
var currentGuessedWord = '';
var removeSpace = '';

var hangman = {
    listWords: ['pacman', 'tetris', 'galaga', 'frogger', 'mario bros', 'donkey kong', 'centipede', 'space invaders', 'dig dug', 'zelda', 'contra', 'doom', 'paper boy', 'pong', 'pitfall', 'street fighter'],
    currentWord: '',
    currentGuess: '',
    oldWord: '',
    numberWin: 0,
    numberLoss: 0,
    startText: "Press any key to get started!",
    successText: "Congratulations!  You Guessed Correctly!",
    failText: "You failed to guess the word correctly.",
    numberGuessesRemaining: 10,
    listGuess: [],
    listLettersGuessed: [],

    // Choose Word randomly and do not repeat the last word
    chooseWord: function() {

        // Randomly choose word until it is not same as last word
        do {
        var index = Math.floor(Math.random() * this.listWords.length);
        this.currentWord = this.listWords[index];
        } while (this.currentWord === this.oldWord);

        // Push blank values onto guessed word list as a placeholder
        for (var i = 0; i < this.currentWord.length; i++) {
            if (this.currentWord[i] === ' ') {
                this.listGuess.push('$');
            } else {
                this.listGuess.push('_');
            }
        }
    },

    // Search Current Word for letter and return update Current Guess
    searchWord: function(userGuess) {

        // Check if game is finished and return null value so input doesn't increment anymore
        if (currentGuessedWord === hangman.currentWord) {
            return;
        } else if (currentGuessedWord !== hangman.currentWord && hangman.numberGuessesRemaining === 0) {
            return;
        }

        // If letter matches, enter letter into current guess
        for (var ii = 0; ii < this.currentWord.length; ii++) {
            if (userGuess === this.currentWord.charAt(ii)) {
                this.listGuess[ii] = userGuess;
            }
        }
        this.numberGuessesRemaining--;

        // If letter already exists, imcrement number of guesses remaining
        if (this.listLettersGuessed.indexOf(userGuess) === -1) {
            this.listLettersGuessed.push(userGuess);
        } else {
            this.numberGuessesRemaining++
        }

        // Insert spaces between letters for Display output
        this.currentGuess = this.listGuess.join(' ');
        return this.currentGuess;
    },

    // Reset counters and choose another word
    resetGame: function() {
        this.currentWord = '';
        this.currentGuess = '';
        this.numberGuessesRemaining = 10;
        this.listGuess = [];
        this.listLettersGuessed = [];
        this.chooseWord();
        currentGuessedWordDisplay = this.listGuess.join(' ');
        if (currentGuessedWordDisplay.indexOf('$') !== -1) {
            currentGuessedWordDisplay = currentGuessedWordDisplay.replace('$', '&nbsp;');
        }
    }

};

// Output results to html
var output = {
    // Display game statistical results
    displayResults: function() {
        $('#winsOutput').html(hangman.numberWin);
        $('#lossesOutput').html(hangman.numberLoss);
        $('#currentWordOutput').html(currentGuessedWordDisplay);
        $('#guessesRemainingOutput').html(hangman.numberGuessesRemaining);
        $('#lettersGuessedOutput').html(hangman.listLettersGuessed.join(',&nbsp;'));
    },

    // Display Hangman progressive picture
    displayActive: function(number) {
        $('.active' + number).attr('src', 'assets/images/Hangman-Game-grey.png');
    },

    // Display Hangman failed picture and text
    displayFail: function() {
        for (var iii = 9; iii > 0; iii--) {
            $('.active' + iii).attr('src', 'assets/images/Hangman-Game-red.png');
        }
        $('#lossText').css('display', 'inline-block');
        $('#currentWordOutput').css('color', 'red');
        $('#lossText').html(hangman.failText);
    },

    // Display Hangman default progress picture
    displayDefault: function() {
        $('#winPhoto').css('display', 'none');
        $('#winText').css('display', 'none');
        $('#lossText').css('display', 'none');
        $('#currentWordOutput').css('color', '');
        $('.jumbotron .row .col-sm-12 img').css('display', 'inline-block');
        $('.default').attr('src', 'assets/images/cloud.png');
    },

    // Display winning photo and text
    displayWin: function() {
        $('.jumbotron .row .col-sm-12 img').css('display', 'none');
        $('#winPhoto').css('display', 'inline-block');
        $('#winText').css('display', 'inline-block');
        $('#currentWordOutput').css('color', 'yellow');
        $('#winPhoto').html('<img src="assets/images/' + hangman.currentWord + '.png">');
        $('#winText').html(hangman.successText);
    }

};

// Initialize script and output to html
hangman.resetGame();
output.displayResults();

document.onkeyup = function(event) {
    // Make Word Lower Case
    var userGuess = String.fromCharCode(event.keyCode).toLowerCase();

    // Get Current Guessed Word
    currentGuessedWordDisplay = hangman.searchWord(userGuess);
    if (currentGuessedWordDisplay.indexOf('$') !== -1) {
        removeSpace = currentGuessedWordDisplay.replace(/\s/g,'');
        currentGuessedWordDisplay = currentGuessedWordDisplay.replace('$', '&nbsp;');
        currentGuessedWord = removeSpace.replace('$', ' ');
    } else {
        currentGuessedWord = currentGuessedWordDisplay.replace(/\s/g,'');
    }

    // Check if word guessed correctly within number of trys allowed, then increment win counter
    if (currentGuessedWord === hangman.currentWord) {
        hangman.numberWin++;
        hangman.oldWord = hangman.currentWord
        output.displayWin();
    } 

    // Check if word guess failed and guesses remaining is 0, then increment loss counter
    if (currentGuessedWord !== hangman.currentWord && hangman.numberGuessesRemaining === 0) {
        hangman.numberLoss++;
        hangman.oldWord = hangman.currentWord
        output.displayFail();
    }

    // Check number of guesses left and output hangman section
    if (hangman.numberGuessesRemaining === 9) {
        output.displayActive(1);
    } else if (hangman.numberGuessesRemaining === 8) {
        output.displayActive(2);
    } else if (hangman.numberGuessesRemaining === 7) {
        output.displayActive(3);
    } else if (hangman.numberGuessesRemaining === 6) {
        output.displayActive(4);
    } else if (hangman.numberGuessesRemaining === 5) {
        output.displayActive(5);
    } else if (hangman.numberGuessesRemaining === 4) {
        output.displayActive(6);
    } else if (hangman.numberGuessesRemaining === 3) {
        output.displayActive(7);
    } else if (hangman.numberGuessesRemaining === 2) {
        output.displayActive(8);
    } else if (hangman.numberGuessesRemaining === 1) {
        output.displayActive(9);
    }


    // Output results to html
    output.displayResults();

}

// Play Again
$(document).ready(function() {
    $('#play-again').on('click', function() {
        hangman.resetGame();
        output.displayDefault();
        output.displayResults();
    });
});

