var c,ctx;
var characterAssetsData,myCharacter;
var background
var state = {
	jalanHorizontal : {
		kiri : "kiri",
		kanan : "kanan"
	},
	jalanVertikal : {
		atas : "atas",
		bawah : "bawah"
	},
	diam : "diam",
	negative : -1,
	positive : 1
}

window.onload = function(){
	
	var windowHeight = window.innerHeight;
	var windowWidth = window.innerWidth;
	
	c = document.getElementById("canvas");
	
	c.width = windowWidth;
	c.height = windowHeight;
	ctx = c.getContext("2d");
	
	
	myCharacter = new MyCharacter();

	document.addEventListener("mousemove",function(e){		
		myCharacter.destX = e.clientX;
		if( document.querySelectorAll(".modal-in").length == 0 ){
			myCharacter.callout.setDefaultMessage();
		}
	})
	
	document.addEventListener('keydown',function(e){
		
		switch( e.keyCode ){
			case 39 : 
				myCharacter.activeState = state.jalanHorizontal.kanan;			
				break;
			case 37 : 
				myCharacter.activeState = state.jalanHorizontal.kiri;							
				break;				
			default :
				myCharacter.activeState = state.diam;
			break;
		}
	});
	
	document.addEventListener('keyup',function(e){		
		myCharacter.activeState = state.diam;		
	})
	
	gameLoop();
	
	/* main js */
	var mainModal = document.getElementById("md0");
	var btnAction = document.querySelectorAll(".btn-action");
	for( var i = 0; i < btnAction.length;i++ ){
		btnAction[i].addEventListener("click",function(){
			var data = {
				modalTarget : this.getAttribute("data-modal-target"),
				title : this.getAttribute("data-title"),
				content : this.getAttribute("data-content")
			}
			
			myCharacter.callout.setText([ this.getAttribute("data-ket") ]);
			showModal(data);
		})
		
	}
	
	var closeBtn = document.querySelectorAll(".close-btn");
	
	for( var i = 0; i < closeBtn.length;i++ ){
		closeBtn[i].addEventListener("click",function(){
			var data = {
				modalTarget : this.getAttribute("data-id"),
			}
			
			hideModal(data);
		})		
	}
	
//	for( var i = 0; i  )
}


/* appjs */
function showModal(data){
	var modal = document.getElementById(data.modalTarget);
	var resource = document.getElementById(data.content).innerHTML;
	modal.className="modal modal-in";
	document.querySelectorAll("#"+data.modalTarget+" .modal-header")[0].innerHTML = data.title;
	document.querySelectorAll("#"+data.modalTarget+" .modal-body")[0].innerHTML = resource;
	
}


function hideModal(data){	
	var modal = document.getElementById(data.modalTarget);
	modal.className="modal";
}
/* ------ end appjs ------ */

/* animasi */

var MyCharacter  = function(){
		this.width = 128;
		this.height = 192;
		this.widthFrame = 4;
		this.heightFrame = 4;
		this.currentIndexWidth = 2;
		this.currentIndexHeight = 0;
		this.zoom = 1.2;
		this.source = "resource/img/sprite.png";
		this.img;
		this.callout;
		this.x = 0,
		this.y = canvas.height - (canvas.height * 0.2);
		this.destX;
		this.destY;
		this.activeState = state.diam;
		this.walkStep = 10;
		this.draw = function(ctx){
			
			var context = this;
			
			if( typeof this.img == 'undefined' ){
				this.img = new Image();
				this.img.src = this.source;
				
				this.img.onload = function(){
					context.drawImage(ctx);
				}				
			}else{
				this.drawImage(ctx);				
			}
			
	
		}
		
		this.setStepX = function(index){
			this.x += ( index * this.walkStep );
			if( this.x < 0 ){
				this.x = 0;
			}
			
			if( this.x > (canvas.width - this.getWidthPerFrame())){
				this.x = canvas.width - this.getWidthPerFrame();
			}
		}
		
		this.setStepY = function(index){
			this.y += ( index * this.walkStep );			
		}
		
		this.drawImage = function(ctx){
			
			
			if( typeof this.destX  != 'undefined' || !isNaN(this.destX)){
				var destXCalc =  Math.floor(this.destX / this.walkStep) * 10; 
				if( destXCalc != this.x ){
					this.activeState = destXCalc >= this.x ? state.jalanHorizontal.kanan : state.jalanHorizontal.kiri;				
				}else{
					this.activeState = state.diam;
//					alert('called');
					this.destX = undefined;
				}
			}else{
			}
			
			this.setSpritePos();
			
			if( this.activeState != state.diam ){
				this.setStepX( this.activeState == state.jalanHorizontal.kanan ? 1 : -1 );
			}
			
			ctx.drawImage(this.img,
			( this.currentIndexWidth * this.getWidthPerFrame()  ),
			( this.currentIndexHeight * this.getHeightPerFrame()  ),		
			this.getWidthPerFrame(),
			this.getHeightPerFrame(),
			this.x,
			this.y,
			this.getWidthPerFrame() * this.zoom,
			this.getHeightPerFrame() * this.zoom);						
			
			if( this.activeState == state.diam ){
				if( typeof this.callout == 'undefined' ){
					this.callout = new Callout();
					this.callout.setWidth(200);
					this.callout.setHeight(150);
//					this.callout.setIsCanChange(true,50);
					this.callout.setFontSize(17);
					this.callout.setText(["Selamat Datang,-Klik menu-atas"]);
				}				
				this.callout.draw(this.x,this.y,this.getWidthPerFrame());
			}

			
		};
		
		this.setSpritePos = function(){
			
			if( this.activeState == state.diam ){
				this.currentIndexHeight = 0;
				this.currentIndexWidth = 2;				
			}				
			if( (this.activeState == state.jalanHorizontal.kanan) || (this.activeState == state.jalanHorizontal.kiri) ){
				
				this.currentIndexHeight = this.activeState == state.jalanHorizontal.kanan ? 2 : 1;
				
				
				if( this.isStateDiam() ){
					
					this.currentIndexWidth = 0;
				}

				if( ( this.currentIndexWidth + 1 ) >= this.widthFrame){
					this.currentIndexWidth = 0;
				}else{
					this.currentIndexWidth++;					
				}
				
			}else{
				if( this.isStateDiam() ){
					this.currentIndexHeight = this.activeState == state.jalanVertikal.atas ? 3 : 0;
					this.currentIndexWidth = 0;
				}

				if( ( this.currentIndexWidth + 1 ) >= this.widthFrame){
					this.currentIndexWidth = 0;
				}else{
					this.currentIndexWidth++;					
				}				
				
			}
			
		}
		
		this.isStateDiam = function(){
			return (this.currentIndexWidth == 3) && ( this.currentIndexHeight == 0 );
		}
		
		this.getWidthPerFrame = function(){
			return this.width / this.widthFrame;
		}

		this.getHeightPerFrame = function(){
			return this.height / this.heightFrame;
		}
		
}

