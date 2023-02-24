import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'test-app/tests/helpers';
import { getApplication, visit } from '@ember/test-helpers';

module('Acceptance: ConfirmGlobal', function (hooks) {
  setupApplicationTest(hooks);

  let App;
  hooks.beforeEach(function () {
    App = getApplication();
  });

  hooks.afterEach(function () {
    App = undefined;
  });

  test('Set global', async function (assert) {
    assert.expect(1);

    App.someProp = 'foo-bar';
    await visit('/');

    await assert.strictEqual(
      window.TestApp.someProp,
      App.someProp,
      'App is exported to window.TestApp'
    );
  });

  test("Don't clobber", async function (assert) {
    assert.expect(1);

    window.TestApp = 'test';
    App.someProp = 'foo-bar';
    await visit('/');

    await assert.strictEqual(
      window.TestApp,
      'test',
      'App is not exported to window.TestApp'
    );
  });

  test('unsets global', async function (assert) {
    assert.expect(2);

    App.someProp = 'foo-bar';
    await visit('/');

    await assert.ok('TestApp' in window, 'global should be present');
    await run(App, 'destroy');
    await assert.notOk(
      'TestApp' in window,
      'global should NOT leak after it has been destroyed'
    );
  });
});
