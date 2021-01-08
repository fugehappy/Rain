//TODO:
//在pc端和移动端的红包随机比例要分别调整
//不同移动端红包和奖品显示错位（适配）
//倒计时结束后谢谢参与并继续抢功能
//在pad端红包性能问题：卡顿，红包生成异常
//拆红包动画
//解决游戏结束时定在倒计时1s
//解决背景适配
//重复游戏时红包异常：第二次游戏红包数量翻倍/第n次游戏无红包

//初始化图片
let imgjishi = "../images/daojishi.png";
let bgPlan = "../images/bg-plan.jpg";
let bgRainer = "../images/bg-rainer.jpg";
let redpacket = "../images/redpacket.png";
let close = "../images/close.png";
let dialogExit = "../images/dialog-exit.png";
let buttonCancel = "../images/button-cancel.png";
let buttonExit = "../images/button-exit.png";
let openRedpacket = "../images/open-redpacket.png";
let open = "../images/open.png";
let redpacketResult = "../images/redpacket-result.png";
let prizeImg = "../images/prize.png";
let buttonUseTicket = "../images/button-use-ticket.png";
let buttonContinue = "../images/button-continue.png";
let cursorAnimation = "../images/cursor-animation.png";
let startRed = "../images/start_red.png";
let startText = "../images/start_text.png";

let states = {};
let QingLvGroup;
let hitNum = 0;
let config = {
  selfPool: 40,
  selfPic: "redpacket",
  rate: 0.5,
  maxSpeed: 800,
  minSpeed: 400,
  max: 70,
};

let ids = [0, 1, 2, 3, 4, 5];
let redpackets = [
  "全场优惠5元",
  "20元代金券",
  "全场优惠5元",
  "20元代金券",
  "全场优惠5元",
  "20元代金券",
];
let time = 10;
let getIds = [];
let radio = document.documentElement.clientHeight;
let e;

function rfuc(n) {
  return n;
}
function rfucY(n) {
  return n;
}

