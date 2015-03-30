/** 
 * @author h5-Lium / http://weibo.com/hellolium
 */

( function(){
	'use strict';
	
	// Timer
	var Timer = Class.extend( {
		init: function( task, cycle, atOnce, countMax ){
			this.task = task || function(){}
			this.cycle = cycle || 20;
			this.atOnce = !! atOnce;
			this.countMax = countMax || Infinity;
			this.count = 0;
			
			this.timerId = -1;
		},
		
		restart: function(){
			this.stop();
			this.count = 0;
			return this.start();
		},
		start: function(){
			var _this = this;
			
			if ( this.atOnce ) {
				doTask();
			}
			this.timerId = setInterval( function(){
				doTask();
			}, this.cycle );
			return this;
			
			function doTask() {
				if ( _this.count === _this.countMax ) {
					_this.stop();
					return;
				}
				_this.task();
				_this.count ++;
			}
		},
		stop: function(){
			clearInterval( this.timerId );
			this.timerId = -1;
			return this;
		},
		
		isRunning: function(){
			return this.timerId !== -1;
		}
	}, {
		doAndWait: function( first, delay, next ){
			var timerId = setTimeout( next, delay );
			first( timerId );
			return this;
		},
		
		waitUntil: function( toDo, judgeFrom, cycle ){
			var timer = new Timer( function(){
				if ( judgeFrom() && timer.isRunning() ) {
					timer.stop();
					toDo();
				}
			}, cycle, true );
			timer.start();
			return this;
		}
	} );
	
	window.Timer = Timer;
} )();