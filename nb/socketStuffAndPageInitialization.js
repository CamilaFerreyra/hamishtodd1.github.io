// var socket = io();
// var isTeacher = false;

// var chapter = null;
// function updateChapter(){} //gets redefined elsewhere

// (function()
// {
// 	socket.on('roomInvitation', function(ourID)
// 	{
// 		init(ourID);
// 	});

// 	socket.on("teacher status accepted",function()
// 	{
// 		bestowTeacherControls()
// 	})

// 	updateChapter()
// 	socket.on("chapter update",updateChapter)
// })();

function bestowTeacherControls()
{
	isTeacher = true

	var rightArrow = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({side:THREE.DoubleSide, color:0xFF0000}))
	rightArrow.geometry.vertices.push(new THREE.Vector3(0,0,0),new THREE.Vector3(-1,1,0),new THREE.Vector3(-1,-1,0))
	rightArrow.geometry.faces.push(new THREE.Face3(0,1,2))
	rightArrow.scale.multiplyScalar(0.07)
	var leftArrow = rightArrow.clone()
	leftArrow.scale.x *= -1
	rightArrow.position.x = 1
	leftArrow.position.x = -1

	camera.add(rightArrow,leftArrow)
	leftArrow.position.z = rightArrow.position.z = -camera.position.z

	clickables.push(rightArrow)
	rightArrow.onClick = function()
	{
		chapter++
	}
	clickables.push(leftArrow)
	leftArrow.onClick = function()
	{
		chapter--
	}
}