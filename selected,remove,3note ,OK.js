'use strict';

const r1 = document.getElementsByClassName('r1');
const r2 = document.getElementsByClassName('r2');
const r3 = document.getElementsByClassName('r3');
const r4 = document.getElementsByClassName('r4');
const r5 = document.getElementsByClassName('r5');
const r6 = document.getElementsByClassName('r6');
const r7 = document.getElementsByClassName('r7');
const r8 = document.getElementsByClassName('r8');
const r9 = document.getElementsByClassName('r9');
let btn = document.querySelectorAll('button');
let numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // to shuffle 1 to 9 
const winArray = [
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 0],
]; // for game win 

let lastClickedDiv;
let noSpanTag; // boolean value // true: the clicked ele is blank, false: the clicked ele isn't blank

const sudokuBoard = dataCreation(); // final creation of sudoku board

const sudokuBoardHtml = [r1, r2, r3, r4, r5, r6, r7, r8, r9]; // HTML board array
const sudokuBoardHtmlBlanks = [[], [], [], [], [], [], [], [], []]; // to store the initial state (to know where the blanks are)
const blanksClone = [[], [], [], [], [], [], [], [], []]; // use to check win and lose
let grid = document.getElementById('grid'); 
let light_dark = localStorage.getItem('light dark');
let running = true; // to check play and pause
let second = 0;
let minute = 0;
let hour = 0;
let hourText = '00';
let minuteText = '00';
let secondText = '00';
let timing; // timing interval
let lose_count = 0;
const heart = document.getElementById('heart');
let heartWidth = 150; // to show lives
let noteOn = false;
let removeOn = false;
let removeCount;
const card_sound = new Audio(`./sound effect/sound_effect.wav`);
const switch_sound = new Audio(`./sound effect/switch_2.mp3`);
let selectedCell = null;
let game_lvl = 1;

function changeDesign(design) {
  if (design == 'dark') {
    grid.style.background = `url('./img/dark_bg.jpg')`;
    grid.style.backgroundSize = `cover`;
    document.getElementsByTagName('body')[0].style.background = '#363231';
    let root = document.documentElement;
    root.style.setProperty('--card', `url('./img/dark_small.jpg')`);
    // for (let row = 0; row < sudokuBoard.length; row++) {
    //   for (let col = 0; col < sudokuBoard.length; col++) {
    //     // sudokuBoardHtml[row][col].querySelector('p').classList.add('dark_card');
    //     sudokuBoardHtml[row][col].querySelector('p').style.background = `var(--dark-card)`;
    //     // sudokuBoardHtml[row][col].querySelector('p').style.backgroundSize = `cover`;
    //   }
    // }
  }
}
function createSudokuBoard(sudokuBoardArray) {
  for (let row = 0; row < sudokuBoardArray.length; row++) {
    for (let col = 0; col < sudokuBoardArray.length; col++) {
      sudokuBoardHtml[row][
        col
      ].innerHTML = `<p><span>${sudokuBoardArray[row][col]}</span></p>`;
      // input ထဲက data တွေ မှန်မှန် တိုက်စစ်ဖို့ ၂ ခု ထဲက ၁ ခုကို သုံးနိုင်
      sudokuBoardHtmlBlanks[row][col] = sudokuBoardArray[row][col];
      blanksClone[row][col] = sudokuBoardArray[row][col];
    }
  }
}

createSudokuBoard(sudokuBoard);
changeDesign(light_dark);

/**
 *
 * @returns 2d array, that has 81 numbers that follows the sudoku rules
 */
