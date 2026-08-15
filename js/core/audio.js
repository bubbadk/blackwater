/* Audio manager: Web Audio procedural ambience + SFX, with file hooks for the
   later art/audio pass (registerSfx). */
(function (GS) {
  'use strict';

  class AudioManager {
    constructor() {
      this.ctx = null;
      this.unlocked = false;
      this.volumes = { master: 1, ambience: 0.7, music: 0.55, sfx: 0.85 };
      this.buses = {};
      this.master = null;
      this._musicNodes = [];
      this._ambienceNodes = [];
      this._ambienceName = null;
      this._ambienceTimer = null;
      this._thunderTimer = null;
      this._sfxFiles = {};
    }

    _ensureCtx() {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) { console.warn('[audio] Web Audio unavailable'); return false; }
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.volumes.master;
      this.master.connect(this.ctx.destination);
      ['ambience', 'music', 'sfx'].forEach((bus) => {
        const g = this.ctx.createGain();
        g.gain.value = this.volumes[bus];
        g.connect(this.master);
        this.buses[bus] = g;
      });
      return true;
    }

    unlock() {
      if (!this._ensureCtx()) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      this.unlocked = true;
    }

    setVolume(bus, v) {
      this.volumes[bus] = v;
      if (bus === 'master' && this.master) this.master.gain.value = v;
      else if (this.buses[bus]) this.buses[bus].gain.value = v;
    }

    getVolume(bus) { return this.volumes[bus]; }

    _noiseBuffer(seconds) {
      const rate = this.ctx.sampleRate;
      const len = Math.max(1, Math.floor(rate * seconds));
      const buf = this.ctx.createBuffer(1, len, rate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    }

    _haltNodes(nodes) {
      nodes.forEach((n) => {
        try { if (typeof n.stop === 'function') n.stop(); } catch (e) { /* noop */ }
        try { n.disconnect(); } catch (e) { /* noop */ }
      });
    }

    _rainSource(bus) {
      const c = this.ctx;
      const src = c.createBufferSource();
      src.buffer = this._noiseBuffer(2);
      src.loop = true;
      const low = c.createBiquadFilter();
      low.type = 'lowpass'; low.frequency.value = 2400;
      const high = c.createBiquadFilter();
      high.type = 'highpass'; high.frequency.value = 320;
      const g = c.createGain();
      g.gain.value = 0.0001;
      src.connect(low); low.connect(high); high.connect(g); g.connect(this.buses[bus]);
      src.start();
      g.gain.setTargetAtTime(0.5, c.currentTime, 1.5);
      const lfo = c.createOscillator(); lfo.frequency.value = 0.11;
      const lfoG = c.createGain(); lfoG.gain.value = 0.13;
      lfo.connect(lfoG); lfoG.connect(g.gain);
      lfo.start();
      return [src, g, lfo, low, high];
    }

    _clockTick(bus) {
      const c = this.ctx;
      const t = c.currentTime;
      const osc = c.createOscillator();
      osc.type = 'square'; osc.frequency.value = 1900;
      const g = c.createGain();
      g.gain.setValueAtTime(0.045, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      osc.connect(g); g.connect(this.buses[bus]);
      osc.start(t); osc.stop(t + 0.07);
    }

    _thunder(bus) {
      const c = this.ctx;
      const t = c.currentTime;
      const src = c.createBufferSource();
      src.buffer = this._noiseBuffer(3);
      const low = c.createBiquadFilter();
      low.type = 'lowpass';
      low.frequency.setValueAtTime(500, t);
      low.frequency.exponentialRampToValueAtTime(70, t + 2.6);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.5, t + 0.09);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 2.7);
      src.connect(low); low.connect(g); g.connect(this.buses[bus]);
      src.start(t); src.stop(t + 3);
    }

    startAmbience(name) {
      if (!this.ctx) return;
      if (name === this._ambienceName) return;
      this.stopAmbience();
      this._ambienceName = name;
      const nodes = [];
      if (name === 'rain' || name === 'office') {
        nodes.push.apply(nodes, this._rainSource('ambience'));
      }
      if (name === 'office') {
        this._ambienceTimer = setInterval(() => this._clockTick('ambience'), 800);
      }
      if (name === 'rain' || name === 'office') this._scheduleThunder();
      this._ambienceNodes = nodes;
    }

    _scheduleThunder() {
      clearTimeout(this._thunderTimer);
      const delay = 12000 + Math.random() * 26000;
      this._thunderTimer = setTimeout(() => {
        if (this._ambienceName === 'rain' || this._ambienceName === 'office') {
          this._thunder('ambience');
          this._scheduleThunder();
        }
      }, delay);
    }

    stopAmbience() {
      clearInterval(this._ambienceTimer);
      clearTimeout(this._thunderTimer);
      this._ambienceTimer = null;
      this._thunderTimer = null;
      this._haltNodes(this._ambienceNodes);
      this._ambienceNodes = [];
      this._ambienceName = null;
    }

    startMusic() {
      if (!this.ctx || this._musicNodes.length) return;
      const c = this.ctx;
      const g = c.createGain();
      g.gain.value = 0.0001;
      const filter = c.createBiquadFilter();
      filter.type = 'lowpass'; filter.frequency.value = 200;
      const o1 = c.createOscillator(); o1.type = 'sine'; o1.frequency.value = 55;
      const o2 = c.createOscillator(); o2.type = 'sine'; o2.frequency.value = 55.7;
      const o3 = c.createOscillator(); o3.type = 'triangle'; o3.frequency.value = 27.5;
      const g3 = c.createGain(); g3.gain.value = 0.35;
      o1.connect(filter); o2.connect(filter); o3.connect(g3); g3.connect(filter);
      filter.connect(g); g.connect(this.buses.music);
      o1.start(); o2.start(); o3.start();
      g.gain.setTargetAtTime(0.45, c.currentTime, 4);
      const lfo = c.createOscillator(); lfo.frequency.value = 0.05;
      const lfoG = c.createGain(); lfoG.gain.value = 55;
      lfo.connect(lfoG); lfoG.connect(filter.frequency);
      lfo.start();
      this._musicNodes = [o1, o2, o3, g3, g, filter, lfo, lfoG];
    }

    stopMusic() {
      this._haltNodes(this._musicNodes);
      this._musicNodes = [];
    }

    playSfx(name) {
      if (this._sfxFiles[name]) { this._playFile(this._sfxFiles[name], 'sfx', false); return; }
      if (!this.ctx) return;
      switch (name) {
        case 'click': this._click(); break;
        case 'knock': this._knock(); break;
        case 'ring': this._ring(); break;
        case 'gunshot': this._gunshot(); break;
        case 'thunder': this._thunder('sfx'); break;
        case 'whoosh': this._whoosh(); break;
        default: break;
      }
    }

    _click() {
      const c = this.ctx; const t = c.currentTime;
      const src = c.createBufferSource();
      src.buffer = this._noiseBuffer(0.06);
      const high = c.createBiquadFilter(); high.type = 'highpass'; high.frequency.value = 1200;
      const g = c.createGain();
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      src.connect(high); high.connect(g); g.connect(this.buses.sfx);
      src.start(t); src.stop(t + 0.07);
    }

    _knock() {
      const c = this.ctx;
      [0, 0.18].forEach((off) => {
        const t = c.currentTime + off;
        const osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = 120;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.5, t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
        osc.connect(g); g.connect(this.buses.sfx);
        osc.start(t); osc.stop(t + 0.18);
      });
    }

    _ring() {
      const c = this.ctx; const t = c.currentTime;
      const carrier = c.createOscillator(); carrier.type = 'sine'; carrier.frequency.value = 425;
      const am = c.createOscillator(); am.type = 'square'; am.frequency.value = 20;
      const amG = c.createGain(); amG.gain.value = 0.5;
      const mul = c.createGain(); mul.gain.value = 0.5;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.22, t + 0.02);
      g.gain.setValueAtTime(0.22, t + 0.9);
      g.gain.linearRampToValueAtTime(0.0001, t + 1.0);
      am.connect(amG); amG.connect(mul.gain);
      carrier.connect(mul); mul.connect(g); g.connect(this.buses.sfx);
      carrier.start(t); carrier.stop(t + 1.05);
      am.start(t); am.stop(t + 1.05);
    }

    _gunshot() {
      const c = this.ctx; const t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this._noiseBuffer(0.4);
      const g = c.createGain();
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      src.connect(g); g.connect(this.buses.sfx);
      src.start(t); src.stop(t + 0.4);
      const osc = c.createOscillator(); osc.type = 'sine'; osc.frequency.value = 80;
      const g2 = c.createGain();
      g2.gain.setValueAtTime(0.7, t);
      g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      osc.connect(g2); g2.connect(this.buses.sfx);
      osc.start(t); osc.stop(t + 0.42);
    }

    _whoosh() {
      const c = this.ctx; const t = c.currentTime;
      const src = c.createBufferSource(); src.buffer = this._noiseBuffer(0.9);
      const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
      bp.frequency.setValueAtTime(300, t);
      bp.frequency.exponentialRampToValueAtTime(1400, t + 0.5);
      bp.frequency.exponentialRampToValueAtTime(200, t + 0.9);
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      src.connect(bp); bp.connect(g); g.connect(this.buses.sfx);
      src.start(t); src.stop(t + 0.95);
    }

    registerSfx(name, url) { this._sfxFiles[name] = url; }

    _playFile(url, bus, loop) {
      const audio = new Audio(url);
      audio.loop = !!loop;
      if (this.ctx) {
        try {
          const src = this.ctx.createMediaElementSource(audio);
          src.connect(this.buses[bus]);
        } catch (e) {
          audio.volume = this.volumes[bus] * this.volumes.master;
        }
      } else {
        audio.volume = this.volumes[bus] * this.volumes.master;
      }
      audio.play().catch(() => { /* autoplay or missing file */ });
      return audio;
    }
  }

  GS.Audio = new AudioManager();
})(window.GameShell = window.GameShell || {});
