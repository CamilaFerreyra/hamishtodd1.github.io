/* "Playing field width/height" appears in here, and we want to get rid of that.
 * It just means the area that the camera can see on the plane z = 0.
 * Actually we certainly don't want dependence on window size. State a size for the window. Give a certain number of pixels.
 * Orthographic projection may simplify you walking around.
 * 
 * 
 * Rift Valley Fever (big one) - 12
 * may want to aim to have the t=1 CK arrangment look like the QS version
 * 
 * QS
 * How about layering konevtsova's spots on them? 
 * Would you need the density maps? Those are nice. Could fade to a density map and put "x-ray" underneath. Hopefully you saved those nice maps on work computer :(
 * Could get the viruses into chimera and color them yourself trying to suggest the quasilattice shapes
 * Or you could just say in the video "the proteins on these viruses sit at the corners of the shapes, and connected corners are connected proteins"
 * 
 * So we have bocavirus on all of them? Four each is nice.
 * 
 * TODO they highlight somehow when mouse is over them
 * TODO start before everything is completely loaded?
 * 
 * When do they pop up? When you get them? When you've been playing a while?
 */

var texture_loader = new THREE.TextureLoader(); //only one?
var clickable_viruses = Array(16);

var CKHider;
var VisibleSlide;
var IrregButtonOpen;
var IrregButtonClosed;

var pictures_loaded = 0;

var virus_textures;
var random_textures;
var slide_textures;