function dataCreation() {
  let max = 10;
  let min = 1;
  let lineCount = 9;
  const sudokuArray = [];
  numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  createSdkArray();
  solving(sudokuArray);
  return sudokuArray;
  /**
   * initialize sudoku template array
   * All rows  initialized with zero
   * @returns sudoku array form
   */
  function createSdkArray() {
    for (let row = 0; row < lineCount; row++) {
      let newRow = [];
      for (let column = 0; column < lineCount; column++) {
        newRow.push(0);
      }
      sudokuArray.push(newRow);
    }
    return sudokuArray;
  }

  /**
   * All Rows Fill With Sudoku Valid Number
   */
  function solving(table) {
    let shuffleArr = shuffleNumberArray(numberArray);
    const zeroRoom = findZeroRoom(table);
    if (!zeroRoom) {
      return true;
    }
    const [row, col] = zeroRoom;

    for (let num = 0; num < shuffleArr.length; num++) {
      if (isValid(table, row, col, shuffleArr[num])) {
        table[row][col] = shuffleArr[num];
        if (solving(table)) {
          return true;
        }
      }
      table[row][col] = 0;
    }
    return false;
  }

  //to find the Zero Number Position Array[x][y]
  function findZeroRoom(table) {
    for (let row = 0; row < lineCount; row++) {
      for (let col = 0; col < lineCount; col++) {
        if (table[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }
  //Check valid position and number
  function isValid(table, row, col, num) {
    return (
      !existInRow(table, row, num) && //valid Number can fill , Number not exist in row
      !existInColumn(table, col, num) && //valid Number can fill , Number not exist in column
      !existSubTable(table, row, col, num) //valid Number can fill , Number not exist in 3row * 3column sub Table
    );
  }

  //Number exist in  subTable with 3row * 3column
  function existSubTable(table, currentRow, currentColumn, num) {
    // example table[4,7], currentRow = 4 ,currentColumn = 7
    let startRow = currentRow - (currentRow % 3);
    /** example table[4,7],
     *  currentRow = 4
     *  startRow = 4-(4%3)
     * ,startRow = 4-1
     * startRow = 3
     *  */
    let startColumn = currentColumn - (currentColumn % 3);
    /** example table[4,7],
     *  currentColumn = 7
     *  startColumn = 7-(7%3)
     * ,startColumn = 7-1
     * startColumn = 6
     *  */

    for (let row = 0; row < 3; row++) {
      //loop for Three Row from the startRow
      for (let col = 0; col < 3; col++) {
        // loop for Three Row from the startRow
        if (
          table[row + startRow][col + startColumn] === // Example  startRow = 3 , loop for row3, row4, row5 // Example  startColumn = 6 , loop for column6, column 7, column8
          num
        ) {
          return true;
        }
      }
    }
    return false;
  }

  //Number exist in row or not
  function existInRow(table, row, num) {
    return table[row].includes(num);
  }

  //Number exist in column or not
  function existInColumn(table, col, num) {
    for (let row = 0; row < lineCount; row++) {
      if (table[row][col] === num) {
        return true;
      }
    }
    return false;
  }
}

game_lvl = localStorage.getItem('difficult lvl');
/**
 * 
 * @param {*} sudokuBoardArray 
 * @param {*} level 
 * to create blanks in random position according to the level
 */
function createBlanks(sudokuBoardArray, level) {
  let totMax; // for easy
  let avg; // for easy
  let max; // for easy: maximum: 6 (inclusive)
  switch (level) {
    case 1:
      totMax = 38; // for easy
      avg = 4; // for easy
      max = avg + 2; // for easy: maximum: 6 (inclusive)
      break;
    case 2:
      totMax = 28;
      avg = 3;
      max = avg + 2;
      break;
    case 3:
      totMax = 23;
      avg = 2;
      max = avg + 2;
  }

  let rowMax = 9;

  let numShowIn1Row = [];
  let total = 0;
  function generateRandomNumbers() {
    numShowIn1Row = [];
    total = 0;
    // loop for 8 times first
    for (let i = 0; i < 8; i++) {
      let random = Math.floor(Math.random() * max) + 1; // for easy: Generates numbers from 0 to 6
      total += random;
      numShowIn1Row.push(random);
    }
    let possible9thNum = totMax - total;
    if (possible9thNum < rowMax - 2 && possible9thNum > 0) {
      // အောက်ဆုံး row မှာ အနည်းဆုံး ၁ လုံး၊ အများဆုံး ၆ လုံး ဖြစ်နိုင်မယ်
      numShowIn1Row.push(possible9thNum);
    } else {
      generateRandomNumbers();
    }
  }
  generateRandomNumbers();

  // actually creating blanks on html
  for (let row = 0; row < sudokuBoardArray.length; row++) {
    let rdm_index_arr = shuffleNumberArray(numberArray);
    let numOfBlanks = rowMax - numShowIn1Row[row];
    for (let i = 0; i < numOfBlanks; i++) {
      sudokuBoardHtml[row][rdm_index_arr[i] - 1].innerHTML = ``;
      sudokuBoardHtmlBlanks[row][rdm_index_arr[i] - 1] = 0;
      blanksClone[row][rdm_index_arr[i] - 1] = 0;
    }
  }

  /**
   * col မှာလည်း အလွတ် မရှိအောင် လုပ်တဲ့ အပိုင်း
   * Uncaught RangeError: Maximum call stack size exceeded တက်စေတယ်

  let col_blanks_counter = 0;
  for (let col = 0; col < sudokuBoardArray.length; col++) {
    for (let row = 0; row < sudokuBoardArray.length; row++) {
      if (sudokuBoardHtmlBlanks[row][col] == 0) {
        col_blanks_counter++;
      }
    }
    if (col_blanks_counter == 9) {
      createBlanks(sudokuBoard, level);
    }
    col_blanks_counter = 0;
  }
     */
}
createBlanks(sudokuBoard, Number(game_lvl)); // 1 for easy

//Shuffle Number From 1 to 9
function shuffleNumberArray(array) {
  let shuffleNumber = array.sort((a, b) => 0.5 - Math.random());
  return shuffleNumber;
}

// clicking starts from here
for (let i = 0; i < 9; i++) {
  for (let j = 0; j < 9; j++) {
    sudokuBoardHtml[i][j].addEventListener('click', e => {
      noSpanTag = sudokuBoardHtmlBlanks[i][j] == 0; // init state မှာ blank ဖြစ်နေတာ မှန်တယ်
      console.log(noSpanTag);
      console.log(sudokuBoard[i][j]);

      if (selectedCell) {
        selectedCell.style.backgroundColor = '';
        selectedCell.style.opacity = '1';
        // if (selectedCell.querySelector('span') !== null) {
        //   selectedCell.querySelector('span').style.backgroundColor = '';
        // }
      }

      selectedCell = e.target;
      e.target.style.backgroundColor = 'skyblue';
      e.target.style.opacity = '0.5';

      lastClickedDiv = sudokuBoardHtml[i][j];
      if (noSpanTag && removeOn == true && noteOn == false) {
        //tth
        lastClickedDiv.innerHTML = '';
        blanksClone[i][j] = 0;
        console.log('Remove', removeOn, removeCount);
      }
    });
  }
}

function handleKeyUp(event) {
  if (lastClickedDiv && /[1-9]/.test(event.key) && noSpanTag && !removeOn) {
    card_sound.play();
    console.log('p', lastClickedDiv.querySelector('p'));

    if (noteOn && lastClickedDiv.querySelector('p') == null) {
      addNote(lastClickedDiv, event.key);
    }
    if (!noteOn) {
      console.log(lastClickedDiv);
      addSudokuCard(lastClickedDiv, event.key);
      checkInput(lastClickedDiv, event.key);
      // if (lastClickedDiv.parentNode.tagName !== 'SPAN') {
      //   lastClickedDiv.querySelector('span').style.backgroundColor = 'skyblue';
      // } else if (lastClickedDiv.parentNode.tagName == 'SPAN') {
      //   lastClickedDiv.querySelector('span').style.backgroundColor = 'skyblue';
      //   lastClickedDiv.querySelector('span').style.opacity = '0.5';
      // }
    }
  }
}

// Add the keyup event listener to the window
window.addEventListener('keyup', handleKeyUp);

/**
 * 
 * @param {*} event1 
 * earser click
 */
function handleButtonClick0(event1) {
  switch_sound.play();
  // if (removeOn) {
  removeCount = 0;
  removeOn = !removeOn;
  noteOn = false;
  if (removeOn) {
    $('.eraser').css({ color: 'white', 'box-shadow': '2px -2px 10px white' });
    $('.note').css({ color: 'black', 'box-shadow': '-3px 3px 10px black' });
  } else {
    $('.eraser').css({ color: 'black', 'box-shadow': '-3px 3px 10px black' });
  }
  console.log('Remove', removeOn, 'Note', noteOn);
  // }
}

/**
 * 
 * @param {*} event1 
 * note click
 */
function handleButtonClick1(event1) {
  switch_sound.play();
  noteOn = !noteOn;
  removeOn = false;
  if (noteOn) {
    $('.note').css({ color: 'white', 'box-shadow': '2px -2px 10px white' });
    $('.eraser').css({ color: 'black', 'box-shadow': '-3px 3px 10px black' });
  } else {
    $('.note').css({ color: 'black', 'box-shadow': '-3px 3px 10px black' });
  }
  console.log('Remove', removeOn, 'Note', noteOn);
}

/**
 * 
 * @param {*} event1 
 * num pad click
 */
function handleButtonClick2To10(event1) {
  card_sound.play();
  if (noSpanTag && !removeOn) {
    console.log('p', lastClickedDiv.querySelector('p'));

    if (noteOn && lastClickedDiv.querySelector('p') == null) {
      addNote(lastClickedDiv, $(event1.target).text());
    }
    if (!noteOn) {
      addSudokuCard(lastClickedDiv, $(event1.target).text());
      checkInput(lastClickedDiv, $(event1.target).text());
      // lastClickedDiv.querySelector('span').style.backgroundColor = 'skyblue';
    }
  }
}

// Add event listeners
for (let k = 0; k < btn.length; k++) {
  if (k === 0) {
    btn[k].addEventListener('click', handleButtonClick0);
  } else if (k === 1) {
    btn[k].addEventListener('click', handleButtonClick1);
  } else if (k >= 2 && k <= 10) {
    btn[k].addEventListener('click', handleButtonClick2To10);
  }
}

// Function to remove event listeners when game_finished is true
function custom_removeEventListeners() {
  for (let k = 0; k < btn.length; k++) {
    if (k === 0) {
      btn[k].removeEventListener('click', handleButtonClick0);
    } else if (k === 1) {
      btn[k].removeEventListener('click', handleButtonClick1);
    } else if (k >= 2 && k <= 10) {
      btn[k].removeEventListener('click', handleButtonClick2To10);
    }
  }

  window.removeEventListener('keyup', handleKeyUp);
}

function addNote(ele, input) {
  let numofChilds = ele.childNodes.length;
  console.log('number' + numofChilds);
  if (numofChilds < 8) {
    if (light_dark == 'dark') {
      ele.innerHTML += `<span><div style="font-size:0.5rem; padding:0.1rem 0.2rem;  color:white">${input}</div></span>`;
    } else {
      ele.innerHTML += `<span><div style="font-size:0.5rem; padding:0.1rem 0.2rem;">${input}</div></span>`;
    }
  }
}

function addSudokuCard(ele, input) {
  ele.innerHTML = `<p><span>${input}</span></p>`;
}

function checkInput(ele, input) {
  // ele.getAttribute('class') -> for example: 'r1 c1'.split(' ') -> [r1, c1] -> r1.split('') -> [r, 1] -> 1

  let row = Number(ele.getAttribute('class').split(' ')[0].split('')[1]);
  let col = Number(ele.getAttribute('class').split(' ')[1].split('')[1]);
  console.log(row, col);
  row -= 1;
  col -= 1;
  blanksClone[row][col] = Number(input);
  console.log(blanksClone);

  if (sudokuBoard[row][col] == input) {
    console.log('The input is correct');
    ele.querySelector('span').style.color = 'rgb(20, 105, 128)';
  } else {
    console.log('The input value is incorrect');
    // heart.style.length
    ele.querySelector('span').style.color = 'red';
    heartWidth = heartWidth - 30;
    heart.style.width = heartWidth + 'px';
    lose_count++;
    if (lose_count >= 5) {
      document.getElementById('myModal').style.display = 'flex';
      timingStop();
      // alert('You Lose.');
      custom_removeEventListeners();
    }
  }

  check_win();
}

function check_win() {
  let all_entered_bool = false;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (blanksClone[i][j] !== 0) {
        all_entered_bool = true;
      } else {
        all_entered_bool = false;
        break;
      }
    }
    if (!all_entered_bool) {
      break;
    }
  }

  let all_correct = false;

  if (all_entered_bool) {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (sudokuBoard[i][j] == blanksClone[i][j]) {
          all_correct = true;
        } else {
          all_correct = false;
          break;
        }
      }
      if (!all_correct) {
        break;
      }
    }
  }

  if (all_correct) {
    game_win_show(winArray);
    timingStop();
    custom_removeEventListeners();
  }
}

