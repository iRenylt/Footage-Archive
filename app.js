const config = window.APP_CONFIG;
const $ = selector => document.querySelector(selector);
const texts = config.texts || {};
const visual = config.visual || {};
const system = texts.system || {};
const setText = (selector, value) => { const element = $(selector); if (element && value !== undefined) element.textContent = value; };
const setHtml = (selector, value) => { const element = $(selector); if (element && value !== undefined) element.innerHTML = value; };
function applyConfiguredTexts() {
  Object.entries(texts.elements || {}).forEach(([selector, value]) => {
    document.querySelectorAll(selector).forEach(element => {
      if (element.matches('label')) { element.childNodes[0].textContent = value; return; }
      if (selector === 'title' || selector.includes('button') || selector.includes('h1') || selector.includes('h3') || selector.includes('eyebrow') || selector.includes('label') || selector.includes('footer') || selector.includes('art-label') || selector.includes('section-note') || selector.includes('access-title') || selector.includes('access-copy') || selector.includes('loader')) element.innerHTML = value;
      else element.textContent = value;
    });
  });
  const navigation = texts.navigation || {};
  const home = texts.home || {};
  const letters = texts.letters || {};
  const gallery = texts.gallery || {};
  const notes = texts.notes || {};
  const letter = texts.letter || {};
  if (visual.letterMinHeight) document.documentElement.style.setProperty('--letter-min-height', visual.letterMinHeight);
  if (visual.letterContentMinHeight) document.documentElement.style.setProperty('--letter-content-min-height', visual.letterContentMinHeight);
  if (texts.browserTitle) document.title = document.body.classList.contains('page-cartas') ? letters.pageTitle : document.body.classList.contains('page-galeria') ? gallery.pageTitle : document.body.classList.contains('page-notas') ? notes.pageTitle : texts.browserTitle;
  setText('#loader-message', texts.loader);
  document.querySelectorAll('.access-box .eyebrow').forEach(element => element.textContent = texts.accessEyebrow);
  setText('#access-copy', texts.accessCopy);
  document.querySelectorAll('#pin-form button').forEach(button => { const icon = button.querySelector('span'); button.childNodes[0].textContent = `${texts.accessButton} `; if (icon) icon.textContent = '↗'; });
  setText('#pin-label', texts.pinLabel);
  const pinInput = $('#pin-input'); if (pinInput) { pinInput.placeholder = texts.pinPlaceholder; pinInput.setAttribute('aria-label', texts.pinLabel); }
  document.querySelectorAll('nav a').forEach(link => { const href = link.getAttribute('href'); link.textContent = href.includes('carta') ? navigation.letters : href.includes('galeria') ? navigation.gallery : href.includes('nota') ? navigation.notes : navigation.home; });
  setText('.hero .eyebrow', home.eyebrow);
  setHtml('#hero-title', home.heroTitle);
  setHtml('.art-label', home.artLabel);
  setText('.site-footer span:last-child', home.footer);
  setText('.letters-section .eyebrow', letters.eyebrow);
  setHtml('.letters-section h1', letters.title);
  setHtml('.letters-section .section-note', letters.note);
  setText('.letters-section .spotify-wrap .eyebrow', letters.soundtrack);
  setHtml('.letters-section .spotify-wrap h3', letters.soundtrackTitle);
  setText('.gallery-section .eyebrow', gallery.eyebrow);
  setHtml('.gallery-section h1', gallery.title);
  $('#prev-wall')?.setAttribute('aria-label', gallery.previous); $('#next-wall')?.setAttribute('aria-label', gallery.next);
  setText('.notes-section .eyebrow', notes.eyebrow);
  setHtml('.notes-section h1', notes.title);
  const nameLabel = $('.note-form label'); if (nameLabel) { nameLabel.childNodes[0].textContent = notes.nameLabel; nameLabel.querySelector('input').placeholder = notes.namePlaceholder; }
  const messageLabel = $('.note-form label:nth-of-type(2)'); if (messageLabel) { messageLabel.childNodes[0].textContent = notes.messageLabel; messageLabel.querySelector('textarea').placeholder = notes.messagePlaceholder; }
  const submit = $('.note-form button[type="submit"]'); if (submit) { const icon = submit.querySelector('span'); submit.childNodes[0].textContent = `${notes.submit} `; if (icon) icon.textContent = '↗'; }
  const letterBack = $('.full-letter .primary-link'); if (letterBack) { const icon = letterBack.querySelector('span'); letterBack.childNodes[0].textContent = `${letter.back} `; if (icon) icon.textContent = '↙'; }
}
applyConfiguredTexts();
const fallbackWalls = config.galleryFallback.map((wall, index) => ({ ...wall, slot: index + 1 }));
let walls = fallbackWalls.map(wall => ({ ...wall })); let wallIndex = 0;
let supabaseStatus = 'idle';
window.addEventListener('offline', () => { supabaseStatus = 'error'; if ($('#note-form')) showFormMessage(system.offlineNote || 'Sin conexión.', 'error'); if ($('#gallery-status')) $('#gallery-status').textContent = system.offlineGallery || 'Sin conexión'; });
window.addEventListener('online', () => { if (config.supabase.url && config.supabase.anonKey && window.archiveClient) { supabaseStatus = 'ready'; if ($('#note-form')) showFormMessage(system.onlineNote || 'Conexión recuperada.', 'success'); if ($('#gallery-status')) $('#gallery-status').textContent = system.onlineGallery || 'Galería lista'; } });
document.querySelectorAll('#guide-button').forEach(element => element.remove());
document.documentElement.style.setProperty('--paper', '#e7e4dc');
document.documentElement.style.setProperty('--soft', '#c7c5be');
document.documentElement.style.setProperty('--muted', '#9b9b95');
document.documentElement.style.setProperty('--acid', '#a8a8a1');
document.documentElement.style.setProperty('--line', 'rgba(231,228,220,.18)');
document.body.style.backgroundColor = '#101114';
const isHomePage = document.body.classList.contains('page-home') || location.pathname.endsWith('/index.html') || location.pathname.endsWith('/');
const randomMessages = system.randomMessages || [];
const randomHearts = system.hearts || ['♥'];
const accessTitles = system.accessTitles || [];
const randomMessage = () => randomMessages[Math.floor(Math.random() * randomMessages.length)];
const randomAccessTitle = () => accessTitles[Math.floor(Math.random() * accessTitles.length)];
const timeGreeting = () => { const hour = new Date().getHours(); return hour < 12 ? (system.morning || 'Buenos días') : hour < 19 ? (system.afternoon || 'Buenas tardes') : (system.evening || 'Buenas noches'); };
const openingMessage = () => `${randomHearts[Math.floor(Math.random() * randomHearts.length)]} ${randomMessage()} ${randomHearts[Math.floor(Math.random() * randomHearts.length)]}`;
const logoMarks = document.querySelectorAll('.brand-mark,.loader-mark');
const renderLogo = () => logoMarks.forEach(mark => {
  if (!config.logoImage) { mark.textContent = system.loadingFallback || 'FA'; return; }
  mark.innerHTML = `<img src="${config.logoImage}" alt="${config.logoAlt || config.name}">`;
  mark.querySelector('img').addEventListener('error', () => { mark.textContent = 'FA'; }, { once: true });
});
renderLogo();
if ($('#brand-name')) $('#brand-name').textContent = config.name; if ($('#hero-title')) $('#hero-title').innerHTML = texts.home?.heroTitle || 'Footage<br><em>Archive.</em>'; if ($('#hero-intro')) $('#hero-intro').textContent = config.intro; if ($('#footer-signature')) $('#footer-signature').textContent = config.signature; if ($('#spotify')) $('#spotify').src = config.spotifyEmbed; if ($('#hero-intro') && !$('#last-updated')) { const updateNote = document.createElement('p'); updateNote.className = 'update-note'; updateNote.innerHTML = 'Se actualiza entre días · <time id="last-updated"></time>'; $('#hero-intro').after(updateNote); } if ($('#last-updated')) { const fileDate = new Date(document.lastModified); const updateDate = Number.isNaN(fileDate.getTime()) ? new Date(config.lastUpdated) : fileDate; $('#last-updated').textContent = updateDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' }); } if (document.body.classList.contains('page-notas')) { const notesTitle = document.querySelector('.notes-grid h1'); if (notesTitle) { notesTitle.textContent = texts.notes?.greetingName || 'Nohelia'; const loveTitle = document.createElement('h2'); loveTitle.className = 'love-line'; loveTitle.innerHTML = texts.notes?.loveTitle || 'El Amor de<br><em>Mi Vida.</em>'; notesTitle.after(loveTitle); } } if ($('#letters')) renderLetters(); if ($('.full-letter')) renderLetterPage(); if ($('#gallery-stage')) renderWall(); if ($('#gallery-stage') || $('#note-form')) setupSupabase(); if ($('#image-picker')) $('#image-picker').addEventListener('change', changeWallImage); if ($('#note-form')) { const nameInput = $('#note-form').querySelector('[name="name"]'); if (nameInput) nameInput.closest('label').remove(); const noteInput = $('#note-form').querySelector('[name="message"]'); if (noteInput) { noteInput.placeholder = texts.notes?.messagePlaceholder || 'Escribe algo bonito para ella...'; noteInput.closest('label').firstChild.textContent = texts.notes?.messageLabel || 'Tu mensaje'; } }
if ($('#access-random')) $('#access-random').textContent = randomMessage();
if ($('#loader p')) { $('#loader p').innerHTML = `<span class="loader-greeting">${timeGreeting()}, ${texts.notes?.greetingName || config.name}.</span><span class="loader-random">${openingMessage()}</span>`; }
if (!isHomePage && $('#loader')) { $('#loader').style.transition = 'none'; $('#loader').classList.add('done'); }
if (!$('#access-random') && $('#pin-form')) { const randomCopy = document.createElement('p'); randomCopy.className = 'access-random'; randomCopy.textContent = randomMessage(); $('#pin-form').before(randomCopy); }
if ($('#access-title')) $('#access-title').innerHTML = randomAccessTitle();
if ($('#access-screen')) { $('#access-screen').classList.add('visible'); $('#access-screen').setAttribute('aria-hidden', 'false'); }
if ($('.access-box') && !$('.access-box').querySelector('.access-logo')) { const logo = document.createElement('img'); logo.className = 'access-logo'; logo.src = config.logoImage; logo.alt = config.logoAlt || config.name; $('.access-box').prepend(logo); }
if ($('#pin-input')) { $('#pin-input').placeholder = texts.pinPlaceholder || '0 0 0 0'; if (!$('#pin-label')) { const pinLabel = document.createElement('label'); pinLabel.id = 'pin-label'; pinLabel.className = 'pin-label'; pinLabel.htmlFor = 'pin-input'; pinLabel.textContent = texts.pinLabel || 'Introduce tu PIN'; $('#pin-input').before(pinLabel); } }

function renderLetters() {
  const years = [...new Set(config.letters.map(letter => letter.year || 'Archivo'))];
  $('#letters').innerHTML = years.map(year => `<section class="letter-year"><div class="year-heading"><p class="eyebrow">${texts.letters?.eyebrow || 'CARTAS'}</p><h2>${year}</h2></div><div class="year-letters">${config.letters.filter(letter => (letter.year || 'Archivo') === year).map(letter => `<a class="letter" href="${letter.page}"><div><span class="letter-number">${letter.date}</span><h3>${letter.title}</h3><p>${letter.detail || texts.letters?.fallbackDetail || 'Una carta guardada para ti.'}</p></div><span class="letter-toggle">${texts.letters?.open || 'Abrir archivo ↗'}</span></a>`).join('')}</div></section>`).join('');
}
function renderLetterPage() {
  const fileName = location.pathname.split('/').pop();
  const letter = config.letters.find(item => item.page === fileName);
  if (!letter) return;
  const article = $('.full-letter');
  article.classList.add('letter-shell');
  article.classList.remove('is-open');
  const eyebrow = article.querySelector('.eyebrow');
  const content = article.querySelector('.letter-content');
  if (eyebrow) eyebrow.textContent = `${letter.date} · ${letter.year}`;
  if (content) content.textContent = letter.text;
  const title = article.querySelector('h1');
  if (title) title.setAttribute('data-letter-title', letter.title);
  const envelopeToggle = document.createElement('button'); envelopeToggle.className = 'envelope-toggle'; envelopeToggle.type = 'button'; envelopeToggle.setAttribute('aria-expanded', 'false'); envelopeToggle.innerHTML = `<span class="envelope-icon">✉</span><span>${texts.letter?.open || 'Abrir carta'}</span>`; article.prepend(envelopeToggle);
  const flower = document.createElement('button'); flower.className = 'letter-flower'; flower.type = 'button'; flower.setAttribute('aria-label', letter.flowerLabel || 'Tocar la flor'); flower.innerHTML = '<span>✿</span>'; article.prepend(flower);
  const details = document.createElement('div'); details.className = 'letter-details'; details.innerHTML = `<span>${letter.year}</span><span>${letter.detail || 'Un recuerdo para volver a leer.'}</span>`; content?.after(details);
  const mark = document.createElement('p'); mark.className = 'letter-signature'; mark.textContent = texts.letter?.signature || 'Con cariño, para leerlo despacio.'; details?.after(mark);
  const spotify = document.createElement('div'); spotify.className = 'letter-spotify'; spotify.innerHTML = `<p class="eyebrow">${texts.letter?.soundtrack || 'BANDA SONORA DE ESTA CARTA'}</p><iframe title="Banda sonora de ${letter.title}" loading="lazy" src="${letter.spotifyEmbed || config.spotifyEmbed}" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`; mark.after(spotify);
  const backLink = article.querySelector('.primary-link'); backLink?.classList.add('letter-actions');
  envelopeToggle.addEventListener('click', () => { const open = article.classList.toggle('is-open'); envelopeToggle.setAttribute('aria-expanded', String(open)); envelopeToggle.querySelector('span:last-child').textContent = open ? (texts.letter?.close || 'Cerrar carta') : (texts.letter?.open || 'Abrir carta'); });
  flower.addEventListener('click', () => revealSecretMessage(`${location.pathname}:flower`));
}
function renderWall() { const wall = walls[wallIndex]; $('#gallery-stage').innerHTML = `<button class="wall-image-button" id="change-image" type="button" aria-label="Cambiar imagen de ${wall.title}"><img src="${wall.image}" alt="${wall.caption}" /><span>presiona para cambiar</span></button><div class="gallery-copy"><h3>${wall.title}</h3><p>${wall.caption}</p></div>`; $('#wall-count').textContent = `${String(wallIndex + 1).padStart(2, '0')} / ${String(walls.length).padStart(2, '0')}`; $('#change-image').addEventListener('click', () => $('#image-picker').click()); }
function setupSupabase() {
  const settings = config.supabase;
  if (!settings.url || !settings.anonKey) { supabaseStatus = 'error'; if ($('#gallery-status')) $('#gallery-status').textContent = system.pendingSupabase || 'Supabase pendiente'; if ($('#note-form')) showFormMessage(system.pendingSupabaseNote || 'Configura Supabase antes de enviar.', 'error'); return; }
  supabaseStatus = 'connecting';
  if (window.archiveClient) return;
  const script = document.createElement('script'); script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'; script.onload = async () => { try { window.archiveClient = window.supabase.createClient(settings.url, settings.anonKey); supabaseStatus = 'ready'; if ($('#note-form')) showFormMessage('Conexión lista · tus mensajes se guardarán en Supabase.', 'success'); if ($('#gallery-stage')) { const { data, error } = await window.archiveClient.from(settings.galleryTable).select('*').order('created_at', { ascending: true }); if (error) throw error; if (data?.length) { const syncedWalls = fallbackWalls.map((fallback, index) => { const item = data.find(row => Number(row.slot) === fallback.slot) || data[index]; return item ? { ...fallback, id: item.id, title: item.title || fallback.title, caption: item.caption || fallback.caption, image: item.image_url || fallback.image } : { ...fallback }; }); walls = syncedWalls; wallIndex = 0; renderWall(); $('#gallery-status').textContent = `Supabase · ${data.length} muro${data.length === 1 ? '' : 's'} sincronizado${data.length === 1 ? '' : 's'} de ${walls.length}`; } } } catch (error) { if ($('#gallery-stage')) $('#gallery-status').textContent = 'Supabase · revisa galleryTable y sus permisos'; if ($('#note-form')) showFormMessage('Conexión lista, pero la tabla de imágenes tiene un error. Los mensajes siguen disponibles.', 'error'); console.error(error); } }; script.onerror = () => { supabaseStatus = 'error'; if ($('#gallery-status')) $('#gallery-status').textContent = 'No se pudo cargar el cliente de Supabase'; if ($('#note-form')) showFormMessage('No se pudo cargar Supabase. No se enviarán mensajes hasta recuperar la conexión.', 'error'); }; document.head.appendChild(script);
}
function showFormMessage(text, type = 'error') { const message = $('#form-message'); if (!message) return; message.textContent = text; message.className = `form-message ${type}`; message.setAttribute('role', 'status'); }
async function changeWallImage(event) { const file = event.target.files[0]; event.target.value = ''; if (!file) return; if (!file.type.startsWith('image/')) { if ($('#gallery-status')) $('#gallery-status').textContent = 'Selecciona un archivo de imagen válido.'; return; } if (supabaseStatus !== 'ready' || !window.archiveClient || !navigator.onLine) { if ($('#gallery-status')) $('#gallery-status').textContent = 'No se puede sincronizar: Supabase o la conexión no están disponibles. No se ha guardado la imagen.'; return; } const wall = walls[wallIndex]; if (!wall) return; if ($('#gallery-status')) $('#gallery-status').textContent = `Sincronizando imagen del muro ${wall.slot || wallIndex + 1}...`; try { const path = `muro-${wall.slot || wallIndex + 1}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '-')}`; const { error: uploadError } = await window.archiveClient.storage.from(config.supabase.galleryBucket).upload(path, file, { upsert: true }); if (uploadError) throw uploadError; const { data: publicData } = window.archiveClient.storage.from(config.supabase.galleryBucket).getPublicUrl(path); const imageUrl = publicData.publicUrl; const payload = { slot: wall.slot || wallIndex + 1, title: wall.title || `Muro ${wallIndex + 1}`, caption: wall.caption || '', image_url: imageUrl }; const result = wall.id ? await window.archiveClient.from(config.supabase.galleryTable).update({ image_url: imageUrl, slot: payload.slot }).eq('id', wall.id) : await window.archiveClient.from(config.supabase.galleryTable).insert(payload).select().single(); if (result.error) throw result.error; if (result.data?.id) wall.id = result.data.id; wall.slot = payload.slot; wall.image = imageUrl; renderWall(); if ($('#gallery-status')) $('#gallery-status').textContent = `Supabase · muro ${payload.slot} sincronizado`; } catch (error) { if ($('#gallery-status')) $('#gallery-status').textContent = 'No se pudo sincronizar la imagen. No se ha guardado nada. Revisa Storage, tabla y permisos.'; console.error(error); } }
async function saveNote(event) { event.preventDefault(); const form = event.currentTarget; const submit = form.querySelector('button[type="submit"]'); const values = Object.fromEntries(new FormData(form)); const noteText = String(values.message || '').trim(); if (!noteText) { showFormMessage('No se puede enviar un mensaje vacío. Escribe algo antes de continuar.', 'error'); form.elements.message.focus(); return; } if (supabaseStatus !== 'ready' || !window.archiveClient || !navigator.onLine) { showFormMessage('No se puede enviar: Supabase o la conexión no están disponibles. No se ha enviado nada.', 'error'); return; } form.classList.add('is-sending'); if (submit) submit.disabled = true; showFormMessage('Enviando mensaje...', 'pending'); try { const payload = { [config.supabase.commentsMessageColumn || 'message']: noteText }; const { error } = await window.archiveClient.from(config.supabase.commentsTable).insert(payload); if (error) throw error; showFormMessage('Mensaje enviado correctamente.', 'success'); form.reset(); } catch (error) { supabaseStatus = 'error'; showFormMessage('No se pudo enviar: la tabla de comentarios o la API tienen un error. No se ha guardado nada.', 'error'); console.error(error); } finally { form.classList.remove('is-sending'); if (submit) submit.disabled = false; } }
if ($('#prev-wall')) $('#prev-wall').addEventListener('click', () => { wallIndex = (wallIndex - 1 + walls.length) % walls.length; renderWall(); }); if ($('#next-wall')) $('#next-wall').addEventListener('click', () => { wallIndex = (wallIndex + 1) % walls.length; renderWall(); }); if ($('#note-form')) $('#note-form').addEventListener('submit', saveNote);
function showAccess(title = randomAccessTitle(), copy = 'Escribe el PIN para entrar a este recuerdo.') { $('#access-title').innerHTML = title; $('#access-copy').textContent = copy; if ($('#access-random')) $('#access-random').textContent = randomMessage(); $('#access-screen').classList.remove('hidden'); $('#access-screen').classList.add('visible'); $('#access-screen').setAttribute('aria-hidden', 'false'); setTimeout(() => $('#pin-input').focus(), 100); }
function hideAccess() { $('#access-screen').classList.remove('visible'); $('#access-screen').classList.add('hidden'); $('#access-screen').setAttribute('aria-hidden', 'true'); $('#pin-input').value = ''; $('#pin-message').textContent = ''; }
$('#pin-form').addEventListener('submit', event => { event.preventDefault(); if ($('#pin-input').value === config.accessPin) { const destination = event.currentTarget.dataset.destination; const revealSecret = event.currentTarget.dataset.secret === 'true'; delete event.currentTarget.dataset.destination; delete event.currentTarget.dataset.secret; hideAccess(); if (revealSecret) revealSecretMessage(`${location.pathname}:heart`); if (destination) setTimeout(() => document.querySelector(destination)?.scrollIntoView({ behavior: 'smooth' }), 50); } else { $('#pin-message').textContent = 'Ese no es el código todavía.'; $('#pin-input').select(); } });
document.querySelectorAll('a[href^="#"]:not(.brand):not([href="#inicio"])').forEach(link => link.addEventListener('click', event => { event.preventDefault(); showAccess('Antes de continuar,<br><em>una clave.</em>', 'Cada sección guarda una pequeña sorpresa.'); const destination = link.getAttribute('href'); $('#pin-form').dataset.destination = destination; }));
const promptedSections = new Set();
const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting && entry.intersectionRatio > 0.42 && !promptedSections.has(entry.target.id)) { promptedSections.add(entry.target.id); showAccess('Antes de continuar,<br><em>una clave.</em>', 'Cada sección guarda una pequeña sorpresa.'); } }), { threshold: [0.42] });
document.querySelectorAll('main section:not(.hero)').forEach(section => sectionObserver.observe(section));
window.addEventListener('load', () => { if (isHomePage) setTimeout(() => { $('#loader').classList.add('done'); }, 2600); });
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('./sw.js');
let deferredInstall; window.addEventListener('beforeinstallprompt', event => { event.preventDefault(); deferredInstall = event; if ($('#install-button')) $('#install-button').hidden = false; }); if ($('#install-button')) $('#install-button').addEventListener('click', async () => { if (!deferredInstall) return; deferredInstall.prompt(); deferredInstall = null; $('#install-button').hidden = true; });
if ($('#secret-heart')) $('#secret-heart').addEventListener('click', () => { $('#pin-form').dataset.secret = 'true'; showAccess('Encontraste<br><em>un secreto.</em>', 'La clave también abre lo que está escondido.'); });
function revealSecretMessage(place = `${location.pathname}:general`) {
  const seenKey = `archive-secrets-seen:${place}`;
  const seen = JSON.parse(localStorage.getItem(seenKey) || '[]');
  const available = config.secrets.map((_, index) => index).filter(index => !seen.includes(index));
  const pool = available.length ? available : config.secrets.map((_, index) => index);
  const secretIndex = pool[Math.floor(Math.random() * pool.length)];
  localStorage.setItem(seenKey, JSON.stringify([...seen.filter(index => index !== secretIndex), secretIndex]));
  const secret = config.secrets[secretIndex];
  const mediaType = secretIndex % 3 === 0 ? 'image' : secretIndex % 3 === 1 ? 'spotify' : 'message';
  const image = config.galleryFallback[secretIndex % config.galleryFallback.length]?.image;
  const media = mediaType === 'image' ? `<img class="secret-image" src="${image}" alt="Imagen escondida del archivo">` : mediaType === 'spotify' ? '<button class="secret-media-button" type="button">Abrir la canción escondida <span>↗</span></button><div class="secret-spotify" hidden><iframe title="Canción escondida" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>' : '<span class="secret-mark">♥</span>';
  const panel = document.createElement('div'); panel.className = 'secret-reveal'; panel.innerHTML = `<div class="secret-card"><button class="secret-close" type="button" aria-label="Cerrar secreto">×</button><p class="eyebrow">DESCUBRIMIENTO · ${String(secretIndex + 1).padStart(3, '0')} / ${config.secrets.length}</p><h2>Has encontrado<br><em>algo nuestro.</em></h2><p class="secret-copy">${secret}</p>${media}<p class="secret-hint">Pista: vuelve a mirar los pequeños detalles del archivo.</p></div></div>`; document.body.append(panel); panel.querySelector('.secret-close').addEventListener('click', () => panel.remove()); panel.addEventListener('click', event => { if (event.target === panel) panel.remove(); }); const mediaButton = panel.querySelector('.secret-media-button'); if (mediaButton) mediaButton.addEventListener('click', () => { const player = panel.querySelector('.secret-spotify'); player.hidden = false; player.querySelector('iframe').src = config.spotifyEmbed; mediaButton.hidden = true; });
}
function enableSecretTriggers() { const triggers = document.querySelectorAll('.random-message,.access-random,.update-note,.letter-content,.letter-signature,.margin-note-copy,.gallery-copy,.art-label,.love-line'); triggers.forEach((trigger, index) => { if (trigger.dataset.secretReady) return; trigger.dataset.secretReady = 'true'; trigger.setAttribute('role', 'button'); trigger.setAttribute('tabindex', '0'); trigger.setAttribute('aria-label', 'Elemento interactivo'); const place = `${location.pathname}:trigger-${index}`; const open = event => { event.preventDefault(); revealSecretMessage(place); }; trigger.addEventListener('click', open); trigger.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); }); }); addSectionHotspots(); }
function addSectionHotspots() { const containers = document.querySelectorAll('main section,main article,.spotify-wrap,.gallery-stage,.note-form'); containers.forEach((section, index) => { if (section.querySelector('.secret-hotspot')) return; const hotspot = document.createElement('button'); hotspot.className = 'secret-hotspot'; hotspot.type = 'button'; hotspot.setAttribute('aria-label', 'Elemento interactivo'); hotspot.innerHTML = '<span aria-hidden="true"></span>'; section.append(hotspot); hotspot.addEventListener('click', () => revealSecretMessage(`${location.pathname}:section-${index}`)); }); document.querySelectorAll('main h1,main h2').forEach((title, index) => { if (title.dataset.secretReady) return; title.dataset.secretReady = 'true'; title.setAttribute('role', 'button'); title.setAttribute('tabindex', '0'); title.setAttribute('aria-label', 'Elemento interactivo'); const open = event => { event.preventDefault(); revealSecretMessage(`${location.pathname}:title-${index}`); }; title.addEventListener('click', open); title.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') open(event); }); }); }
document.querySelectorAll('.brand-mark').forEach(mark => mark.addEventListener('dblclick', event => { event.preventDefault(); revealSecretMessage(); }));
enableSecretTriggers();
Object.entries(texts.elements || {}).forEach(([selector, value]) => {
  if (selector === 'title' || selector === '.loader p') return;
  document.querySelectorAll(selector).forEach(element => {
    if (element.matches('label')) { element.childNodes[0].textContent = value; return; }
    element.innerHTML = value;
  });
});