//初始化红包
function QingLv(config, game) {
  this.init = function () {
    this.config = config;
    QingLvGroup = game.add.group();
    QingLvGroup.enableBody = true;
    QingLvGroup.createMultiple(config.selfPool, config.selfPic); //初始化多个红包
    QingLvGroup.setAll("anchor.y", 1);
    QingLvGroup.setAll("outOfBoundsKill", true);
    QingLvGroup.setAll("checkWorldBounds", true);
    this.maxWidth = game.width + 100;

    game.time.events.loop(
      Phaser.Timer.SECOND * config.rate,
      this.createQL,
      this
    );
  };
  this.createQL = function () {
    e = QingLvGroup.getFirstExists(false);

    if (e) {
      if (hitNum >= config.max) {
        return;
      }
      hitNum++;
      e.events.onInputDown.removeAll();
      //TODO:红包随机角度/随机大小
      var ram = Math.random() * 0.7 + 0.3;
      // console.log(ram);
      // ram = ram<0.2?ram+=0.2:ram;
      // ram = (0.2 - 0.6);
      e.loadTexture(this.config.selfPic);
      e.alpha = 1;
      e.angle = Math.random() * (45 - -45) - 45;
      e.scale.setTo(ram);
      //TODO:红包生成的位置、红包移动的速度
      e.reset(game.rnd.integerInRange(100, this.maxWidth - 100), 0);
      e.body.velocity.x = game.rnd.integerInRange(-100, 100);
      e.body.velocity.y = game.rnd.integerInRange(
        config.minSpeed,
        config.maxSpeed
      );
      e.inputEnabled = true;
      e.events.onInputDown.add(this.hitted, this);
    }
  };
  //点红包事件
  this.hitted = function (sprite) {
    //TODO:设置红包概率
    if (Math.random() < 1 / 2 && ids.length > 0) {
      sprite.kill();

      //点击获得红包,游戏暂停
      game.paused = true;

      //背景
      let hexGraphics = new Phaser.Graphics()
        .beginFill(0x000000, 0.5)
        .drawRect(
          0,
          0,
          document.documentElement.clientWidth,
          document.documentElement.clientHeight
        );
      let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture());

      // let openDialog = game.add.sprite(rfuc(62), rfuc(150), 'openRedpacket')
      let openDialog = game.add.sprite(62, 150, "openRedpacket");
      openDialog.scale.setTo(0.8);
      openDialog.top = game.world.centerY - openDialog.height / 2;
      openDialog.left = game.world.centerX - openDialog.width / 2;

      // let open = game.add.sprite(rfuc(130), rfuc(300), 'open')
      let open = game.add.sprite(130, 450, "open");
      open.scale.setTo(0.5);
      open.top = game.world.centerY - open.height / 2 - 100;
      open.left = game.world.centerX - open.width / 2;
      open.inputEnabled = true;

      // let result = game.add.sprite(rfuc(0), rfuc(120), 'redpacketResult')
      let result = game.add.sprite(0, 120, "redpacketResult");
      result.scale.setTo(0.8);
      result.top = game.world.centerY - result.height / 2;
      result.left = game.world.centerX - result.width / 2;
      result.visible = false;

      let prize = game.add.sprite(0, 120, "prizeImg");
      prize.scale.setTo(0.8);
      prize.top = game.world.centerY - prize.height / 2;
      prize.left = game.world.centerX - prize.width / 2;
      prize.visible = false;

      // let userTicket = game.add.sprite(rfuc(78), rfuc(445), 'buttonUseTicket')
      let userTicket = game.add.sprite(78, 785, "buttonUseTicket");
      userTicket.scale.setTo(0.8);
      userTicket.top = game.world.centerY - userTicket.height / 2 + 250;
      userTicket.right = game.world.centerX + userTicket.width + 10;
      userTicket.visible = false;

      // let goOn = game.add.sprite(rfuc(198), rfuc(445), 'buttonContinue')
      let goOn = game.add.sprite(198, 785, "buttonContinue");
      goOn.scale.setTo(0.8);
      goOn.top = game.world.centerY - goOn.height / 2 + 250;
      goOn.left = game.world.centerX - goOn.width - 10;
      goOn.visible = false;

      let ticketText = {};
      let link = "";

      //拆红包
      let clickOpen = function () {
        //游戏暂停时,点击事件无效,只能通过这种画热点的形式来绑定事件
        // let openRect = new Phaser.Rectangle(rfuc(130), rfuc(315), 239, 239).copyFrom(open);
        let openRect = new Phaser.Rectangle(130, 315, 239, 239).copyFrom(open);

        if (openRect.contains(game.input.x, game.input.y)) {
          let currentWidth = open.width;

          //拆红包动画
          let tempArr = [1, 2, 4, 6, 20, 6, 4, 2, 1];
          let index = 0;
          let timer = setInterval(function () {
            if (index > tempArr.length - 1) {
              index = 0;
            }
            open.scale.setTo(0.8);
            open.width = currentWidth / tempArr[index];
            open.height = open.height;
            open.left = game.world.centerX - open.width / 2;
            open.top = game.world.centerY - open.height / 2 + 100;

            ++index;
          }, 100);
          game.input.onDown.remove(clickOpen, this);
          //取出奖品
          let arrIndex = Math.floor(Math.random() * ids.length);
          let redpacketId = ids.splice(arrIndex, 1);
          getIds.push(redpacketId[0]);

          setTimeout(() => {
            timer && clearInterval(timer);
            let text = redpackets[redpacketId[0]];
            // ticketText = game.add.text(0, rfuc(338), text, {fill: '#ffe67d', fontSize: '46px', fontWeight: 'bolder'})
            ticketText = game.add.text(0, 0, text, {
              fill: "#ffe67d",
              fontSize: "40px",
              fontWeight: "bolder",
            });
            ticketText.top = game.world.centerY - ticketText.height / 2 + 58;
            ticketText.left = game.world.centerX - ticketText.width / 2;
            openDialog.visible = false;
            open.visible = false;
            prize.visible = true;
            // userTicket.visible = true;
            // goOn.visible = true;
            game.input.onDown.add(clickButton, this);
          }, 1500);
        }
      };

      let clickButton = function () {
        let userTicketRect = new Phaser.Rectangle(78, 445, 194, 66).copyFrom(
          userTicket
        );
        let continueRect = new Phaser.Rectangle(198, 445, 194, 66).copyFrom(
          goOn
        );

        if (userTicketRect.contains(game.input.x, game.input.y)) {
          window.location.replace(link);
          game.input.onDown.remove(clickButton, this);
        } else if (continueRect.contains(game.input.x, game.input.y)) {
          result.visible = false;
          userTicket.visible = false;
          goOn.visible = false;
          pausedMask.visible = false;
          ticketText.visible = false;
          game.paused = false;
          game.input.onDown.remove(clickButton, this);
        }
      };

      game.input.onDown.add(clickOpen, this);
    } else {
      sprite.inputEnabled = false;
      var anim = sprite.animations.add(config.selfPic);
      sprite.play(config.selfPic, 40, false);
      anim.onComplete.add(this.fade, this, sprite);
    }
  };
  this.fade = function (sprite) {
    var tween = game.add.tween(sprite).to({ alpha: 0 }, 300, "Linear", true);
    tween.onComplete.add(this.killed, this, sprite);
  };
  this.killed = function (sprite) {
    sprite.kill();
  };
}
states.boot = function (game) {
  this.preload = function () {
    if (typeof GAME !== "undefined") {
      this.load.baseURL = GAME + "/";
    }
    if (!game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
      this.scale.forcePortrait = true;
      this.scale.refresh();
    }
  };
  this.create = function () {
    game.stage.backgroundColor = "#FFF";
    game.state.start("preload");
  };
};
states.preload = function (game) {
  this.preload = function (game) {
    //加载图片
    game.load.spritesheet("daojishi", imgjishi, 250, 120, 4);
    game.load.image("bgPlan", bgPlan);
    game.load.image("bgRainer", bgRainer);
    game.load.image("startRed", startRed);
    game.load.image("startText", startText);
    game.load.spritesheet("redpacket", redpacket, 144, 173, 2);
    game.load.image("close", close);
    game.load.image("dialogExit", dialogExit);
    game.load.image("buttonExit", buttonExit);
    game.load.image("buttonCancel", buttonCancel);
    game.load.image("openRedpacket", openRedpacket);
    game.load.image("open", open);
    game.load.image("redpacketResult", redpacketResult);
    game.load.image("prizeImg", prizeImg);
    game.load.image("buttonContinue", buttonContinue);
    game.load.image("buttonUseTicket", buttonUseTicket);
    game.load.spritesheet("cursorAnimation", cursorAnimation, 74, 108, 2);
  };
  this.create = function () {
    game.state.start("main");
  };
};
states.main = function (game) {
  this.create = function () {
    // 物理系统
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // 背景图
    var bgPlan = game.add.sprite(0, 0, "bgPlan");
    bgPlan.width = game.width;
    bgPlan.height = game.height;
    var startRed = game.add.sprite(0, 0, "startRed");
    startRed.left = game.world.centerX - startRed.width / 2;
    startRed.top = game.world.centerY - startRed.height / 2 + 100;
    var startText = game.add.sprite(0, 0, "startText");
    startText.left = game.world.centerX - startText.width / 2;
    startText.top = game.world.centerY - startText.height / 2 - 300;
    var cursorPointer = game.add.sprite(
      game.world.centerX - 36,
      game.world.centerY + 150,
      "cursorAnimation"
    );
    var anim = cursorPointer.animations.add("cursorAnimation");
    cursorPointer.play("cursorAnimation", 2, true);

    // document.getElementById('audioCountDown').play()

    // 开始游戏倒计时
    var daojishi = game.add.sprite(
      game.world.centerX - 120,
      game.world.centerY - 200,
      "daojishi"
    );
    var anim = daojishi.animations.add("daojishi");
    daojishi.play("daojishi", 1, false);
    anim.onComplete.add(this.startGame, this, daojishi);
  };

  this.startGame = function (daojishi) {
    this.leftTime = time;
    let bgRainer = game.add.sprite(0, 0, "bgRainer");
    bgRainer.width = game.width;
    bgRainer.height = game.height;
    daojishi.visible = false;
    this.createQingLv();

    //添加按钮,并绑定事件
    let closeImg = game.add.button(
      40,
      40,
      "close",
      function () {
        game.paused = true;
        pausedMask.visible = true;
        exitDialog.visible = true;
        exitButton.visible = true;
        cancelButton.visible = true;

        game.input.onDown.add(buttonClick, this);
      }.bind(this)
    );

    // 剩余时间
    this.leftTimeText = game.add.text(0, 0, this.leftTime, {
      fill: "#FFF",
      fontSize: "50px",
      fontWeight: "bolder",
    });
    // this.leftTimeText.scale.setTo(1)
    this.leftTimeText.fixedToCamera = true;
    // this.leftTimeText.cameraOffset.setTo(game.camera.width - rfuc(80), rfuc(20));
    this.leftTimeText.cameraOffset.setTo(game.camera.width - 100, 40);

    let hexGraphics = new Phaser.Graphics()
      .beginFill(0x000000, 0.5)
      .drawRect(
        0,
        0,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight + 200
      );
    let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture());
    pausedMask.visible = false;

    let exitDialog = game.add.sprite(62, 150, "dialogExit");
    exitDialog.top = game.world.centerY - exitDialog.height / 2;
    exitDialog.left = game.world.centerX - exitDialog.width / 2;
    exitDialog.visible = false;

    let exitButton = game.add.button(80, 315, "buttonExit");
    exitButton.top = game.world.centerY - exitButton.height / 2 + 150;
    exitButton.left = game.world.centerX - exitButton.width - 10;
    exitButton.visible = false;

    let isExit = false;
    let cancelButton = game.add.button(200, 315, "buttonCancel");
    cancelButton.top = game.world.centerY - cancelButton.height / 2 + 150;
    cancelButton.left = game.world.centerX + 10;
    cancelButton.visible = false;

    game.time.events.repeat(
      Phaser.Timer.SECOND,
      this.leftTime,
      this.refreshTime,
      this
    );

    let buttonClick = function () {
      let cancelRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(
        cancelButton
      );
      let exitRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(
        exitButton
      );
      if (cancelRect.contains(game.input.x, game.input.y)) {
        game.input.onDown.remove(buttonClick, this);
        game.paused = false;
        pausedMask.visible = false;
        exitDialog.visible = false;
        exitButton.visible = false;
        cancelButton.visible = false;
      } else if (exitRect.contains(game.input.x, game.input.y)) {
        game.input.onDown.remove(buttonClick, this);
        game.paused = false;
        pausedMask.visible = false;
        exitDialog.visible = false;
        exitButton.visible = false;
        cancelButton.visible = false;
      }
    };
  };

  this.createQingLv = function () {
    this.qinglv = new QingLv(config, game);
    this.qinglv.init();
    this.qinglv = new QingLv(config, game);
    this.qinglv.init();
  };

  // let hexGraphics = new Phaser.Graphics().beginFill(0x000000, 0.5).drawRect(0,0,document.documentElement.clientWidth,document.documentElement.clientHeight + 200);
  //     let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture())
  //     pausedMask.visible = false;

  this.refreshTime = function () {
    this.leftTime--;
    var tem = this.leftTime;
    this.leftTimeText.text = tem;
    if (this.leftTime === 0) {
      // game.paused = true;
      this.gameOver();
    }
  };
  //TODO:游戏结束页面
  this.gameOver = function () {
    game.paused = true;
    let hexGraphics = new Phaser.Graphics()
      .beginFill(0x000000, 0.5)
      .drawRect(
        0,
        0,
        document.documentElement.clientWidth,
        document.documentElement.clientHeight + 200
      );
    let pausedMask = game.add.sprite(0, 0, hexGraphics.generateTexture());
    let gameOverText = game.add.text(0, 0, "谢谢参与！", {
      fill: "#FFF",
      fontSize: "60px",
      fontWeight: "bolder",
    });
    gameOverText.left = game.world.centerX - gameOverText.width / 2 + 20;
    gameOverText.top = game.world.centerY - gameOverText.height / 2 - 100;
    let exitButton = game.add.sprite(0, 0, "buttonExit");
    exitButton.top = game.world.centerY - exitButton.height / 2 + 100;
    exitButton.left = game.world.centerX - exitButton.width / 2;

    let exitClick = function () {
      let exitRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(
        exitButton
      );
      if (exitRect.contains(game.input.x, game.input.y)) {
        // game.paused = false;
        gameOverText.visible = false;
        pausedMask.visible = false;
        exitButton.visible = false;
        game.input.onDown.remove(exitClick, this);
        //TODO:需要添加关闭动作
        this.create();
        // window.location.replace(link);
      }
    };
    game.input.onDown.add(exitClick, this);
  };
};

//生成游戏
let game = null;
if (game == null) {
  game = new Phaser.Game(
    document.documentElement.clientWidth,
    document.documentElement.clientHeight,
    Phaser.AUTO,
    document.getElementById("gameScreen")
  );
  game.state.add("boot", states.boot.bind(game));
  game.state.add("preload", states.preload.bind(game));
  game.state.add("main", states.main.bind(game));
  game.state.start("boot");
}
