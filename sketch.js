let mgr;
let streetImages = []; // Global array to store all preloaded street images
let streetImageNames = [];
let carnaubaImg, cajueiroImg, juazeiroImg, jucaImg, mororoImg, oitiImg;
let carnaubaBtn, cajueiroBtn, juazeiroBtn, jucaBtn, mororoBtn, oitiBtn;
let menuCarnauba, menuCajueiro, menuJuazeiro, menuJuca, menuMororo, menuOiti;
let carnaubaDesc, cajueiroDesc, juazeiroDesc, jucaDesc, mororoDesc, oitiDesc;
let trees = [
  { type: 'Carnauba', img: () => carnaubaImg, btn: () => carnaubaBtn, menuImg: () => menuCarnauba, desc: () => carnaubaDesc },
  { type: 'Cajueiro', img: () => cajueiroImg, btn: () => cajueiroBtn, menuImg: () => menuCajueiro, desc: () => cajueiroDesc },
  { type: 'Juazeiro', img: () => juazeiroImg, btn: () => juazeiroBtn, menuImg: () => menuJuazeiro, desc: () => juazeiroDesc },
  { type: 'Juca', img: () => jucaImg, btn: () => jucaBtn, menuImg: () => menuJuca, desc: () => jucaDesc },
  { type: 'Mororo', img: () => mororoImg, btn: () => mororoBtn, menuImg: () => menuMororo, desc: () => mororoDesc },
  { type: 'Oiti', img: () => oitiImg, btn: () => oitiBtn, menuImg: () => menuOiti, desc: () => oitiDesc }
]
let backgroundImg;
let font;
let photosPath = 'assets/game_screen/street_photos/';

function preload() {
  loadStreetImages();
  loadTrees();
  loadTreeButtons();
  loadMenuTrees();
  loadBackgroundAndFont();
  setTreeDescriptions();
}

function setup() {
  console.log('Setup starting - all assets loaded!');
  createCanvas(1920, 1080);
  textFont(font);
  mgr = new SceneManager();
  mgr.wire();
  mgr.showScene(title_screen);
  console.log('Setup complete!');
}

function draw() {
  mgr.draw();
}

function loadStreetImages() {
  // Preload all 198 street images
  let imageNumbers = [
    1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12
    , 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
    31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 51, 53, 54, 55, 56, 57,
    59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84,
    85, 86, 87, 88, 89, 92, 93, 94, 95, 96, 97, 98, 99, 100, 102, 103, 104, 105, 106, 107, 108, 109,
    110, 111, 112, 113, 114, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129,
    130, 132, 134, 135, 136, 137, 138, 139, 140, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151,
    152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170,
    171, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190,
    191, 193, 194, 195, 196, 197, 198, 199
  ];

  let i = 0;
  console.log('Loading ' + imageNumbers.length + ' street images...');

  for (let num of imageNumbers) {
    let imagePath = photosPath + "E_" + num + ".webp";
    streetImages[i] = loadImage(imagePath, 
      () => {}, // Success callback - silent
      (err) => console.error('Failed to load image:', imagePath, err)
    );
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

function setTreeDescriptions() {
  carnaubaDesc = 'Get to know Carnaúba, the “tree of life” that is the symbol of Ceará. Pictured in the state flag, it\'s endemic to the Caatinga, and can reach 15 m in height! From its leaves, we can extract wax that is widely used in global cosmetic, food, pharma, and even tech industries. Their deep and beautiful roots resist drought and salinity, preventing erosion.';
  cajueiroDesc = 'Native to Brazil, the cashew tree thrives in full sun and deep soils. It yields 20 to 60 fruits per harvest, is of significant socioeconomic importance to the country\'s northeast, and all parts of the fruit are widely used, not just the nut! Get to know the world\’s largest Cajueiro that spreads 8,500 m² in Natal, at Rio Grande do Norte.';
  juazeiroDesc = 'Named from the indigenous Tupi for “yellow fruit,” this evergreen tree has a dense crown and deep roots. It has medicinal bark and leaves that are used to treat wounds and fevers. It cools cities, shelters wildlife, and aids land recovery, working with the aid of bees. It\'s a symbol of resistance from the Sertão and can live up to 100 years!';
  jucaDesc = 'Jucá is also called pau-ferro (ironwood)or ybyraitá in Tupi, and it\'s known for its dense, durable, and resistant wood, with beautiful marble-like trunks ranging from dark green to white and grey blotches. This medium-to-large native tree offers shade and resilience, with non-aggressive roots. In addition, Jucá teas and infusions are used in popular culture to treat infections and wounds.';
  mororoDesc = 'This key Caatinga species is popular know as pata-de-vaca (cow\'s foot), with a light, sparse crown, and it\'s a “biological barometer,” sprouting after heavy rains. It\'s a beautiful ornamental tree, and more, due to its high adaptability, mororó plant is used in revegetation projects for eroded soil!';
  oitiDesc = 'A medium-to-large evergreen tree with a dense, rounded crown, reaching up to 20m in height. Its velvety leaves reduce water loss in hot weather, and it produces small, sweet yellow fruits loved by humans and birds. It\'s also resistant to pollution! ';
}

function loadTreeButtons() {
  carnaubaBtn = loadImage('assets/tree_buttons/carnauba_button.png', 'Carnauba Button');
  cajueiroBtn = loadImage('assets/tree_buttons/cajueiro_button.png', 'Cajueiro Button');
  juazeiroBtn = loadImage('assets/tree_buttons/juazeiro_button.png', 'Juazeiro Button');
  jucaBtn = loadImage('assets/tree_buttons/juca_button.png', 'Juca Button');
  mororoBtn = loadImage('assets/tree_buttons/mororo_button.png', 'Mororo Button');
  oitiBtn = loadImage('assets/tree_buttons/oiti_button.png', 'Oiti Button');
}

function loadMenuTrees() {
  menuCarnauba = loadImage('assets/menu_trees/menu_carnauba.png', 'Menu Carnauba');
  menuCajueiro = loadImage('assets/menu_trees/menu_cajueiro.png', 'Menu Cajueiro');
  menuJuazeiro = loadImage('assets/menu_trees/menu_juazeiro.png', 'Menu Juazeiro');
  menuJuca = loadImage('assets/menu_trees/menu_juca.png', 'Menu Juca');
  menuMororo = loadImage('assets/menu_trees/menu_mororo.png', 'Menu Mororo');
  menuOiti = loadImage('assets/menu_trees/menu_oiti.png', 'Menu Oiti');
}

function loadBackgroundAndFont() {
  backgroundImg = loadImage('assets/background.png', 
    () => console.log('Background loaded'),
    (err) => console.error('Failed to load background:', err)
  );
  font = loadFont('assets/fonts/PressStart2P.ttf',
    () => console.log('Font loaded'),
    (err) => console.error('Failed to load font:', err)
  );
}

function mousePressed() {
  // Only handle mouse press if scene manager is initialized
  if (mgr) {
    mgr.handleEvent("mousePressed");
  }
}

function mouseClicked() {
  // Only handle mouse click if scene manager is initialized
  console.log('mouseClicked fired');
  if (mgr) {
    mgr.handleEvent("mouseClicked");
  }
}

function keyPressed() {
  // Only handle key press if scene manager is initialized
  console.log('keyPressed fired');
  if (mgr) {
    mgr.handleEvent("keyPressed");
  }
}
