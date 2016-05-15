(function(){
	'use strict';
	
	// UserDriver extends Driver
	var UserDriver = Driver.extend( {
		init: function( ship ){
			this._super( ship );
			
			// looking parameters
			var pointing = this.ship.pointing;
			// XXX: make the lon, lat correct
			this.lon = THREE.Math.radToDeg(
				Math.atan2( pointing.z, pointing.x )
			);
			this.lat = THREE.Math.radToDeg(
				Math.asin( pointing.y )
			);
			this.phi = 0;
			this.theta = 0;
		},
		
		// TODO
		start: function(){	// override
			this._super();
			
			// listen events
			$( document ).on(
				'keydown keyup',
				World.bind( UserDriver.onKeyChange, this )
			).on(
				'mousemove',
				World.bind( UserDriver.onMouseMove, this )
			).on(
				'mousedown',
				World.bind( UserDriver.onMouseDown, this )
			);
		},
		stop: function(){	// override
			this._super();
			
			this.ship.world.setCamera(
				[ 2500, 2500, 2500 ],
				[ -1, -1, -1 ]
			);
			
			// reload the page
			setTimeout( function(){
				location.reload();
			}, 15000 );
		},
		
		hasDied: function( killer ){	// override
			this._super();
			
			Timer.doAndWait( function(){
				World.soundPlayer.stop( 'injureSound' );
				World.soundPlayer.play( 'dieSound' );
			}, 800, function(){
				World.soundPlayer.stop( 'injureVoice' );
				World.soundPlayer.replay( 'dieVoice' );
			} );
		},
		
		beenInjured: function( weapon ){	// override
			this._super();
			
			if ( ! this.ship.toDie ) {
				Timer.doAndWait( function(){
					World.soundPlayer.play( 'injureSound' );
				}, 800, function(){
					World.soundPlayer.replay( 'injureVoice' );
				} );
			}
			
			// bloody the screen
			var world= this.ship.world;
			world.overlayTimer.stop();
			world.$overlay.css( {
				'background-color': 'rgba( 255, 0, 0, 0.3 )'
			} ).removeClass( 'hidden' );
			world.overlayTimer.restart();
		},
		
		hasFired: function(){	// override
			this._super();
			
			World.soundPlayer.play( 'fireSound' );
		}
	}, {
		onMouseMove: function( event ){
			if ( ! this.ship.world.locked ) return;
			event = event.originalEvent;
			var dx = event.movementX || event.webkitMovementX || event.mozMovementX || 0,
			dy = event.movementY || event.webkitMovementY || event.mozMovementY || 0;
			
			this.lon += dx * UserDriver.lookingSpeed;
			this.lat += dy * UserDriver.lookingSpeed * World.windowRatio;
			
			this.lat = Math.max( - 89, Math.min( 89, this.lat ) );
			this.phi = THREE.Math.degToRad( 90 - this.lat );
			this.theta = THREE.Math.degToRad( this.lon );
			
			this.toLook.set(
				Math.sin( this.phi ) * Math.cos( this.theta ),
				- Math.cos( this.phi ),
				Math.sin( this.phi ) * Math.sin( this.theta )
			);
		},
		
		onMouseDown: function( event ){
			if ( ! this.ship.world.locked ) return;
			
			if ( event.which === 1 ) {
				this.toFire = true;
			}
		},
		
		onKeyChange: function( event ){
			if ( ! this.ship.world.locked ) return;
			var flag = event.type === 'keydown',
			key = event.which,
			keyTable = UserDriver.keyTable;
			
			if ( key === keyTable.W ) {
				this.toMove.forth = flag;
			} else if ( key === keyTable.S ) {
				this.toMove.back = flag;
			} else if ( key === keyTable.A ) {
				this.toMove.left = flag;
			} else if ( key === keyTable.D ) {
				this.toMove.right = flag;
			} else if ( key === keyTable.R ) {
				this.toMove.up = flag;
			} else if ( key === keyTable.F ) {
				this.toMove.down = flag;
			}
		},
		
		lookingSpeed: 0.1,
		
		keyTable: {
			W: 87, S: 83, A: 65, D: 68, R: 82, F: 70
		}
	} );
	
	window.UserDriver = UserDriver;
})();