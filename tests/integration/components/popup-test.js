import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { assertionInjector, assertionCleanup } from '../../assertions';
import MarkerLayerComponent from 'ember-leaflet/components/marker-layer';
import locations from '../../helpers/locations';
const { computed } = Ember;
/* globals L */

//Needed to silence leaflet autodetection error
L.Icon.Default.imagePath = 'some-path';

let marker, layer;

moduleForComponent('marker-layer', 'Integration | Component | popup mixin', {
  integration: true,
  beforeEach() {
    assertionInjector();

    this.register('component:marker-layer', MarkerLayerComponent.extend({
      init() {
        this._super(...arguments);
        marker = this;
      },
      createLayer() {
        let leafletLayer = this._super(...arguments);
        layer = leafletLayer;
        return leafletLayer;
      }
    }));

    this.set('center', locations.nyc);
    this.set('zoom', 13);
  },
  afterEach() {
    assertionCleanup();
  }
});

test('popup works', function(assert) {
  this.set('markerCenter', locations.nyc);

  this.render(hbs`
    {{#leaflet-map zoom=zoom center=center}}
      {{#marker-layer location=markerCenter}}
        Popup content
      {{/marker-layer}}
    {{/leaflet-map}}
  `);

  assert.equal(this.$('.leaflet-popup').length, 0, 'popup not added until opened');

  Ember.run(() => {
    marker._layer.fire('click', { latlng: locations.nyc });
  });

  assert.equal(this.$('.leaflet-popup').length, 1, 'popup opened');
  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup content', 'popup content set');
});

test('popup content isn\'t rendered until it is opened (lazy popups)', function(assert) {
  var didRun = false;

  this.set('markerCenter', locations.nyc);
  this.set('computedProperty', computed(function() {
    didRun = true;
  }));

  this.render(hbs`
    {{#leaflet-map zoom=zoom center=center}}
      {{#marker-layer location=markerCenter}}
        {{computedProperty}}
      {{/marker-layer}}
    {{/leaflet-map}}
  `);

  assert.equal(this.$('.leaflet-popup').length, 0, 'popup not added until opened');

  assert.ok(!didRun, 'computed property did not run');

  Ember.run(() => {
    marker._layer.fire('click', { latlng: locations.nyc });
  });

  assert.equal(this.$('.leaflet-popup').length, 1, 'popup opened');
  assert.ok(didRun, 'computed property did run');

});

test('popup opens based on popupOpen', function(assert) {

  this.set('markerCenter', locations.nyc);
  this.set('popupOpen', true);

  this.render(hbs`
    {{#leaflet-map zoom=zoom center=center}}
      {{#marker-layer location=markerCenter popupOpen=popupOpen}}
        Popup content
      {{/marker-layer}}
    {{/leaflet-map}}
  `);

  assert.equal(this.$('.leaflet-popup').length, 1, 'popup starts open');
  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup content', 'popup content set');

  Ember.run(() => {
    this.set('popupOpen', false);
  });

  assert.equal(this.$('.leaflet-popup').length, 0, 'popup closed');

  Ember.run(() => {
    this.set('popupOpen', true);
  });

  assert.equal(this.$('.leaflet-popup').length, 1, 'popup opens again');
  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup content', 'popup content set');

});

test('popup closes when layer is destroyed', function(assert) {

  this.set('markerCenter', locations.nyc);
  this.set('isVisible', true);

  this.render(hbs`
    {{#leaflet-map zoom=zoom center=center}}
      {{#if isVisible}}
        {{#marker-layer location=markerCenter popupOpen=true}}
          Popup content
        {{/marker-layer}}
      {{/if}}
    {{/leaflet-map}}
  `);

  assert.equal(this.$('.leaflet-popup').length, 1, 'popup starts open');
  assert.equal(this.$('.leaflet-popup-content-wrapper').text().trim(), 'Popup content', 'popup content set');

  this.set('isVisible', false);

  assert.equal(this.$('.leaflet-popup').length, 0, 'popup closed');

});
