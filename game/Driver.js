(function(){
	'use strict';
	
	// Driver
	var Driver = Class.extend( {
		init: function( ship ){
			this.ship = ship;
			
			// ejectors
			this.toMove = {
				forth: false, back: false,
				left: false, right: false,
				up: false, down: false,
			}
			// weapon
			this.toFire = false;
			// pointing
			this.toLook = ship.pointing.clone();
		},
		
		hasDied: function( killer ){
			// tell driver the ship has died
		},
		beenInjured: function( weapon ){
			// tell driver the ship has been injured
		},
		hasFired: function(){
			// tell driver the ship has fired
		},
		
		getCommand: function(){
			var command = {
				toMove: this.toMove,
				toFire: this.toFire,
				toLook: this.toLook
			}
			this.toFire = false;
			return command;
		},
		
		start: function(){
			
		},
		stop: function(){
			
		}
	}, {
		
	} );
	
	window.Driver = Driver;
})();