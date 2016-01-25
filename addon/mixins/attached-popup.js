import Ember from 'ember';
import layout from '../templates/dom-render-contents';

export default Ember.Mixin.create({
  // we need a "tagfull" here to have `this.element`
  tagName: 'div',

  layout,
  popupOpen: false,

  /*
   * Evil hack by @rwjblue.
   * `hasBlock` isn't available in js land.
   * More info: https://github.com/miguelcobain/rfcs/blob/js-has-block/text/0000-js-has-block.md#alternatives
   */
  setHasBlock: computed(function() {
    this.set('hasBlock', true);
  }),

  // creates a document fragment that will hold the DOM
  destinationElement: computed(function() {
    return document.createElement('div');
  }),

  willInsertElement() {
    this._super(...arguments);
    this._firstNode = this.element.firstChild;
    this._lastNode = this.element.lastChild;
    this.appendToDestination();
  },

  appendToDestination() {
    let destinationElement = this.get('destinationElement');
    this.appendRange(destinationElement, this._firstNode, this._lastNode);
  },

  appendRange(destinationElement, firstNode, lastNode) {
    while(firstNode) {
      destinationElement.insertBefore(firstNode, null);
      firstNode = firstNode !== lastNode ? lastNode.parentNode.firstChild : null;
    }
  },

  didCreateLayer() {
    this._super(...arguments);
    if (this.get('hasBlock')) {
      this._popup = this.L.popup({}, this._layer);
      this._popup.setContent(this.get('destinationElement'));
    }
  },

});
