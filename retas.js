var retas = [[[400,100], [400,300]]];
var moving = false;
var r1 = [];
var moving_type=0;
var x_antigo, y_antigo;
function main(tipo){
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	//var e = event || window.event;
	canvas.oncontextmenu = function (){return false;}
	atualiza();
	canvas.addEventListener('mousedown', down, false);
	canvas.addEventListener('mouseup'  , up  , false);
	canvas.addEventListener('mousemove', move, false);
	if (tipo=="insere"){
		insere_poligono();
	}
	function pos(event){
		var e = event || window.event;
		x = e.pageX - canvas.offsetLeft;
		y = e.pageY - canvas.offsetTop;
		return {x:x,y:y};
	}
	function incid1(p, reta){
		var pi = {x:reta[0][0],y:reta[0][1]};
		var pf = {x:reta[1][0],y:reta[1][1]};
		var dist1 = parseInt((dist(pi, p).toFixed(1)));
		var dist2 = parseInt((dist(p, pf).toFixed(1)));
		var dist4 = parseInt(dist1)+parseInt(dist2);
		var dist3 = parseInt(dist(pi, pf).toFixed(1));
		if(dist4==dist3){
			moving=true;
			if (dist1<5){ //ponta inicial
				return {t:0, fixo:pf};
			}else if (dist2<5) { //ponta final
				return {t:1, fixo:pi};
			}else{ //meio
				return {t:2, fixo:""};
			}
		}
		return {t:-1}; //fora
	}
	function dist(p1, p2) {
		return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
	}
	function lbtn(p){
		for (i in retas){
		  if (moving==false){
			var r = incid1(p,retas[i]);
			if (r.t==0 || r.t==1){//mover apenas uma ponta
				r1 = r.fixo;
				moving_type=1;
				retas.splice(i,1);
				console.log("reta: "+i);
				break;
			}else if (r.t==2){//mover reta inteira
				r1 = retas[i];
				moving_type=2;
				x_antigo=p.x;
				y_antigo=p.y;
				retas.splice(i,1);
				break;
			}
		  }
		}
	}
	function incid2(p, reta){
		var pi = {x:reta[0][0],y:reta[0][1]};
		var pf = {x:reta[1][0],y:reta[1][1]};
		var dist1 = parseInt((dist(pi, p).toFixed(1)));
		var dist2 = parseInt((dist(p, pf).toFixed(1)));
		var dist4 = parseInt(dist1)+parseInt(dist2);
		var dist3 = parseInt(dist(pi, pf).toFixed(1));
		if(dist4==dist3){ //esta em uma reta
			if (dist1>5 && dist2>5){//só pra não ficar retas curtinhas
				return 1;
			}
		}
		return 0; //fora
	}
	function rbtn(p){
		for (i in retas){
			var r = incid2(p,retas[i]);
			if (r==1){//quebrar linha
				r1 = retas[i];
				retas.splice(i,1);
				retas.push([r1[0], [p.x+2,p.y]]);
				retas.push([r1[1], [p.x-2,p.y]]);
				atualiza();
				break;
			}
		}
	}
	function down(event){
		var e = event || window.event;
		var p = pos(e);
		switch (e.which) {
			case 1://bt esquerdo
				lbtn(p);
				break;
			case 3://bt direito
				rbtn(p);
				break;
		}
	}
	function up(event){
		var e = event || window.event;
		var p = pos(e);
		document.getElementById("texto").innerHTML = "Soltou em x,y: ("+p.x+","+p.y+")";
		moving=false;
		if (moving_type==1){//movendo apenas uma ponta
			retas.push([[r1.x,r1.y],[p.x, p.y]]);
			moving_type=0;
		}else if (moving_type==2){//movendo reta inteira
			var dif_x = x_antigo-p.x;
			var dif_y = y_antigo-p.y;
			retas.push([[r1[0][0]-dif_x,r1[0][1]-dif_y], [r1[1][0]-dif_x,r1[1][1]-dif_y]]);
			moving_type=0;
		}
	}
	function move(event){
		var e = event || window.event;
		var p = pos(e);
		document.getElementById("texto").innerHTML = "x,y: ("+p.x+","+p.y+")";
		if (moving==true){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.beginPath();
			if (moving_type==1){//movendo apenas uma ponta
				ctx.moveTo(r1.x,r1.y);//pto inicial
				ctx.lineTo(p.x,p.y);//pto final
				ctx.lineWidth = 4;
				ctx.stroke();
			}if (moving_type==2){//movendo reta inteira
				var dif_x = x_antigo-p.x;
				var dif_y = y_antigo-p.y;
				ctx.moveTo(r1[0][0]-dif_x,r1[0][1]-dif_y);//pto inicial
				ctx.lineTo(r1[1][0]-dif_x,r1[1][1]-dif_y);//pto final
				ctx.lineWidth = 4;
				ctx.stroke();
			}
			atualiza();
		}
	}
  function insere_poligono(){
		var n = document.getElementById("lados").value;
		var canvas = document.getElementById("myCanvas");
		var ctx = canvas.getContext("2d");
		ctx.clearRect(0,0, canvas.width, canvas.height);
		if (n==3){
				retas.push([[200,100],[600,100]],[[600,100],[400,300]],[[401,300],[200,100]]);
				atualiza();
		}else if (n==4){
				retas.push([[200,100],[600,100]],[[600,100],[600,300]],[[600,300],[200,300]],[[200,300],[200,100]]);
				atualiza();
		}else if (n==5){
				retas.push([[400,100],[500,200]], [[500,200],[460,300]], [[460,300],[340,300]], [[340,300],[300,200]], [[300,200],[400,100]]);
				atualiza();
		}else if (n==6){
				retas.push([[350,100],[450,100]], [[450,100],[500,200]],
							[[500,200],[460,300]],[[460,300],[340,300]],
							[[350,300],[450,300]],[[340,300],[300,200]],[[300,200],[350,100]]);
				atualiza();
		}else if (n==7){
				retas.push([[400,100],[500,150]], [[400,100],[300,150]], [[500,150],[525,225]],
						   [[300,150],[275,225]], [[525,225],[475,300]], [[275,225],[325,300]], [[325,300],[475,300]]);
				atualiza();
		}else if (n==8){
				retas.push([[350,100],[450,100]],
						   [[500,160],[500,230]], [[500,160],[450,100]], [[300,230],[350,300]],
						   [[300,160],[300,230]], [[300,160],[350,100]], [[500,230],[450,300]],
						   [[450,300],[350,300]]);
				atualiza();
		}
	}
	function atualiza(){
		for (r in retas){
			ctx.moveTo(retas[r][0][0],retas[r][0][1]);//pto inicial
			ctx.lineTo(retas[r][1][0],retas[r][1][1]);//pto final
			ctx.lineWidth = 4;
			ctx.stroke();
		}
	}
}
