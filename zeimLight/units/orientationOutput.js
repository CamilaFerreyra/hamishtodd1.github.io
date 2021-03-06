function initOrientationOutput()
{
	let object = new THREE.Object3D()
	object.quaternion.set( Math.random(),Math.random(),Math.random(),Math.random() )
	let controls = new THREE.DeviceOrientationControls( object );
	updateFunctions.push(function()
	{
		controls.update()
	})

	for(let i = 0; i < 3; i++)
	{
		f(i)
	}

	function f(i)
	{
		let str = (object.rotation.toArray())[i].toString()

		let sign = makeTextSign(str)
		sign.scale.multiplyScalar(0.17)
		sign.position.y = 0.3 - i * 0.2
		scene.add(sign)

		updateFunctions.push(function()
		{
			str = (object.quaternion.toArray())[i].toString()
			sign.children[0].material.setText(str)
		})
	}
}