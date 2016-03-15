;(function(options) {
	var canvas = document.getElementById('canvas'),
		ctx = canvas.getContext('2d'),
		opt = options || {};

	canvas.width = opt.w || window.innerWidth;
	canvas.height = opt.h || window.innerHeight;

	var maxParticles = opt.max || 100,
		particleRate = opt.rate || 10;

	var Simulation = function() {
		this.particles = [];
		this.emitters = [];
	}

	Simulation.prototype = {
		init : function(){
			var self = this;
			setInterval(function(){
				self.clear();
				self.update();
				self.draw();
			}, 1000/60);
		},

		clear : function() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		},

		update : function() {
			this.addParticles();
			this.plotParticles(canvas.width, canvas.height);
		},

		draw : function() {
			ctx.fillStyle = "#00f";
			for(var i = 0; i < this.particles.length; i++){
				ctx.fillRect(particles[i].x, particles[i].y, 1, 1);
			}
		},

		queue : function() {
		},

		addEmitter : function() {

		},

		addParticles : function() {
			if(this.particles.length > maxParticles) return;
			for(i = 0; i < this.emitters.length; i++){
				for(var j = 0; j < particleRate; j++) this.particles.push(this.emitters[i].emitParticle());
			}
		},

		plotParticles : function(bw, bh) {
			var newParticles = [];
			for(var i = 0; i < this.particles.length; i++){
				var particle = this.particles[i];
				if(particle.position.x >= 0 && particle.position.x <= bw && particle.position.y >= 0 && particle.position <= bh) continue;
				particle.move();
				newParticles.push(particle);
				console.log(newParticles);
			}
			this.particles = newParticles;
		}
	}

	var Vector = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	Vector.prototype = {
		add : function(vector) {
			this.x += vector.x;
			this.y += vector.y;
		},

		scalar : function(vector) {
			return this.x * vector.x + this.y * vector.y;
		},

		getMagnitude : function() {
			return Math.sqrt(this.scalar(this));
		},

		getAngle : function() {
			return Math.atan2(this.y, this.x);
		},

		fromPolar : function(magnitude, angle) {
			return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
		}
	}

	var Particle = function(center, velocity, acceleration) {
		this.position = center || new Vector(0, 0);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
	}

	Particle.prototype = {
		move : function() {
			this.velocity.add(this.acceleration);
			this.position.add(this.velocity);
		},
	}

	var Emitter = function(center, velocity, spread) {
		this.position = center;
		this.velocity = velocity;
		this.spread = spread || Math.PI / 32;
	}

	Emitter.prototype = {
		emitParticle : function() {
			var angle = this.velocity.getAngle() + Math.random() * this.spread * 2 - this.spread,
				magnitude = this.velocity.getMagnitude(),
				position = new Vector(this.position.x, this.position.y),
				velocity = Vector.fromPolar(magnitude, angle);
			return new Particle(position, velocity)
		},
	}

	new Simulation().init();
})();
