var scene,cam,renderer,controls,ambient,all_objects=[],NOISE=new ImprovedNoise().noise,SEED=Math.random(),SIZE=10
function init(){
	scene=new THREE.Scene()
	cam=new THREE.PerspectiveCamera(60,window.innerWidth/window.innerHeight,0.1,100000)
	cam.position.set(0,2000,0)
	cam.enablePan=false
	cam.lookAt(new THREE.Vector3(0,0,0))
	renderer=new THREE.WebGLRenderer({antialias:true})
	renderer.setSize(window.innerWidth,window.innerHeight)
	scene.background=new THREE.Color().setHSL(1,1,1)
	document.body.appendChild(renderer.domElement)
	ambient=new THREE.AmbientLight(0xececec,1)
	scene.add(ambient)
	renderer.render(scene,cam)
	controls=new THREE.OrbitControls(cam,renderer.domElement)
	controls.target=new THREE.Vector3(0,0,0)
	window.addEventListener("resize",resize,false)
	window.addEventListener("keypress",onkeypress)
	requestAnimationFrame(render)
	generate()
}
function render(){
	for (var k of all_objects){
		k.update()
	}
	renderer.render(scene,cam)
	requestAnimationFrame(render)
}
function resize(){
	cam.aspect=window.innerWidth/window.innerHeight
	cam.updateProjectionMatrix()
	renderer.setSize(window.innerWidth,window.innerHeight)
}
function onkeypress(e){
	switch (e.keyCode){
		case 49: //Left Arrow
			find("sun_and_moon")[0].rotS=1
			break
		case 113: //Top Arrow
			find("sun_and_moon")[0].rotS=0
			break
		case 50: //Right Arrow
			find("sun_and_moon")[0].rotS=2
			break
		case 51: //Down Arrow
			find("sun_and_moon")[0].rotS=3
			break
	}
}
function generate(){
	all_objects.push(SunAndMoon())
	all_objects.push(Terrain())
}
function find(n){
	var a=[]
	for (var k of all_objects){
		if (k.type==n){a.push(k)}
	}
	return a
}
Number.prototype.map=function(as,ae,bs,be){
	return (this-as)*(be-bs)/(ae-as)+bs
}
Number.prototype.mapC=function(as,ae,c1,c2){
	return [this.map(as,ae,c1[0]/360,c2[0]/360),this.map(as,ae,c1[1]/100,c2[1]/100),this.map(as,ae,c1[2]/100,c2[2]/100)]
}
window.addEventListener("DOMContentLoaded",init,false)
