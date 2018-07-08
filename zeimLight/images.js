/*
	"No supported source"? Use chrome rather than chromium

	want to be able to put mosue over a picture on the internet,
		press a keyboard shortcut, see it appear

	save file to the directory is easy, you'll want to "save as"

	TODO copy and paste to make a new one appear

	You do need to convert all videos to power-of-2
*/

function initImagesAndVideos()
{
	var textureFileNames = [
		"2515823.jpg",
		"Roberts-Maryam-Mirzakhanis-Pioneering-Mathematical-Legacy.jpg",
		"thirdFromRight.jpg",
		"interview.mp4",
		"Seoul ICM2014 Opening Ceremony (0).mp4",
		// "Seoul ICM2014 Opening Ceremony (1).mp4",
		// "Seoul ICM2014 Opening Ceremony (2).mp4",
		// "clips.mov"
	];

	var everythingGeometry = new THREE.PlaneGeometry( 1,1 );

	var textureLoader = new THREE.TextureLoader();
	textureLoader.crossOrigin = true;

	var displayMesh = new THREE.Mesh( everythingGeometry, new THREE.MeshBasicMaterial());
	displayMesh.material.visible = false;
	displayMesh.position.z = - camera.near - 0.001
	camera.add( displayMesh )

	var progressTracker = new THREE.Line(new THREE.Geometry(), new THREE.MeshBasicMaterial({color:0xFFFFFF,depthTest:false}))
	progressTracker.visible = false
	progressTracker.geometry.vertices.push(new THREE.Vector3(0,-0.6,0),new THREE.Vector3(0,0.6,0))
	camera.add(progressTracker)

	var scaleThatFillsScreen = new THREE.Vector3(1,1,1);
	function setScaleThatFillsScreen(aspectRatio)
	{
		var centerToFrameSideDistanceAtZ = centerToFrameDistance(otherFov(camera.fov,camera.aspect,true), -displayMesh.position.z)
		var audienceCenterToFrameSideDistanceAtZ = centerToFrameSideDistanceAtZ * getAudienceProportionOfWindowWidth()
		var audienceScreenHeightAtZ = audienceCenterToFrameSideDistanceAtZ * 2 / AUDIENCE_ASPECT_RATIO;

		if(aspectRatio > AUDIENCE_ASPECT_RATIO)
		{
			scaleThatFillsScreen.set( audienceScreenHeightAtZ * aspectRatio, audienceScreenHeightAtZ, 1 );
		}
		else
		{
			var viewerScreenWidthAtZ = audienceScreenHeightAtZ * AUDIENCE_ASPECT_RATIO;
			scaleThatFillsScreen.set( viewerScreenWidthAtZ, viewerScreenWidthAtZ / aspectRatio, 1 );
		}
	}
	var zoomProgress = 0;

	objectsToBeUpdated.push( displayMesh )
	displayMesh.update = function()
	{
		var mostRecentClickWasOnAThumbnailWeAreReflecting = 
				thumbnails.indexOf(mouse.lastClickedObject) !== -1 && (
					mouse.lastClickedObject.material.map === this.material.map ||
					mouse.lastClickedObject.material.map.video.src === this.material.map.video.src )
				
		if( mostRecentClickWasOnAThumbnailWeAreReflecting )
		{
			this.scale.copy(scaleThatFillsScreen)
			if( this.material.map.video === undefined)
			{
				this.scale.multiplyScalar(1+zoomProgress);
				// if(this.zoomDirection)
				// {
				// 	//something
				// }

				zoomProgress += 0.0003
			}
			else
			{
				var thumbnail = mouse.lastClickedObject
				progressTracker.position.copy( thumbnail.position )
				progressTracker.position.x = thumbnail.getTimeAt( this.material.map.video.currentTime, true )
				progressTracker.scale.y = thumbnail.scale.y
			}
		}
		else
		{
			if( this.material.map !== null )
			{
				this.material.visible = false;
				this.material.map = null;
				progressTracker.visible = false
			}
		}
	}

	bindButton("[",function()
	{
		displayMesh.material.map.setCurrentTimeToStart()
		//also "save"... later...
	}, "set current time as when you would start current clip")

	{
		// var frameDrawer = new THREE.Line(new THREE.OriginCorneredPlaneBufferGeometry(1,1))
		// frameDrawer.material.depthTest = false;
		// scene.add(frameDrawer)
		// displayMesh.onClick = function()
		// {
		// 	if( !this.visible || !this.material.visible)
		// 	{
		// 		return
		// 	}

		// 	frameDrawer.visible = true;
		// }
		// objectsToBeUpdated.push(frameDrawer)
		// frameDrawer.update = function()
		// {
		// 	var mousePosition = mouse.rayIntersectionWithZPlane(this.position.z)
		// 	this.scale.x = mousePosition.x - this.position.x;
		// 	this.scale.y = this.scale.x / AUDIENCE_ASPECT_RATIO
		// }

		// bindButton("z",function()
		// {
		// 	//stop zooming and set zoomprogress to 0
		// 	zoomProgress = 0;
		// 	frameDrawer.position.copy(mouse.rayIntersectionWithZPlane(0))
		// }, "set zoom direction")
	}

	bindButton("v",function()
	{
		if( displayMesh.material.map === null || displayMesh.material.map.video === undefined )
		{
			return
		}
		var stringJustBefore = "textures/"
		var startingPointInString = displayMesh.material.map.video.src.indexOf(stringJustBefore) + stringJustBefore.length;
		var fileNameInArray = decodeURIComponent(displayMesh.material.map.video.src.slice(startingPointInString) )
		var fileIndex = textureFileNames.indexOf( fileNameInArray )
		if(fileIndex === -1)
		{
			console.error("no such file: ",fileNameInArray)
		}
		else
		{
			loadVideo( fileIndex )
		}
	}, "clone current clip")
	// bindButton("d",function()
	// {

	// }, "delete current clip")
	//could make it so that if you reach the end, return to beginning
	//also a little line going along them to let you know when it's about to end...

	var thumbnails = [];
	function Thumbnail( i, thumbnailTexture, displayTexture )
	{
		if(displayTexture === undefined)
		{
			displayTexture = thumbnailTexture;
		}
		var width = AUDIENCE_CENTER_TO_SIDE_OF_FRAME_AT_Z_EQUALS_0 * 2 / textureFileNames.length;
		var thumbnail = new THREE.Mesh(
			everythingGeometry,
			new THREE.MeshBasicMaterial({depthTest:false,map:thumbnailTexture}) );
		thumbnails.push(thumbnail)
		mouseables.push(thumbnail)
		thumbnail.scale.set( width, width, 1 )

		thumbnail.reposition = function(effectiveIndex)
		{
			thumbnail.position.y = AUDIENCE_CENTER_TO_TOP_OF_FRAME_AT_Z_EQUALS_0 * 1.02 + 0.5 * width;
			var numWeCanSqueezeIn = AUDIENCE_CENTER_TO_SIDE_OF_FRAME_AT_Z_EQUALS_0 * 2 / width;

			var rowPosition = effectiveIndex;
			if( rowPosition >= numWeCanSqueezeIn )
			{
				rowPosition -= numWeCanSqueezeIn
				thumbnail.position.y *= -1 // will need more lines eventually
			}
			thumbnail.position.x = (rowPosition - (numWeCanSqueezeIn-1)/2) * width;

			camera.updateMatrixWorld()
			thumbnail.position.z = 0
			camera.worldToLocal(thumbnail.position)
			camera.add(thumbnail)

			for(var j = 0; j < thumbnails.length; j++)
			{
				if(thumbnails[j] === thumbnail) continue;

				if(thumbnails[j].position.distanceTo(thumbnail.position) < 0.0001)
				{
					this.reposition(effectiveIndex+1);
					break;
				}
			}
		}
		thumbnail.reposition( i )

		thumbnail.onClick = function()
		{
			setScaleThatFillsScreen(this.scale.x / this.scale.y)
			displayMesh.material.map = displayTexture;
			displayMesh.material.needsUpdate = true;
			displayMesh.material.visible = true;
			if( displayTexture.video !== undefined )
			{
				displayTexture.video.currentTime = thumbnailTexture.video.currentTime;
				displayTexture.video.play();

				progressTracker.visible = true
			}
			else
			{
				zoomProgress = 0;
			}
		}
		
		return thumbnail;
	}

	function loadImage(i)
	{
		textureLoader.load( "./data/textures/" + textureFileNames[i], function(texture) 
		{
			var thumbnail = Thumbnail( i, texture );
			var aspectRatio = texture.image.naturalWidth / texture.image.naturalHeight;
			thumbnail.scale.set(thumbnail.scale.x,thumbnail.scale.x / aspectRatio,1)
		}, function ( xhr ) {}, function ( xhr ) {console.log( 'texture loading error' );} );
	}

	function VideoTexture(i)
	{
		var video = document.createElement( 'video' )
		video.id = Math.random().toString()
		video.loop = true
		video.muted = true
		video.style = "display:none"
		video.src = "./data/textures/" + textureFileNames[i]
		video.crossOrigin = 'anonymous';

		var videoImage = document.createElement( 'canvas' );
		var videoTexture = new THREE.Texture( videoImage );
		videoTexture.video = video;
		videoTexture.minFilter = THREE.LinearFilter; //no mipmapping
		videoTexture.magFilter = THREE.LinearFilter;
		var videoImageContext = videoImage.getContext( '2d' );
		videoImageContext.fillStyle = '#FFFFFF';
		videoImageContext.fillRect( 0, 0, 1280, 720 );

		//this doesn't always have to be happenning
		objectsToBeUpdated.push(videoTexture)
		videoTexture.update = function()
		{
			if( video.readyState === video.HAVE_ENOUGH_DATA )
			{
				videoImageContext.drawImage( video, 0, 0 );
				videoTexture.needsUpdate = true;
			}
		}

		return videoTexture
	}

	function loadVideo(i)
	{
		var displayTexture = VideoTexture(i)
		var thumbnailTexture = VideoTexture(i)
		var startTime = 0.05
		thumbnailTexture.video.currentTime = startTime
		displayTexture.video.currentTime = startTime

		var thumbnail = Thumbnail( i, thumbnailTexture, displayTexture )

		displayTexture.setCurrentTimeToStart = function()
		{
			startTime = this.video.currentTime
		}

		thumbnail.getTimeAt = function(input, reverse)
		{
			var frameLimitLeft =  this.geometry.vertices[0].clone().applyMatrix4( this.matrixWorld ).x;
			var frameWidth = this.scale.x;

			var trueDuration = thumbnailTexture.video.duration - startTime;

			if(reverse)
			{
				var proportionAlong = ( input - startTime ) / trueDuration
				return proportionAlong * frameWidth + frameLimitLeft;
			}

			var proportionAlong = (input - frameLimitLeft) / frameWidth;
			return startTime + proportionAlong * trueDuration;
		}

		objectsToBeUpdated.push(thumbnail)
		thumbnail.update = function()
		{
			if(thumbnail.scale.y === thumbnail.scale.x && thumbnailTexture.video.videoHeight !== 0 )
			{
				thumbnailTexture.image.width = thumbnailTexture.video.videoWidth;
				thumbnailTexture.image.height = thumbnailTexture.video.videoHeight;
				displayTexture.image.width = thumbnailTexture.video.videoWidth;
				displayTexture.image.height = thumbnailTexture.video.videoHeight;
				var aspectRatio = thumbnailTexture.video.videoWidth / thumbnailTexture.video.videoHeight;
				thumbnail.scale.set(thumbnail.scale.x,thumbnail.scale.x/aspectRatio,1)
			}

			var intersections = mouse.rayCaster.intersectObject( thumbnail ); //we're changing the name of that...
			if( intersections.length !== 0 )
			{
				var hoveredTime = thumbnail.getTimeAt( intersections[0].point.x, false )

				//we check because currentTime needs a chance to get set. Also, useful looping effect
				if( Math.abs( thumbnailTexture.video.currentTime - hoveredTime ) > 0.05 )
				{
					thumbnailTexture.video.currentTime = hoveredTime
					if( thumbnailTexture.video.paused )
					{
						thumbnailTexture.video.play()
					}
				}
			}
			else
			{
				if(!thumbnailTexture.video.paused)
				{
					thumbnailTexture.video.pause()
				}
			}
		}

		return thumbnail;
	}

	for(var i = 0, il = textureFileNames.length; i < il; i++)
	{
		var fileExtension = textureFileNames[i].slice(textureFileNames[i].length-3);
		if( fileExtension === "mp4" || fileExtension === "mov")
		{
			loadVideo(i);
		}
		else
		{
			loadImage(i);
		}
	}
}