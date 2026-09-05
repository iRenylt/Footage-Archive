async function clearWebCache() {
  const registrations = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistrations() : [];
  await Promise.all(registrations.map(registration => registration.unregister()));
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }
}
window.clearWebCache = clearWebCache;

// Keep pinch gestures from zooming the archive on touch browsers.
document.addEventListener('gesturestart', event => event.preventDefault(), { passive: false });
document.addEventListener('gesturechange', event => event.preventDefault(), { passive: false });
document.addEventListener('touchmove', event => {
  if (event.touches.length > 1) event.preventDefault();
}, { passive: false });

try {
  window.history.scrollRestoration = 'manual';
} catch {}
function resetPageScroll() {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  window.scrollTo(0, 0);
  root.scrollTop = 0;
  document.body.scrollTop = 0;
  root.style.scrollBehavior = previousBehavior;
}
resetPageScroll();
window.addEventListener('load', resetPageScroll);
window.addEventListener('pageshow', resetPageScroll);

const config = window.APP_CONFIG;
const content = window.ARCHIVE_CONTENT || {};
const logoUrl = config.logoImage;
if (logoUrl) {
  [{ rel: 'icon', type: 'image/png' }, { rel: 'apple-touch-icon' }].forEach(({ rel, type }) => {
    let link = document.querySelector(`link[rel="${rel}"]`);
    if (!link) { link = document.createElement('link'); link.rel = rel; document.head.append(link); }
    if (type) link.type = type;
    link.href = logoUrl;
  });
}
const $ = selector => document.querySelector(selector);
const texts = content.texts || config.texts || {};
const system = texts.system || {};
const fallbackWalls = (content.galleryFallback || config.galleryFallback || []).map((wall, index) => ({ ...wall, slot: index + 1 }));
let walls = fallbackWalls.map(wall => ({ ...wall })); let wallIndex = 0;
let supabaseStatus = 'idle';
window.addEventListener('offline', () => { supabaseStatus = 'error'; if ($('#note-form')) showFormMessage('Sin conexión.', 'error'); if ($('#gallery-status')) $('#gallery-status').textContent = 'Sin conexión'; });
window.addEventListener('online', () => { if (config.supabase.url && config.supabase.anonKey && window.archiveClient) { supabaseStatus = 'ready'; if ($('#note-form')) showFormMessage('Conexión recuperada.', 'success'); window.archiveGalleryRefresh?.(); } });
document.querySelectorAll('#guide-button').forEach(element => element.remove());
bindCreditsPanel();
document.documentElement.style.setProperty('--paper', '#e7e4dc');
document.documentElement.style.setProperty('--soft', '#c7c5be');
document.documentElement.style.setProperty('--muted', '#9b9b95');
document.documentElement.style.setProperty('--acid', '#a8a8a1');
document.documentElement.style.setProperty('--line', 'rgba(231,228,220,.18)');
document.body.style.backgroundColor = '#101114';
const isHomePage = document.body.classList.contains('page-home') || location.pathname.endsWith('/index.html') || location.pathname.endsWith('/');
if (isHomePage) sessionStorage.removeItem('archiveDeveloperMode');
const menuMessages = system.menuMessages?.length ? system.menuMessages : [config.intro];
const randomMenuMessage = () => menuMessages[0];

function bindCreditsPanel() {
  const topbar = document.querySelector('.topbar');
  if (!topbar || topbar.querySelector('#credits-button')) return;
  const actions = topbar.querySelector('.top-actions') || topbar;
  const button = document.createElement('button');
  button.id = 'credits-button';
  button.className = 'credits-button';
  button.type = 'button';
  button.innerHTML = 'Créditos <span>✦</span>';
  actions.append(button);

  const openCredits = () => {
    if (document.querySelector('.credits-panel')) return;
    const panel = document.createElement('div');
    panel.className = 'credits-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'credits-title');
    panel.innerHTML = `<div class="credits-sheet"><button class="credits-close" type="button" aria-label="Cerrar créditos">×</button><p class="eyebrow">FOOTAGE ARCHIVE · CRÉDITOS</p><h2 id="credits-title">Hecho con<br><em>memoria.</em></h2><div class="credits-grid"><article><span>DESARROLLADOR</span><strong>iRenyKn (Diego)</strong><p>La idea, la historia y la mirada detrás de este archivo.</p></article><article><span>SELLO</span><strong>Registros Fantasmas</strong><p>La firma emocional, el nombre y la atmósfera del proyecto.</p></article></div><p class="credits-final">Gracias por entrar a este espacio.<br>Lo más especial de este archivo es que existe porque nosotros existimos.</p></div>`;
    document.body.append(panel);
    document.body.classList.add('modal-locked');
    const close = () => {
      panel.remove();
      document.body.classList.remove('modal-locked');
    };
    panel.querySelector('.credits-close').addEventListener('click', close);
    panel.addEventListener('click', event => { if (event.target === panel) close(); });
    document.addEventListener('keydown', function closeCredits(event) {
      if (event.key === 'Escape') { close(); document.removeEventListener('keydown', closeCredits); }
    }, { once: true });
  };
  button.addEventListener('click', openCredits);
}

