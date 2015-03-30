(function(){
	'use strict';
	
	// Missile extends Unit
	var Missile = Unit.extend( {
		init: function( host ){
			this._super();
			
			// mesh
			this.setGeometry( Missile.geometry.clone() );
			this.setMaterial( Missile.material.clone() );
			
			// host
			this.host = host;
			
			// harm, speed
			this.harm = Missile.harm;
			this.speed = Missile.speed;
			
			// deadline
			this.deadline = Date.now() + Missile.lifecycle;
			
			// hit test
			this.raycaster = new THREE.Raycaster();
			
			// for inside station bug
			
		},
		
		update: function( delta ){	// override
			// check deadline
			if ( Date.now() > this.deadline ) {
				this.toDie = true;
			}
			
			var actualSpeed = this.speed * delta;
			
			// hit testing
			if ( this.hitTest( actualSpeed ) ) {
				this.toDie = true;
			} else {
				this.translateZ( - actualSpeed );
			}
		},
		
		hitTest: function( speed ){
			var didHit = false,
			units = this.host.world.units;
			
			this.raycaster.set( this.position, this.pointing );
			var intersects = this.raycaster.intersectObjects( units );
			
			// except self and the host
			var _this = this;
			intersects = $( intersects ).filter( function( i, v ){
				return v.object !== _this && v.object !== _this.host;
			} );
			if ( intersects.length ) {	// has target
				if ( intersects[ 0 ].distance < speed ) {	// distance
					intersects[ 0 ].object
					.injure( this.harm, this );	// hurt the unit
					didHit = true;
				}
			}
			
			return didHit;
		},
		
		die: function(){	// override
			this.toDie = false;
			if ( ! this.alive ) return;
			
			this.alive = false;
			this.stop();
			this.parent.remove( this );	// disappear at once
		},
		
		injure: function( damage, weapon ){	// override
			this.toDie = true;	// to die when injured
		}
	}, {
		_name: 'missile',
		geometry: new THREE.CubeGeometry( 10, 10, 10 ),
		
		//material: new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
		material: new THREE.MeshBasicMaterial(
			{
				map: THREE.ImageUtils.loadTexture( 'textures/ice.png' )
			}
		),
		
		hpMax: Unit.hpMax * 0.1,
		speed: Unit.speed * 7,
		harm: 20,
		lifecycle: 1000 * 1
	} );
	
	window.Missile = Missile;
})();