function load_AV_stuff()
{
	//TODO put the numbers in here
	var virus_texture_urls = Array();
	var random_texture_urls = Array();
	var slide_texture_urls = Array();
	
	//-----clickable viruses
	virus_texture_urls[0] = "http://hamishtodd1.github.io/Data/ClickableViruses/1 - BV.jpg"; //to be turned into golfball.jpg or whatever
	virus_texture_urls[1] = "http://hamishtodd1.github.io/Data/ClickableViruses/1 - BV.jpg";
	virus_texture_urls[2] = "http://hamishtodd1.github.io/Data/ClickableViruses/9 - N4.gif";
	virus_texture_urls[3] = "http://hamishtodd1.github.io/Data/ClickableViruses/13 - RV.png";
	
	virus_texture_urls[4] = "http://hamishtodd1.github.io/Data/ClickableViruses/3 - PV.png";
	virus_texture_urls[5] = "http://hamishtodd1.github.io/Data/ClickableViruses/4 - SFV.png";
	virus_texture_urls[6] = "http://hamishtodd1.github.io/Data/ClickableViruses/7 - CV.png";
	virus_texture_urls[7] = "http://hamishtodd1.github.io/Data/ClickableViruses/12 - RVFV.png";
	
	virus_texture_urls[ 8] = "http://hamishtodd1.github.io/Data/ClickableViruses/Bocavirus file.png";
	virus_texture_urls[ 9] = "http://hamishtodd1.github.io/Data/ClickableViruses/Bluetongue file.png";
	virus_texture_urls[10] = "http://hamishtodd1.github.io/Data/ClickableViruses/Zika file.png";
	virus_texture_urls[11] = "http://hamishtodd1.github.io/Data/ClickableViruses/HPV file.png";
	
	virus_texture_urls[12] = "http://hamishtodd1.github.io/Data/ClickableViruses/T4 file.png";
	virus_texture_urls[13] = "http://hamishtodd1.github.io/Data/ClickableViruses/Phi29 file.png";
	virus_texture_urls[14] = "http://hamishtodd1.github.io/Data/ClickableViruses/HIV file.png";
	virus_texture_urls[15] = "http://hamishtodd1.github.io/Data/ClickableViruses/Herpes file.png";
	
	//the other things and their widths
	random_texture_urls[0] = "http://hamishtodd1.github.io/Data/Misc textures/CKhider.png";
	random_texture_urls[1] = "http://hamishtodd1.github.io/Data/Misc textures/open.png";
	random_texture_urls[2] = "http://hamishtodd1.github.io/Data/Misc textures/close.png";
	random_texture_urls[3] = "http://hamishtodd1.github.io/Data/Misc textures/Egg cell hawaiireedlab.png";
	
	//slides
	slide_texture_urls[0] = "http://hamishtodd1.github.io/Data/Slides/Zika victim.png";
	slide_texture_urls[1] = "http://hamishtodd1.github.io/Data/Slides/HIV victim.png";
	slide_texture_urls[2] = "http://hamishtodd1.github.io/Data/Slides/Dad.jpg";
	
	slide_texture_urls[3] = "http://hamishtodd1.github.io/Data/Slides/Golfball.png";
	slide_texture_urls[4] = "http://hamishtodd1.github.io/Data/Slides/Golfball_virus.png";
	slide_texture_urls[5] = "http://hamishtodd1.github.io/Data/Slides/Origami.jpg";
	slide_texture_urls[6] = "http://hamishtodd1.github.io/Data/Slides/Origami_virus.png";
	slide_texture_urls[7] = "http://hamishtodd1.github.io/Data/Slides/Darb e above entrance.jpg";
	slide_texture_urls[8] = "http://hamishtodd1.github.io/Data/Slides/HPV xray.png";

	slide_texture_urls[9] = "http://hamishtodd1.github.io/Data/Slides/Protein example.png";
	slide_texture_urls[10] = "http://hamishtodd1.github.io/Data/Slides/Random protein.png";
	slide_texture_urls[11] = "http://hamishtodd1.github.io/Data/Slides/MC1R.png";
	slide_texture_urls[12] = "http://hamishtodd1.github.io/Data/Slides/Polymerase and trascriptase.png";
	
	slide_texture_urls[13] = "http://hamishtodd1.github.io/Data/Slides/Cell with proteins.png";
	slide_texture_urls[14] = "http://hamishtodd1.github.io/Data/Slides/Cell full of viruses.jpg";
	slide_texture_urls[15] = "http://hamishtodd1.github.io/Data/Slides/Cell lysis.jpg";

	slide_texture_urls[16] = "http://hamishtodd1.github.io/Data/Slides/HIV.png";
	slide_texture_urls[17] = "http://hamishtodd1.github.io/Data/Slides/Bonobos.jpg";
	slide_texture_urls[18] = "http://hamishtodd1.github.io/Data/Slides/HIV variety.png";

	slide_texture_urls[19] = "http://hamishtodd1.github.io/Data/Slides/Semliki.png";
	slide_texture_urls[20] = "http://hamishtodd1.github.io/Data/Slides/Greenhouse.jpg";
	slide_texture_urls[21] = "http://hamishtodd1.github.io/Data/Slides/Gamma ray detector.jpg";
	slide_texture_urls[22] = "http://hamishtodd1.github.io/Data/Slides/Bucky.png";
	slide_texture_urls[23] = "http://hamishtodd1.github.io/Data/Slides/Hair and baskets.png";
	slide_texture_urls[24] = "http://hamishtodd1.github.io/Data/Slides/First pic of virus.jpg";
	
	slide_texture_urls[25] = "http://hamishtodd1.github.io/Data/Slides/Zika Virus.jpg";
	slide_texture_urls[26] = "http://hamishtodd1.github.io/Data/Slides/Darb e outside.jpg";
	slide_texture_urls[27] = "http://hamishtodd1.github.io/Data/Slides/Darb e above entrance.jpg";
	slide_texture_urls[28] = "http://hamishtodd1.github.io/Data/Slides/Darb e inside.jpg";
	slide_texture_urls[29] = "http://hamishtodd1.github.io/Data/Slides/Pattern triangular.jpg";
	slide_texture_urls[30] = "http://hamishtodd1.github.io/Data/Slides/Pattern square.png";
	slide_texture_urls[31] = "http://hamishtodd1.github.io/Data/Slides/Pattern hexagonal.jpg";
	slide_texture_urls[32] = "http://hamishtodd1.github.io/Data/Slides/Pentagons.png";
	slide_texture_urls[33] = "http://hamishtodd1.github.io/Data/Slides/Pattern pentagonal.png";
	
	slide_texture_urls[34] = "http://hamishtodd1.github.io/Data/Slides/Irreg.png";
	slide_texture_urls[35] = "http://hamishtodd1.github.io/Data/Slides/Origami geodesic.png";
	slide_texture_urls[36] = "http://hamishtodd1.github.io/Data/Slides/Very dodecahedral virus.png";
	slide_texture_urls[37] = "http://hamishtodd1.github.io/Data/Slides/golden spiral.png";
	slide_texture_urls[38] = "http://hamishtodd1.github.io/Data/Slides/Mona Lisa.jpg";
	slide_texture_urls[39] = "http://hamishtodd1.github.io/Data/Slides/Measles virus.png";
	
	
	virus_textures = Array(virus_texture_urls.length);
	random_textures = Array(random_texture_urls.length);
	slide_textures = Array(slide_texture_urls.length);
	
	for(var i = 0; i < virus_texture_urls.length; i++ )
		loadpic(virus_texture_urls[i], 0, i);
	for(var i = 0; i < random_texture_urls.length; i++ )
		loadpic(random_texture_urls[i], 1, i);

	for(var i = 0; i < slide_texture_urls.length; i++ )
	{
		var last_three_letters = slide_texture_urls[i].substr( slide_texture_urls[i].length - 3);
		
		//might be quite nice to have failsafe pictures in case they can't show videos
		if( last_three_letters === "png" || last_three_letters === "gif" || last_three_letters === "jpg" )
			loadpic(slide_texture_urls[i], 2, i);
		else console.log( "unrecognized format", last_three_letters);
	}
}