function syncViewportHeight() {
  const viewport = window.visualViewport;
  const height = viewport?.height || window.innerHeight;
  document.documentElement.style.setProperty('--viewport-height', `${height}px`);
  document.body.classList.toggle('keyboard-open', Boolean(viewport && window.innerHeight - viewport.height > 120));
}
syncViewportHeight();
window.addEventListener('resize', syncViewportHeight);
window.visualViewport?.addEventListener('resize', syncViewportHeight);
window.visualViewport?.addEventListener('scroll', syncViewportHeight);
const letterTexts = { open: 'Abrir carta', close: 'Cerrar carta', soundtrack: 'BANDA SONORA DE ESTA CARTA', signature: 'Con cariño, para leerlo despacio.' };
const letterUnlockDay = 9;
const monthNumbers = { enero: 1, febrero: 2, marzo: 3, abril: 4, mayo: 5, junio: 6, julio: 7, agosto: 8, septiembre: 9, octubre: 10, noviembre: 11, diciembre: 12 };
const timeGreeting = () => { const hour = new Date().getHours(); return hour < 12 ? (system.morning || 'Buenos días') : hour < 19 ? (system.afternoon || 'Buenas tardes') : (system.evening || 'Buenas noches'); };
const logoMarks = document.querySelectorAll('.brand-mark,.loader-mark');
const renderLogo = () => logoMarks.forEach(mark => {
  if (!config.logoImage) { mark.textContent = system.loadingFallback || 'FA'; return; }
  mark.innerHTML = `<img src="${config.logoImage}" alt="${config.logoAlt || config.name}">`;
  mark.querySelector('img').addEventListener('error', () => { mark.textContent = 'FA'; }, { once: true });
});
renderLogo();
if ($('#brand-name')) $('#brand-name').textContent = config.name; if ($('#hero-title')) $('#hero-title').innerHTML = texts.home?.heroTitle || 'Footage<br><em>Archive.</em>'; if ($('#hero-intro')) $('#hero-intro').textContent = config.intro; if ($('#footer-signature')) $('#footer-signature').textContent = config.signature; if ($('#spotify')) $('#spotify').src = config.spotifyEmbed; if ($('#hero-intro') && !$('#last-updated')) { const updateNote = document.createElement('p'); updateNote.className = 'update-note'; updateNote.innerHTML = 'Se actualiza entre días · <time id="last-updated"></time>'; $('#hero-intro').after(updateNote); } if ($('#last-updated')) { const fileDate = new Date(document.lastModified); const updateDate = Number.isNaN(fileDate.getTime()) ? new Date(config.lastUpdated) : fileDate; $('#last-updated').textContent = updateDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }); } if (document.body.classList.contains('page-notas')) { const notesTitle = document.querySelector('.notes-grid h1'); if (notesTitle) { notesTitle.textContent = texts.notes?.greetingName || 'Nohelia'; const loveTitle = document.createElement('h2'); loveTitle.className = 'love-line'; loveTitle.innerHTML = texts.notes?.loveTitle || 'El Amor de<br><em>Mi Vida.</em>'; notesTitle.after(loveTitle); } } if ($('.full-letter')) renderLetterPage(); if ($('#gallery-stage')) renderWall(); if ($('#gallery-stage') || $('#note-form')) setupSupabase(); if ($('#image-picker')) $('#image-picker').addEventListener('change', changeWallImage); if ($('#note-form')) { const nameInput = $('#note-form').querySelector('[name="name"]'); if (nameInput) nameInput.closest('label').remove(); const noteInput = $('#note-form').querySelector('[name="message"]'); if (noteInput) { noteInput.placeholder = texts.notes?.messagePlaceholder || 'Escribe algo bonito para ella...'; noteInput.closest('label').firstChild.textContent = texts.notes?.messageLabel || 'Tu mensaje'; } }
if ($('#note-form')) {
  const notesTitle = document.querySelector('.notes-grid h1[data-html-content]');
  if (notesTitle) notesTitle.innerHTML = notesTitle.dataset.htmlContent;
  const messageLabel = $('#note-form').querySelector('[name="message"]')?.closest('label');
  if (messageLabel) messageLabel.firstChild.textContent = $('#note-form').dataset.messageLabel || messageLabel.firstChild.textContent;
}
if (isHomePage && $('#hero-intro')) $('#hero-intro').innerHTML = `<span class="hero-greeting">${timeGreeting()}, ${texts.notes?.greetingName || config.name}.</span><span class="hero-message">${randomMenuMessage()}</span>`;
if (isHomePage && $('#hero-intro')) {
  setInterval(() => {
    const greeting = $('#hero-intro .hero-greeting');
    if (greeting) greeting.textContent = `${timeGreeting()}, ${texts.notes?.greetingName || config.name}.`;
  }, 7000);
}
if ($('#loader p')) {
  $('#loader p').innerHTML = '<span class="loader-title">Footage Archive</span>';
}
if (!isHomePage && $('#loader')) { $('#loader').style.transition = 'none'; $('#loader').classList.add('done'); }
if ($('#access-screen')) { $('#access-screen').classList.add('visible'); $('#access-screen').setAttribute('aria-hidden', 'false'); document.body.classList.add('access-locked'); }
let homePinProfile = null;
function setupHomePinProfiles() {
  if (!isHomePage || !$('#pin-form') || $('#pin-profiles')) return;
  document.body.classList.add('home-profile-choice');
  const profiles = config.pinProfiles || {};
  const chooser = document.createElement('div');
  chooser.id = 'pin-profiles';
  chooser.className = 'pin-profiles';
  chooser.setAttribute('role', 'group');
  chooser.setAttribute('aria-label', 'Elige quién entra');
  chooser.innerHTML = Object.entries(profiles).map(([key, profile]) => `<button type="button" class="pin-profile" data-profile="${key}" aria-pressed="false"><img src="${profile.image}" alt="${profile.label}"><span>${profile.label}</span></button>`).join('');
  $('#pin-form').prepend(chooser);
  chooser.querySelectorAll('.pin-profile').forEach(button => button.addEventListener('click', () => {
    homePinProfile = button.dataset.profile;
    document.body.classList.remove('home-profile-choice');
    chooser.querySelectorAll('.pin-profile').forEach(option => { const selected = option === button; option.classList.toggle('is-selected', selected); option.setAttribute('aria-pressed', String(selected)); });
    $('#pin-message').textContent = '';
    $('#pin-input').focus();
  }));
}
setupHomePinProfiles();
if ($('.access-box') && !$('.access-box').querySelector('.access-logo')) { const logo = document.createElement('img'); logo.className = 'access-logo'; logo.src = config.logoImage; logo.alt = config.logoAlt || config.name; $('.access-box').prepend(logo); }
if ($('#pin-input')) { $('#pin-input').placeholder = texts.pinPlaceholder || '0 0 0 0'; if (!$('#pin-label')) { const pinLabel = document.createElement('label'); pinLabel.id = 'pin-label'; pinLabel.className = 'pin-label'; pinLabel.htmlFor = 'pin-input'; pinLabel.textContent = texts.pinLabel || 'Introduce tu PIN'; $('#pin-input').before(pinLabel); } }
if (document.body.classList.contains('page-cartas')) bindLetterLinks();
if (document.body.classList.contains('letter-page')) applyLetterPageLock();
bindHiddenSecrets();