var Callout = function(){
	this.resource = {
		right : "resource/img/callout-right.png",
		left : "resource/img/callout-left.png"
	};
	this.isCanChange = false;
	this.time = 1;
	this.timeChangeInMs = 1000;
	this.activeMessageIndex = 0;
	this.counter = 0;
	this.width = 0;
	this.fontSize = 13;
	this.height = 0 ;
	this.img;
	this.text;
	this.draw = function(x,y,widthObj){
		if( typeof this.img == 'undefined' ){
			this.img = new Image();
			this.img.src = this.resource.right;
		}
		
		if( ( x + this.width ) > canvas.width ){
			this.img.src = this.resource.left;
			x = x - this.width + widthObj;			
		}else{
			this.img.src = this.resource.right;			
		}
	
		if( typeof this.text != 'undefined' && this.text[this.activeMessageIndex].trim().length > 0){
		
			ctx.drawImage(this.img,
				0,0,
				this.img.width,this.img.height,
				x,y - this.height,
				this.width,this.height			
			);
			
			ctx.font = this.fontSize+"px Comic Sans Ms";
			var context = this;
			
			ctx.fillStyle = "black";
			this.text[this.activeMessageIndex].split("-").forEach(function(elem,itr){
				ctx.fillText(elem,x + 30,y - context.height + 40 + ( context.fontSize * itr ));									
			})
			
			if( this.isCanChange ){
				if( this.counter >= this.time ){
					this.activeMessageIndex++;
					if( this.activeMessageIndex > this.text.length - 1){
						this.text = undefined;
						this.activeMessageIndex = 0;						
					}
					this.counter = 0;
				}else{
					this.counter++;
				}
			}
		}
		
	}
	
	this.setFontSize = function(size){
		this.fontSize = size;
	}
	
	this.setDefaultMessage = function(){
		this.setText(['Selamat Datang,-Klik menu-atas']);
	}
	
	this.setIsCanChange = function(change,time){
		this.isCanChange = change;
		this.time = time;
	}
	
	this.setText = function(text){
		this.text = text;
	}
	
	this.getText = function(){
		return this.text;
	}
	
	this.setWidth = function(width){
		this.width = width;
	}
	
	this.setHeight = function(height){
		this.height = height;
	}
	
	this.getHeight = function(){
		return this.img.height;
	}

	this.getWidth = function(){
		return this.img.width;
	}
	
	this.getHighestChar = function(kataData){
		var highest = 0;
		for( var i = 0; i < kataData.length;i++ ){
			if( kataData[i].length > kataData[highest].length ){
				highest = i;			
			}			
		}
		
		return kataData[highest].length;
	}
}


function gameLoop(){	
	
		ctx.clearRect(0,0,canvas.width,canvas.height);		
	
		var top = new Image();
		top.src = "resource/img/top.png";
		ctx.drawImage(top,0,0,top.width,top.height,0,(canvas.height - canvas.height * 0.2 + myCharacter.getHeightPerFrame()) - top.height,canvas.width,top.height);

		background = new Image();
		background.src = "resource/img/ground.png";
		ctx.drawImage(background,0,0,background.width,background.height,0,(canvas.height - canvas.height * 0.2 + myCharacter.getHeightPerFrame()),canvas.width,canvas.height * 0.2);
		
		myCharacter.draw(ctx);	
		
		ctx.beginPath();
		ctx.arc(10, 10, canvas.height / 3, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'white';
		ctx.fill();
		
		setTimeout(gameLoop,1000/30);
}

/* endof animasi */