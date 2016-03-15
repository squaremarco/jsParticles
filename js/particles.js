;(function(options) {
	var canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	opt = options || {};

	canvas.width = opt.w || window.innerWidth - 20;
	canvas.height = opt.h || window.innerHeight - 20;

	var maxParticles = opt.max || 2000,
	particleRate = opt.rate || 2;


	var particles = [],
	emitters = [],
	fields = [];

	function loop() {
		clear();
		update();
		draw();
		queue();
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
		drawEmitters();
		drawFields();
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

	function addEmitter(point, velocity, spread) {
		emitters.push(new Emitter(point, velocity, spread)); //Range of values[0, 2 * Math.PI]
	}

	function addField(point, mass) {
		fields.push(new Field(point, mass));
	}

	function drawParticles() {
		for(var i = 0; i < particles.length; i++){
			ctx.fillStyle = particles[i].color;
			ctx.beginPath();
			ctx.arc(particles[i].position.x, particles[i].position.y, 1, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	function drawEmitters() {
		for(var i = 0; i < emitters.length; i++){
			ctx.fillStyle = emitters[i].color;
			ctx.beginPath();
			ctx.arc(emitters[i].position.x, emitters[i].position.y, 2, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	function drawFields() {
		for(var i = 0; i < fields.length; i++){
			ctx.fillStyle = fields[i].color;
			ctx.beginPath();
			ctx.arc(fields[i].position.x, fields[i].position.y, 2, 0, 2 * Math.PI);
			ctx.fill();
		}
	}

	function updateParticles(bw, bh) {
		particles = particles.filter(function(p){
			p.fieldEffect();
			p.move();
			return p.position.x >= 0 && p.position.x <= bw && p.position.y >= 0 && p.position.y <= bh;
		});
	}

	function randomColor() {
		return "#" + Math.floor(Math.random() * 155 + 100).toString(16) + Math.floor(Math.random() * 155 + 100).toString(16) + Math.floor(Math.random() * 100).toString(16);
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
		this.color = randomColor();
	}

	Particle.prototype = {
		move : function() {
			this.velocity.add(this.acceleration);
			this.position.add(this.velocity);
		},

		fieldEffect : function() {
			var ax = 0, ay = 0;
			for(var i = 0; i < fields.length; i++){
				var vecx = fields[i].position.x - this.position.x,
				vecy = fields[i].position.y - this.position.y;
				var force = fields[i].mass / Math.pow(vecx * vecx + vecy * vecy, 1.5);
				ax += vecx * force;
				ay += vecy * force;
			}
			this.acceleration = new Vector(ax, ay);
		}
	}

	var Emitter = function(center, velocity, spread) {
		this.position = center;
		this.velocity = velocity;
		this.spread = spread || Math.PI / 32;
		this.color = "#ff0";
	}

	Emitter.prototype = {
		emitParticle : function() {
			var angle = this.velocity.getAngle() + Math.random() * this.spread - this.spread / 2,
			magnitude = this.velocity.getMagnitude(),
			position = new Vector(this.position.x, this.position.y),
			velocity = Vector.prototype.fromPolar(magnitude, angle);
			return new Particle(position, velocity)
		}
	}

	var Field = function(center, mass){
		this.position = center;
		this.mass = mass || 100;
		this.color = (mass <= 0) ? "#f00" : "#0f0";
	}

	Field.prototype = {
		setMass : function(mass){
			this.mass = mass || 100;
			this.color = (mass <= 0) ? "#f00" : "#0f0";
		}
	}

	addEmitter(new Vector(canvas.width / 2 + 100, canvas.height / 2), Vector.prototype.fromPolar(1, Math.PI * 5/4), Math.PI / 12);
	addField(new Vector(canvas.width / 2, canvas.height / 2), -5);
	addField(new Vector(canvas.width / 2 - 10, canvas.height / 2 + 30), 100);
	loop();
}());