const hiddenSecrets = [
    { title: '09 · 06 · 25', text: 'El día en que empezamos a ser nosotros.', hint: 'Una fecha que lo cambió todo.' },
    { title: 'Pista encontrada', text: 'Lo bonito también sabe esconderse a plena vista.', hint: 'Sigue mirando con calma.' },
    { title: 'Para volver', text: 'Hay recuerdos que no necesitan una dirección.', hint: 'Solo un lugar dentro de ti.' },
    { title: 'Pequeño manifiesto', text: 'Quedarse también es una forma de elegir.', hint: 'Y aquí seguimos.' },
    { title: 'Coordenadas', text: 'Dos personas, una historia y demasiados instantes para contar.', hint: 'El mapa sigue creciendo.' },
    { title: 'Nota al margen', text: 'Si llegaste hasta aquí, ya formas parte del archivo.', hint: 'Gracias por mirar más despacio.' },
    { title: 'Registro 01', text: 'Nada de esto empezó perfecto. Empezó de verdad.', hint: 'Eso lo hizo suficiente.' },
    { title: 'Entre líneas', text: 'Lo que permanece no siempre hace ruido.', hint: 'A veces solo se queda.' },
    { title: 'Archivo reservado', text: 'Tu risa también pertenece a esta colección.', hint: 'Aunque no esté escrita.' },
    { title: 'Última pista', text: 'El mejor secreto es el que se descubre juntos.', hint: '09/06/25 · siempre.' }
  ];

function showHiddenSecret(secretIndex) {
    const secret = hiddenSecrets[secretIndex];
    if (!secret || document.querySelector('.secret-reveal')) return;
    const reveal = document.createElement('div');
    reveal.className = 'secret-reveal';
    reveal.setAttribute('role', 'dialog');
    reveal.setAttribute('aria-modal', 'true');
    reveal.setAttribute('aria-label', secret.title);
    reveal.innerHTML = `<article class="secret-card"><button class="secret-close" type="button" aria-label="Cerrar secreto">×</button><p class="eyebrow">ARCHIVO RESERVADO · ${String(secretIndex + 1).padStart(2, '0')} / 10</p><h2>${secret.title}</h2><p class="secret-copy">${secret.text}</p><p class="secret-hint">${secret.hint}</p><span class="secret-mark">✦</span></article>`;
    document.body.append(reveal);
    const close = () => reveal.remove();
    reveal.querySelector('.secret-close').addEventListener('click', close);
    reveal.addEventListener('click', event => { if (event.target === reveal) close(); });
    document.addEventListener('keydown', function closeOnEscape(event) {
      if (event.key === 'Escape') { close(); document.removeEventListener('keydown', closeOnEscape); }
    }, { once: true });
  }

