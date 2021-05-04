// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const photo_input = document.getElementById("image-input");
const submit = document.querySelector("[type='submit']");
const clear = document.querySelector("[type='reset']");
const read = document.querySelector("[type='button']");
const canvas = document.getElementById('user-image');
const ctx = canvas.getContext('2d');
let TOP_TEXT;
let BOTTOM_TEXT;
//Fires whenever the user uploads a new picture :)
photo_input.addEventListener('change', () => {
 let file = photo_input.files[0];
 img.alt = photo_input.files[0].name; //YUHHHHHHHHHHHHHHHHHHH
 img.src = URL.createObjectURL(file);
});



// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  //Taking care of the canvas
  //const canvas = document.getElementById('user-image');
  wipeCanvas();

  //Now we got a black canvas.  Now we need to enter the image in <3
  drawImg();

  //Set img alt

  //Now we should enable or disable buttons :)
  enableButtonsImgLoad();

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

//This event handler will take the text and then put it into the top text and bottom text :)
submit.addEventListener('click', (e) => {
  e.preventDefault();
  drawText();

  enableButtonsSubmit();

});

clear.addEventListener('click', (e) => {
  e.preventDefault();
  ctx.clearRect(0,0, canvas.width, canvas.height);
  document.getElementById('text-top').value = "";
  document.getElementById('text-bottom').value = "";

  enableButtonsClear();
});

read.addEventListener('click', (e) => {
  e.preventDefault();

  let synth = window.speechSynthesis;
  let utterance1 = new SpeechSynthesisUtterance(document.getElementById('text-top').value);
  let utterance2 = new SpeechSynthesisUtterance(document.getElementById('text-bottom').value);
  
  synth.speak(utterance1);
  //window.speechSynthesis.cancel();
  synth.speak(utterance2);
  //window.speechSynthesis.cancel();
});



function drawText(){
  //const ctx = canvas.getContext('2d');
  TOP_TEXT = document.getElementById('text-top').value;
  BOTTOM_TEXT = document.getElementById('text-bottom').value;
  ctx.font = "20px Georgia";
  ctx.fillStyle="#FFFFFF";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "black";
  ctx.fillText(TOP_TEXT, 10, 50, canvas.width);
  ctx.fillText(BOTTOM_TEXT, 10, canvas.height-50 , canvas.width);
}

function wipeCanvas(){
  //const ctx = canvas.getContext('2d');
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas.width, canvas.height);
}
function drawImg(){
  //const ctx = canvas.getContext('2d');
  let image_dimensions = getDimensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, image_dimensions.startX,image_dimensions.startY, image_dimensions.width, image_dimensions.height);
}
function enableButtonsImgLoad(){

  submit.disabled = false;
  clear.disabled =true;
  read.disabled = true;
}
function enableButtonsSubmit(){
  submit.disabled = true;
  clear.disabled =false;
  read.disabled = false;
}
function enableButtonsClear(){

  submit.disabled = false;
  clear.disabled =true;
  read.disabled = true;
}


function populateVoiceList() {
  if(typeof speechSynthesis === 'undefined') {
    return;
  }

  var voices = speechSynthesis.getVoices();

  for(var i = 0; i < voices.length; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    document.getElementById("voice-selection").disabled = false;
    document.querySelector("[value='none']").innerHTML = "Choose a language!";
    document.getElementById("voice-selection").appendChild(option);
  }
}

populateVoiceList();
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width ad height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
