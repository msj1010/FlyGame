
/*封装函数*/
function createBullet(obj,target,offsetLeft) {
    var flyEle = document.getElementById('fly_me');
    var ele = document.createElement('div');
    ele.id = obj.name + parseInt(target.id);
    var length = obj.arr.length;
        obj.arr[length] = ele.id + '|';
        obj.num++;
        ele.style.width = obj.width + "px";
        ele.style.height = obj.height + "px";
        ele.style.background = 'url(' + obj.path + ')';
        ele.style.top = '380px';
        ele.style.left = offsetLeft + 'px';
        obj.arr[length] = obj.arr[length] + ele.style.top + '|';
        obj.arr[length] = obj.arr[length] + ele.style.left ;
        ele.className = "bullet layui-anim layui-anim-up";
    view.appendChild(ele);
    if(getGameModel() == 2){
        score += 10;
        $("#point").text(score+"");
        $("#addScore").fadeIn(150);
        $("#addScore").animate({"font-size":"0"},700,function () {
            $("#addScore").text("+10");
            $("#addScore").hide();
            $("#addScore").css({"font-size":"32px"});
        });
        return;
    }
    currentExperience += 100;
    $("#currentExperience").text(currentExperience);
    $("#currentExperience").parent().parent().css("width",(currentExperience/totalExperience)*100+"%");

    if(currentExperience >= totalExperience && currentLifeValue > 0){
        exitGame();
        //如果是通关模式
            level ++;
            layer.confirm('恭喜您!成功升到'+level+"级,是否继续游戏?", {
                btn: ['继续','退出'] //按钮
            }, function(){
                layer.msg('继续游戏', {icon: 1});
                startGame(25);
            }, function(){
                layer.msg('退出游戏', {icon: 1});
                $("#endGame").click();
            });
    }
}

function moveFly(offsetLeft) {
    var $fly = $(flyEle);
    $fly.animate({left:offsetLeft+"px"},80);
}

