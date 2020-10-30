"use strict";

//環境設定
var isMobile = function isMobile() {
  return window.innerWidth < 780;
};

var type = "WebGL";

if (!PIXI.utils.isWebGLSupported()) {
  type = "canvas";
}

PIXI.utils.sayHello(type);
var app = new PIXI.Application({
  width: 1920,
  height: 960
});
var Application = PIXI.Application,
    loader = PIXI.Loader.shared,
    renderer = app.renderer,
    resources = PIXI.Loader.shared.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Container = PIXI.Container;
var loaded = false;
var speed = 35; //每 frame 移動距離

var fps = 20;
var ticker = fps / 60;
var gravity = 8.5; //重力

var time = 20; //遊戲時間

var velocity = 0;
var dis = 0;
var cloudDis = 0;
var elapsedTime = 0;
var gameTicker = PIXI.Ticker.shared;
var thisMission = []; //現在關卡

var foreground = new Container();
var fgContainer = new Container();
var cloudsContainer = new Container();
var rainContainer = new Container();
var nowStory = {};
var temperature = 37;
var today = new Date();
var newDay = today.toISOString().split('T')[0].split("-");
var passed = []; //let city = document.querySelector('#county').value

var score = 0;
var tempDOM = document.querySelector('.game__temp .num');
var dateDOM = document.querySelector('.game__city .date'); //角色

var power = 93; //跳躍力

var air = 0;
var ground = 130;
var jump = false;
var state = 'stand'; //目前動作

var changeState = 'walk';
var chr = {}; // stories

