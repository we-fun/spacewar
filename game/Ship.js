(function(){
	'use strict';
	
	var geometry = new THREE.CubeGeometry( 50, 50, 50 );
	for ( var i = 0; i < 6; i ++ ) {
		geometry.faces[ i ].materialIndex = 1;
	}
	geometry.faces[ 5 ].materialIndex = 0;
	
	// Ship extends Unit
	var Ship = Unit.extend( {
		init: function( world ){
			this._super();
			
			// speed
			this.speed = Ship.speed;
			
			// kill
			this.kill = 0;
			
			// world
			this.world = world;
			
			// mesh
			this.setGeometry( Ship.geometry.clone() );
			var textures = [
				'bluewool', 'redwool', 'opaque', 'netherrack',
				'glowstone', 'cobblestone', 'brick', 'plank'
			];
			var texture = textures[
				~~(Math.random()*textures.length)
			];
			var materials = [
				new THREE.MeshBasicMaterial( {
					map: THREE.ImageUtils.loadTexture( 'textures/diamond.png' )
				} ),
				new THREE.MeshBasicMaterial( {
					map: THREE.ImageUtils.loadTexture( 'textures/'+ texture +'.png' )
				} )
			];
			this.setMaterial( 
				new THREE.MeshFaceMaterial( materials )
			);
			
			// driver
			this.driver = null;
			
			// killer
			this.killer = null;
		},
		
		start: function(){	// override
			this.driver.start();
			
			this._super();
		},
		stop: function(){	// override
			this._super();
			
			this.driver.stop();
		},
		
		setDriver: function( driverType ){
			this.driver = new driverType( this );
		},
		
		update: function( delta ){	// override
			// moving command
			var offset = new THREE.Vector3(),
			command = this.driver.getCommand(),
			toMove = command.toMove;
			toMove.forth && ( offset.z -= 1 );
			toMove.back && ( offset.z += 1 );
			toMove.left && ( offset.x -= 1 );
			toMove.right && ( offset.x += 1 );
			toMove.up && ( offset.y += 1 );
			toMove.down && ( offset.y -= 1 );
			offset.normalize();
			
			// look
			this.watchBy( command.toLook );
			// fire
			if ( command.toFire ) {
				this.fire();
			}
			// move
			var actualOffset = offset
			.multiplyScalar( delta * this.speed );
			this.translate( actualOffset );
		},
		
		fire: function(){
			this.driver.hasFired();
			var scene = this.parent;
			
			var missile = new Missile( this );
			missile.position.copy( this.position );
			missile.watchBy( this.pointing );
			missile.translateY( -25 );
			scene.add( missile );
			
			this.world.units.push( missile );
			missile.start();
		},
		
		die: function(){	// override
			this._super();
			
			this.driver.hasDied( this.killer );
		},
		
		injure: function( damage, weapon ){	// override
			this._super( damage, weapon );
			
			if ( this.toDie ) {
				if ( weapon && ! this.killer ) {
					this.killer = weapon.host;	// weapon has a host
					this.killer.kill ++;
				}
			} else {
				this.driver.beenInjured( weapon );
			}
		}
	}, {
		_name: 'ship',
		//geometry: new THREE.CubeGeometry( 50, 50, 50 ),
		geometry: geometry,
		
		hpMax: Unit.hpMax,
		speed: Unit.speed
	} );
	
	window.Ship = Ship;
})();