(function( _ ){
	'use strict';
	
	// Unit extends Mesh
	var Unit = Class.extend.call( THREE.Mesh, {
		init: function(){
			// from the constructor of Mesh
			THREE.Object3D.call( this );
			
			// name, pointing
			this.name = this._class._name;	// _name
			this.pointing = Unit.pointing.clone();
			
			// hpMax, hp, alive
			this.hpMax = this._class.hpMax;
			this.hp = this.hpMax;
			
			// injuring timer
			this.injuringTimerId = -1;
			
			// flags
			this.alive = true;
			this.toUpdate = false;
			this.toDie = false;
		},
		
		// update to call only when 'toUpdate' is true
		update: function( delta ){
			// no update
		},
		
		start: function(){
			this.toUpdate = true;
		},
		
		stop: function(){
			this.toUpdate = false;
		},
		
		// called only by controller
		die: function(){
			this.toDie = false;
			if ( ! this.alive ) return;
			
			// prevent restore
			clearTimeout( this.injuringTimerId );
			
			this.alive = false;
			this.stop();
			
			var _this = this;
			Timer.doAndWait( function(){
				_this.setWireframe( true );
			}, 2000, function(){
				_this.parent.remove( _this );
			} );
		},
		
		injure: function( damage, weapon ){
			if ( ! this.alive ) return;
			
			// prevent restore
			clearTimeout( this.injuringTimerId );
			
			// drop the hp
			this.hp = Math.max( 0, this.hp - damage );
			if ( this.hp === 0 ) {
				this.toDie = true;
				return;
			}
			
			// blink the injury
			var _this = this;
			Timer.doAndWait( function( timerId ){
				_this.setOpacity( 0.7 );
				_this.injuringTimerId = timerId;
			}, 100, function(){
				_this.setOpacity( 1 );
				_this.injuringTimerId = -1;
			} );
		},
		
		setWireframe: function( flag ){
			if ( this.material.materials ) {
				$( this.material.materials ).each( function( i, v ){
					v.wireframe = flag;
				} );
			} else {
				this.material.wireframe = flag;
			}
		},
		setOpacity: function( opacity ){
			if ( this.material.materials ) {
				$( this.material.materials ).each( function( i, v ){
					v.opacity = opacity;
				} );
			} else {
				this.material.opacity = opacity;
			}
		},
		
		// no support for objects in rotated or translated parents
		watchBy: function( direction ){
			this.pointing = direction.normalize();	// normalized pointing
			this.lookAt( this.position.clone().sub( this.pointing ) );
		},
		
		translate: function( offset ){
			this.translateX( offset.x );
			this.translateY( offset.y );
			this.translateZ( offset.z );
		}
	}, {
		_name: 'unit',	// use '_name', 'name' is natively occupied
		geometry: new THREE.CubeGeometry( 50, 50, 50 ),
		material: new THREE.MeshBasicMaterial( { color: 0xaaaaaa } ),
		pointing: new THREE.Vector3( 0, 0, -1 ),
		hpMax: 100,
		speed: 1500
	} );
	
	window.Unit = Unit;
})();