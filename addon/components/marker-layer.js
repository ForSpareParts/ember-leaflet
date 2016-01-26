import Ember from 'ember';
/* global L */

import BaseLayer from 'ember-leaflet/components/base-layer';
import DraggabilityMixin from 'ember-leaflet/mixins/draggability';
import PopupMixin from 'ember-leaflet/mixins/popup';
import toLatLng from 'ember-leaflet/macros/to-lat-lng';

export default BaseLayer.extend(DraggabilityMixin, PopupMixin, {
  leafletRequiredOptions: [
    'location'
  ],

  leafletOptions: [
    'icon', 'clickable', 'draggable', 'keyboard', 'title',
    'alt', 'zIndexOffset', 'opacity', 'riseOnHover', 'riseOffset'
  ],

  leafletEvents: [
    'click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'dragstart', 'drag', 'dragend', 'move', 'remove',
    'popupopen', 'popupclose'
  ],

  leafletProperties: [
    'icon', 'zIndexOffset', 'opacity', 'location:setLatLng'
  ],

  location: toLatLng(),

  createLayer() {
    return this.L.marker(...this.get('requiredOptions'), this.get('options'));
  },

  _getDefaultPopupOffset() {
    //based on: https://github.com/Leaflet/Leaflet/blob/v0.7.7/src/layer/marker/Marker.Popup.js#L33
    const popupAnchor = L.point(this._layer.options.icon.options.popupAnchor || [0, 0]);
    const baseOffset = L.Popup.prototype.options.offset;

    return popupAnchor.add(baseOffset);
  },

  _getDefaultOnClick() {
    return () => this.set('popupOpen', !this.get('popupOpen'));
  },

  popupLocation: Ember.computed.oneWay('location')
});
