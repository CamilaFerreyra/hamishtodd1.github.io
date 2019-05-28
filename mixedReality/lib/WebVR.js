/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Based on @tojiro's vr-samples-utils.js
 */
// navigator.getVRDisplays().then(function(a){console.log(a)})

var WEBVR = {
	vrAvailable: false,

	createButton: function ( renderer, options ) {

		if ( options && options.frameOfReferenceType ) {

			renderer.vr.setFrameOfReferenceType( options.frameOfReferenceType );

		}

		function showEnterVR( device ) {

			WEBVR.vrAvailable = true

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';

			button.textContent = 'ENTER VR (y)';

			button.onmouseenter = function () { button.style.opacity = '1.0'; };
			button.onmouseleave = function () { button.style.opacity = '0.5'; };

			button.onclick = function () {

				device.isPresenting ? device.exitPresent() : device.requestPresent( [ { source: renderer.domElement } ] );

			};

			renderer.vr.setDevice( device );

		}

		function showEnterXR( device ) {

			var currentSession = null;

			function onSessionStarted( session ) {

				session.addEventListener( 'end', onSessionEnded );

				renderer.vr.setSession( session );
				button.textContent = 'EXIT VR';

				currentSession = session;

			}

			function onSessionEnded( event ) {

				currentSession.removeEventListener( 'end', onSessionEnded );

				renderer.vr.setSession( null );
				button.textContent = 'ENTER VR (y)';

				currentSession = null;

			}

			//

			button.style.display = '';

			button.style.cursor = 'pointer';
			button.style.left = 'calc(50% - 50px)';
			button.style.width = '100px';

			button.textContent = 'ENTER VR (y)';

			button.onmouseenter = function () { button.style.opacity = '1.0'; };
			button.onmouseleave = function () { button.style.opacity = '0.5'; };

			button.onclick = function () {

				if ( currentSession === null ) {

					device.requestSession( { immersive: true, exclusive: true /* DEPRECATED */ } ).then( onSessionStarted );

				} else {

					currentSession.end();

				}

			};

			renderer.vr.setDevice( device );

		}

		function showVRNotFound() {
			
			button.style.display = '';

			button.style.cursor = 'auto';
			button.style.left = 'calc(50% - 75px)';
			button.style.width = '150px';

			button.textContent = 'VR NOT FOUND';

			button.onmouseenter = null;
			button.onmouseleave = null;

			button.onclick = null;

			renderer.vr.setDevice( null );

		}

		function stylizeElement( element ) {

			element.style.position = 'absolute';
			element.style.bottom = '20px';
			element.style.padding = '12px 6px';
			element.style.border = '1px solid #fff';
			element.style.borderRadius = '4px';
			element.style.background = 'rgba(0,0,0,0.1)';
			element.style.color = '#fff';
			element.style.font = 'normal 13px sans-serif';
			element.style.textAlign = 'center';
			element.style.opacity = '0.5';
			element.style.outline = 'none';
			element.style.zIndex = '999';

		}

		// navigator.getVRDisplays().then(function(a){console.log(a)}).catch( function(){console.log("not found as well?")} );
		{
			var button = document.createElement( 'button' );
			button.style.display = 'none';

			stylizeElement( button );

			window.addEventListener( 'vrdisplayconnect', function ( event ) {

				showEnterVR( event.display );

			}, false );

			window.addEventListener( 'vrdisplaydisconnect', function ( event ) {

				showVRNotFound();

			}, false );

			window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

				button.textContent = event.display.isPresenting ? 'EXIT VR' : 'ENTER VR (y)';

			}, false );

			window.addEventListener( 'vrdisplayactivate', function ( event ) {

				event.display.requestPresent( [ { source: renderer.domElement } ] );

			}, false );

			navigator.getVRDisplays().then( function ( displays )
			{
				if ( displays.length > 0 )
				{
					showEnterVR( displays[ 0 ] );

				} else {

					showVRNotFound();

				}

			} ).catch( function()
			{
				//this. is. firing. even. though. the. above. happened.
				// showVRNotFound()
			} );

			return button;

		}

	},

	// DEPRECATED

	checkAvailability: function () {
		console.warn( 'WEBVR.checkAvailability has been deprecated.' );
		return new Promise( function () {} );
	},

	getMessageContainer: function () {
		console.warn( 'WEBVR.getMessageContainer has been deprecated.' );
		return document.createElement( 'div' );
	},

	getButton: function () {
		console.warn( 'WEBVR.getButton has been deprecated.' );
		return document.createElement( 'div' );
	},

	getVRDisplay: function () {
		console.warn( 'WEBVR.getVRDisplay has been deprecated.' );
	}

};
