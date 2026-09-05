const pageContent = window.ARCHIVE_CONTENT || {};

window.ARCHIVE_CONTENT = {
  ...pageContent,
  texts: window.APP_CONFIG.texts,
  galleryFallback: pageContent.galleryFallback || window.APP_CONFIG.galleryFallback
};

delete window.APP_CONFIG.texts;
delete window.APP_CONFIG.galleryFallback;
