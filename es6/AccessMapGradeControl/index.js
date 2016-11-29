import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import extend from 'xtend';

import '!style!css!./AccessMapGradeControl.css';

// TODO: make use of es6 features (e.g. class constructor) function
// AccessMapCostControl(options) {
function AccessMapGradeControl(options) {
  this.options = extend({}, this.options, options);
}

AccessMapGradeControl.prototype = {

  options: {
    title: 'Grade (%)',
    domain: [0, 5, 10],
    colorScale: chroma.scale(['lime', 'yellow', 'red']).mode('lab')
  },

  onAdd: function(map) {
    this._map = map;
    this.colorScale = this.options.colorScale;

    // Create div(s) to target
    let el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-gradectrl mapboxgl-ctrl';

    let titleEl = document.createElement('h4');
    titleEl.className = 'gradectrl-title';
    titleEl.innerHTML = this.options.title;

    let plotEl = document.createElement('div');
    plotEl.className = 'gradectrl-plot';

    let gradeEl = this._gradeScale = document.createElement('div');
    gradeEl.className = 'gradectrl-grade-scale';

    let domainEl = document.createElement('div');
    domainEl.className = 'gradectrl-grade-domain';

    let min = document.createElement('span');
    min.className = 'domain-min'
    min.innerHTML = this.options.domain[0];
    let mid = document.createElement('span');
    mid.className = 'domain-mid'
    mid.innerHTML = this.options.domain[1]
    let max = document.createElement('span');
    max.className = 'domain-max'
    max.innerHTML = this.options.domain[2]

    domainEl.appendChild(min);
    domainEl.appendChild(mid);
    domainEl.appendChild(max);

    plotEl.appendChild(gradeEl);
    plotEl.appendChild(domainEl);

    el.appendChild(titleEl);
    el.appendChild(plotEl);

    this._drawGradient();

    return el;
  },

  onRemove: function() {
    this._container.parentNode.removeChild(this.container);
    this._map = null;

    return this;
  },

  _drawGradient() {
    for (let i = 0; i <= 100; i++) {
      let span = document.createElement('span');
      span.className = 'grad-step';
      span.style['background-color'] = this.colorScale(i / 100.);
      this._gradeScale.appendChild(span);
    }
  }
};

module.exports = AccessMapGradeControl;
