/* Event emitter - zero-dependency pub/sub used across the shell. */
(function (GS) {
  'use strict';
  class EventEmitter {
    constructor() { this._m = new Map(); }
    on(ev, fn) { if (!this._m.has(ev)) this._m.set(ev, []); this._m.get(ev).push(fn); return this; }
    off(ev, fn) { if (!this._m.has(ev)) return this; this._m.set(ev, this._m.get(ev).filter((f) => f !== fn)); return this; }
    emit(ev, payload) {
      if (!this._m.has(ev)) return this;
      for (const fn of this._m.get(ev).slice()) {
        try { fn(payload); }
        catch (err) { console.error('[GameShell] handler for "' + ev + '" failed:', err); }
      }
      return this;
    }
  }
  GS.EventEmitter = EventEmitter;
  GS.Events = new EventEmitter();
})(window.GameShell = window.GameShell || {});
