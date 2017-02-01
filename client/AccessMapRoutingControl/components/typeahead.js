import debounce from 'lodash.debounce';
import assign from 'lodash.assign';
import Suggestions from 'suggestions';
import MapboxClient from 'mapbox/lib/services/geocoding';

// FIXME: the Typeahead class fires an extra 'change' event on click. This
// is bad - it launches two route requests. This is a messy hack around
// that copied from version 1.3.1
Suggestions.prototype.value = function(value) {
  this.selected = value;
  this.el.value = this.getItemValue(value);
};

class Typeahead {
  constructor(el, opts) {
    // el is a container element - a text input will be created for it, and the
    // typeahead container appended as a neighbor
    let options = this.options = {
      placeholder: 'Search location',
      accessToken: undefined,
      // Seattle
      bbox: [-122.4325535, 47.4837601, -122.2273287, 47.7390944]
    };
    assign(options, opts);

    this._mapboxClient = new MapboxClient(this.options.accessToken);

    let inputEl = this.input = document.createElement('input');
    inputEl.className = 'geocoder-input';
    inputEl.type = 'text';
    inputEl.placeholder = this.options.placeholder;
    inputEl.title = this.options.placeholder;
    el.appendChild(inputEl);

    let typeahead = this._typeahead = new Suggestions(inputEl, [], { filter: false });
    typeahead.getItemValue = function(item) { return item.place_name; };

    let onKeyDown = this._onKeyDown.bind(this);
    inputEl.addEventListener('keydown', debounce(onKeyDown, 200));
  }

  on(event, cb) {
    // Accepted inputs are identical to any input events
    let typeahead = this._typeahead;
    this.input.addEventListener(event, function(e) {
      cb(e, typeahead.selected);
    });
  }

  updatePlaceholder(newplaceholder) {
    this.input.placeholder = this.input.title = newplaceholder;
  }

  _geocode(search, cb) {
    if (!search) return;
    let request = this._mapboxClient.geocodeForward(search, {
      // Bounding box for Seattle area
      bbox: this.options.bbox,
      county: 'us'
    });

    request.then(cb);
  }

  _onKeyDown(e) {
    // Ignore tab, esc, left, right, enter, up, down
    if (e.metakey || [9, 27, 37, 39, 13, 38, 40].indexOf(e.keyCode) !== -1) {
      return;
    }
    let typeahead = this._typeahead;
    this._geocode(e.target.value, function(response) {
      typeahead.update(response.entity.features);
    });
  }
}

module.exports = Typeahead;
