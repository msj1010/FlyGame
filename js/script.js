/* 初始化*/
/*全局变量*/
var self = null;/*全局定时器*/
var self2 = null;/*产生敌机定时器*/
var self3 = null;/*循环检测是否选择关卡定时器*/
var currentExperience = 0;
var totalExperience = 1500;
var currentLifeValue = 1500;
var totalLifeValue = 1500;
var SpeedOfCreate = 0;
var SpeedOfMove = 0;
var level = 1;/*通关模式时 默认为1级 无限模式时为-1*/
var score = 0;
var hasStarted = false;
var currentInput = null;
var prevInput = '#';
// 创建战机
var view = document.getElementById("view");
var flyEle = document.createElement("div");
flyEle.id = 'fly_me';
view.appendChild(flyEle);
/*处理输入*/
document.onkeydown = function(e){
    var code = e.charCode || e.keyCode;
    currentInput = code;
    //处理大小写情况
    if(code >= 97&& code <= 122)
        code -= 32;
    var character = String.fromCharCode(code);
    var foe = document.getElementsByClassName(character)[0];
    if(foe != undefined ){
        if(currentInput != prevInput){
            moveFly(foe.offsetLeft);
            createBullet(objB,foe,foe.offsetLeft);
            prevInput = currentInput;
        }
    }else{
        if(getGameModel() == 2 && hasStarted){
            score = score > 0? score - 15 : 0;
            $("#point").text(score+"");
            $("#addScore").text("-15");
            $("#addScore").fadeIn(150);
            $("#addScore").animate({"font-size":"0"},700,function () {
                $("#addScore").hide();
                $("#addScore").css({"font-size":"32px"});
            });

        }
    }
}
sessionStorage.setItem("canClose","false");
// 创建子弹
var objB = { //子弹的相关值
    name: 'bullet',
    num: 1,
    arr: [],// ['id|top|left']
    width: 50,
    height: 50,
    path: 'images/bullet.png'
};
// 创建敌机
var objF = {
    name: 'foe',
    num: 1,
    arr: [],// ['id|top|left|character']
    width: 35,
    height: 59,
    path: 'images/flyscript.png'
};
var radius = 20;
$(function(){
    //var str = $("#level").html();
    var showSpeed = 180;
    $("#startGame").on("click",function(){
        startGame(25);
        $(".btngroup").fadeOut(showSpeed);
        $(".mask").hide();
        $("#endGame").show();
    });
    $("#endGame").on("click",function(){
        exitGame();
        $(this).hide();
        $(".mask").show();
        $(".btngroup").fadeIn(showSpeed);
    });

    $("#setModel").on("click",function (){
        layer.open({
            type:2,
            title:"请选择游戏等级",
            area:['420px','265px'],
            content:["select.html","no"],
            anim:3
        });
        self3 = setInterval(function () {
            if(sessionStorage.getItem("canClose") == "true"){
                $(".layui-layer-close1").click();
                sessionStorage.setItem("canClose","false");
                clearInterval(self3);
            }
        },200);
    });
    $("#queryList").on("click",function () {
        layer.open({
            type: 0,
            title:'游戏榜单',
            area: ['420px', '340px'], //宽高
            content:$("#playerList").html(),
            anim:4
        });
    });
    $("#Method").on("click",function () {
        layer.open({
            type: 1,
            shade: false,
            title: false, //不显示标题
            content: $("#tips"),
            anim:2
        });
    })
});