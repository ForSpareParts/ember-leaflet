import Ember from 'ember';
/* global L */

import BaseLayer from 'ember-leaflet/components/base-layer';
import DraggabilityMixin from 'ember-leaflet/mixins/draggability';
import PopupMixin from 'ember-leaflet/mixins/popup';
import toLatLng from 'ember-leaflet/macros/to-lat-lng';
import layout from 'ember-leaflet/templates/popup';

export default BaseLayer.extend(DraggabilityMixin, {

  tagName: 'div',

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
    return layer = this.L.marker(...this.get('requiredOptions'), this.get('options'));
  },

  didCreateLayer() {
    this._super(...arguments);

    //based on: https://github.com/Leaflet/Leaflet/blob/v0.7.7/src/layer/marker/Marker.Popup.js#L33
    const popupAnchor = L.point(this._layer.options.icon.options.popupAnchor);
    const baseOffset = L.Popup.prototype.options.offset;

    this.set('defaultPopupOffset', popupAnchor.add(baseOffset));

    //if the user has already specified a popupOffset, keep it
    if (!this.get('popupOffset')) {
      //otherwise, use the default
      this.set('popupOffset', this.get('defaultPopupOffset'));
    }
  }

  //-------------FACTOR OUT (popup support)---------------------------
  // tagName: 'div',

  // willInsertElement() {
  //   this._super(...arguments);
  //   this._firstNode = this.element.firstChild;
  //   this._lastNode = this.element.lastChild;
  //   this.appendToDestination();
  // },

  // appendToDestination() {
  //   let destinationElement = this.get('destinationElement');
  //   this.appendRange(destinationElement, this._firstNode, this._lastNode);
  // },

  // appendRange(destinationElement, firstNode, lastNode) {
  //   while(firstNode) {
  //     destinationElement.insertBefore(firstNode, null);
  //     firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
  //   }
  // },

  layout,

  popupOpen: true,

  defaultPopupOffset: null, //calculated at runtime
  popupOffset: null,

  // /*
  //  * Evil hack by @rwjblue.
  //  * `hasBlock` isn't available in js land.
  //  * More info: https://github.com/miguelcobain/rfcs/blob/js-has-block/text/0000-js-has-block.md#alternatives
  //  */
  // setHasBlock: Ember.computed(function() {
  //   this.set('hasBlock', true);
  // }),

  // // creates a document fragment that will hold the DOM
  // destinationElement: Ember.computed(function() {
  //   return document.createElement('div');
  // }),


});