function bindHiddenSecrets() {
    $('#secret-heart')?.addEventListener('click', () => showHiddenSecret(0));
    document.querySelectorAll('.brand-mark').forEach(element => element.addEventListener('dblclick', () => showHiddenSecret(1)));
    $('#last-updated')?.addEventListener('click', () => showHiddenSecret(2));
    document.querySelector('.site-footer')?.addEventListener('dblclick', () => showHiddenSecret(3));
    const wallCount = $('#wall-count');
    if (wallCount) {
      let clicks = 0;
      let resetTimer;
      wallCount.addEventListener('click', () => {
        clicks += 1;
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => { clicks = 0; }, 1000);
        if (clicks === 3) { clicks = 0; showHiddenSecret(4); }
      });
    }
    $('.gallery-stage')?.addEventListener('dblclick', () => showHiddenSecret(5));
    document.querySelector('.love-line')?.addEventListener('click', () => showHiddenSecret(6));
    document.querySelector('.full-letter h1')?.addEventListener('dblclick', () => showHiddenSecret(7));
    document.querySelector('.letter-signature')?.addEventListener('click', () => showHiddenSecret(8));
    let code = '';
    document.addEventListener('keydown', event => {
      if (event.target.matches('input, textarea')) return;
      code = `${code}${event.key}`.slice(-6);
      if (code === '090625') { code = ''; showHiddenSecret(9); }
    });
}
function getToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function isDeveloperMode() {
  return sessionStorage.getItem('archiveDeveloperMode') === 'true';
}

function formatReleaseDate(date) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

function getLetterReleaseDate(element) {
  const eyebrow = element.querySelector('.eyebrow');
  const dateText = eyebrow?.textContent || '';
  const dateParts = dateText.split('·').map(value => value.trim().toLowerCase());
  let month = monthNumbers[dateParts[0]];
  let year = Number(dateParts[1]);
  if (!month && element.classList.contains('letter')) {
    const monthText = element.querySelector('.letter-number')?.textContent.trim().toLowerCase();
    const yearText = element.closest('.letter-year')?.querySelector('.year-heading h2')?.textContent.trim();
    month = monthNumbers[monthText];
    year = Number(yearText);
  }
  if (!month || !year) return null;
  return new Date(year, month - 1, letterUnlockDay);
}

function bindLetterLinks() {
  if (isDeveloperMode()) return;
  document.querySelectorAll('#letters a.letter').forEach(link => {
    const releaseDate = getLetterReleaseDate(link);
    if (!releaseDate) return;
    if (releaseDate <= getToday()) return;
    link.classList.add('is-locked');
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      let message = link.nextElementSibling;
      if (!message || !message.classList.contains('letter-lock-message')) {
        message = document.createElement('p');
        message.className = 'letter-lock-message';
        message.setAttribute('role', 'status');
        link.after(message);
      }
      message.textContent = `Esta carta se desbloqueará el ${formatReleaseDate(releaseDate)}.`;
    });
  });
}

function applyLetterPageLock() {
  if (isDeveloperMode()) return;
  const releaseDate = getLetterReleaseDate($('.full-letter'));
  if (!releaseDate) return;
  if (releaseDate <= getToday()) return;
  const article = $('.full-letter');
  if (article) article.hidden = true;
  const accessScreen = $('#access-screen');
  if (!accessScreen) return;
  accessScreen.classList.add('visible');
  accessScreen.classList.add('has-lock-message');
  accessScreen.setAttribute('aria-hidden', 'false');
  if ($('#access-title')) $('#access-title').innerHTML = 'Carta<br><em>bloqueada.</em>';
  if ($('#access-copy')) $('#access-copy').textContent = `Esta carta se desbloqueará el ${formatReleaseDate(releaseDate)}.`;
  if ($('#access-random')) $('#access-random').textContent = 'Vuelve cuando llegue su fecha. 💗';
}

