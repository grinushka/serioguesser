import './styles/main.scss';
import { gameData } from './data.js';

// GLOBAL VARIABLES
let level = 1;
let rightChoice;
let wonTheLevel = false;
let score = 0;

const images = importAll(
  require.context('./assets/img/', false, /\.(png|jpe?g|svg)$/)
);
const audios = importAll(
  require.context('./assets/audio/', false, /\.(mp3)$/)
);

const subText = document.querySelector('.sub-text');
const infoContent = document.querySelector('.info__content');

const choicesList = document.querySelector('.choices__list');
const choicesLabels = document.querySelectorAll('.choices__list li label');
const choicesInputs = document.querySelectorAll('.choices__list li input');

const mainImg = document.querySelector('.main-preview-img');
const infoImg = document.querySelector('.info-preview-img');
const mainTitle = document.querySelector('.main__title');
const infoTitle = document.querySelector('.info__title');
const infoCountry = document.querySelector('.info__country');
const infoDescription = document.querySelector('.info__description');
const mainAudio = document.querySelector('.main__audio');
const mainAudioSource = document.querySelector('.main__audio source');
const nextBtn = document.querySelector('.next__btn');
const showAnswerBtn = document.querySelector('.info__answer-btn');

nextBtn.addEventListener('click', () => {
  startLevel();
});

showAnswerBtn.addEventListener('click', () => {
  toggleButtonAttribute();
  showInfo();
  wonTheLevel = true;
  displaySeriesInfo(rightChoice);
  level++;
  showAnswerBtn.style.display = 'none';
});


// Enable or disable next level btn, depending on the choice made and whether the answer has been shown
function toggleButtonAttribute() {
  nextBtn.disabled == true
    ? (nextBtn.disabled = false)
    : (nextBtn.disabled = true);
}

function startLevel() {
  if (level > 6) {
    // Implement showing the score modal window
    return;
  }

  rightChoice = getRandomInt(1, 7);
  wonTheLevel = false;
  cleanSeriesInfo();
  
  hideInfo();
  toggleButtonAttribute();
  enableChoices();
  higlightLevel();
  displayLevelAudio(rightChoice);

  renderChoices(level);
}

function higlightLevel() {
  if (level > 1) {
    document.querySelector(
      `.levels__pagination :nth-child(${level - 1})`
    ).style.filter = 'brightness(100%)';
  }
  document.querySelector(
    `.levels__pagination :nth-child(${level})`
  ).style.filter = 'brightness(100%)';
}

// GAME FUNCTIONALITY
function checkTheChoice(e) {
  e.stopPropagation();
  if (wonTheLevel) return;

  if (e.target.id.slice(-1) == rightChoice) {
    showInfo();
    displaySeriesInfo(rightChoice);
    disableChoices();
    wonTheLevel = true;
    toggleButtonAttribute();
    level++;
  } else {
    disableChoices();
    subText.textContent = 'Opps! You may have misheard the intro...'
    showAnswerBtn.style.display = 'block';
  }
}

function renderChoices(level) {
  const titles = [];

  for (let i = 0; i < 6; i++) {
    titles.push(gameData[level - 1][i].title);
  }

  let j = 0;
  choicesLabels.forEach((item) => {
    item.innerHTML = `<span></span>`;
    item.innerHTML += titles[j];
    j++;
  });

  choicesInputs.forEach((item) => {
    item.addEventListener('click', (e) => {
      checkTheChoice(e);
    });
  });
}

function displayTempImage(imgSrc) {
  mainImg.src = imgSrc;
}

// Displays info about the series when the right choice has been made;
function displaySeriesInfo(rightChoice) {
  const series = gameData[level - 1][rightChoice - 1];

  mainTitle.textContent = `${series.title}`;
  infoTitle.textContent = `${series.title}`;

  infoCountry.textContent = `${series.country}`;

  mainAudioSource.src = `${series.audio}`;

  mainImg.src = `${series.image}`;
  infoImg.src = `${series.image}`;
}

function displayLevelAudio(rightChoice) {
  mainAudioSource.src = gameData[level-1][rightChoice - 1].audio;
  mainAudio.load();
}

// Clean info about the series from the info card
function cleanSeriesInfo() {
  mainTitle.textContent = '******';
  infoTitle.textContent = '';
  infoCountry.textContent = '';
  mainAudioSource.src = '';
  mainImg.src = '';
  infoImg.src = '';
  displayTempImage('img/question-mark.png');
}

// Disable inputs (after the right choice)
function disableChoices() {
  choicesInputs.forEach((item) => {
    item.disabled = true;
  });
}

// Enable inputs
function enableChoices() {
  choicesInputs.forEach((item) => {
    item.disabled = false;
    item.checked = false;
  });
}

//  Hide info block on the right
function hideInfo() {
  infoContent.style.visibility = 'hidden';
  infoDescription.style.visibility = 'hidden';
  subText.style.removeProperty('display');
}

// Show info block on the right
function showInfo() {
  infoContent.style.removeProperty('visibility');
  infoDescription.style.removeProperty('visibility');
  subText.style.display = 'none';
}

// function toogleShowAnswerBtn() {
//   console.log(showAnswerBtn.style.display);
//   showAnswerBtn.style.display == 'block'
//     ? (showAnswerBtn.style.display = 'none')
//     : (showAnswerBtn.style.display = 'block');
//   console.log(showAnswerBtn.style.display);
// }


startLevel();


// ASSISTANCE FUNCTIONS
function importAll(r) {
  return r.keys().map(r);
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
