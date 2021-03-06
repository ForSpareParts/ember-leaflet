import Ember from 'ember';
/* global requirejs */

export default Ember.Controller.extend({

  componentList: Ember.computed(function() {
    let componentList = [];

    for (var key in requirejs.entries) {
      if (key.indexOf('ember-leaflet/components/') !== -1 && key.indexOf('jshint') === -1) {
        componentList.push(key.split('/').pop());
      }
    }

    return componentList;
  })

});
