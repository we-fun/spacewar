(function(){
	'use strict';
	
	// Station extends Unit
	var Station = Unit.extend( {
		init: function(){
			this._super();
			
			// mesh
			this.setGeometry( Station.geometry.clone() );
			this.setMaterial( Station.material.clone() );
		},
		
		injure: function( damage, attacker ){	// override
			damage = 0;	// station receives no damage
			this._super( damage, attacker );
		}
	}, {
		_name: 'station',
		geometry: new THREE.CubeGeometry( 500, 500, 500 ),
		
		//material: new THREE.MeshBasicMaterial( { color: 0xff00ff } ),
		material: new THREE.MeshPhongMaterial(
			{
				map: THREE.ImageUtils.loadTexture( 'textures/blockDiamond.png' ),
				
				// for inside the station
				side: THREE.DoubleSide
			}
		),
		
		hpMax: Unit.hpMax * 10
	} );
	
	window.Station = Station;
})();