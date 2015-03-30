// world
var world = new World();

// stations
world.addStation( [ 0, 0, -2500 ] );
world.addStation( [ 0, 0, 2500 ] );
world.addStation( [ -2500, 0, 0 ] );
world.addStation( [ 2500, 0, 0 ] );

world.addStation( [ -10000, 4000, -10000 ] );
world.addStation( [ -10000, 4000, 10000 ] );
world.addStation( [ 10000, 4000, -10000 ] );
world.addStation( [ 10000, 4000, 10000 ] );
world.addStation( [ -10000, -4000, -10000 ] );
world.addStation( [ -10000, -4000, 10000 ] );
world.addStation( [ 10000, -4000, -10000 ] );
world.addStation( [ 10000, -4000, 10000 ] );

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
var source1 = [
	'sounds/music/376737_Skullbeatz___Bad_Cat_Maste.mp3',
	'sounds/music/376737_Skullbeatz___Bad_Cat_Maste.ogg'
],
source2 = [
	'sounds/music/358232_j_s_song.mp3',
	'sounds/music/358232_j_s_song.ogg'
];
World.soundPlayer.load( {
	music11: source1,
	music12: source1,
	music21: source2,
	music22: source2
}, true, false, 0.3 );
world.setupSoundBox( 'music11', [ 0, 0, -2500 ], 5000 );
world.setupSoundBox( 'music12', [ 0, 0, 2500 ], 5000 );
world.setupSoundBox( 'music21', [ -2500, 0, 0 ], 5000 );
world.setupSoundBox( 'music22', [ 2500, 0, 0 ], 5000 );

// start
world.start();