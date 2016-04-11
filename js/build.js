/*
不足之处：
由于将命令写到一个cubebox中，导致命令执行的同时，动画效果一同执行，
如果想预编译，让命令提前执行判断合法性，需要先执行一遍命令，看哪行出错，
这样的动画同时执行，就会变成编译到哪停止了，才显示哪行出错

关于下一个问题的思考：
新增的需求有：
1、新增元素“墙”，墙是正方形不可进入、越过的区域
2、新增修墙的指令，BUILD，执行指令时，会在当前方块面对的方向前修建一格墙壁，
如果被指定修墙的地方超过边界墙或者已经有墙了，则取消修墙操作，并调用浏览器的console.log方法打印一个错误日志
3、新增粉刷的指令，BRU color，color是一个字符串，保持和css中颜色编码一致。
执行指令时，如果当前方块蓝色边面对方向有紧相邻的墙，则将这个墙颜色改为参数颜色，如果没有，则通过调用浏览器的console.log方法，打印一个错误日志
4、尝试写一段代码，实现在空间内修建一个长长的五颜六色的墙或者有趣的图形
5、新增一个按钮，可以在空间内随机生成一些墙
6、增加一个指令：MOV TO x, y，会使得方块从当前位置移动到坐标为x，y的地方，移动过程中不能进入墙所在的地方，寻路算法请自行选择并实现，不做具体要求

增加墙的需求需要修改判函数执行的断合法性，由于现在版本通过判断边界的top和left值来实现
初步想法是在cubebox中增加一个变量position，记录在config中的row和column比如6和7就是一共42个方块中，具体在哪个方块上
墙即不可达的位置，需要一个wall的数组来存放哪个方块不可达，随机生成墙的时候，要注意从wall中没有的生成
build指令通过position和方块的forward来确定需要染色的方块，折算出需要染色的grid的方块id即可
*/
var config = {
    row:6,
    column:7
}

var cubebox = {
    deg:0,
    forward : 0,// 0-up 1-left 2-bottom 3-right 
    commandline:0,
    TURNLEFT:function(cube){
        this.forward++;
        if(this.forward==4){
            this.forward = this.forward - 4;
        }
        this.deg -= 90;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.commandline++;
    },
    TURNRIGHT:function(cube){
        this.forward--;
        if(this.forward==-1){
            this.forward = this.forward + 4;
        }
        this.deg += 90;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.commandline++;
    },
    TURNBACK:function(cube){
        this.forward = this.forward + 2;
        if(this.forward>3){
            this.forward = this.forward - 4;
        }
        if(this.forward<0){
            this.forward = this.forward + 4;
        }
        this.deg += 180;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.commandline++;
    },
    GO:function(cube){
        var next = this.At;
        if(this.forward == 0){
            this.topPos -= 42;
            if(this.topPos < 23){
               this.topPos += 42;
               this.error();
               return
            }
            cube.style.top = this.topPos + 'px';
        }else if(this.forward == 2){
            this.topPos += 42;
            if(this.topPos > 23+ 42*(config.column-1)){
               this.topPos -= 42;
               this.error();
               return
            }
            cube.style.top = this.topPos + 'px';
        }else if(this.forward == 1){
            this.leftPos -= 42
            if(this.leftPos<42){
               this.leftPos += 42
               this.error();
               return
            }
            cube.style.left = this.leftPos + 'px';
        }else if(this.forward == 3){
            this.leftPos += 42;
            if(this.leftPos> 43+42*(config.row-1)){
               this.leftPos -= 42;
               this.error();
               return
            }
            cube.style.left = this.leftPos + 'px';
        }   
        this.commandline++;
    },
    TRALEF:function(cube){
        this.leftPos -= 42
        if(this.leftPos<42){
            this.leftPos += 42;
            this.error();
            return
        }
        cube.style.left = this.leftPos + 'px';
        this.commandline++;
    },
    TRATOP:function(cube){
        this.topPos -= 42;
        if(this.topPos < 23){
            this.topPos += 42;
            this.error();
            return
        }
        cube.style.top = this.topPos + 'px';
        this.commandline++;
    },
    TRARIG:function(cube){
        this.leftPos += 42;
        if(this.leftPos> 43+42*(config.row-1)){
            this.leftPos -= 42;
            this.error();
            return
        }
        cube.style.left = this.leftPos + 'px';
        this.commandline++;
    },
    TRABOT:function(cube){
        this.topPos += 42;
        if(this.topPos > 23+ 42*(config.column-1)){
            this.topPos -= 42;
            this.error();
            return
        }
        cube.style.top = this.topPos + 'px';
        this.commandline++;
    },
    MOVLEF:function(cube){
        this.forward = 1;
        this.deg = -90;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.GO(cube);
        this.commandline++;
    },
    MOVTOP:function(cube){
        this.forward = 0;
        this.deg = 0;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.GO(cube);
        this.commandline++;
    },
    MOVRIG:function(cube){
        this.forward = 3;
        this.deg = 90;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.GO(cube);
        this.commandline++;
    },
    MOVBOT:function(cube){
        this.forward = 2;
        this.deg = 180;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        this.GO(cube);
        this.commandline++;
    },
    error:function(){
        console.log("err at "+(this.commandline+1));
        document.getElementById("linenum_"+(this.commandline+1)).style.backgroundColor = "#FF9A9A"
        return false;
    },
    init:function(cube){
        var startAt = Math.ceil(Math.random() * config.row * config.column) -1,//随机起始点
            forwardAT = Math.ceil(Math.random()*100);
        // 
        // this.deg = (-90)*forward;
        this.forward =  (forwardAT % 4);
        this.deg = (-90)*this.forward;
        cube.style.transform = "rotate(" + this.deg + "deg)";
        var x = startAt % config.row;
        var y = (startAt - x)/config.row;
        this.topPos = 23 + 42*y;
        this.leftPos = 43 + 42*x;

        cube.style.top = this.topPos + 'px';
        cube.style.left = this.leftPos + 'px';
    }
    
}

