import * as d3 from 'd3';
import * as chroma from 'chroma-js';
import extend from 'xtend';

import '!style!css!./AccessMapGradeControl.css';

// TODO: make use of es6 features (e.g. class constructor) function
function AccessMapGradeControl(options) {
  this.options = extend({}, this.options, options);
}

AccessMapGradeControl.prototype = {

  options: {
    xlabel: 'grade (%)',
    domain: [0, 5, 10],
    colorScale: chroma.scale(['lime', 'yellow', 'red']).mode('lab')
  },

  onAdd: function(map) {
    this._map = map;
    this.colorScale = this.options.colorScale;

    // Create div(s) to target
    let el = this.container = document.createElement('div');
    el.className = 'mapboxgl-ctrl-gradectrl mapboxgl-ctrl';

    let xLabelEl = document.createElement('div');
    xLabelEl.className = 'gradectrl-xlabel';
    xLabelEl.innerHTML = this.options.xlabel;

    let plotEl = document.createElement('div');
    plotEl.className = 'gradectrl-plot';

    let gradeEl = this._gradeScale = document.createElement('div');
    gradeEl.className = 'gradectrl-grade-scale';

    let domainEl = document.createElement('div');
    domainEl.className = 'gradectrl-grade-domain';

    let axisLabels = ['min', 'mid', 'max'];
    for (let i = 0; i < 3; i++) {
      let label = document.createElement('div');
      label.className = 'domain-' + axisLabels[i];
      label.innerHTML = this.options.domain[i];
      domainEl.appendChild(label);
    }

    plotEl.appendChild(gradeEl);
    plotEl.appendChild(domainEl);

    el.appendChild(plotEl);
    el.appendChild(xLabelEl);

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
