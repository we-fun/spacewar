/** 
 * @author h5-Lium / http://weibo.com/hellolium
 */

( function(){
	'use strict';
	
	// Sound
	var Sound = Class.extend( {
		init: function( sources, loop, multiple, volumeMax, volumeRatio ){
			this.loop = !! loop;
			this.multiple = !! multiple;
			this.stopped = false;
			
			var _this = this;
			this.$audio = $( '<audio>' )
			.on( 'ended', function( e ){
				if ( _this.loop ) {
					_this.replay();
				} else {
					_this.stop();
				}
			} );
			this.$current = this.$audio;
			// select a type can be played
			this.source = '';
			sources = sources.concat();	// clone array
			for ( var i = 0, ext; i < sources.length; i ++ ) {
				ext = /[^\.]+$/.exec( sources[ i ] );
				if ( this.$audio[ 0 ].canPlayType( 'audio/' + ext ) ) {
					this.source = sources[ i ];
					break;
				}
			}
			this.loadSource();
			
			// volume
			this.volumeMax = isNaN( volumeMax ) ? 1 : volumeMax;
			this.volumeRatio = isNaN( volumeRatio ) ? 1 : volumeRatio;
			
			// insuring loaded
			this.loaded = false;
			this.insuringTimerId = -1;
			this.insureLoaded();
		},
		insureLoaded: function(){
			var _this = this;
			this.insuringTimerId = setInterval( function(){
				if ( _this.$audio[ 0 ].readyState < 3 ) {
					_this.loadSource( true );
				} else {
					clearInterval( _this.insuringTimerId );
					_this.loaded = true;
				}
			}, 1000 );
		},
		loadSource: function( randomly ){
			this.$audio.attr(
				'src',
				this.source + ( randomly ? ( '?_=' + Date.now() ) : '' )
			);
			return this;
		},
		
		setVolumeMax: function( value ){
			this.volumeMax = value;
			return this.setVolumeRatio( this.volumeRatio );
		},
		setVolumeRatio: function( ratio ){
			this.volumeRatio = ratio;
			this.$current[ 0 ].volume = this.volumeMax * this.volumeRatio;
			return this;
		},
		
		replay: function(){
			return this.stop().play();
		},
		play: function(){
			var _this = this;
			if ( this.multiple || this.stopped ) {
				this.$current = this.$audio.clone()
				.on( 'ended', function( e ){
					if ( _this.loop ) {
						_this.replay();
					} else {
						_this.stop();
					}
				} );
			}
			this.stopped = false;
			this.setVolumeMax( this.volumeMax );
			
			this.$current[ 0 ].play();
			return this;
		},
		stop: function(){
			this.pause();
			this.stopped = true;
			return this;
		},
		pause: function(){
			this.$current[ 0 ].pause();
			return this;
		},
		
		isPaused: function(){
			return this.$current[ 0 ].paused;
		},
		isEnded: function(){
			return this.$current[ 0 ].ended;
		}
	}, {
		
	} );
	
	// SoundPlayer
	var SoundPlayer = Class.extend( {
		init: function(){
			this.sounds = {};
		},
		load: function( sounds, loop, multiple, volumeMax, volumeRatio ){
			for ( var key in sounds ) {
				this.sounds[ key ] = new Sound(
					sounds[ key ], loop, multiple, volumeMax, volumeRatio
				);
			}
			return this;
		},
		
		setVolumeMax: function( name, value ){
			this.sounds[ name ].setVolumeMax( value );
			return this;
		},
		setVolumeRatio: function( name, ratio ){
			this.sounds[ name ].setVolumeRatio( ratio );
			return this;
		},
		
		replay: function( name ){
			this.sounds[ name ].replay();
			return this;
		},
		play: function( name ){
			this.sounds[ name ].play();
			return this;
		},
		stop: function( name ){
			this.sounds[ name ].stop();
			return this;
		},
		pause: function( name ){
			this.sounds[ name ].pause();
			return this;
		},
		
		getNotLoaded: function(){
			var names = [];
			for ( var key in this.sounds ) {
				if ( ! this.sounds[ key ].loaded ) {
					names.push( key );
				}
			}
			return names;
		},
		isAllLoaded: function(){
			var flag = true;
			for ( var key in this.sounds ) {
				if ( ! this.sounds[ key ].loaded ) {
					flag = false;
					break;
				}
			}
			return flag;
		}
	}, {
		
	} );
	
	window.SoundPlayer = SoundPlayer;
} )();