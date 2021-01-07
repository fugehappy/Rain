require([
    './script/lib/p2.js',
    './script/lib/phaser-split.js',
    './script/lib/pixi.js',
    './script/lib/countdown.js'
], function() {
    const awardComponent = {
        data: {
            isLogin: false,
            show: false,//显示弹窗
            showAward: false,
            time: 20,
            date: ''
        },
        mounted () {
            this.init()
        },
        beforeDestroy () {
        },
        methods: {
            init () {
                this.handleInit()
            },

            handleInit () {
                let self = this;
                Vue.nextTick(function () {
                    let data = new Date().valueOf() + self.time * 1000;
                    $('.timeBar').countdown(data.toString()).on('update.countdown', function (event) {
                        self.date = event.strftime('%S')
                    }).on('finish.countdown', function (event) {
                        if (self.showTime) {
                            self.show = false;
                        }
                    })
                })
            },

            showPopup () {

            }
        }
    }

    document.querySelector('#rain') && new Vue({
        el: "#rain",
        mixins: [awardComponent]
    })
})