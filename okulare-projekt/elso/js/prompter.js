/*
  Hidak Istene – súgómonitor vezérlés
  -----------------------------------
  Funkciók:
  - betűméret állítása
  - választott betűméret mentése a böngészőben
  - színpadi utasítások ki/be kapcsolása
  - teljes képernyős mód
  - egyszerű hanglejátszás a media mappából
*/

(function () {
  'use strict';

  const root = document.documentElement;

  const slider = document.getElementById('fontSlider');
  const fontValue = document.getElementById('fontValue');

  const savedFontSize = localStorage.getItem('prompterFontSize');
  const defaultFontSize = slider?.value || 32;

  const audioPlayer = new Audio();

  function clampFontSize(value) {
    const number = Number(value) || 32;
    return Math.max(16, Math.min(120, number));
  }

  function setFontSize(value) {
    const size = clampFontSize(value);

    root.style.setProperty('--font-size', `${size}px`);

    if (slider) {
      slider.value = size;
    }

    if (fontValue) {
      fontValue.textContent = `${size} px`;
    }

    localStorage.setItem('prompterFontSize', size);
  }

  function increaseFontSize() {
    setFontSize((parseInt(slider.value, 10) || 32) + 4);
  }

  function decreaseFontSize() {
    setFontSize((parseInt(slider.value, 10) || 32) - 4);
  }

  function resetFontSize() {
    setFontSize(32);
  }

  function toggleStageDirections() {
    document.body.classList.toggle('reading-mode');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      return;
    }

    document.exitFullscreen?.();
  }

  function playSound(button) {
    const soundName = button.dataset.sound;
    const source = button.dataset.src || `media/${soundName}.mp3`;

    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = source;

    audioPlayer.play().catch(function () {
      button.classList.add('missing');
      button.title = `Nem található vagy nem lejátszható: ${source}`;

      alert(
        `A hangfájl nem található vagy nem játszható le:\n` +
        `${source}\n\n` +
        `Tedd a fájlt a media mappába, pl. ${soundName}.mp3`
      );
    });
  }

  function handleKeyboardShortcut(event) {
    const key = event.key.toLowerCase();

    if (key === '+' || key === '=') {
      increaseFontSize();
    }

    if (key === '-' || key === '_') {
      decreaseFontSize();
    }

    if (key === '0') {
      resetFontSize();
    }

    if (key === 's') {
      toggleStageDirections();
    }
  }

  // Kezdő betűméret beállítása.
  setFontSize(savedFontSize || defaultFontSize);

  // Vezérlőgombok.
  slider?.addEventListener('input', function (event) {
    setFontSize(event.target.value);
  });

  document.getElementById('bigger')?.addEventListener('click', increaseFontSize);
  document.getElementById('smaller')?.addEventListener('click', decreaseFontSize);
  document.getElementById('resetSize')?.addEventListener('click', resetFontSize);
  document.getElementById('toggleStage')?.addEventListener('click', toggleStageDirections);
  document.getElementById('fullscreen')?.addEventListener('click', toggleFullscreen);

  // Billentyűparancsok.
  document.addEventListener('keydown', handleKeyboardShortcut);

  // Hanggombok.
  document.querySelectorAll('[data-sound]').forEach(function (button) {
    button.addEventListener('click', function () {
      playSound(button);
    });
  });
}());
