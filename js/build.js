var config = {
    row:6,
    column:7
}

var cubebox = {
    deg:0,
    forward : 0,// 0-up 1-left 2-bottom 3-right 
    topPos:23,
    leftPos:43,
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
        this.topPos += 42*y;
        this.leftPos += 42*x;

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
    var lineNum = val.split('\n').length;
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
    document.getElementById("execute").addEventListener("click",function(){
       var orders = document.getElementById("order").value.split('\n');
       for(var i=0;i<orders.length;i++){
           var command = order[i];
           cubebox[command](cube);
       }
       
    })
}

buildGrid();
init();