function renderLetterPage() {
  const fileName = location.pathname.split('/').pop();
  const article = $('.full-letter');
  if (!article) return;
  const eyebrow = article.querySelector('.eyebrow');
  const dateParts = (eyebrow?.textContent || '').split('·').map(value => value.trim());
  const letter = {
    page: fileName,
    date: dateParts[0] || '',
    year: dateParts[1] || '',
    title: article.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim() || fileName,
    detail: article.dataset.letterDetail || '',
    spotifyEmbed: article.dataset.spotifyEmbed || config.spotifyEmbed
  };
  article.classList.add('letter-shell');
  article.classList.remove('is-open');
  const title = article.querySelector('h1');
  if (title) title.setAttribute('data-letter-title', letter.title);
  const envelopeToggle = document.createElement('button'); envelopeToggle.className = 'envelope-toggle'; envelopeToggle.type = 'button'; envelopeToggle.setAttribute('aria-expanded', 'false'); envelopeToggle.innerHTML = `<span class="envelope-icon">✉</span><span>${letterTexts.open}</span>`; article.prepend(envelopeToggle);
  const flower = document.createElement('button'); flower.className = 'letter-flower'; flower.type = 'button'; flower.setAttribute('aria-label', letter.flowerLabel || 'Tocar la flor'); flower.innerHTML = '<span>✿</span>'; article.prepend(flower);
  const letterContent = article.querySelector('.letter-content');
  const details = article.querySelector('.letter-details') || document.createElement('div'); details.className = 'letter-details'; if (!details.innerHTML) details.innerHTML = `<span>${letter.year}</span><span>${letter.detail || 'Un recuerdo para volver a leer.'}</span>`; if (!details.parentElement) letterContent?.after(details);
  const mark = article.querySelector('.letter-signature') || document.createElement('p'); mark.className = 'letter-signature'; if (!mark.textContent) mark.textContent = letterTexts.signature; if (!mark.parentElement) details.after(mark);
  const spotify = article.querySelector('.letter-spotify') || document.createElement('div'); if (!spotify.innerHTML) { spotify.className = 'letter-spotify'; spotify.innerHTML = `<p class="eyebrow">${letterTexts.soundtrack}</p><iframe title="Banda sonora de ${letter.title}" loading="lazy" src="${letter.spotifyEmbed}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`; } if (!spotify.parentElement) mark.after(spotify);
  const backLink = article.querySelector('.primary-link'); backLink?.classList.add('letter-actions');
  envelopeToggle.addEventListener('click', () => { const open = article.classList.toggle('is-open'); envelopeToggle.setAttribute('aria-expanded', String(open)); envelopeToggle.querySelector('span:last-child').textContent = open ? letterTexts.close : letterTexts.open; });
}
function renderWall() {
  const wall = walls[wallIndex];
  const stage = $('#gallery-stage');
  if (!stage) return;
  if (!stage.querySelector('.wall-image-button')) {
    stage.innerHTML = `<button class="wall-image-button" id="change-image" type="button"><img src="" alt=""><span>presiona para cambiar</span></button><div class="gallery-copy"><h3></h3><p></p></div><button class="wall-edit-toggle" id="edit-wall-toggle" type="button">Editar muro</button><form class="wall-edit-form" id="wall-edit-form" hidden><label>Título<input name="title" maxlength="80" required></label><label>Descripción<textarea name="caption" maxlength="240" rows="3" required></textarea></label><div><button type="submit" class="wall-edit-save">Guardar cambios</button><button type="button" class="wall-edit-cancel">Cancelar</button></div><p class="wall-edit-message" role="status"></p></form>`;
  }
  if (!stage.querySelector('.wall-edit-form')) stage.insertAdjacentHTML('beforeend', '<button class="wall-edit-toggle" id="edit-wall-toggle" type="button">Editar muro</button><form class="wall-edit-form" id="wall-edit-form" hidden><label>Título<input name="title" maxlength="80" required></label><label>Descripción<textarea name="caption" maxlength="240" rows="3" required></textarea></label><div><button type="submit" class="wall-edit-save">Guardar cambios</button><button type="button" class="wall-edit-cancel">Cancelar</button></div><p class="wall-edit-message" role="status"></p></form>');
  const imageButton = $('#change-image');
  if (imageButton && !imageButton.dataset.imagePickerBound) {
    imageButton.addEventListener('click', () => $('#image-picker')?.click());
    imageButton.dataset.imagePickerBound = 'true';
  }
  const image = imageButton.querySelector('img');
  const imageUrl = new URL(wall.image, location.href);
  imageUrl.searchParams.set('v', wall.image);
  image.src = imageUrl.href;
  image.alt = wall.caption;
  imageButton.setAttribute('aria-label', `Cambiar imagen de ${wall.title}`);
  stage.querySelector('.gallery-copy h3').textContent = wall.title;
  stage.querySelector('.gallery-copy p').textContent = wall.caption;
  $('#wall-count').textContent = `${String(wallIndex + 1).padStart(2, '0')} / ${String(walls.length).padStart(2, '0')}`;
  const editForm = $('#wall-edit-form');
  if (editForm && !editForm.dataset.bound) {
    $('#edit-wall-toggle').addEventListener('click', () => {
      editForm.elements.title.value = walls[wallIndex].title || '';
      editForm.elements.caption.value = walls[wallIndex].caption || '';
      editForm.hidden = false;
      $('#edit-wall-toggle').hidden = true;
      editForm.elements.title.focus();
    });
    editForm.querySelector('.wall-edit-cancel').addEventListener('click', () => { editForm.hidden = true; $('#edit-wall-toggle').hidden = false; });
    editForm.addEventListener('submit', saveWallText);
    editForm.dataset.bound = 'true';
  }
  if (editForm?.hidden === false) {
    editForm.elements.title.value = wall.title || '';
    editForm.elements.caption.value = wall.caption || '';
  }
}
async function saveWallText(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const wall = walls[wallIndex];
  const title = String(form.elements.title.value || '').trim();
  const caption = String(form.elements.caption.value || '').trim();
  const message = form.querySelector('.wall-edit-message');
  if (!title || !caption) { if (message) message.textContent = 'Completa el título y la descripción.'; return; }
  if (supabaseStatus !== 'ready' || !window.archiveClient || !navigator.onLine) { if (message) message.textContent = 'Supabase no está disponible.'; return; }
  const saveButton = form.querySelector('.wall-edit-save');
  if (saveButton) saveButton.disabled = true;
  if (message) message.textContent = 'Guardando...';
  try {
    const payload = { slot: wall.slot || wallIndex + 1, title, caption, image_url: wall.image || '' };
    const result = wall.id
      ? await window.archiveClient.from(config.supabase.galleryTable).update({ title, caption }).eq('id', wall.id).select().single()
      : await window.archiveClient.from(config.supabase.galleryTable).insert(payload).select().single();
    if (result.error) throw result.error;
    wall.title = title;
    wall.caption = caption;
    if (result.data?.id) wall.id = result.data.id;
    renderWall();
    if (message) message.textContent = 'Cambios guardados.';
    form.hidden = true;
    $('#edit-wall-toggle').hidden = false;
  } catch (error) {
    if (message) message.textContent = 'No se pudieron guardar los cambios.';
    console.error(error);
  } finally { if (saveButton) saveButton.disabled = false; }
}
function setupSupabase() {
  const settings = config.supabase;
  if (!settings.url || !settings.anonKey) { supabaseStatus = 'error'; if ($('#gallery-status')) $('#gallery-status').textContent = 'Supabase pendiente'; if ($('#note-form')) showFormMessage('Configura Supabase antes de enviar.', 'error'); return; }
  supabaseStatus = 'connecting';
  if ($('#comments-board')) setupComments(settings);
  if (window.archiveClient) return;
  const script = document.createElement('script'); script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; script.onload = async () => { try { window.archiveClient = window.supabase.createClient(settings.url, settings.anonKey, { global: { fetch: (input, init = {}) => fetch(input, { ...init, cache: 'no-store' }) } }); supabaseStatus = 'ready'; if ($('#note-form')) showFormMessage('Conexión lista · tus mensajes se guardarán en Supabase. ✅', 'success'); if ($('#gallery-stage')) { const { data, error } = await window.archiveClient.from(settings.galleryTable).select('*').order('created_at', { ascending: true }); if (error) throw error; if (data?.length) { const syncedWalls = fallbackWalls.map(fallback => { const item = data.find(row => Number(row.slot) === fallback.slot); return item ? { ...fallback, id: item.id, title: item.title || fallback.title, caption: item.caption || fallback.caption, image: item.image_url || fallback.image } : { ...fallback }; }); walls = syncedWalls; wallIndex = 0; renderWall(); $('#gallery-status').textContent = `Supabase · ${data.length} muro${data.length === 1 ? '' : 's'} sincronizado${data.length === 1 ? '' : 's'} de ${walls.length}`; } } } catch (error) { if ($('#gallery-stage')) $('#gallery-status').textContent = 'Supabase · revisa galleryTable y sus permisos'; if ($('#note-form')) showFormMessage('Conexión lista, pero la tabla de imágenes tiene un error. Los mensajes siguen disponibles.', 'error'); console.error(error); } }; script.onerror = () => { supabaseStatus = 'error'; if ($('#gallery-status')) $('#gallery-status').textContent = 'No se pudo cargar el cliente de Supabase'; if ($('#note-form')) showFormMessage('No se pudo cargar Supabase. No se enviarán mensajes hasta recuperar la conexión.', 'error'); }; document.head.appendChild(script);
}
let commentsRefreshTimer;
let commentsExpanded = false;
async function loadComments(settings) {
  if (!window.archiveClient || !$('#comments-list')) return;
  const { data, error } = await window.archiveClient.from(settings.commentsTable).select('*');
  if (error) throw error;
  renderComments(data || []);
}
function renderComments(comments) {
  const list = $('#comments-list');
  const empty = $('#comments-empty');
  const expand = $('#comments-expand');
  if (!list) return;
  list.querySelectorAll('.comment-item').forEach(item => item.remove());
  if (!comments.length) { if (empty) empty.hidden = false; return; }
  if (empty) empty.hidden = true;
  const orderedComments = [...comments].sort((first, second) => {
    const firstDate = Date.parse(first.created_at || first.createdAt || '') || 0;
    const secondDate = Date.parse(second.created_at || second.createdAt || '') || 0;
    return secondDate - firstDate;
  });
  const visibleComments = commentsExpanded ? orderedComments : orderedComments.slice(0, 1);
  visibleComments.forEach(comment => {
    const item = document.createElement('article');
    item.className = 'comment-item';
    const text = document.createElement('p');
    text.textContent = comment.mensaje || comment.message || '';
    item.append(text);
    list.append(item);
  });
  if (expand) {
    expand.hidden = orderedComments.length <= 1;
    expand.innerHTML = commentsExpanded ? 'Mostrar solo el más reciente <span>↑</span>' : `Ver todos (${orderedComments.length}) <span>↓</span>`;
  }
}
function setupComments(settings) {
  if (!$('#comments-board') || $('#comments-board').dataset.bound) return;
  if (!window.archiveClient) { window.setTimeout(() => setupComments(settings), 500); return; }
  $('#comments-board').dataset.bound = 'true';
  $('#comments-expand')?.addEventListener('click', () => { commentsExpanded = !commentsExpanded; loadComments(settings).catch(() => {}); });
  loadComments(settings).then(() => { if ($('#comments-live')) $('#comments-live').textContent = 'Actualizado'; }).catch(() => { if ($('#comments-live')) $('#comments-live').textContent = 'No disponible'; });
  window.archiveClient.channel('comments-live').on('postgres_changes', { event: '*', schema: 'public', table: settings.commentsTable }, () => {
    loadComments(settings).catch(() => {});
  }).subscribe(status => { if ($('#comments-live') && status === 'SUBSCRIBED') $('#comments-live').textContent = 'En directo'; });
  commentsRefreshTimer = window.setInterval(() => loadComments(settings).catch(() => {}), 15000);
}
function showFormMessage(text, type = 'error') { const message = $('#form-message'); if (!message) return; message.textContent = text; message.className = `form-message ${type}`; message.setAttribute('role', 'status'); }
async function changeWallImage(event) { const file = event.target.files[0]; event.target.value = ''; if (!file) return; if (!file.type.startsWith('image/')) { if ($('#gallery-status')) $('#gallery-status').textContent = 'Selecciona un archivo de imagen válido. ❌'; return; } if (supabaseStatus !== 'ready' || !window.archiveClient || !navigator.onLine) { if ($('#gallery-status')) $('#gallery-status').textContent = 'No se puede sincronizar: Supabase o la conexión no están disponibles. No se ha guardado la imagen. ❌'; return; } const wall = walls[wallIndex]; if (!wall) return; if ($('#gallery-status')) $('#gallery-status').textContent = `Sincronizando imagen del muro ${wall.slot || wallIndex + 1}...`; try { const path = `muro-${wall.slot || wallIndex + 1}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`; const { error: uploadError } = await window.archiveClient.storage.from(config.supabase.galleryBucket).upload(path, file, { upsert: true }); if (uploadError) throw uploadError; const { data: publicData } = window.archiveClient.storage.from(config.supabase.galleryBucket).getPublicUrl(path); const imageUrl = publicData.publicUrl; const payload = { slot: wall.slot || wallIndex + 1, title: wall.title || `Muro ${wallIndex + 1}`, caption: wall.caption || '', image_url: imageUrl }; const result = wall.id ? await window.archiveClient.from(config.supabase.galleryTable).update({ image_url: imageUrl, slot: payload.slot }).eq('id', wall.id) : await window.archiveClient.from(config.supabase.galleryTable).insert(payload).select().single(); if (result.error) throw result.error; if (result.data?.id) wall.id = result.data.id; wall.slot = payload.slot; wall.image = imageUrl; renderWall(); if ($('#gallery-status')) $('#gallery-status').textContent = `Supabase · muro ${payload.slot} sincronizado`; } catch (error) { if ($('#gallery-status')) $('#gallery-status').textContent = 'No se pudo sincronizar la imagen. No se ha guardado nada. Revisa Storage, tabla y permisos.'; console.error(error); } }
async function saveNote(event) { event.preventDefault(); const form = event.currentTarget; const submit = form.querySelector('button[type="submit"]'); const values = Object.fromEntries(new FormData(form)); const noteText = String(values.message || '').trim(); if (!noteText) { showFormMessage('No se puede enviar un mensaje vacío. Escribe algo antes de continuar. ❤️', 'error'); form.elements.message.focus(); return; } if (supabaseStatus !== 'ready' || !window.archiveClient || !navigator.onLine) { showFormMessage('No se puede enviar: Supabase o la conexión no están disponibles. No se ha enviado nada. ❌', 'error'); return; } form.classList.add('is-sending'); if (submit) submit.disabled = true; showFormMessage('Enviando mensaje...', 'pending'); try { const payload = { [config.supabase.commentsMessageColumn || 'message']: noteText }; const { error } = await window.archiveClient.from(config.supabase.commentsTable).insert(payload); if (error) throw error; showFormMessage('Mensaje enviado correctamente. ❤️', 'success'); form.reset(); } catch (error) { supabaseStatus = 'error'; showFormMessage('No se pudo enviar: la tabla de comentarios o la API tienen un error. No se ha guardado nada.', 'error'); console.error(error); } finally { form.classList.remove('is-sending'); if (submit) submit.disabled = false; } }
if ($('#prev-wall')) $('#prev-wall').addEventListener('click', () => { wallIndex = (wallIndex - 1 + walls.length) % walls.length; renderWall(); }); if ($('#next-wall')) $('#next-wall').addEventListener('click', () => { wallIndex = (wallIndex + 1) % walls.length; renderWall(); }); if ($('#note-form')) $('#note-form').addEventListener('submit', saveNote);
function showAccess(title = $('#access-title').innerHTML, copy = texts.accessCopy) { $('#access-title').innerHTML = title; $('#access-copy').textContent = copy; $('#access-screen').classList.remove('hidden'); $('#access-screen').classList.add('visible'); $('#access-screen').setAttribute('aria-hidden', 'false'); document.body.classList.add('access-locked'); setTimeout(() => $('#pin-input').focus(), 100); }
function hideAccess() { $('#access-screen').classList.remove('visible'); $('#access-screen').classList.add('hidden'); $('#access-screen').setAttribute('aria-hidden', 'true'); document.body.classList.remove('access-locked'); $('#pin-input').value = ''; $('#pin-message').textContent = ''; }
$('#pin-form').addEventListener('submit', event => {
  event.preventDefault();
  const enteredPin = $('#pin-input').value;
  const developerAccess = isHomePage && homePinProfile === 'developer' && enteredPin === config.developerPin;
  const profileAccess = isHomePage ? homePinProfile === 'ella' && enteredPin === config.accessPin : enteredPin === config.accessPin;
  const currentLetter = document.body.classList.contains('letter-page') ? $('.full-letter') : null;
  const releaseDate = currentLetter ? getLetterReleaseDate(currentLetter) : null;
  const letterIsLocked = releaseDate && releaseDate > getToday() && !isDeveloperMode();
  if (developerAccess) {
    sessionStorage.setItem('archiveDeveloperMode', 'true');
    if (currentLetter) currentLetter.hidden = false;
    const destination = event.currentTarget.dataset.destination;
    delete event.currentTarget.dataset.destination;
    hideAccess();
    if (document.body.classList.contains('page-cartas')) location.reload();
    else if (destination) setTimeout(() => document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth' }), 50);
  } else if (profileAccess && !letterIsLocked) {
    const destination = event.currentTarget.dataset.destination;
    delete event.currentTarget.dataset.destination;
    hideAccess();
    if (destination) setTimeout(() => document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth' }), 50);
  } else if (letterIsLocked) {
    $('#pin-message').textContent = 'Esta carta todavía no está disponible. Vuelve el ' + formatReleaseDate(releaseDate) + '. 😔';
    $('#pin-input').select();
  } else {
    $('#pin-message').textContent = system.wrongPin;
    $('#pin-input').select();
  }
});
document.querySelectorAll('a[href^="#"]:not(.brand):not([href="#inicio"])').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showAccess(system.sectionAccessTitle, system.sectionAccessCopy); const destination = link.getAttribute('href'); $('#pin-form').dataset.destination = destination; }));
const promptedSections = new Set();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting && entry.intersectionRatio > 0.42 && !promptedSections.has(entry.target.id)) { promptedSections.add(entry.target.id); showAccess(system.sectionAccessTitle, system.sectionAccessCopy); } }), { threshold: [0.42] });
document.querySelectorAll('main > section:not(.hero)').forEach(section => sectionObserver.observe(section));
window.addEventListener('load', () => { if (isHomePage) setTimeout(() => { $('#loader').classList.add('done'); }, 2600); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').then(registration => registration.update()).catch(error => console.warn('No se pudo actualizar la caché web.', error));
}
let deferredInstall; window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstall = event; if ($('#install-button')) $('#install-button').hidden = false; }); if ($('#install-button')) $('#install-button').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall = null; $('#install-button').hidden = true; });
document.querySelectorAll('.notes-grid .love-line').forEach((element, index) => { if (index > 0) element.remove(); });

