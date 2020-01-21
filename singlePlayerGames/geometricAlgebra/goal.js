function initInputOutputGoal()
{
	let background = new THREE.Mesh(new THREE.PlaneGeometry(1.,1.), new THREE.MeshBasicMaterial({color:0xFFFFFF}))
	background.scale.x = 3.65
	background.scale.y = 1.2
	background.position.z = -.001

	let intendedPositions = [
		new THREE.Vector3( 0.,-camera.topAtZZero + .9, 0.),
		new THREE.Vector3( 0., camera.topAtZZero - 2.1, 0.)
	]

	{
		var inputSelectionIndicator = new THREE.Group()
		let yellowRect = new THREE.Mesh(new THREE.PlaneGeometry(1.,1.), new THREE.MeshBasicMaterial({color:0xFFFF00}))
		let thickness = .1
		for(let i = 0; i < 4; i++)
		{
			let r = new THREE.Mesh(yellowRect.geometry,yellowRect.material)
			inputSelectionIndicator.add(r)
			if(i < 2)
			{
				r.position.x = .5 - thickness * .5
				r.scale.x = thickness
			}
			else
			{
				r.position.y = .5 - thickness * .5
				r.scale.y = thickness
			}
			if(i%2)
				r.position.multiplyScalar(-1.);
			r.position.z = .01
		}
		var outputSelectionIndicator = inputSelectionIndicator.clone()
	}

	function selectInput(multivec)
	{
		inputSelectionIndicator.position.copy(multivec.position)
		outputSelectionIndicator.position.copy(multivec.position)

		//probably have it shake a little. Well I mean this is what the pipes were meant to be

		console.error("Need to update ALL the scope")
	}

	{
		var inputGroup = new THREE.Group()
		scene.add(inputGroup)
		inputGroup.add(background)

		inputGroup.add(inputSelectionIndicator)

		var inputs = Array(3)
		for(let i = 0; i < inputs.length; i++)
		{
			let elements = new Float32Array(8)
			for(let j = 0; j < 5; j++) //ONLY USING THOSE THAT WORK
				elements[j] = (Math.random()-.5)*2.
			elements[0] = Math.floor(Math.random()*20) - 10.
			elements[3] = 0.

			inputs[i] = MultivectorAppearance(selectInput,elements)
			inputs[i].position.x = (i-1) * 1.2;
			inputGroup.add(inputs[i])
		}

		var inputScope = [inputs[2]]
		selectInput(inputScope[0])
	}

	{
		var outputGroup = new THREE.Group()
		scene.add(outputGroup)
		outputGroup.add(background.clone())
		outputGroup.add(outputSelectionIndicator)

		let outputs = Array(3)
		for(let i = 0; i < outputs.length; i++)
		{
			let elements = new Float32Array(8)
			elements[0] = Math.floor(Math.random()*20) - 10.
			for(let j = 1; j < 5; j++) //ONLY USING THOSE THAT WORK
				elements[j] = (Math.random()-.5)*2.

			outputs[i] = MultivectorAppearance(function(){},elements)
			outputs[i].position.x = (i-1) * 1.2;
			outputGroup.add(outputs[i])
		}

		// let goalSign = makeTextSign("Goal:")
		// goalSign.scale.multiplyScalar(.7)
		// outputGroup.add(goalSign)
		// goalSign.position.x -= background.scale.x * .5 + goalSign.scale.x * .5 + .1
	}

	updateFunctions.push(function()
	{
		intendedPositions[0].x = camera.rightAtZZero - 2
		intendedPositions[1].x = camera.rightAtZZero - 2
		outputGroup.position.lerp(intendedPositions[0],frameCount===0?1.:.1)
		inputGroup.position.lerp( intendedPositions[1],frameCount===0?1.:.1)
	})

	return inputScope
}

let singularGoalMultivector = null
function initSingularGoal(goalElements)
{
	var goalBox = new THREE.Group()
	scene.add(goalBox)
	goalBox.position.y = camera.topAtZZero - 1.4

	goalBox.title = makeTextSign("Make this:")
	goalBox.title.scale.multiplyScalar(.5)
	goalBox.title.position.y = .9
	goalBox.add(goalBox.title)

	let background = new THREE.Mesh(new THREE.PlaneGeometry(1.,1.),new THREE.MeshBasicMaterial({color:0x000000}))
	background.scale.set(goalBox.title.scale.x*1.1,goalBox.title.scale.y*4.3,1.)
	background.position.z -= .001
	background.position.y += .18
	goalBox.add(background)

	singularGoalMultivector = MultivectorAppearance(function(){},goalElements)
	goalBox.add(singularGoalMultivector)

	var goalIrritation = 0.
	updateFunctions.push(function()
	{
		goalBox.position.x = camera.rightAtZZero - 1.4
		
		singularGoalMultivector.position.x = goalIrritation * .2 * Math.sin(frameCount * .3)

		for(let i = 0; i < singularGoalMultivector.children.length; i++)
		{
			singularGoalMultivector.children[i].material.color.g = 1.-goalIrritation
			singularGoalMultivector.children[i].material.color.b = 1.-goalIrritation
		}

		goalIrritation = Math.max(goalIrritation - frameDelta * .75,0.);
	})

	let goalAchieved = false
	setGoalAchievement = function(newGoalAchieved)
	{
		if(!goalAchieved && newGoalAchieved)
		{
			goalBox.title.children[0].material.setText("You win!")

			updateFunctions.push(function()
			{
				for(let i = 0; i < singularGoalMultivector.children.length; i++)
				{
					singularGoalMultivector.children[i].material.color.r = Math.sin(frameCount * .14)
					singularGoalMultivector.children[i].material.color.b = Math.sin(frameCount * .14)
				}

				goalBox.title.children[0].material.color.r = Math.sin(frameCount * .14)
				goalBox.title.children[0].material.color.b = Math.sin(frameCount * .14)

				goalBox.position.y *= .9
			})

			goalAchieved = newGoalAchieved
		}
	}
	setGoalIrritation = function(newValue)
	{
		goalIrritation = 1.
	}

	//level generator
	// {
	// 	let numOperations = 4;
	// 	let generatorScope = []
	// 	for(let i = 0; i < scope.length; i++)
	// 		generatorScope.push(scope[i].elements)
	// 	for(let operation = 0; operation < numOperations; operation++)
	// 	{
	// 		let operandA = generatorScope[ Math.floor( Math.random() * generatorScope.length ) ];
	// 		let operandB = generatorScope[ Math.floor( Math.random() * generatorScope.length ) ];

	// 		let functionToUse = Math.random() < .5 ? geometricProduct : geometricSum;

	// 		let result = functionToUse(operandA,operandB)

	// 		// if(searchArray(generatorScope,result))
	// 		// {
	// 		// 	operation--
	// 		// }
	// 		// else
	// 		{
	// 			generatorScope.push(result)
	// 		}
	// 	}

	// 	var singularGoalMultivector = MultivectorAppearance(function(){},generatorScope[generatorScope.length-1])
	// }
}