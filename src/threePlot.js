/*
author: Bram Verreussel
excuse me for this very old code
*/

function ThreePlot(){
	//keeps track of animation state
	this.running = false;
	
	//set up the scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.PerspectiveCamera(/*75*/80, innerWidth/innerHeight, .1, 1000);
	this.renderer = new THREE.WebGLRenderer({antialias:true});
	this.renderer.setSize(innerWidth, innerHeight);
	this.renderer.domElement.style.width = '100%';
	this.renderer.domElement.style.height = '100%';
	document.body.appendChild(this.renderer.domElement);
	
	
	
	//add some lighting
	var light = new THREE.DirectionalLight( 0xffffff, .9 );
	light.position.set( .2, -1, -1 ).normalize();
	var light2 = new THREE.DirectionalLight( 0xffffff );
	light2.position.set( -3, 2, .5 ).normalize();
	var ambient = new THREE.AmbientLight(0xffffff, .7);
	
	this.scene.add(light);
	this.scene.add(light2);
	this.scene.add(ambient);
	
	this.camera.position.z = this.cameraDist;
	
	//enable rotation of camera
	this.camera.isPerspectiveCamera = true;
	this.orbitCtrl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
	this.orbitCtrl.enableDamping = true;
	this.orbitCtrl.dampingFactor = .4;
	this.orbitCtrl.minDistance = .1;
	this.orbitCtrl.maxDistance = 7;
	
	this.path = new THREE.CatmullRomCurve3();
	
	this.createAxes();
	var that = this;
	window.addEventListener('resize', function(e){
		that.renderer.domElement.width = innerWidth;
		that.renderer.domElement.height = innerHeight;
		that.renderer.setSize(innerWidth, innerHeight);
	});
}
ThreePlot.prototype = {
	cameraDist: 2.5,
	xsegments: 400,
	xArray: [],
	xmax: 3,
	xDisplaySize: 1.5,
	zmax: .3,
	zDisplaySize: 1.2, 
	running: false,
	animationFunction: ( x => x),
	createAxes: function(){
		var simpleMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
		
		var xgeometry = new THREE.CylinderGeometry( .005, .005, 2*this.xDisplaySize, 10 );
		var realgeometry = new THREE.CylinderGeometry( .005, .005, 2*this.zDisplaySize, 10 );
		var imgeometry = realgeometry.clone();
		
		//align to local z-axis to make lookAt() work
		xgeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		realgeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		imgeometry.applyMatrix( new THREE.Matrix4().makeRotationX( Math.PI / 2 ) );
		
		var xAxis    = new THREE.Mesh(xgeometry, simpleMaterial);
		var realAxis = new THREE.Mesh(realgeometry, simpleMaterial);
		var imAxis   = new THREE.Mesh(imgeometry, simpleMaterial);
		xAxis.lookAt(new THREE.Vector3(1, 0, 0));
		realAxis.lookAt(new THREE.Vector3(0, 0, 1));
		imAxis.lookAt(new THREE.Vector3(0, 1, 0));
		
		this.scene.add(xAxis   );
		this.scene.add(realAxis);
		this.scene.add(imAxis  );
	},
	createCurveMesh: function( realArr, imagArr ){
		this.xArray = new Array(realArr.length);
		for(let i=0; i<n; i++){
			this.xArray[i] = - this.xmax + 2*this.xmax/(n - 1)*i;
		}
		var selectedObject = this.scene.getObjectByName('wave_function');
		this.scene.remove( selectedObject );
		
		var geometry = new THREE.Geometry();
		var material = new THREE.MeshStandardMaterial({color: 'rgb(255, 0, 0)', metalness: .5, roughness: .8});
		this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.name = 'wave_function';
		this.scene.add( this.mesh );
		// console.log(this.mesh);
		return this.mesh;
		/*
		var n = realArr.length;
		this.xArray = new Array(n)
		for(let i=0; i<n; i++){
			this.xArray[i] = - this.xmax + 2*this.xmax/(n - 1)*i;
		}
		var points = [];
		//first point specifies offset
		//points.push(new THREE.Vector3());
		var dx = this.xDisplaySize/this.xmax;
		var dz = this.zDisplaySize/this.zmax;
		for(var i=0; i<n; i++){
			points.push( new THREE.Vector3( this.xArray[i]*dx, realArr[i]*dz, imagArr[i]*dz ) );
		}
		this.path = new THREE.CatmullRomCurve3(points);
		var geometry = new THREE.TubeGeometry( this.path, this.xsegments, .01, 8, false );
		var material = new THREE.MeshStandardMaterial({color: 'rgb(255, 0, 0)', metalness: .5, roughness: .8});
		this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.name = 'wave_function';
		this.scene.add( this.mesh );
		return this.mesh;
		*/
	},
	setCurve: function( realArr, imagArr ){
		//if(arr.length != vertices.length){
		//	console.error('error at setCurve: length of array does not match number of points in path');
		//	return false;
		//}
		var points = [];
		//first point specifies offset
		var dx = this.xDisplaySize/this.xmax;
		var dz = this.zDisplaySize/this.zmax;
		for(var i=0; i<n; i++){
			points.push( new THREE.Vector3( this.xArray[i]*dx, realArr[i]*dz, imagArr[i]*dz ) );
		}
		var path2 = new THREE.CatmullRomCurve3( points );
		var geometry2 = new THREE.TubeGeometry( path2, this.xsegments, .01, 8, false );
		
		this.mesh.geometry.dynamic = true;
		//this.path.geometry.vertices.map( (item, index) => {
		//	var v = geometry2.vertices[index];
		//	item.set(v.x, v.y, v.z);
		//});
		//this.geometry = geometry2;
		//this.geometry.dynamic = true;
		//this.geometry.vertices.map( (item, index) => {
		//	var v = geometry2.vertices[index];
		//	item.set(v.x, v.y, v.z);
		//});
		this.mesh.geometry.dispose();
		this.mesh.geometry = geometry2;
		this.mesh.geometry.verticesNeedUpdate = true;
	},
	plot: function(realArr, imagArr){
		if( realArr.length !== imagArr.length ){
			console.error('real and imaginary array dimension mismatch')
		}
		
		if(this.xArray.length == realArr.length){
			//assume a curve has been created because xsegments != 0
			this.setCurve( realArr, imagArr );
		}else{
			console.log('new');
			this.createCurveMesh( realArr, imagArr );
			this.setCurve( realArr, imagArr );
		}
	},
	render: function(){
		this.renderer.render( this.scene, this.camera );
	},
	startLoop: function(){
		if(this.running)
			return false;
		
		this.running = true;
		var that = this;
		
		this.animation = requestAnimationFrame(function frame(){
			that.animationFunction(that);
			plot.render();
			plot.orbitCtrl.update();
			if(that.running){
				that.animation = requestAnimationFrame(frame);
			}
				
		});
	},
	stopLoop: function(){
		this.running = false;
		cancelAnimationFrame( this.animation );
	}
	
}
