// world
var world = new World();

// stations
world.addStation( [ 0, 0, -2000 ] );
world.addStation( [ 0, 0, 2000 ] );

// user
World.user = world.addUserShip( [ 0, 0, 0 ], [ 0, 0, -1 ] );
world.bindCamera( World.user );

// npc
world.addAIShip( [ 0, 400, -2500 ], [ 0, -1, 0 ] );
world.addAIShip( [ -400, 0, -2500 ], [ 1, 0, 0 ] );
world.addAIShip( [ 400, 0, -2500 ], [ -1, 0, 0 ] );
world.addAIShip( [ 0, 400, 2500 ], [ 0, -1, 0 ] );
world.addAIShip( [ -400, 0, 2500 ], [ 1, 0, 0 ] );
world.addAIShip( [ 400, 0, 2500 ], [ -1, 0, 0 ] );

// music
World.soundPlayer.load( {
	music1: [
		'sounds/music/376737_Skullbeatz___Bad_Cat_Maste.mp3',
		'sounds/music/376737_Skullbeatz___Bad_Cat_Maste.ogg'
	],
	music2: [
		'sounds/music/358232_j_s_song.mp3',
		'sounds/music/358232_j_s_song.ogg'
	]
}, true, false, 0.3 );
world.setupSoundBox( 'music1', [ 0, 0, -2000 ], 4000 );
world.setupSoundBox( 'music2', [ 0, 0, 2000 ], 4000 );

// start
world.start();