let galleryRefreshPromise = null;
async function refreshGalleryFromSupabase() {
  if (!$('#gallery-stage') || !window.archiveClient || !navigator.onLine || galleryRefreshPromise) return galleryRefreshPromise;
  const settings = config.supabase;
  galleryRefreshPromise = (async () => {
    if ($('#gallery-status')) $('#gallery-status').textContent = 'Sincronizando galería...';
    const { data, error } = await window.archiveClient.from(settings.galleryTable).select('*').order('created_at', { ascending: true });
    if (error) throw error;
    const rows = (data || []).filter(row => Number.isFinite(Number(row.slot)));
    const syncedBySlot = new Map(rows.map(row => [Number(row.slot), row]));
    walls = fallbackWalls.map(fallback => {
      const row = syncedBySlot.get(fallback.slot);
      if (!row) return { ...fallback };
      syncedBySlot.delete(fallback.slot);
      return { ...fallback, ...row, slot: fallback.slot, title: row.title || fallback.title, caption: row.caption || fallback.caption, image: row.image_url || fallback.image };
    });
    syncedBySlot.forEach(row => walls.push({ ...row, slot: Number(row.slot), title: row.title || `Muro ${row.slot}`, caption: row.caption || '', image: row.image_url || '' }));
    wallIndex = Math.min(wallIndex, Math.max(walls.length - 1, 0));
    renderWall();
    if ($('#gallery-status')) $('#gallery-status').textContent = rows.length ? `Supabase · ${rows.length} muro${rows.length === 1 ? '' : 's'} sincronizado${rows.length === 1 ? '' : 's'}` : 'Supabase · sin muros, mostrando archivo local';
    if (!$('#gallery-stage').dataset.galleryRealtimeBound) {
      window.archiveClient.channel('gallery-live').on('postgres_changes', { event: '*', schema: 'public', table: settings.galleryTable }, () => refreshGalleryFromSupabase().catch(() => {})).subscribe();
      $('#gallery-stage').dataset.galleryRealtimeBound = 'true';
    }
  })().catch(error => {
    if ($('#gallery-status')) $('#gallery-status').textContent = 'Supabase · mostrando el archivo local';
    console.warn('No se pudo sincronizar la galería.', error);
  }).finally(() => { galleryRefreshPromise = null; });
  return galleryRefreshPromise;
}
window.archiveGalleryRefresh = refreshGalleryFromSupabase;
document.querySelector('.access-logo')?.addEventListener('error', event => { event.currentTarget.replaceWith(document.createTextNode('FA')); }, { once: true });
if ($('#gallery-stage')) {
  const refreshTimer = window.setInterval(() => {
    if (!window.archiveClient) return;
    window.clearInterval(refreshTimer);
    refreshGalleryFromSupabase();
  }, 250);
}