var housewifeAssets = [{
  name: 'bg',
  src: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/bg-housewife.jpg'
}, {
  name: 'fg',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/fg-housewife.png"
}, {
  name: 'clouds',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/cloud-housewife.png"
}, {
  name: 'block-1',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-housewife-01.png"
}, {
  name: 'block-2',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-housewife-02.png"
}, {
  name: 'block-3',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-housewife-03.png"
}, {
  name: 'block-4',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-housewife-04.png"
}, {
  name: 'block-5',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-housewife-05.png",
  rain: true
}, {
  name: 'chr',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-housewife-2.png"
}, {
  name: 'tear',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-housewife.png"
}];
var salaryAssets = [{
  name: 'bg',
  src: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/bg-salary.png'
}, {
  name: 'fg',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/fg-salary.png"
}, {
  name: 'clouds',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/cloud-housewife.png"
}, {
  name: 'block-1',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-salary-01.png"
}, {
  name: 'block-2',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-salary-02.png",
  rain: true
}, {
  name: 'block-3',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-salary-03.png",
  rain: true
}, {
  name: 'block-4',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-salary-04.png",
  rain: true
}, {
  name: 'block-5',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-salary-05.png",
  rain: true
}, {
  name: 'chr',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-salary.png"
}, {
  name: 'tear',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-salary.png"
}];
var parentsAssets = [{
  name: 'bg',
  src: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/bg-parents.jpg'
}, {
  name: 'fg',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/fg-parents.png"
}, {
  name: 'clouds',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/cloud-housewife.png"
}, {
  name: 'block-1',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-parents-01.png"
}, {
  name: 'block-2',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-parents-02.png",
  rain: true
}, {
  name: 'block-3',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-parents-03.png",
  rain: true
}, {
  name: 'block-4',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-parents-04.png",
  rain: true
}, {
  name: 'block-5',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-parents-05.png",
  rain: true
}, {
  name: 'chr',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-parents.png"
}, {
  name: 'tear',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-parents.png"
}];
var retireAssets = [{
  name: 'bg',
  src: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/bg-retire.jpg'
}, {
  name: 'fg',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/fg-retire.png"
}, {
  name: 'clouds',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/cloud-housewife.png"
}, {
  name: 'block-1',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-retire-01.png"
}, {
  name: 'block-2',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-retire-02.png"
}, {
  name: 'block-3',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-retire-03.png"
}, {
  name: 'block-4',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-retire-04.png"
}, {
  name: 'block-5',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/block-retire-05.png",
  rain: true
}, {
  name: 'chr',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-retire.png"
}, {
  name: 'tear',
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-retire.png"
}];
var allAssets = [{
  name: "rain",
  src: "https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/rain.png"
}].concat(housewifeAssets).concat(salaryAssets).concat(parentsAssets).concat(retireAssets);
var housewife = {
  url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-housewife-2.png',
  tears: {
    url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-housewife.png',
    x: 39,
    y: -7
  },
  animations: {
    'walk': [0, 1, 2],
    'stand': [0],
    'jump': [3]
  }
};
var salary = {
  url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-salary.png',
  tears: {
    url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-housewife.png',
    x: 66,
    y: 15
  },
  animations: {
    'walk': [0, 1, 2],
    'stand': [0],
    'jump': [3]
  }
};
var parents = {
  url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-parents.png',
  tears: {
    url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-parents.png',
    x: 71,
    y: 42
  },
  animations: {
    'walk': [0, 1, 2],
    'stand': [0],
    'jump': [3]
  }
};
var retire = {
  url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/chr-retire.png',
  tears: {
    url: 'https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/tear-housewife.png',
    x: 50,
    y: 32
  },
  animations: {
    'walk': [0, 1, 2],
    'stand': [0],
    'jump': [3]
  }
};
var stories = {
  housewife: {
    name: 'housewife',
    ground: 130,
    assets: housewifeAssets,
    character: housewife,
    concept: "為了買家人愛吃的菜<br class='mb-show'>在市場裡揮汗奔波",
    result: [{
      desc: '太陽太辣，採買中暑',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-housewife-1.png'
    }, {
      desc: '豔陽要亡果！菜價飆漲',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-housewife-2.png'
    }, {
      desc: '蚊蟲孳生感染',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-housewife-3.png'
    }, {
      desc: '生食食品易壞',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-housewife-4.png'
    }, {
      desc: '菜選擇少，手腳慢搶不到',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-housewife-5.png'
    }]
  },
  salary: {
    name: 'salary',
    ground: 170,
    assets: salaryAssets,
    character: salary,
    concept: "為了趕上班在城市裡奔波",
    result: [{
      desc: '天熱火氣大，路上三寶找架吵',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-salary-1.png'
    }, {
      desc: '暴雨積水好危險',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-salary-2.png'
    }, {
      desc: '眼鏡瀑布看不見',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-salary-3.png'
    }, {
      desc: '通勤成本大暴增',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-salary-4.png'
    }, {
      desc: '新鞋新襪溼答答',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-salary-5.png'
    }]
  },
  parents: {
    name: 'parents',
    ground: 180,
    assets: parentsAssets,
    character: parents,
    concept: "為了孩子開心的笑容，去露營囉！",
    result: [{
      desc: '天熱小孩中暑',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-parents-1.png'
    }, {
      desc: '小水窪',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-parents-2.png'
    }, {
      desc: '露營區積水',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-parents-3.png'
    }, {
      desc: '坍方路不通',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-parents-4.png'
    }, {
      desc: '輪胎打滑',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-parents-5.png'
    }]
  },
  retire: {
    name: 'retire',
    ground: 180,
    assets: retireAssets,
    character: retire,
    concept: "為了去公園與老友下棋",
    result: [{
      desc: '柏油路蒸氣燙燙燙',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-retire-1.png'
    }, {
      desc: '路上有老人中暑昏倒',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-retire-2.png'
    }, {
      desc: '食物放一下就壞，吃壞肚子',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-retire-3.png'
    }, {
      desc: '太熱沒胃口',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-retire-4.png'
    }, {
      desc: '淋濕衣服',
      src: 'https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/icon-retire-5.png'
    }]
  }
}; // renderer.view.style.position = "absolute";
// renderer.view.style.display = "block";
// renderer.autoResize = true;
// renderer.resize(window.innerWidth, window.innerHeight);
// set pixi view

document.querySelector('#game').appendChild(app.view); //預設關卡

nowStory = stories['housewife'];
setGame(nowStory); //setGame(nowStory)
//操作

$(document).on('keydown touchstart', function (e) {
  console.log(document.querySelector('.game__inner--ready').style);
  if (time > 29) return;

  if (e.keyCode == '32' || e.type == 'touchstart') {
    if (state === 'jump') return;
    jump = true;
  }
});
$(window).on('resize', function () {
  var rate = 1920 / 960;
  var canvas = $(app.view);
  canvas.width($(window).width());
  canvas.height(canvas.width() * (960 / 1920)); // if(isMobile){
  //   app.width = 750
  //   app.height = 1240
  //   rate = 750 / 1240
  //   canvas.height(canvas.width() * (1240/750))
  // }

  if (canvas.height() < $(window).height()) {
    canvas.height($(window).height());
    canvas.width(canvas.height() * rate);
  }

  console.log(canvas.width(), canvas.height());
}).resize(); // 

