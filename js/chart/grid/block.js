jui.define("chart.grid.block", [ "util.scale" ], function(UtilScale) {

	var BlockGrid = function(chart, axis, grid) {
		var orient = grid.orient;

		this.top = function(chart, g, scale) {
			var full_height = chart.area('height');
			
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

                if (!domain && domain !== 0) {
                    continue;
                }

				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});

				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? full_height : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : -20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				});

				axis.append(this.line(chart, {
					y2 : (grid.line) ? full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		this.bottom = function(chart, g, scale) {
			var full_height = chart.area('height');

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					x1 : this.start,
					x2 : this.end
				}));
			}

			for (var i = 0, len = this.points.length; i < len; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
                    continue;
                }
                
				var axis = chart.svg.group({
					"transform" : "translate(" + this.points[i] + ", 0)"
				});
				
				axis.append(this.line(chart, {
					x1 : -this.half_band,
					y1 : 0,
					x2 : -this.half_band,
					y2 : (grid.line) ? -full_height : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : 0,
					y : 20,
					"text-anchor" : "middle"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(" + this.end + ", 0)"
				})

				axis.append(this.line(chart, {
					y2 : (grid.line) ? -full_height : this.bar
				}));

				g.append(axis);
			}
		}
		
		this.left = function(chart, g, scale) {
			var full_width = chart.area('width');

			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}))
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band ) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? full_width : -this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : -this.bar - 4,
					y : this.half_band,
					"text-anchor" : "end"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				})

				axis.append(this.line(chart, {
					x2 : (grid.line) ? chart.area('width') : -this.bar
				}));

				g.append(axis);
			}
		}

		this.right = function(chart, g) {
			if (!grid.line) {
				g.append(this.axisLine(chart, {
					y1 : this.start,
					y2 : this.end
				}));
			}

			for (var i = 0; i < this.points.length; i++) {
				var domain = this.format(this.domain[i], i);

				if (!domain && domain !== 0) {
					continue;
				}

				var axis = chart.svg.group({
					"transform" : "translate(0, " + (this.points[i] - this.half_band) + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.area('width') : this.bar
				}));

				axis.append(this.getTextRotate(chart.text({
					x : this.bar + 4,
					y : this.half_band,
					"text-anchor" : "start"
				}, domain)));

				g.append(axis);
			}

			if (!grid.full) {
				var axis = chart.svg.group({
					"transform" : "translate(0, " + this.end + ")"
				});

				axis.append(this.line(chart, {
					x2 : (grid.line) ? -chart.area('width') : this.bar
				}));

				g.append(axis);
			}
		}

		this.drawBefore = function() {
			grid.type = grid.type || "block";
			grid = this.setBlockDomain(chart, grid);

			var obj = this.getGridSize(chart, orient, grid);

			// scale 설정
			this.scale = UtilScale.ordinal().domain(grid.domain);
			var range = [obj.start, obj.end];

			if (grid.full) {
				this.scale.rangeBands(range);
			} else {
				this.scale.rangePoints(range);
			}

			this.start = obj.start;
			this.size = obj.size;
			this.end = obj.end;
			this.points = this.scale.range();
			this.domain = this.scale.domain();

			this.band = this.scale.rangeBand();
			this.half_band = (grid.full) ? 0 : this.band / 2;
			this.bar = 6;
			this.reverse = grid.reverse;
		}

		this.draw = function() {
			return this.drawGrid(chart, orient, "block", grid);
		}

		this.drawSetup = function() {
			return this.getOptions({
				// core options
				max: 10,
				start: 0,
				size: 0,

				// block options
				full: false
			});
		}
	}

	return BlockGrid;
}, "chart.grid.core");
