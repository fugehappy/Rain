require(["./script/lib/countdown.js"], function () {
  const awardComponent = {
    data: {
      isLogin: false,
      show: false, //显示弹窗
      showAward: false,
      time: 20,
      date: "",
      bgRainer: "../images/bg-rainer.jpg",
      redpacket: "../images/redpacket.png",
      close: "../images/close.png",
      dialogExit: "../images/dialog-exit.png",
      buttonExit: "../images/button-exit.png",
      openRedpacket: "../images/open-redpacket.png",
      open: "../images/open.png",
      redpacketResult: "../images/redpacket-result.png",
      buttonContinue: "../images/button-continue.png",
      prizeImg: "../images/prize.png",
      states: {},
      redInitGroup: {},
      hitNum: 0,
      config: {
        selfPool: 40,
        selfPic: "redpacket",
        rate: 0.5,
        maxSpeed: 600,
        minSpeed: 250,
        max: 70,
      },

      ids: [0],
      redpackets: ["奖池"],
      time: 10,
      getIds: [],
      e: {},
    },
    mounted() {
      this.initialize();
    },
    beforeDestroy() {},
    methods: {
      initialize() {
        this.handleInit();
        this.startGameInit();
      },

      handleInit() {
        let self = this;
        Vue.nextTick(function () {
          let data = new Date().valueOf() + self.time * 1000;
          $(".timeBar")
            .countdown(data.toString())
            .on("update.countdown", function (event) {
              self.date = event.strftime("%S");
            })
            .on("finish.countdown", function (event) {
              if (self.showTime) {
                self.show = false;
              }
            });
        });
      },
      //红包初始化
      init () {
        this.config = config;
        redInitGroup = game.add.group();
        redInitGroup.enableBody = true;
        redInitGroup.createMultiple(config.selfPool, config.selfPic); //初始化多个红包
        redInitGroup.setAll("anchor.y", 1);
        redInitGroup.setAll("outOfBoundsKill", true);
        redInitGroup.setAll("checkWorldBounds", true);
        this.maxWidth = game.width + 100;
    
        game.time.events.loop(
          Phaser.Timer.SECOND * config.rate,
          this.createRI,
          this
        );
      },
      //创建随机红包
      createRI () {
        e = redInitGroup.getFirstExists(false);
    
        if (e) {
          if (hitNum >= config.max) {
            return;
          }
          hitNum++;
          e.events.onInputDown.removeAll();
          //红包随机角度/随机大小
          var ram = Math.random() * 0.5 + 0.3;
          // console.log(ram);
          // ram = ram<0.2?ram+=0.2:ram;
          // ram = (0.2 - 0.6);
          e.loadTexture(this.config.selfPic);
          e.alpha = 1;
          e.angle = Math.random() * (45 - -45) - 45;
          e.scale.setTo(ram);
          //红包生成的位置、红包移动的速度
          e.reset(game.rnd.integerInRange(100, this.maxWidth - 100), 0);
          e.body.velocity.x = game.rnd.integerInRange(-100, 100);
          e.body.velocity.y = game.rnd.integerInRange(
            config.minSpeed,
            config.maxSpeed
          );
          e.inputEnabled = true;
          e.events.onInputDown.add(this.hitted, this);
        }
      },
      //拆红包
      hitted (sprite) {
        //设置红包概率
        if (Math.random() < 1 / 4 && ids.length > 0) {
          sprite.kill();
    
          //点击获得红包,游戏暂停
          game.paused = true;
    
          //拆红包背景
          let hexGraphics3 = new Phaser.Graphics()
            .beginFill(0x000000, 0.5)
            .drawRect(
              0,
              0,
              document.documentElement.clientWidth,
              document.documentElement.clientHeight
            );
          let pausedMask3 = game.add.sprite(0, 0, hexGraphics3.generateTexture());
    
          let openDialog = game.add.sprite(62, 150, "openRedpacket");
          openDialog.scale.setTo(0.8);
          openDialog.top = game.world.centerY - openDialog.height / 2;
          openDialog.left = game.world.centerX - openDialog.width / 2;

          let open = game.add.sprite(130, 450, "open");
          open.scale.setTo(0.5);
          open.top = game.world.centerY - open.height / 2 + 50;
          open.left = game.world.centerX - open.width / 2;
          open.inputEnabled = true;
    
          let prizeImg = game.add.sprite(62, 150, "prizeImg");
          prizeImg.scale.setTo(0.8);
          prizeImg.top = game.world.centerY - prizeImg.height / 2;
          prizeImg.left = game.world.centerX - prizeImg.width / 2;
          prizeImg.visible = false;
    
          // let prizeImg = {};
          let link = "https://www.baidu.com";
    
          //拆红包
          let clickOpen = function () {
            //游戏暂停时,点击事件无效,只能通过这种画热点的形式来绑定事件
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
                // open.scale.setTo(0.5);
                open.width = currentWidth / tempArr[index];
                open.height = open.height;
                open.left = game.world.centerX - open.width / 2;
                open.top = game.world.centerY - open.height / 2 + 50;
    
                ++index;
              }, 80);
              game.input.onDown.remove(clickOpen, this);
              //取出奖品
              let arrIndex = Math.floor(Math.random() * ids.length);
              let redpacketId = ids.splice(arrIndex, 1);
              getIds.push(redpacketId[0]);
    
              setTimeout(() => {
                timer && clearInterval(timer);
                // let prize = redpackets[redpacketId[0]];
                // prizeImg = game.add.sprite(0, 0, "prizeImg");
                // prizeImg.scale.setTo(0.8);
                // prizeImg.top = game.world.centerY - prizeImg.height / 2;
                // prizeImg.left = game.world.centerX - prizeImg.width / 2;
    
                openDialog.visible = false;
                open.visible = false;
                prizeImg.visible = true;
                game.input.onDown.add(clickButton, this);
              }, 1500);
            }
          };
    
          let clickButton = function () {
            let prizeImgRect = new Phaser.Rectangle(78, 445, 194, 66).copyFrom(
              prizeImg
            );
            if (prizeImgRect.contains(game.input.x, game.input.y)) {
              window.location.replace(link);
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
      },
      redInit(config, game) {
        //初始化
        this.init(),
        //创建随机红包
        this.createRI(),
        //点红包事件
        this.hitted(),
        this.fade = function (sprite) {
          var tween = game.add.tween(sprite).to({ alpha: 0 }, 300, "Linear", true);
          tween.onComplete.add(this.killed, this, sprite);
        };
        this.killed = function (sprite) {
          sprite.kill();
        };
      },
      startGameInit() {
        this.states.boot = function (game) {
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
        this.states.preload = function (game) {
          this.preload = function (game) {
            //加载图片
            game.load.image("bgRainer",rain.bgRainer);
            game.load.spritesheet("redpacket", rain.redpacket, 144, 173, 2);
            game.load.image("close", rain.close);
            game.load.image("dialogExit", rain.dialogExit);
            game.load.image("buttonExit", rain.buttonExit);
            game.load.image("openRedpacket", rain.openRedpacket);
            game.load.image("open", rain.open);
            game.load.image("buttonContinue", rain.buttonContinue);
            game.load.image("prizeImg", rain.prizeImg);
          };
          this.create = function () {
            game.state.start("main");
          };
        };
      
        this.states.main = function (game) {
          this.create = function () {
            // 物理系统
            game.physics.startSystem(Phaser.Physics.ARCADE);
      
            this.startGame();
          };
      
          this.startGame = function () {
            this.leftTime = rain.time;
            let bgRainer = game.add.sprite(0, 0, "bgRainer");
            bgRainer.width = game.width;
            bgRainer.height = game.height;
            this.createRedInit();
      
            //添加按钮,并绑定事件
            let closeImg = game.add.button(
              40,
              40,
              "close",
              function () {
                game.paused = true;
                pausedMask4.visible = true;
                exitDialog.visible = true;
                exitButton.visible = true;
                goOn.visible = true;
      
                game.input.onDown.add(buttonClick, this);
              }.bind(this)
            );
            closeImg.scale.setTo(0.7);
      
            // 剩余时间
            this.leftTimeText = game.add.text(0, 0, this.leftTime, {
              fill: "#FFF",
              fontSize: "40px",
              fontWeight: "bolder",
            });
            this.leftTimeText.scale.setTo(0.8);
            this.leftTimeText.fixedToCamera = true;
            this.leftTimeText.cameraOffset.setTo(game.camera.width - 60, 40);
      
            let hexGraphics4 = new Phaser.Graphics()
              .beginFill(0x000000, 0.5)
              .drawRect(
                0,
                0,
                document.documentElement.clientWidth,
                document.documentElement.clientHeight
              );
            let pausedMask4 = game.add.sprite(0, 0, hexGraphics4.generateTexture());
            pausedMask4.visible = false;
      
            let exitDialog = game.add.sprite(62, 150, "dialogExit");
            exitDialog.scale.setTo(0.5);
            exitDialog.top = game.world.centerY - exitDialog.height / 2;
            exitDialog.left = game.world.centerX - exitDialog.width / 2;
            exitDialog.visible = false;
      
            let exitButton = game.add.button(80, 315, "buttonExit");
            exitButton.scale.setTo(0.5);
            exitButton.top = game.world.centerY - exitButton.height / 2 + 80;
            exitButton.left = game.world.centerX - exitButton.width - 10;
            exitButton.visible = false;
      
            let isExit = false;
            let goOn = game.add.sprite(0, 0, "buttonContinue");
            goOn.scale.setTo(0.5);
            goOn.top = game.world.centerY - goOn.height / 2 + 80;
            goOn.right = game.world.centerX + goOn.width + 10;
            goOn.visible = false;
      
            game.time.events.repeat(
              Phaser.Timer.SECOND,
              this.leftTime,
              this.refreshTime,
              this
            );
      
            let buttonClick = function () {
              let goOnRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(goOn);
              let exitRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(
                exitButton
              );
              if (goOnRect.contains(game.input.x, game.input.y)) {
                game.input.onDown.remove(buttonClick, this);
                game.paused = false;
                pausedMask4.visible = false;
                exitDialog.visible = false;
                exitButton.visible = false;
                goOn.visible = false;
              } else if (exitRect.contains(game.input.x, game.input.y)) {
                game.input.onDown.remove(buttonClick, this);
                game.paused = false;
                pausedMask4.visible = false;
                exitDialog.visible = false;
                exitButton.visible = false;
                goOn.visible = false;
              }
            };
          };
          //红包密度
          this.createRedInit = function () {
            this.redinit = new redInit(rain.config, game);
            this.redinit.init();
            this.redinit = new redInit(rain.config, game);
            this.redinit.init();
          };
      
          this.refreshTime = function () {
            this.leftTime--;
            var tem = this.leftTime;
            this.leftTimeText.text = tem;
            if (this.leftTime === 0) {
              // game.paused = true;
              this.gameOver();
            }
          };
          //游戏结束
          this.gameOver = function () {
            game.paused = true;
            let hexGraphics2 = new Phaser.Graphics()
              .beginFill(0x000000, 0.5)
              .drawRect(
                0,
                0,
                document.documentElement.clientWidth,
                document.documentElement.clientHeight + 200
              );
            let pausedMask2 = game.add.sprite(0, 0, hexGraphics2.generateTexture());
            let gameOverText = game.add.text(0, 0, "谢谢参与！", {
              fill: "#FFF",
              fontSize: "60px",
              fontWeight: "bolder",
            });
            gameOverText.left = game.world.centerX - gameOverText.width / 2 + 20;
            gameOverText.top = game.world.centerY - gameOverText.height / 2 - 100;
            let goOn = game.add.sprite(0, 0, "buttonContinue");
            goOn.top = game.world.centerY - goOn.height / 2 + 100;
            goOn.left = game.world.centerX - goOn.width / 2;
      
            let goOnClick = function () {
              let goOnRect = new Phaser.Rectangle(200, 315, 194, 66).copyFrom(goOn);
              if (goOnRect.contains(game.input.x, game.input.y)) {
                // game.paused = false;
                gameOverText.visible = false;
                pausedMask2.visible = false;
                goOn.visible = false;
                game.input.onDown.remove(goOnClick, this);
                //重新初始化游戏
                reInitGame();
              }
            };
            game.input.onDown.add(goOnClick, this);
          };
        };
        function reInitGame() {
      
          game.state.remove("boot", states.boot.bind(game));
          game.state.remove("preload", states.preload.bind(game));
          game.state.remove("main", states.main.bind(game));
          // game.state.stop("boot");
          game = null;
          startGameInit();
        }
      
        //生成游戏
        let game = null;
        if (game == null) {
          game = new Phaser.Game(
            document.documentElement.clientWidth,
            document.documentElement.clientHeight,
            Phaser.AUTO,
            document.getElementById("#rain")
          );
          game.state.add("boot", this.states.boot.bind(game));
          game.state.add("preload", this.states.preload.bind(game));
          game.state.add("main", this.states.main.bind(game));
          game.state.start("boot");
        }
      }
    },
  };

  if(document.querySelector("#rain")) {
    
    window.rain = new Vue({
      el: "#rain",
      mixins: [awardComponent],
    });
  }
});