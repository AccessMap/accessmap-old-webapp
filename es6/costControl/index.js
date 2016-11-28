import * as d3 from 'd3';
import * as chroma from 'chroma-js';
// import events from 'events';
import extend from 'xtend';


// TODO: make use of es6 features (e.g. class constructor)
function AccessMapCostControl(options) {
  // this._eventEmitter = new events.eventEmitter();
  this.options = extend({}, this.options, options);
}

AccessMapCostControl.prototype = {

  options: {
    // Layer for which to control general appearance (colors, etc)
    'layer': 'sidewalks',
    'layer-prop': 'grade',
    // control points for the elevation cost function
    a: [-10, 100],
    b: [-5, 30],
    c: [-1, 0],
    d: [4, 30],
    e: [8.33, 100]
  },

  onAdd: function(map) {
    this._map = map;

    // Bind any desired events here - e.g. keyboard interaction
    // this._onKeyDown = this._onKeyDown.bind(this);

    // FIXME: Add split screen, apply sidewalk layer coloring

    // Create div(s) to target with d3, input forms
    // To add things like icons, etc. create a span here with a specific
    // class and target with CSS
    let el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-costcontrol mapboxgl-ctrl';

    let costplot = document.createElement('div');
    costplot.className = 'costplot';

    el.appendChild(costplot);

    let that = this;
    map.on('load', function() {
      that._setupPlot(that);
    });

    return el;
  },

  onRemove: function() {
    this._container.parentNode.removeChild(this.container);
    this._map = null;

    return this;
  },

  _setupPlot: function(that) {
    let options = that.options;
    let map = that._map;
    // create svg canvas
    let svg = d3.select('.costplot')
                .append('svg')
                .attr('width', 400)
                .attr('height', 200);
    let margin = 50;
    let w = svg.attr('width') - margin;
    let h = svg.attr('height') - margin;

    // set up d3 axes

    let g = svg.append('g')
      .attr('transform', 'translate(' + margin / 2 + ',' + margin / 2 + ')');

    let x = d3.scaleLinear()
      .domain([-10, 10])
      .range([0, w])
      .clamp(true);
    let y = d3.scaleLinear()
      .domain([0, 100])
      .range([h, 0])
      .clamp(true);

    g.append('g')
      .attr('class', 'axis axis-x')
      .attr('transform', 'translate(0,' + h + ')')
      .call(d3.axisBottom(x));

    g.append('g')
      .attr('class', 'axis axis-y')
      .call(d3.axisLeft(y));

    // * d3 place initial points
    //   TODO: grab from cookie, if available
    let data = [options.a, options.b, options.c, options.d, options.e];
    data = data.map(function (d, i) {
      return {x: d[0], y: d[1], id: i}
    });

    let line = d3.line()
      .x(function(d) { return x(d.x) })
      .y(function(d) { return y(d.y) });

    let lines = g.selectAll('lines')
      .data([data])
    .enter().append('path')
      .attr('class', 'lines')
      .attr('d', function(d) { return line(d) })
      .style('fill', 'none')
      .style('stroke', 'blue')
      .style('stroke-width', '2px');

    let pointGroup = g.append('g')
      .attr('class', 'points');

    let point = pointGroup.selectAll('points')
      .data(data)
    .enter().append('circle')
      .attr('cx', function(d) { return x(d.x) })
      .attr('cy', function(d) { return y(d.y) })
      .attr('r', 5)
      .style('fill', 'black')
      .call(d3.drag()
        .on('start drag', dragged));

    function dragged(d) {
      // Using a linear scale + tracking drag events has some odd behavior -
      // It doesn't originate at a reasonable location. Have to hack around it
      // until we understand the proper transformations/settings
      // The hack: use dx and dy and convert manually to get setting. Likely
      // introduces some error

      // Note: can't modify cutoffs via control points

      let dx = d3.event.dx * (20 / w);
      let dy = -1 * d3.event.dy * (100 / h);

      if (d.id == 1 || d.id == 3) {
        // between control points
        d.x += dx;
        d.y += dy;

      } else {
        // Center control point - only left/right allowed
        d.x += dx;
      }

      // Update
      d3.select(this)
        .attr('cx', function(d) { return x(d.x) })
        .attr('cy', function(d) { return y(d.y) });

      lines
        .attr('d', line(data));

      updateColors();
    }

    function updateColors() {
      let colorScale = chroma.scale(['lime', 'yellow', 'red']);
      // Update coloring scheme for map
      // TODO: have separate modes: uphill vs. downhill. Current method uses
      // line direction, which has no meaning on the map view
      function densify(arr) {
        arr = arr.slice();
        for (let i = (arr.length - 1); i > 0; i--) {
          arr.splice(i, 0, {
            x: (arr[i - 1].x + arr[i].x) / 2,
            y: (arr[i - 1].y + arr[i].y) / 2
          });
        }
        return arr;
      }

      let denseData = densify(densify(data));

      let stops = denseData.map(function(d) {
        let x = 1e-2 * d.x;
        let y = colorScale(1e-2 * d.y).hex();
        return [x, y]
      });

      map.setPaintProperty('sidewalks', 'line-color', {
        property: 'grade',
        colorSpace: 'lab',
        stops: stops
      });
    }

  }
};

module.exports = AccessMapCostControl;