function setGame(story, autoStart) {
  autoStart = autoStart || false;
  nowStory = story;
  ground = isMobile() ? 170 : story.ground;
  pauseGame();
  temperature = 37;
  tempDOM.textContent = String(temperature);
  today = new Date();
  newDay = today.toISOString().split('T')[0].split("-");
  passed = [];
  score = 0;
  setScore(score);
  document.querySelector('.game__concept').innerHTML = nowStory.concept;
  time = 20;
  setCounter(time.toString(), '#counter');
  var bgurl = story.assets[0].src;
  var characterName = story.name;
  speed = isMobile() ? 30 : 33;

  if (!loaded) {
    loadAssets(setup);
  } else {
    while (app.stage.children.length > 0) {
      app.stage.removeChildAt(0);
    }

    setup();
  }

  function loadAssets(callback) {
    //let assets = 
    var urls = allAssets.map(function (item) {
      return item.src;
    });
    urls = urls.filter(function (item, index) {
      return urls.indexOf(item) === index;
    }); //console.log(urls)

    loader.add(urls).load(callback);
  }

  function setup() {
    //console.log(resources)
    var bg = new Sprite(resources[bgurl].texture);
    bg.width = renderer.view.width;
    bg.height = renderer.view.height;
    app.stage.addChild(bg);
    var distence = time * fps * speed;
    foreground = new Container();
    cloudsContainer = new Container();
    rainContainer = new Container();
    setScene(generateBlocks(characterName, 5), 12, distence, story.assets[1].src, story.assets[2].src);
    app.stage.addChild(cloudsContainer);
    app.stage.addChild(foreground);
    buildCharacter(story.character);
    app.stage.addChild(chr.self);
    app.stage.addChild(rainContainer);
    air = ground;
    dis = 0;
    velocity = 0;
    jump = false;
    state = 'stand';
    gameTicker.autoStart = false;
    gameTicker.speed = ticker;
    if (!loaded) gameTicker.add(gameLoop);
    gameTicker.stop();
    loaded = true;
    console.log('auto ' + autoStart);
    if (autoStart) startGame();
  }
}

function startGame() {
  console.log('start');
  jump = false;
  chr.body.textures = chr.animations.walk;
  chr.body.play();
  gameTicker.start();
}

function pauseGame() {
  console.log('stop');
  gameTicker.stop();
} //生成角色


function buildCharacter(sheet) {
  var texture = new PIXI.BaseTexture.from(sheet.url);
  var w = texture.width / 4;
  var h = texture.height;
  var animationNames = Object.keys(sheet.animations);
  chr.animations = {};
  animationNames.forEach(function (item, index) {
    chr.animations[item] = sheet["animations"][item].map(function (value) {
      return new PIXI.Texture(texture, new PIXI.Rectangle(value * w, 0, w, h));
    });
  }); //console.log(chr.animations)

  chr.self = new Container();
  chr.body = new PIXI.AnimatedSprite(chr.animations.walk);

  if (isMobile()) {
    chr.body.scale.x = 0.9;
    chr.body.scale.y = 0.9;
  }

  chr.body.animationSpeed = ticker * 1.5;
  chr.self.addChild(chr.body);
  chr.tears = new Sprite(resources[sheet.tears.url].texture);
  chr.tears.x = sheet.tears.x;
  chr.tears.y = sheet.tears.y;

  if (isMobile()) {
    chr.tears.scale.x = 0.9;
    chr.tears.scale.y = 0.9;
    chr.tears.x = sheet.tears.x * 0.9;
    chr.tears.y = sheet.tears.y * 0.9;
  }

  chr.tears.alpha = 0;
  chr.self.addChild(chr.tears);
  var detectSize = isMobile() ? 140 : 160;
  chr.detectArea = new PIXI.Graphics();
  chr.detectArea.beginFill(0xcccccc);
  chr.detectArea.drawRect(0, 0, detectSize, chr.body.height * .8);
  chr.detectArea.x = (chr.body.width - detectSize) / 2;
  chr.detectArea.alpha = 0;
  chr.self.addChild(chr.detectArea);
  chr.self.x = isMobile() ? 0 : 100;
  chr.self.y = app.stage.height - chr.body.height - ground; //console.log('chr.self.y',chr.body.height)

  ground = app.stage.height - chr.self.height - ground;
} //生成障礙物資料


