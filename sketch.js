let mgr;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Press Start 2P');
  mgr = new SceneManager();
  mgr.wire();
  mgr.showScene(title_screen);
}

function draw() {
  mgr.draw();
}