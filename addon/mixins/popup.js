import Ember from 'ember';
import layout from '../templates/popup';
/* global L */

const { Mixin } = Ember;

export default Mixin.create({
 layout,

  defaultPopupOffset: null, //calculated at runtime

  popupOffset: null,
  popupLocation: null,

  init() {
    this._super(...arguments);

    if (!this.get('setPopupOpen')) {
      this.set('setPopupOpen', (value) => {
        this.set('popupOpen', value);
      });
    }

    if (!this.get('onClick')) {
      this.set('onClick', this._getDefaultOnClick());
    }
  },

  didCreateLayer() {
    this._super(...arguments);

    this.set('defaultPopupOffset', this._getDefaultPopupOffset());

    //if the user has already specified a popupOffset, keep it
    if (!this.get('popupOffset')) {
      //otherwise, use the default
      this.set('popupOffset', this.get('defaultPopupOffset'));
    }
  },

  /**
   * Return the default offset position of a popup for this class. If a user
   * specifies `popupOffset`, their value will be used instead.
   */
  _getDefaultPopupOffset() {
    return L.Popup.prototype.options.offset;
  },


  /**
   * Return the default click handler for this class (often used for popups). If
   * a user specifies `onClick`, their callback will be used instead.
   */
  _getDefaultOnClick() {
    return undefined;
  }

});