function generateBlocks(name, num) {
  var blocks = [];
  var tempBlocks = stories[name].assets.filter(function (value) {
    //console.log(value.name.indexOf('block'))
    return value.name.indexOf('block') >= 0;
  });

  for (var i = 0; i < num; i++) {
    //let rainning = 
    //let block = buildBlock(new Sprite(resources[`./images/block-${name}-0${i}.png`].texture), rainning)
    var block = buildBlock(new Sprite(resources[tempBlocks[i].src].texture), false);
    block.rain = tempBlocks[i].rain || false; //console.log(block.width)

    blocks.push(block);
  }

  return blocks;
}

function buildBlock(sprite, rainning) {
  var temp = new Container();
  var block = sprite;

  if (block.height < 140) {
    block.width = block.width * (140 / block.height);
    block.height = block.height * (140 / block.height);
  }

  if (block.height > 200) {
    block.width = block.width * (200 / block.height);
    block.height = block.height * (200 / block.height);
  }

  var detectSize = 120;

  if (isMobile()) {
    block.width *= 0.85;
    block.height *= 0.85;
    detectSize = 100;
  }

  temp.addChildAt(block, 0);
  temp.block = block; //console.log(temp.height)

  var detectArea = new PIXI.Graphics();
  detectArea.beginFill(0x55ccff);
  detectArea.drawRect(0, 0, detectSize, detectSize);
  detectArea.endFill();
  temp.addChildAt(detectArea, 1);
  detectArea.x = (block.width - detectSize) / 2;
  detectArea.y = block.height - detectSize;
  detectArea.alpha = 0;
  temp.detectArea = detectArea;

  if (rainning) {
    var rain = {};
    var texture = new PIXI.BaseTexture.from("https://cors-anywhere.small-service.gpeastasia.org/https://change.greenpeace.org.tw/2020/petition/zh-TW.2020.climate.emergency.signup.mc/images/rain.png");
    var w = texture.width / 2;
    var h = texture.height;
    rain.animations = {
      rainning: [new PIXI.Texture(texture, new PIXI.Rectangle(0 * w, 0, w, h)), new PIXI.Texture(texture, new PIXI.Rectangle(1 * w, 0, w, h))]
    }; //console.log(chr.animations)

    rain.body = new PIXI.AnimatedSprite(rain.animations.rainning);
    rain.body.animationSpeed = 1;

    if (isMobile()) {
      rain.body.scale.x = 0.85;
      rain.body.scale.y = 0.85;
    } //rain.body.animationSpeed = ticker * 1.5
    //console.log(temp)


    temp.rain = rain;
  }

  return temp;
} //設置關卡 (障礙物資料、數目、總長)


function setScene(blocks, num, distence, fgurl, clouds) {
  // foreground
  var fgNum = distence / resources[fgurl].texture.width;

  for (var i = 0; i < fgNum + 5; i++) {
    var tempCloud = new Sprite(resources[clouds].texture);
    tempCloud.y = 0;
    tempCloud.x = i * tempCloud.width;
    var temp = new Sprite(resources[fgurl].texture);

    if (isMobile()) {
      temp.width *= 0.9;
      temp.height *= 0.9;
    }

    temp.y = 0;
    temp.x = i * temp.width;
    foreground.addChild(temp);
    cloudsContainer.addChild(tempCloud);
  } //console.log('foreground ' + foreground.height)


  foreground.x = 0;
  foreground.y = app.stage.height - foreground.height;
  foreground.thisHeight = foreground.height;
  cloudsContainer.y = 180;
  var allBlocks = [];

  while (allBlocks.length < num) {
    allBlocks = allBlocks.concat(shuffle(blocks));
  }

  var tempX = 0;
  var nowGround = isMobile() ? 180 : nowStory.ground;

  for (var j = 0; j < num; j++) {
    var tempBlock = allBlocks[j];

    if (j < 5) {
      tempX = tempX + distence * 0.45 / 5;
    } else {
      tempX = tempX + distence * 0.45 / 7;
    }

    tempBlock.x = tempX;
    tempBlock.y = foreground.height - nowGround - tempBlock.height;
    foreground.addChild(tempBlock); //console.log(tempBlock.y)

    thisMission[j] = tempBlock;

    if (tempBlock.rain) {
      tempBlock.rain.body.x = tempBlock.x + (tempBlock.width - tempBlock.rain.body.width) / 2;
      tempBlock.rain.body.y = app.stage.height - 60 - tempBlock.rain.body.height;
      rainContainer.addChild(tempBlock.rain.body);
      tempBlock.rain.body.textures = tempBlock.rain.animations.rainning;
      tempBlock.rain.body.play();
    }

    console.log(tempBlock.y);
  }

  rainContainer.x = 0;
  rainContainer.y = 0;
}