function buildGrid(){
    var row = config.row,
        column = config.column,
        htmlStr = "";
    htmlStr += '<div id="cube" class="cube"><div class="cube-bar"></div></div>';    
    htmlStr += '<div class="group"><div class="box-bord"></div>';   
    for(var i = 0;i<row;i++){
        htmlStr += '<div class="box-bord">'+(i+1)+'</div>';
    }
    htmlStr +='</div>';
    for(var i = 0;i<column;i++){
        htmlStr += '<div class="group"><div class="box-bord">'+(i+1)+'</div>';
        for(var j = 0;j<row;j++){
            htmlStr += '<div class="box"></div>';
        }
        htmlStr +='</div>';
    }
    document.getElementById("Grid").innerHTML = htmlStr;
}

function updateLineNumber(){
    var val = document.getElementById("order").value;
    var lineNum = val.split('\n').length+1;
    var temp = 1;
    var innerStr = '';
    while(temp!=lineNum){
        innerStr += '<li id="linenum_'+temp+'">'+temp+'</li>';
        temp++;
    }
    document.getElementById("line").innerHTML = innerStr;
}

function init(){
    var cube = document.getElementById("cube")
    cubebox.init(cube);
    //bind events
    document.getElementById("tl").addEventListener("click",function(){
        cubebox.TURNLEFT(cube);
    })
    document.getElementById("tr").addEventListener("click",function(){
        cubebox.TURNRIGHT(cube);
    })
    document.getElementById("tb").addEventListener("click",function(){
        cubebox.TURNBACK(cube);
    })
    document.getElementById("go").addEventListener("click",function(){
        cubebox.GO(cube);
    })
    document.getElementById("init").addEventListener("click",function(){
        cubebox.init(cube);
        document.getElementById("order").value = "";
        updateLineNumber();
    })
    document.getElementById("execute").addEventListener("click",function(){
       var orders = document.getElementById("order").value.split('\n');
       var i = 0;
       function al(){
           i++;
           if(i<=orders.length){
               setTimeout(function(){
                   var command = orders[i-1].replace(/\s/g, "").toUpperCase();
                   cubebox[command](cube);
                   al()
               },500)
           }
           
       }
       al();
       
    })
}

buildGrid();
init();

