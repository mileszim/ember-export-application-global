import { classify } from '@ember/string';
import { getOwnConfig, macroCondition } from '@embroider/macros';

export function initialize() {
  const application = arguments[1] || arguments[0];
  if (macroCondition(getOwnConfig().exportApplicationGlobal)) {
    let theGlobal;
    if (typeof globalThis !== 'undefined') {
      theGlobal = globalThis;
    } else if (typeof window !== 'undefined') {
      theGlobal = window;
    } else if (typeof global !== 'undefined') {
      theGlobal = global;
    } else if (typeof self !== 'undefined') {
      theGlobal = self;
    } else {
      // no reasonable global, just bail
      return;
    }

    const value = getOwnConfig().exportApplicationGlobal;
    let globalName;

    if (typeof value === 'string') {
      globalName = value;
    } else {
      globalName = classify(getOwnConfig().modulePrefix);
    }

    if (!theGlobal[globalName]) {
      theGlobal[globalName] = application;

      application.reopen({
        willDestroy: function () {
          this._super.apply(this, arguments);
          delete theGlobal[globalName];
        },
      });
    }
  }
}

export default {
  name: 'export-application-global',

  initialize,
};