function start() {
  second++;
  if (second == 60) {
    second = 0;
    minute++;
  }

  minuteText = minute < 10 ? '0' + minute : minute;
  secondText = second < 10 ? '0' + second : second;

  $('#timer').html(`${minuteText}  :  ${secondText}`);
}

window.addEventListener('load', () => {
  if (!timing) {
    timing = setInterval(start, 1000);
  }
});

function game_win_show(array) {
  for (let row = 0; row < array.length; row++) {
    for (let col = 0; col < array.length; col++) {
      if (array[row][col] == 0) {
        sudokuBoardHtml[row][col].innerHTML = '';
      } else {
        if (row < 3) {
          sudokuBoardHtml[row][col].innerHTML = `<p style="background:brown">
              <span></span>
            </p>`;
        } else if (row > 2 && row < 6) {
          sudokuBoardHtml[row][col].innerHTML = `<p style="background:#0D716E">
              <span></span>
            </p>`;
        } else {
          sudokuBoardHtml[row][col].innerHTML = `<p style="background:orange">
              <span></span>
            </p>`;
        }
      }
    }
  }
}

function timingStop() {
  clearInterval(timing);
}

$('.pause_icon').click(function () {
  $('.cover').toggleClass('coverOn');
  $('.fa-pause').toggle();
  $('.fa-play').toggleClass('active');
  if (running) {
    timingStop();
    custom_removeEventListeners();
    running = false;
  } else {
    timing = setInterval(start, 1000);
    for (let k = 0; k < btn.length; k++) {
      if (k === 0) {
        btn[k].addEventListener('click', handleButtonClick0);
      } else if (k === 1) {
        btn[k].addEventListener('click', handleButtonClick1);
      } else if (k >= 2 && k <= 10) {
        btn[k].addEventListener('click', handleButtonClick2To10);
      }
    }
    window.addEventListener('keyup', handleKeyUp);

    running = true;
  }
});
