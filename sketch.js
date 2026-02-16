let mgr;
let streetImages = []; // Global array to store all preloaded street images
let streetImageNames = [];
let carnaubaImg, cajueiroImg, juazeiroImg, jucaImg, mororoImg, oitiImg;
let carnaubaBtn, cajueiroBtn, juazeiroBtn, jucaBtn, mororoBtn, oitiBtn;
let photosPath = 'assets/game_screen/street_photos/';

function preload() {
  loadStreetImages();
  loadTrees();
  loadTreeButtons();
}

function setup() {
  createCanvas(1920, 1080);
  textFont('Press Start 2P');
  mgr = new SceneManager();
  mgr.wire();
  mgr.showScene(title_screen);
}

function draw() {
  mgr.draw();
}

function loadStreetImages() {
  // Preload all 198 street images
  let imageNumbers = [
    1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12
    , 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31,32,33,34,35,36,37,38,39,40,41,42,43,45,46,47,48,49,50,51,53,54,55,56,57,
    59,60,61,62,63,64,65,66,67,68,69,70,71,72,74,75,76,77,78,79,80,81,82,83,84,
    85,86,87,88,89,92,93,94,95,96,97,98,99,100,102,103,104,105,106,107,108,109,
    110,111,112,113,114,116,117,118,119,120,121,122,123,124,125,126,127,128,129,
    130,132,134,135,136,137,138,139,140,142,143,144,145,146,147,148,149,150,151,
    152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,
    171,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,
    191,193,194,195,196,197,198,199
  ];

  let i = 0;
  
  for (let num of imageNumbers) {
    streetImages[i] = loadImage(photosPath + "E_" + num + ".webp");
    streetImageNames[i] = "E_" + num + ".webp";
    i++;
  }
}

function loadTrees() {
  carnaubaImg = loadImage('assets/trees/carnauba.png', 'Carnauba Tree');
  cajueiroImg = loadImage('assets/trees/cajueiro.png', 'Cajueiro Tree');
  juazeiroImg = loadImage('assets/trees/juazeiro.png', 'Juazeiro Tree');
  jucaImg = loadImage('assets/trees/juca.png', 'Juca Tree');
  mororoImg = loadImage('assets/trees/mororo.png', 'Mororo Tree');
  oitiImg = loadImage('assets/trees/oiti.png', 'Oiti Tree');
}

function loadTreeButtons() {
  carnaubaBtn = loadImage('assets/tree_buttons/carnauba_button.png', 'Carnauba Button');
  cajueiroBtn = loadImage('assets/tree_buttons/cajueiro_button.png', 'Cajueiro Button');
  juazeiroBtn = loadImage('assets/tree_buttons/juazeiro_button.png', 'Juazeiro Button');
  jucaBtn = loadImage('assets/tree_buttons/juca_button.png', 'Juca Button');
  mororoBtn = loadImage('assets/tree_buttons/mororo_button.png', 'Mororo Button');
  oitiBtn = loadImage('assets/tree_buttons/oiti_button.png', 'Oiti Button');
}

function mousePressed() {
    mgr.handleEvent("mousePressed");
}