function loadpic(url, type, index) {
	//these lines are for if you have no internet
//	clickable_viruses[i].material.color = 0x000000;
//	pictures_loaded++;
//	if(pictures_loaded === clickable_viruses.length ) {
//		PICTURES_LOADED = 1;
//		attempt_launch();
//	}
	
	texture_loader.load(
			url,
		function(texture) {
			if(type === 0)
				virus_textures[index] = texture;
			if(type === 1)
				random_textures[index] = texture;
			if(type === 2)
				slide_textures[index] = texture;
			
			pictures_loaded++;

			if(pictures_loaded === virus_textures.length + random_textures.length + slide_textures.length ) {
				bind_pictures();
			}
		},
		function ( xhr ) {}, function ( xhr ) {
			console.log( 'texture loading error, switch to using the other code in this function' );
		}
	);
}

function bind_pictures()
{
	init_clickable_viruses();
	init_tree();
	init_bocavirus_stuff(); //it needs the egg cell pic
	
	//-----other
	CKHider = new THREE.Mesh( new THREE.CubeGeometry(6.93513143351, 6.93513143351, 0),
		new THREE.MeshBasicMaterial( { transparent:true, map: random_textures[0] } ) );
	
	IrregButtonOpen = new THREE.Mesh( new THREE.CubeGeometry(0.6, 0.6, 0),
		new THREE.MeshBasicMaterial( { transparent:true, map: random_textures[1] } ) );
	IrregButtonClosed = new THREE.Mesh( new THREE.CubeGeometry(0.6, 0.6, 0),
		new THREE.MeshBasicMaterial( { transparent:true, map: random_textures[2] } ) );
	
	IrregButtonOpen.position.set(1.9,-0.7,0.0001);
	IrregButtonOpen.capsidopen = 0;
	IrregButtonClosed.position.set(1.9,-0.7,0.0001);
	IrregButtonClosed.capsidopen = 0;
	
	//first slide
	VisibleSlide = new THREE.Mesh( new THREE.CubeGeometry(playing_field_dimension, playing_field_dimension, 0),
		new THREE.MeshBasicMaterial( { transparent:true } ) );
	
	
	//----Ready
	PICTURES_LOADED = 1;
	attempt_launch();
}