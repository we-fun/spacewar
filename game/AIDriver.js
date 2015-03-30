(function(){
	'use strict';
	
	// AIDriver extends Driver
	var AIDriver = Driver.extend( {
		init: function( ship ){
			this._super( ship );
			
			// target, strategy
			this.target = new THREE.Vector3();
			this.strategy = AIDriver.strategies[ 0 ];
			
			// thinking timer
			var _this = this;
			this.movingTimer = new Timer( function(){
				_this.judgeMoving();
			}, 1000, true );
			this.firingTimer = new Timer( function(){
				_this.judgeFiring();
			}, 300, true );
		},
		
		// TODO
		start: function(){	// override
			this._super();
			
			this.movingTimer.start();
			this.firingTimer.start();
		},
		stop: function(){	// override
			this.movingTimer.stop();
			this.firingTimer.stop();
			
			this._super();
		},
		
		judgeMoving: function(){
			// looking
			var r1 = Math.random(),
			r2 = Math.random(),
			r3 = Math.random();
			this.target.set(
				1000 * ( r1 < 0.33 ? 1 : ( r1 < 0.66 ? -1 : 0 ) ),
				1000 * ( r2 < 0.33 ? 1 : ( r2 < 0.66 ? -1 : 0 ) ),
				1000 * ( r3 < 0.33 ? 1 : ( r3 < 0.66 ? -1 : 0 ) )
			);
			
			// moving
			var r = Math.random();
			r = r < 0.33 ? 0 : ( r < 0.77 ? 1 : 0 ); 
			this.strategy = AIDriver.strategies[ r ];
		},
		judgeFiring: function(){
			// firing
			this.toFire = Math.random() < 0.33;
		},
		
		hasDied: function( killer ){	// override
			this._super();
			
			if ( killer === World.user ) {
				Timer.doAndWait( function(){
					World.soundPlayer.play( 'killSound' );
				}, 800, function(){
					World.soundPlayer.replay( 'killVoice' );
				} );
			}
		},
		
		beenInjured: function( weapon ){	// override
			this._super();
			
			if ( weapon.host === World.user ) {
				World.soundPlayer.play( 'tapSound' );
			}
		},
		
		update: function(){
			var strategy = this.strategy,
			target = this.target;
			
			// toLook
			this.toLook = target.clone().sub( this.ship.position );
			
			// toMove
			this.toMove.forth = this.toMove.back = false;
			if ( strategy === 'forth' ) {
				this.toMove.forth = true;
			} else if ( strategy === 'back' ) {
				this.toMove.back = true;
			}
		},
		
		getCommand: function(){
			this.update();
			
			return this._super();
		}
	}, {
		strategies: [ 'wait', 'forth', 'back' ]
	} );
	
	window.AIDriver = AIDriver;
})();