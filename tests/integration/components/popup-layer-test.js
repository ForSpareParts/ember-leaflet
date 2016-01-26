import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import locations from '../../helpers/locations';

moduleForComponent('popup-layer', 'Integration | Component | popup layer', {
  integration: true,
  beforeEach() {
    this.set('center', locations.nyc);
    this.set('zoom', 13);

    this.set('popupLocation', locations.nyc);
    this.set('popupOpen', true);
    this.set('setPopupOpen', (value) => this.set('popupOpen', value));
  }
});

test('it fires the close event', function(assert) {

  this.render(hbs`
    {{#leaflet-map zoom=zoom center=center}}
      {{#if popupOpen}}
        {{#popup-layer
            location=popupLocation
            closePopup=(action setPopupOpen false)}}
          Popup text!
        {{/popup-layer}}
      {{/if}}
    {{/leaflet-map}}
  `);

  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup text!');


  //test that the close button fires the action
  this.$('.leaflet-popup-close-button').click();
  assert.equal(this.$('.leaflet-popup').length, 0);
  assert.equal(this.get('popupOpen'), false);

  this.set('popupOpen', true);
  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup text!');

  // test that a background click also fires the action
  this.$('.leaflet-map-pane').click();
  assert.equal(this.$('.leaflet-popup').length, 0);
  assert.equal(this.get('popupOpen'), false);

});
