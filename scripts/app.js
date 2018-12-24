
(function() {
  'use strict';

  var possibleEmoji = ["🐭","🐮","🐯","🐰","🐲","🐍","🐴","🐐","🐵","🐔","🐶","🐷","🐖","🐽"];
  var INTERVAL = 1500;
  var currentTimeout;
  var els = {
    startContainer: document.querySelector('.start-container'),
    sequenceContainer: document.querySelector('.sequence-container'),
    sequenceBox: document.querySelector('.sequence'),
    guessContainer: document.querySelector('.guess-container'),
    guessInputs: document.querySelector('.guess-inputs'),
    currentGuess: document.querySelector('.current-guess'),
    incorrect: document.querySelector('.incorrect-dialog'),
    correct: document.querySelector('.correct-dialog'),
    correctSequence: document.querySelector('.correct-sequence'),
    tryAgain: document.querySelector('.try-again'),
    nextLevel: document.querySelector('.next-level'),
    levelComplete: document.querySelector('.level-complete'),
    currentLevel: document.querySelector('.current-level'),
    start: document.querySelector('.start'),
    refresh: document.querySelector('.button-refresh')
  }

  function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

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
  }

  function getCurrentLevel() {
    var level = localStorage.getItem('currentLevel') || setCurrentLevel(3);
    return parseInt(level);
  }

  function setCurrentLevel(i) {
    localStorage.setItem('currentLevel', i);
    return i;
  }

  function getEmojiSequence(len) {
    return shuffle(possibleEmoji.slice(0)).slice(0, len);
  }

  function updateDisplay(sequence, el) {
    el.textContent = sequence[0];
    if(sequence.length > 0) {
      sequence.shift();
      currentTimeout = setTimeout(updateDisplay.bind(null, sequence, el), INTERVAL);
    } else {
      els.sequenceContainer.classList.toggle('hide');
      els.guessContainer.classList.toggle('hide');
    }
  }


  function startGame() {
    els.currentLevel.textContent = getCurrentLevel();
    els.incorrect.classList.remove('dialog-container--visible');
    els.correct.classList.remove('dialog-container--visible');
    els.currentGuess.parentElement.classList.remove('correct');
    els.currentGuess.parentElement.classList.remove('wrong');
    els.startContainer.classList.add('hide');
    els.guessContainer.classList.add('hide');
    els.sequenceContainer.classList.remove('hide');
    els.currentGuess.textContent = '';
    clearTimeout(currentTimeout);

    var currentLevel = getCurrentLevel();
    var seq = getEmojiSequence(currentLevel);
    localStorage.setItem('sequence', JSON.stringify(seq));
    updateDisplay(seq, els.sequenceBox);
  }

  function handleEmojiClick(e) {
    var expected = JSON.parse(localStorage.getItem('sequence'));
    var currentGuess = els.currentGuess.textContent;
    var index = currentGuess.length / 2;
    els.currentGuess.textContent += e.currentTarget.textContent;
    if(e.currentTarget.textContent === expected[index]) {
      els.currentGuess.parentElement.classList.add('correct');
      if((els.currentGuess.textContent.length / 2) === expected.length) {
        var currentLevel = getCurrentLevel();
        els.levelComplete.textContent = currentLevel;
        els.currentLevel.textContent = currentLevel + 1;
        setCurrentLevel(currentLevel + 1);
        els.correct.classList.toggle('dialog-container--visible');
      }
    } else {
      els.currentGuess.parentElement.classList.remove('correct');
      els.currentGuess.parentElement.classList.add('wrong');
      els.incorrect.classList.toggle('dialog-container--visible');
      els.correctSequence.textContent = expected.join('');
    }
  }


  function init() {
    els.currentLevel.textContent = getCurrentLevel();

    possibleEmoji.forEach(function(e) {
      var li = document.createElement('li');
      var btn = document.createElement('button');
      li.classList.add('emoji-input');
      btn.classList.add('emoji-btn');
      btn.textContent = e;
      li.appendChild(btn);
      els.guessInputs.appendChild(li);
      btn.addEventListener('click', handleEmojiClick);
    });

    els.tryAgain.addEventListener('click', startGame);
    els.nextLevel.addEventListener('click', startGame);
    els.refresh.addEventListener('click', startGame);
    els.start.addEventListener('click', startGame);

    if (performance.mark !== undefined) {
      // Create the performance mark
      performance.mark('inited');
    }



  }
  init();
  // Add feature check for Service Workers here

  if('serviceWorker' in navigator) {
    navigator.serviceWorker
             .register('service-worker.js')
             .then(function() { console.log('Service Worker Registered'); });
  }

})();