function gameLoop(delta) {
  elapsedTime += delta;
  time -= 1 / 60;

  if (elapsedTime >= 1) {
    setCounter(Math.floor(time).toString(), '#counter');

    if (time < 0) {
      pauseGame(); //nowStep = 1;
      //changeSection('#trans', 2)
      //alert('挑戰成功')

      setEnd('success', nowStory);
    }

    elapsedTime = 0;
    dis -= speed;
    cloudDis -= speed / 4;
    foreground.x = dis;
    rainContainer.x = dis;
    cloudsContainer.x = cloudDis;

    if (jump) {
      //console.log(chr.body)
      velocity -= power;
      jump = false;
      changeState = 'jump';
    }

    velocity += gravity;
    air += velocity;
    chr.self.y = air;
    velocity *= 0.9;

    if (air >= ground) {
      air = ground;
      velocity = 0;
      chr.self.y = ground;
      changeState = 'walk';
    }

    if (state != changeState) {
      state = changeState;
      chr.body.textures = chr.animations[state];
      chr.body.play();
    }

    for (var i = 0; i < thisMission.length; i++) {
      if (collisionDetect(chr.detectArea, thisMission[i].detectArea)) {
        pauseGame(); //alert('挑戰失敗')
        //nowStep = 1;
        //changeSection('#trans', 2)

        setTimeout(function () {
          chr.tears.alpha = 1;
        }, 300);
        setTimeout(function () {
          setEnd('fail', nowStory);
        }, 1000);
      } else {
        if (chr.detectArea.getGlobalPosition().x > thisMission[i].detectArea.getGlobalPosition().x + thisMission[i].detectArea.width && passed.indexOf(i) < 0) {
          score += 1;
          passed.push(i);
          setScore(score);
        }
      }
    }
  }
}

function setScore(score) {
  var newYear = today.getFullYear() + score;
  var newTemperature = temperature + score;
  dateDOM.textContent = "".concat(newYear, ".").concat(newDay[1], ".").concat(newDay[2]);
  tempDOM.textContent = newTemperature;
}

function setEnd(result, story) {
  $('body').addClass('noscroll');
  $('.game-end').hide().removeClass('success fail');
  $('.game-end .success, .game-end .fail').hide();
  $('.game-end .' + result).show(); // $('.game-end').addClass(result)

  $('.game-end').attr('class', 'game-end game-end--' + story.name + ' ' + result);
  $('.game-end__item').each(function (index) {
    $(this).find('.game-end__name').text(story.result[index].desc);
    $(this).find('.game-end__icon').attr('src', story.result[index].src);
  });
  $('.game-end').fadeIn();
}

function collisionDetect(r1, r2) {
  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  hit = false;
  r1.centerX = r1.getGlobalPosition().x + r1.width / 2;
  r1.centerY = r1.getGlobalPosition().y + r1.height / 2;
  r2.centerX = r2.getGlobalPosition().x + r2.width / 2;
  r2.centerY = r2.getGlobalPosition().y + r2.height / 2;
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      hit = true;
      console.log(r2.parent); // let detectArea = new PIXI.Graphics()
      // detectArea.beginFill(0xff0000)
      // detectArea.drawRect(r2.getGlobalPosition().x, r2.getGlobalPosition().y, r2.width, r2.height)
      // detectArea.endFill()
      // detectArea.alpha = .3
      // app.stage.addChild(detectArea)
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }

  return hit;
} //隨機重新排列陣列


function shuffle(resource) {
  var result = [];
  var ranNum = resource.length;
  var picked = [];

  for (var i = 0; i < ranNum; i++) {
    var ran = Math.floor(Math.random() * ranNum);

    while (picked.indexOf(ran) >= 0) {
      ran = Math.floor(Math.random() * ranNum);
    }

    var rainning = resource[ran].rain;
    var newBlock = buildBlock(new Sprite(resource[ran].getChildAt(0).texture), rainning);
    result.push(newBlock);
    picked.push(ran);
  }

  return result;
}

function paddingLeft(str, length) {
  if (str.length >= length) {
    return str;
  } else {
    return paddingLeft("0" + str, length);
  }
}

function setCounter(time, counter) {
  if (parseInt(time) < 0) time = "0";
  document.querySelector(counter).textContent = '00:' + paddingLeft(time, 2); //console.log(time)
}