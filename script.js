const playBtn = document.getElementById('play');
let gameLevel;
let design = 'url';

let checkedLevel = document.getElementsByName('level');
let designMode = document.getElementsByName('design');
function difficulties() {
  for (var i = 0; i < checkedLevel.length; i++) {
    if (checkedLevel[i].checked) {
      gameLevel = checkedLevel[i].value;
      console.log(gameLevel);
      break; // Exit the loop once a checked radio button is found
    }
  }
  return gameLevel;
}
function designChange() {
  for (var i = 0; i < designMode.length; i++) {
    if (designMode[i].checked) {
      design = designMode[i].value;
      console.log(design);
      break; // Exit the loop once a checked radio button is found
    }
  }

  return design;
}

document.getElementById('darkLabel').addEventListener('click', designDark);
document.getElementById('lightLabel').addEventListener('click', designLight);

function designDark() {
  let root = document.documentElement;
  root.style.setProperty('--card', `url('./img/dark_small.jpg')`);
  document.getElementsByClassName(
    'front'
  )[0].style.background = `url('./img/dark_bg.jpg')`;
}

function designLight() {
  let root = document.documentElement;
  root.style.setProperty('--card', `url('./img/light_bg.jpg')`);
  document.getElementsByClassName(
    'front'
  )[0].style.background = `url('./img/light_small.jpg')`;
}

playBtn.addEventListener('click', () => {
  console.log(difficulties(), designChange());
  localStorage.setItem('difficult lvl', difficulties());
  localStorage.setItem('light dark', designChange());
  // localStorage.getItem('lastname');
});
