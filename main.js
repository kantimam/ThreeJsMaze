function cell(y,x,size){
	this.x=x;
  this.y=y;
  
	this.size=size;
	this.visited=false;
	
	this.walls=[true,true,true ,true]
	this.wallMesh=[]
	this.returnedTo=false
	this.neighbors=[]
	this.color=[5,255,255,1]
  this.enter=[]
  this.material = new THREE.MeshPhongMaterial( { color: "rgb(250,250,250)"} );
				this.draw=function(){
					this.geometry = new THREE.BoxGeometry( size,2,0.01);
          //top wall at origin
          if(this.walls[0]){
            this.wallMesh.push(new THREE.Mesh( this.geometry, this.material ))
					  this.wallMesh[0].position.x=this.x;
					  this.wallMesh[0].position.z=this.y;
          }
          //right wall rotated by 90deg
          if(this.walls[1]){
            this.wallMesh.push(new THREE.Mesh( this.geometry, this.material ))
					  this.wallMesh[1].position.x=this.x+size/2;
					  this.wallMesh[1].position.z=this.y+size/2;
            this.wallMesh[1].rotation.y=90*Math.PI/180;
          }
          //bottom wall 
          if(this.walls[2]){
            this.wallMesh.push(new THREE.Mesh( this.geometry, this.material ))
					  this.wallMesh[2].position.x=this.x;
				  	this.wallMesh[2].position.z=this.y+size;
          }
          //left wall rotated by 90deg
          if(this.walls[3]){
            this.wallMesh.push(new THREE.Mesh( this.geometry, this.material ))
				  	this.wallMesh[3].position.x=this.x-size/2;
					  this.wallMesh[3].position.z=this.y+size/2;
				  	this.wallMesh[3].rotation.y=90*Math.PI/180;
          }
					//add all walls to the scene
					this.wallMesh.forEach(element=>scene.add(element))
        }
  }

  // helper function to create 1d and 2d version of 2d array
  TwoDimArray=(y,x,mode)=>{
    let output=[]
    let flatArray=[]
    for(let j=0;j<y;j++){
      output[j]=[]
      for(let i=0;i<x;i++){
        output[j].push(new cell(j,i,1))
        flatArray.push(new cell(j,i,1))
    }
    }
    if(mode){
      return flatArray
    }
    else{
      return output
    }
    
  }

const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
      const controls = new THREE.OrbitControls( camera );
      worldOffset={x:0,y:0}


      /* create renderer with its canvas and append it to the dom */
			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
      document.body.appendChild( renderer.domElement );

      /* create outer box */
			const worldMesh= new THREE.Mesh( new THREE.BoxGeometry(80,80,80) , new THREE.MeshPhongMaterial({color:0xfffff0,side: THREE.BackSide }))

      /* create geometry to track the current node */
			const trackerMesh = new THREE.Mesh( new THREE.SphereGeometry( 1,120,120 ), new THREE.MeshPhongMaterial( { color: "rgb(250,250,250)"} ) );
      
      const light = new THREE.PointLight( 0xffffff, 1, 0,1 );
			light.position.set( 20, 30, 20 );
      
      /* add stuff to the scene so it can be used */
      scene.add( light );
			scene.add( trackerMesh );
      scene.add( worldMesh );
      
      worldMesh.position.x=24;
      worldMesh.position.z=24;
      worldMesh.position.y=40;
			camera.position.z = 5
			camera.position.y=5;
      
      /* update orbit controlls */
      controls.update()

			
      
      // set up array size here
			let twoDimCube=TwoDimArray(38,38,0)
      twoDimCube.forEach(array=>array.forEach(cell=>cell.draw())) 
      //createMazeTwoDim(twoDimCube,4)
      //twoDimCube.forEach(array=>array.forEach(cell=>cell.draw()))        
      
      
      // takes 2 dim array of cells and creates as maze
      function createMazeTwoDim(inputArr){
        // setup
        //this.x=13;  
        let mazePath=[]
        //console.log(inputArr)
        let currentCell=inputArr[0][0]
        let i=0;
        let newVisitedCells=1;
        this.mazeCreated=false;
        
        //create maze step
        this.createMaze=function(){
          //console.log(i)
          if(newVisitedCells>=((inputArr.length*inputArr[0].length))){
            /* clearInterval(createMaze) */
            this.mazeCreated=true;
            console.log('maze created')
            
          }
          if(currentCell!==undefined){
            let cY=currentCell.y
            let cX=currentCell.x
            currentCell.enter.push(i)
          if(inputArr[cY-1]!==undefined && !inputArr[cY-1][cX].visited){
            currentCell.neighbors.push(inputArr[cY-1][cX])
          }
          if(inputArr[cY][cX+1]!==undefined && !inputArr[cY][cX+1].visited){
            currentCell.neighbors.push(inputArr[cY][cX+1])
          }
          if(inputArr[cY+1]!==undefined && !inputArr[cY+1][cX].visited){
            currentCell.neighbors.push(inputArr[cY+1][cX])
          }
          if(inputArr[cY][cX-1]!==undefined && !inputArr[cY][cX-1].visited){
            currentCell.neighbors.push(inputArr[cY][cX-1])
          }
          currentCell.visited=true;
          if(currentCell.neighbors.length>0){
            let randomPick=Math.floor(Math.random()*currentCell.neighbors.length);
            let nextCell=currentCell.neighbors[randomPick]
            currentCell.neighbors=[]
            newVisitedCells++
            let xMove=currentCell.x-nextCell.x;
            let yMove=currentCell.y-nextCell.y;
            switch(xMove){
              case -1:
              { 
                currentCell.walls[1]=false;
                nextCell.walls[3]=false;
                scene.remove(currentCell.wallMesh[1])
                scene.remove(nextCell.wallMesh[3])
                break;
              }
              case 1:
              { 
                currentCell.walls[3]=false;
                nextCell.walls[1]=false;
                scene.remove(currentCell.wallMesh[3])
                scene.remove(nextCell.wallMesh[1])
                break;
              }
              default:{
      
              }
            }
            switch(yMove){
              case -1:
              { 
                currentCell.walls[2]=false;
                nextCell.walls[0]=false;
                scene.remove(currentCell.wallMesh[2])
                scene.remove(nextCell.wallMesh[0])
                break;
              }
              case 1:
              { 
                currentCell.walls[0]=false;
                nextCell.walls[2]=false;
                scene.remove(currentCell.wallMesh[0])
                scene.remove(nextCell.wallMesh[2])
                break;
              }
              default:{
                 
              }
            }
            mazePath.push(currentCell)
            currentCell=nextCell;
            
            
          }
          else if(currentCell.neighbors.length===0){
            if(mazePath.length>0){
              currentCell=mazePath.pop()
              currentCell.returnedTo=true;
            }
          }
        }
        trackerMesh.position.x=currentCell.x;
        trackerMesh.position.z=currentCell.y+(trackerMesh.scale.z/2.0);
        //console.log(currentCell.x)
        i++;
        }

      }

      const myMaze=new createMazeTwoDim(twoDimCube)

      manageScene=()=>{
        controls.update()
        if(!myMaze.mazeCreated){
          myMaze.createMaze()
        }
        renderer.render( scene, camera )
        requestAnimationFrame( manageScene )

      }

      manageScene()

      
