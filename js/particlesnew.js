;(function(options) {
	var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	opt = options || {};

	canvas.width = opt.w || window.innerWidth - 5;
	canvas.height = opt.h || window.innerHeight - 5;

	var maxParticles = opt.max || 100000,
	particleRate = opt.rate || 10;


	var particles = [],
	emitters = [];

	function loop() {
		clear();
		update();
		draw();
		queue();
		console.log("ok");
	}

	function clear() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	function update() {
		addParticles();
		updateParticles(canvas.width, canvas.height);
	}

	function draw() {
		drawParticles();
	}

	function queue() {
		window.requestAnimationFrame(loop);
	}

	function addParticles() {
		if(particles.length > maxParticles) return;
		for(i = 0; i < emitters.length; i++){
			for(var j = 0; j < particleRate; j++) particles.push(emitters[i].emitParticle());
		}
	}

	function addEmitter() {
		var point = new Vector(canvas.width / 2, canvas.height / 2),
		velocity = new Vector(1, 0);
		emitters.push(new Emitter(point, velocity));
	}

	function drawParticles() {
		ctx.fillStyle = "#00f";
		for(var i = 0; i < particles.length; i++){
			ctx.fillRect(particles[i].position.x, particles[i].position.y, 1, 1);
		}
	}

	function updateParticles(bw, bh) {
		var newParticles = [];
		for(var i = 0; i < particles.length; i++){
			var particle = particles[i];
			if(particle.position.x >= 0 && particle.position.x <= bw && particle.position.y >= 0 && particle.position <= bh) continue;
			particle.move();
			newParticles.push(particle);
		}
		particles = newParticles;
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

		getMagnitude : function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},

		getAngle : function() {
			return Math.atan2(this.y, this.x);
		},

		fromPolar : function(magnitude, angle) {
			return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
		}
	}

	var Particle = function(point, velocity, acceleration) {
		this.position = point || new Vector(0, 0);
		this.velocity = velocity || new Vector(0, 0);
		this.acceleration = acceleration || new Vector(0, 0);
	}

	Particle.prototype = {
		move : function() {
			this.velocity.add(this.acceleration);
			this.position.add(this.velocity);
		}
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
			velocity = Vector.prototype.fromPolar(magnitude, angle);
			return new Particle(position, velocity)
		},
	}

	addEmitter();
	loop();
})();
