(function(){
	'use strict';
	
	// World
	var World = Class.extend( {
		init: function(){
			// clock, scene, light
			this.clock = new THREE.Clock( false );
			this.scene = new THREE.Scene();
			this.scene.add( new THREE.AmbientLight( 0xffffff ) );
			
			// camera
			this.camera = new THREE.PerspectiveCamera( 50,
			World.windowRatio, 1, 30000 );
			this.scene.add( this.camera );
			
			// renderer
			this.renderer = new THREE.WebGLRenderer( { antialias: true } );
			//this.renderer = new THREE.CanvasRenderer( { antialias: true } );
			this.renderer.setClearColor( 0x000000, 1 );
			
			// dom, events
			this.locked = false;
			this.$body = $( 'body' );
			this.$container = $( '#container' );
			this.$screen = $( '#screen' );
			this.$userInfo = $( '#userInfo' );
			var _this = this;
			this.$body.on( 'click', function( event ){
				if ( ! _this.locked ) {
					event.preventDefault();
					Locker.lockPointer( this );
					return false;
				}
			} );
			Locker.setHandler( function( locked ){
				_this.locked = locked;
			} );
			$( window ).on( 'resize', function(){
				_this.onWindowResize();
			} ).trigger( 'resize' );
			// overlay
			this.$overlay = $( '#overlay' );
			this.overlayTimer = new Timer( function(){
				_this.$overlay.addClass( 'hidden' );
			}, 200, false, 1 );
			
			// units
			this.units = [];
			// sound boxes
			this.soundBoxes = [];
		},
		
		start: function(){
			var _this = this;
			/*Timer.waitUntil( function(){
				start.call( _this );
			}, function(){
				return World.soundPlayer.isAllLoaded();
			}, 500 );*/
			setTimeout( function(){
				start.call( _this );
			}, 2000 );
			
			function start(){
				// start
				this.$screen.append( this.renderer.domElement );
				this.stats = new Stats();
				this.$container.append( this.stats.domElement );
				
				for ( var i = 0; i < this.units.length; i ++ ) {
					this.units[ i ].start();
				}
				this.clock.start();
				this.animate();
				
				// sounds boxes
				for ( var i = 0; i < this.soundBoxes.length; i ++ ) {
					this.soundBoxes[ i ].play();
				}
				
				// welcome
				setTimeout( function(){
					World.soundPlayer.replay( 'welcomeVoice' );
				}, 1500);
			}
		},
		
		update: function(){
			// apply dying first
			var units = this.units;
			for ( var i = 0, unit; i < units.length; i ++) {
				unit = units[ i ];
				if ( unit.toDie ) {
					unit.die();
					units.splice( i--, 1 );	// remove from the units list
				}
			}
			
			// update all
			var delta = this.clock.getDelta();
			$( units ).each( function( i, v ){
				v.toUpdate && v.update( delta );
			} );
			
			// sounds
			var camera = this.camera,
			position = camera.parent instanceof THREE.Scene ?
			camera.position : camera.parent.position;
			$( this.soundBoxes ).each( function( i, v ){
				v.update( position );
			} );
			
			this.renderer.render( this.scene, this.camera );
			this.stats.update();
			this.$userInfo.html( [
				'<p>',
					'ships: ', $( world.units ).filter( function( i, v ){
						return v.name === 'ship';
					} ).length,
				'</p>',
				'<p>',
					'kill: ', World.user.kill,
				'</p>',
				'<p>',
					'hp: ', World.user.hp, ' / ', World.user.hpMax,
				'</p>'
			].join( '' ) );
		},
		
		animate: function(){
			var _this = this;
			requestAnimationFrame( function(){
				_this.animate();
			} );
			
			this.update();
		},
		
		setupSoundBox: function( name, position, radius ){
			var box = {
				name: name,
				position: World.parseVector( position ),
				radius: radius,
				update: function( position ){
					var distance = this.position.distanceTo( position );
					
					if ( distance > this.radius ) {	// too far
						World.soundPlayer.setVolumeRatio( this.name, 0 );
					} else {
						World.soundPlayer.setVolumeRatio(
							this.name,
							1 - Math.pow( distance / this.radius, 2 )
						);
					}
				},
				play: function(){
					World.soundPlayer.play( this.name );
				}
			}
			this.soundBoxes.push( box );
		},
		
		setCamera: function( position, pointing ){
			position = World.parseVector( position );
			pointing = World.parseVector( pointing );
			
			this.scene.add( this.camera );
			this.camera.position = position;
			Unit.prototype.watchBy.call(
				this.camera,
				
				// XXX: negated for camera, dont know why
				pointing.clone().negate()
			);
		},
		
		bindCamera: function( ship ){
			ship.add( this.camera );	// should be at center
		},
		
		addUserShip: function( position, pointing ){
			var ship = this._makeShip( position, pointing );
			ship.setDriver( UserDriver );
			return ship;
		},
		addAIShip: function( position, pointing ){
			var ship = this._makeShip( position, pointing );
			ship.setDriver( AIDriver );
			return ship;
		},
		_makeShip: function( position, pointing ){
			position = World.parseVector( position );
			pointing = World.parseVector( pointing );
			
			var ship = new Ship( this );
			ship.position = position;
			ship.watchBy( pointing );
			this.scene.add( ship );
			
			this.units.push( ship );
			return ship;
		},
		
		addStation: function( position ){	// array to pass in
			position = World.parseVector( position );
			
			var station = new Station();
			station.position = position;
			this.scene.add( station );
			
			this.units.push( station );
			return station;
		},
		
		addSound: function( sources, loop, volumeMax, radius, position ){
			position = World.parseVector( position );
			
			var sound = new Sound( sources, loop, volumeMax, radius );
			sound.position = position;
			
			this.sounds.push( sound );
			return sound;
		},
		
		onWindowResize: function(){
			//var w = window.innerWidth,
			// XXX: removing the buggy white line at bottom
			//h = window.innerHeight + 3;
			var w = this.$screen.width();
			var h = this.$screen.height();
			
			World.windowRatio = w / h;
			this.camera.aspect = World.windowRatio;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize( w, h );
		}
	}, {
		windowRatio: window.innerWidth / window.innerHeight,
		
		parseVector: function( array ){
			var vector = new THREE.Vector3();
			return vector.fromArray( array );
		},
		
		soundPlayer: ( function(){
			var soundPlayer = new SoundPlayer();
			soundPlayer.load( {
				killSound: [
					'sounds/events/kill.mp3',
					'sounds/events/kill.ogg'
				],
				tapSound: [
					'sounds/events/tap.mp3',
					'sounds/events/tap.ogg'
				],
				dieSound: [
					'sounds/ship/die.mp3',
					'sounds/ship/die.ogg'
				],
				injureSound: [
					'sounds/ship/injure.mp3',
					'sounds/ship/injure.ogg'
				],
				fireSound: [
					'sounds/ship/fire.mp3',
					'sounds/ship/fire.ogg'
				]
			}, false, true )
			.load( {
				welcomeVoice: [
					'sounds/voices/welcome.mp3',
					'sounds/voices/welcome.ogg'
				],
				killVoice: [
					'sounds/voices/kill.mp3',
					'sounds/voices/kill.ogg'
				],
				injureVoice: [
					'sounds/voices/injure.mp3',
					'sounds/voices/injure.ogg'
				],
				dieVoice: [
					'sounds/voices/die.mp3',
					'sounds/voices/die.ogg'
				]
			} );
			return soundPlayer;
		} )(),
		
		bind: function( fn, scope ){
			return function(){
				fn.apply(scope, arguments);
			}
		},

		user: null
	} );
	
	window.World = World;
})();