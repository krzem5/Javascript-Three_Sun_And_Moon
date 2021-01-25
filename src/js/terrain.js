function Terrain(){
	var g=new THREE.Group()
	g.rotation.x=Math.PI/2
	for (var y=0;y<SIZE;y++){
		for (var x=0;x<SIZE;x++){
			var c=Chunk(x-Math.floor(SIZE/2),y-Math.floor(SIZE/2))
			g.add(c.object)
			all_objects.push(c)
		}
	}
	scene.add(g)
	return {
		type: "terrain",
		chunkList: g,
		create_chunk: function(x,y){
			var c=Chunk(x,-y)
			this.chunkList.add(c.object)
			all_objects.push(c)
		},
		update: function(){
			//
		}
	}
}
function get_noise(x,y){return NOISE(x,y,SEED)*600}
function Chunk(x,y){
	var mesh=new THREE.Mesh(new THREE.PlaneGeometry(1000,1000,10,10),new THREE.MeshStandardMaterial({color:0xa3f707,side:THREE.DoubleSide,flatShading:true,metalness:0.5,roughness:0.9}))
	mesh.reciveShadow=true
	mesh.castShadow=true
	mesh.position.set(x*1000,y*-1000,0)
	scene.add(mesh)
	for (var j=0;j<11;j++){
		for (var i=0;i<11;i++){
			mesh.geometry.vertices[j*11+i].z=get_noise(x+i/10,y+j/10)
		}
	}
	return {
		type: "chunk",
		object: mesh,
		v: true,
		update: function(){
			this.object.visible=this.v
		}
	}
}
function SunAndMoon(){
	var sun=new THREE.SpotLight(0xffffff,1,0,1)
	sun.position.set(200,200,200)
	sun.target.position.set(0,0,0)
	sun.castShadow=true
	sun.shadow.mapSize.width=1024
	sun.shadow.mapSize.height=1024
	sun.shadow.camera.near=0.5
	sun.shadow.camera.far=15000
	var g=new THREE.Mesh(new THREE.SphereGeometry(150,32,32,0,6.3,0,3.1),new THREE.MeshBasicMaterial({color:0xdddd00}))
	sun.add(g)
	var moon=new THREE.SpotLight(0xcecece,1,0,1)
	moon.position.set(200,200,200)
	moon.target.position.set(0,0,0)
	moon.castShadow=true
	moon.shadow.mapSize.width=1024
	moon.shadow.mapSize.height=1024
	moon.shadow.camera.near=0.5
	moon.shadow.camera.far=15000
	var g2=new THREE.Mesh(new THREE.SphereGeometry(70,32,32,0,6.3,0,3.1),new THREE.MeshBasicMaterial({color:0xbfbfbf}))
	moon.add(g2)
	var gr=new THREE.Group()
	gr.add(sun)
	gr.add(moon)
	scene.add(gr)
	scene.add(sun.target)
	scene.add(moon.target)
	return {
		type: "sun_and_moon",
		sun: sun,
		moon: moon,
		object: gr,
		pos: new THREE.Vector3(0,0,0),
		rotA: 45,
		rotS: 2,// 0-no rotation, 1-slow rotation, 2-normal rotation, 3-fast rotation
		update: function(){
			this.rotA+=[0,0.01,0.075,0.3][this.rotS]
			var a=17500,b=2000
			var ang=THREE.Math.degToRad(this.rotA)
			var p=this.pos.clone()
			this.sun.position.set(a*Math.cos(ang)+p.x,b*Math.sin(0.5*ang)+p.y,a*Math.sin(ang)+p.z)
			this.sun.intensity=Math.min(Math.max(3*Math.sin(0.5*ang),0),2)
			this.sun.children[0].material.color.setHSL(this.sun.intensity.map(0,2,30/360,60/360),1,0.5)
			this.sun.visible=this.sun.position.y>-1000
			this.moon.position.set(a*Math.cos(ang+Math.PI)+p.x,-b*Math.sin(0.5*ang)+p.y,a*Math.sin(ang+Math.PI)+p.z)
			this.moon.intensity=Math.max(0.75-this.sun.intensity,0)
			this.moon.visible=this.moon.position.y>-1000
			ambient.color.setHSL(230/360,1,this.sun.intensity.map(0,2,50/100,100/100))
			scene.background.setHSL(...this.sun.intensity.mapC(0,2,[235,100,2],[186,84,80]))
		}
	}
}