function moveBullet() {
   for (var i = 0; i < objB.arr.length; i++) {
        var newArr = objB.arr[i].split('|');
        var eleB = document.getElementById(newArr[0]);
       //子弹上升的速度
        newArr[1] = parseInt(newArr[1]) - 20;
        console.log(newArr[1]);
        eleB.style.top = newArr[1] + 'px';
        objB.arr[i] = newArr[0] + '|' + newArr[1] + '|' + newArr[2];
        if (newArr[1] < 0) {
            objB.arr.splice(i, 1);
            var delEle = document.getElementById(newArr[0]);
            delEle.parentNode.removeChild(delEle);
        }
    }
}
//获取指定区间的随机数
function randomInRange(low,high){
    return Math.floor(Math.random() * (high -
    low + 1) + low);
}
function hasRepeated(obj,character) {
    var arr = [];
    for(var i = 0 ;i < obj.arr.length ;i++){
        var temp = obj.arr[i].split("|");
        if(temp[3] == character)
            return true;
    }
    return false;
}
function createFoe(obj,speed) {
    self2 = setInterval(function () {
    var flyEle = document.getElementById('fly_me');
    if (objF.num < 50) {
        var ele = document.createElement('div');
        ele.id = obj.name + obj.num;
        var length = obj.arr.length;
        var num = randomInRange(1,6);
        if (length < 50) {
            obj.arr[length] = ele.id + '|';
            obj.num++;
            ele.style.width = obj.width + "px";
            ele.style.height = obj.height + "px";
            ele.style.position = 'absolute';
            ele.style.background = 'url(' + obj.path + ')';
            ele.style.backgroundPosition = -((num - 1) % 3)*35 +"px"+" "+ (parseInt(-(num - 1) / 3) * 59)  +"px";
            ele.style.top = 0;
            var ran = Math.random() * 930;
            ele.style.left = ran + 'px';
            obj.arr[length] = obj.arr[length] + ele.style.top + '|';
            obj.arr[length] = obj.arr[length] + ele.style.left + '|';
            var character = String.fromCharCode(randomInRange(65,90));
            //保证同一时刻生成的字符唯一
            while(hasRepeated(objF,character)) {
                character = String.fromCharCode(randomInRange(65, 90));
            }
            ele.className = character + " foe";
            obj.arr[length] = obj.arr[length] + character;
            ele.innerHTML = character;
        }
        view.appendChild(ele);
    }
}, speed);
}
function stopCreateFoe() {
    clearInterval(self2);
    $(".foe").remove();
    objF.num = 1;
    objF.arr.length = 0;
}
function moveFoe(speed) {
    var flyEle = document.getElementById('fly_me');
    for (var i = 0; i < objF.arr.length; i++) {
        var newArr = objF.arr[i].split('|');
        var eleB = document.getElementById(newArr[0]);
        //敌机下落的速度
        newArr[1] = parseInt(newArr[1]) + speed;
        eleB.style.top = newArr[1] + 'px';
        objF.arr[i] = newArr[0] + '|' + newArr[1] + '|' + newArr[2];
        if (newArr[1] > view.offsetHeight - objF.height) {
            objF.arr.splice(i, 1);
            var delEle = document.getElementById(newArr[0]);
            delEle.parentNode.removeChild(delEle);
            if (getGameModel() != 2) {
                currentLifeValue -= 100;
                if (currentLifeValue <= 0) {
                    exitGame();
                    $("#currentLifeValue").parent().parent().css("width", "0%");
                    layer.alert("游戏结束!", {
                        skin: 'layui-layer-molv',
                        closeBtn: 0
                    });
                    $("#endGame").click();
                    return;
                }
                $("#currentLifeValue").text(currentLifeValue);
                $("#currentLifeValue").parent().parent().css("width", (currentLifeValue / totalLifeValue) * 100 + "%");
            }else {
                exitGame();
                layer.alert("游戏结束!您的得分是" + score + "分", {
                    skin: 'layui-layer-molv',
                    closeBtn: 0
                });
                $("#endGame").click();
                return;
            }
        }
    }
}
function getSpeedOfMove(level) {
    var speed = 0;
    if(level == -1){
        speed = 3;
    }else{
        if(level < 3)
            speed = 1;
        else if(level < 5)
            speed = 2;
        else if(level < 7)
            speed = 3;
        else if(level < 9)
            speed = 4;
        else
            speed = 4;
    }
    return speed;
}
function getGameModel() {
    var Model = sessionStorage.getItem("Model");
    if(Model != null && Model == "2")
        return 2;
    else
        return 1;
}
function startGame(second){
    hasStarted = true;
    console.log("StartGame");
    SpeedOfCreate = 1500;
    $("#fly_me").show();
    if(getGameModel() == 2){
        level = -1;
        $("#addScore").text("+10");
        $("#currentExperience").text("");
        $("#totalExperience").text("");
        $("#currentLifeValue").text("");
        $("#totalLifeValue").text("");
        $(".layui-progress").addClass("layui-disabled");
        $(".layui-progress").css({"opacity":"0.5"});
        $(".score").hide();
        score = 0;
    }else{
        $(".layui-progress").removeClass("layui-disabled");
        $(".layui-progress").css({"opacity":"1"});
        $(".score").fadeIn(100);
        totalExperience = 1500 + (level - 1) * 500;
        totalLifeValue = 1500 + (level - 1) * 250;
        $("#currentExperience").text(0);
        $("#totalExperience").text(totalExperience);
        $("#currentLifeValue").text(currentLifeValue);
        $("#totalLifeValue").text(totalLifeValue);
    }
    $("#currentExperience").parent().parent().css("width","0%");
    $("#currentLifeValue").parent().parent().css("width","100%");
    SpeedOfMove = getSpeedOfMove(level);
    currentLifeValue = totalLifeValue;
    currentExperience = 0;
        if(level > 0)
            $("#level").html(level);
        else
            $("#level").html("- - 生存模式");

        createFoe(objF,SpeedOfCreate);
        self = setInterval(function () {
            // 让子弹运动其起来
            moveBullet();
            // 让敌机运动起来
            moveFoe(SpeedOfMove);
            //检查边界
            checkBorder();
        }, second);
}
function exitGame(){
    hasStarted = false;

    $("#fly_me").hide();
    stopCreateFoe();
    clearInterval(self);
}
function checkBorder(){
    for (var i = 0; i < objF.arr.length; i++) {
        var newArr = objF.arr[i].split('|');
        var eleF = document.getElementById(newArr[0]);
        var xFS = parseInt(newArr[2]);
        var xFE = parseInt(newArr[2]) + objF.width;
        var yFS = parseInt(newArr[1]);
        var yFE = parseInt(newArr[1]) + objF.height;
        for (var j = 0; j < objB.arr.length; j++) {
            var newArr1 = objB.arr[j].split('|');
            var eleB = document.getElementById(newArr1[0]);
            var xB = parseInt(newArr1[2]);
            var yB = parseInt(newArr1[1]);
            var xCheck = xB > xFS - radius && xB < xFE + radius;
            var yCheck = yB > yFS - radius && yB < yFE + radius;
            if (xCheck && yCheck) {
                objF.arr.splice(i, 1);
                eleF.parentNode.removeChild(eleF);
                objB.arr.splice(j, 1);
                eleB.parentNode.removeChild(eleB);
            }
        }
    }
}
