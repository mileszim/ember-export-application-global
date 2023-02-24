import Application from '@ember/application';
import { classify } from '@ember/string';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';
import config from 'test-app/config/environment';
import { initialize } from 'test-app/initializers/export-application-global';

let originalModulePrefix, originalExportApplicationGlobal;

module('Unit | Initializer | export-application-global', function (hooks) {
  hooks.beforeEach(function () {
    originalModulePrefix = config.modulePrefix;
    originalExportApplicationGlobal = config.exportApplicationGlobal;

    this.TestApplication = class TestApplication extends Application {
      modulePrefix = config.modulePrefix;
      podModulePrefix = config.podModulePrefix;
      Resolver = Resolver;
    };

    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
    });
  });

  hooks.afterEach(function () {
    const classifiedName = classify(config.modulePrefix);
    delete window[classifiedName];
    delete window.Foo;
    delete window.Catz;
    config.modulePrefix = originalModulePrefix;
    config.exportApplicationGlobal = originalExportApplicationGlobal;
    run(this.application, 'destroy');
  });

  test('it sets the application on window with the classified modulePrefix', function (assert) {
    config.modulePrefix = 'foo';
    var app = { reopen: function () {} };
    initialize(null, app);

    assert.strictEqual(window.Foo, app);
  });

  test('it sets the application on window with the classified modulePrefix when exportApplicationGlobal is true', function (assert) {
    config.modulePrefix = 'foo';
    config.exportApplicationGlobal = true;
    var app = { reopen: function () {} };
    initialize(null, app);

    assert.strictEqual(window.Foo, app);
  });

  test('it does not set the global unless exportApplicationGlobal is true', function (assert) {
    config.modulePrefix = 'foo';
    config.exportApplicationGlobal = false;
    var app = { reopen: function () {} };
    initialize(null, app);

    assert.notStrictEqual(window.Foo, app);
  });

  test('it does not set the global if it already exists falsy', function (assert) {
    window.Foo = 'hello';
    config.modulePrefix = 'foo';
    var app = { reopen: function () {} };

    assert.notStrictEqual(window.Foo, app);
  });

  test('it sets a custom global name if specified', function (assert) {
    config.modulePrefix = 'foo';
    config.exportApplicationGlobal = 'Catz';
    var app = { reopen: function () {} };
    initialize(null, app);

    assert.notStrictEqual(window.Foo, app);
    assert.strictEqual(window.Catz, app);
  });
});
