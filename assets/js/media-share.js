/*
  FIGHT LIRA / DFL — Compartilhamento e proteção de mídia
  Versão: 1.0
*/
(function FightLiraMediaShare() {
  'use strict';

  if (window.__fightLiraMediaShareLoaded) return;
  window.__fightLiraMediaShareLoaded = true;

const GA_ID = 'G-549G0VHR49';

  function analyticsConfigured() {
    return /^G-[A-Z0-9]+$/i.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX';
  }

  function initAnalytics() {
    if (!analyticsConfigured()) return;

    if (!window.dataLayer) window.dataLayer = [];

    if (!window.gtag) {
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
    }

    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { send_page_view: true });

    if (!document.querySelector(`script[data-fight-lira-ga="${GA_ID}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src =
        `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
      script.dataset.fightLiraGa = GA_ID;
      document.head.appendChild(script);
    }
  }

  initAnalytics();

  if (!document.getElementById('fight-lira-media-share-style')) {
    const style = document.createElement('style');

    style.id = 'fight-lira-media-share-style';

    style.textContent = `
      .gallery img,
      .lightbox img,
      video {
        -webkit-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
        -webkit-touch-callout: none !important;
      }

      .fl-sharebar {
        position: absolute;
        left: 50%;
        bottom: 46px;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: min(92vw, 560px);
        pointer-events: auto;
      }

      .fl-sharebtn,
      .fl-seminar-share {
        appearance: none;
        border: 1px solid rgba(255,255,255,.20);
        background: rgba(10,10,10,.90);
        color: #fff;
        min-height: 42px;
        padding: 0 15px;
        border-radius: 999px;
        font: 800 12px/1 Arial, Helvetica, sans-serif;
        letter-spacing: .04em;
        cursor: pointer;
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        box-shadow: 0 8px 24px rgba(0,0,0,.28);
      }

      .fl-sharebtn:hover,
      .fl-seminar-share:hover {
        border-color: rgba(255,255,255,.42);
        background: #171717;
      }

      .fl-sharebtn.whatsapp,
      .fl-seminar-share {
        border-color: rgba(37,211,102,.48);
      }

      .fl-seminar-share {
        min-height: 50px;
        padding: 0 22px;
      }

      .fl-share-toast {
        position: fixed;
        left: 50%;
        bottom: 22px;
        transform: translateX(-50%);
        z-index: 12000;
        padding: 10px 14px;
        border-radius: 999px;
        background: #fff;
        color: #080808;
        font: 800 12px/1 Arial, Helvetica, sans-serif;
        box-shadow: 0 10px 34px rgba(0,0,0,.35);
        opacity: 0;
        pointer-events: none;
        transition: opacity .18s ease;
      }

      .fl-share-toast.show {
        opacity: 1;
      }

      @media (max-width: 640px) {
        .fl-sharebar {
          bottom: 45px;
          gap: 6px;
        }

        .fl-sharebtn {
          min-height: 40px;
          padding: 0 12px;
          font-size: 11px;
        }

        .lightbox .counter {
          bottom: 12px !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function normalizeId(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase()
      .slice(0, 120);
  }

  function pageId() {
    return normalizeId(
      window.location.pathname.split('/').pop() || 'pagina'
    );
  }

  function getCurrentPhotoNumber() {
    const counter = document.getElementById('counter');

    if (counter) {
      const match =
        (counter.textContent || '').match(/(\d+)\s*\/\s*\d+/);

      if (match) return Number(match[1]);
    }

    const lightboxImg =
      document.getElementById('lightboxImg');

    const gallery =
      document.querySelector('.gallery');

    if (!lightboxImg || !gallery) return null;

    const currentSrc =
      lightboxImg.currentSrc || lightboxImg.src;

    const images =
      [...gallery.querySelectorAll('img')];

    const index =
      images.findIndex(
        img =>
          (img.currentSrc || img.src) === currentSrc
      );

    return index >= 0 ? index + 1 : null;
  }

  function getCampaignType(contentType) {
    if (contentType === 'seminario') return 'seminario';
    if (contentType === 'video') return 'video';
    return 'galeria';
  }

  function buildShareUrl(contentType, photoNumber, method) {
    const url =
      new URL(window.location.href);

    url.hash = '';

    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content'
    ].forEach(
      key => url.searchParams.delete(key)
    );

    if (photoNumber) {
      url.searchParams.set(
        'foto',
        String(photoNumber)
      );
    } else {
      url.searchParams.delete('foto');
    }

    url.searchParams.set(
      'utm_source',
      method === 'whatsapp'
        ? 'whatsapp'
        : 'copy_link'
    );

    url.searchParams.set(
      'utm_medium',
      'share'
    );

    url.searchParams.set(
      'utm_campaign',
      `fightlira_${getCampaignType(contentType)}`
    );

    const item =
      photoNumber
        ? `${pageId()}-foto-${photoNumber}`
        : pageId();

    url.searchParams.set(
      'utm_content',
      item
    );

    return url.toString();
  }

  function buildCleanPhotoUrl(photoNumber) {
    const url =
      new URL(window.location.href);

    url.hash = '';

    [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content'
    ].forEach(
      key => url.searchParams.delete(key)
    );

    if (photoNumber) {
      url.searchParams.set(
        'foto',
        String(photoNumber)
      );
    } else {
      url.searchParams.delete('foto');
    }

    return url.toString();
  }

  function itemId(contentType, photoNumber) {
    if (photoNumber) {
      return `${pageId()}-foto-${photoNumber}`;
    }

    return `${pageId()}-${contentType}`;
  }

  function trackShare(
    method,
    contentType,
    photoNumber
  ) {
    if (
      typeof window.gtag !== 'function' ||
      !analyticsConfigured()
    ) {
      return;
    }

    window.gtag(
      'event',
      'share',
      {
        method,
        content_type: contentType,
        item_id:
          itemId(
            contentType,
            photoNumber
          )
      }
    );
  }

  function shareText(
    contentType,
    url,
    photoNumber
  ) {
    if (contentType === 'seminario') {
      return (
        `Fight Lira • Seminário\n` +
        `${document.title}\n` +
        `${url}`
      );
    }

    if (contentType === 'video') {
      return (
        `Fight Lira / DFL • Vídeo oficial\n` +
        `${url}`
      );
    }

    return (
      `Fight Lira / DFL • Foto oficial` +
      `${photoNumber ? ' ' + photoNumber : ''}\n` +
      `${url}`
    );
  }

  function openWhatsApp(
    contentType,
    photoNumber
  ) {
    const url =
      buildShareUrl(
        contentType,
        photoNumber,
        'whatsapp'
      );

    const message =
      shareText(
        contentType,
        url,
        photoNumber
      );

    trackShare(
      'whatsapp',
      contentType,
      photoNumber
    );

    window.open(
      'https://wa.me/?text=' +
        encodeURIComponent(message),
      '_blank',
      'noopener,noreferrer'
    );
  }

  let toastTimer;

  function showToast(message) {
    let toast =
      document.querySelector(
        '.fl-share-toast'
      );

    if (!toast) {
      toast =
        document.createElement('div');

      toast.className =
        'fl-share-toast';

      document.body.appendChild(toast);
    }

    toast.textContent = message;

    toast.classList.add('show');

    clearTimeout(toastTimer);

    toastTimer =
      setTimeout(
        () =>
          toast.classList.remove(
            'show'
          ),
        1500
      );
  }

  async function copyLink(
    contentType,
    photoNumber
  ) {
    const url =
      buildShareUrl(
        contentType,
        photoNumber,
        'copy_link'
      );

    try {
      await navigator.clipboard.writeText(
        url
      );
    } catch (_) {
      const temp =
        document.createElement('textarea');

      temp.value = url;

      temp.setAttribute(
        'readonly',
        ''
      );

      temp.style.position = 'fixed';
      temp.style.opacity = '0';

      document.body.appendChild(temp);

      temp.select();

      document.execCommand('copy');

      temp.remove();
    }

    trackShare(
      'copy_link',
      contentType,
      photoNumber
    );

    showToast('LINK COPIADO');
  }

  function protectMedia(
    root = document
  ) {
    root
      .querySelectorAll(
        '.gallery img, .lightbox img, video'
      )
      .forEach(el => {
        el.setAttribute(
          'draggable',
          'false'
        );

        if (
          !el.dataset.fightLiraProtected
        ) {
          el.dataset.fightLiraProtected =
            '1';

          el.addEventListener(
            'dragstart',
            event =>
              event.preventDefault()
          );

          el.addEventListener(
            'contextmenu',
            event =>
              event.preventDefault()
          );
        }

        if (
          el.tagName === 'VIDEO'
        ) {
          el.setAttribute(
            'controlsList',
            'nodownload'
          );

          el.disablePictureInPicture =
            true;
        }
      });
  }

  document.addEventListener(
    'contextmenu',
    event => {
      if (
        event.target.closest(
          '.gallery img, .lightbox img, video'
        )
      ) {
        event.preventDefault();
      }
    }
  );

  document.addEventListener(
    'keydown',
    event => {
      const lightbox =
        document.getElementById(
          'lightbox'
        );

      if (
        lightbox &&
        lightbox.classList.contains(
          'active'
        ) &&
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() === 's'
      ) {
        event.preventDefault();
      }
    }
  );

  function setupGalleryShare() {
    const lightbox =
      document.getElementById(
        'lightbox'
      );

    const lightboxImg =
      document.getElementById(
        'lightboxImg'
      );

    const gallery =
      document.querySelector(
        '.gallery'
      );

    if (
      !lightbox ||
      !lightboxImg ||
      !gallery
    ) {
      return;
    }

    if (
      !lightbox.querySelector(
        '.fl-sharebar'
      )
    ) {
      const bar =
        document.createElement(
          'div'
        );

      bar.className =
        'fl-sharebar';

      bar.setAttribute(
        'aria-label',
        'Compartilhar foto'
      );

      const whatsapp =
        document.createElement(
          'button'
        );

      whatsapp.type = 'button';

      whatsapp.className =
        'fl-sharebtn whatsapp';

      whatsapp.textContent =
        'WHATSAPP';

      const copy =
        document.createElement(
          'button'
        );

      copy.type = 'button';

      copy.className =
        'fl-sharebtn';

      copy.textContent =
        'COPIAR LINK';

      whatsapp.addEventListener(
        'click',
        event => {
          event.stopPropagation();

          openWhatsApp(
            'foto',
            getCurrentPhotoNumber()
          );
        }
      );

      copy.addEventListener(
        'click',
        event => {
          event.stopPropagation();

          copyLink(
            'foto',
            getCurrentPhotoNumber()
          );
        }
      );

      bar.addEventListener(
        'click',
        event =>
          event.stopPropagation()
      );

      bar.append(
        whatsapp,
        copy
      );

      lightbox.appendChild(bar);
    }

    function syncCleanAddress() {
      if (
        !lightbox.classList.contains(
          'active'
        )
      ) {
        return;
      }

      const photoNumber =
        getCurrentPhotoNumber();

      if (!photoNumber) return;

      history.replaceState(
        null,
        '',
        buildCleanPhotoUrl(
          photoNumber
        )
      );
    }

    function clearPhotoParam() {
      const url =
        new URL(
          window.location.href
        );

      if (
        !url.searchParams.has('foto')
      ) {
        return;
      }

      url.searchParams.delete('foto');

      history.replaceState(
        null,
        '',
        url.pathname +
          url.search +
          url.hash
      );
    }

    new MutationObserver(
      () => {
        if (
          lightbox.classList.contains(
            'active'
          )
        ) {
          setTimeout(
            syncCleanAddress,
            0
          );
        } else {
          clearPhotoParam();
        }
      }
    ).observe(
      lightbox,
      {
        attributes: true,
        attributeFilter: ['class']
      }
    );

    const counter =
      document.getElementById(
        'counter'
      );

    if (counter) {
      new MutationObserver(
        () => {
          if (
            lightbox.classList.contains(
              'active'
            )
          ) {
            syncCleanAddress();
          }
        }
      ).observe(
        counter,
        {
          childList: true,
          subtree: true,
          characterData: true
        }
      );
    }

    const requested =
      Number(
        new URL(
          window.location.href
        ).searchParams.get('foto')
      );

    if (
      Number.isInteger(requested) &&
      requested > 0
    ) {
      const index =
        requested - 1;

      function tryOpenRequested() {
        const images =
          [
            ...gallery.querySelectorAll(
              'img'
            )
          ];

        if (images[index]) {
          images[index].click();

          return true;
        }

        if (
          typeof window.openLightbox ===
          'function'
        ) {
          try {
            window.openLightbox(index);

            return true;
          } catch (_) {}
        }

        return false;
      }

      if (
        !tryOpenRequested()
      ) {
        const galleryObserver =
          new MutationObserver(
            () => {
              if (
                tryOpenRequested()
              ) {
                galleryObserver.disconnect();
              }
            }
          );

        galleryObserver.observe(
          gallery,
          {
            childList: true,
            subtree: true
          }
        );

        setTimeout(
          () =>
            galleryObserver.disconnect(),
          120000
        );
      }
    }
  }

  function setupSeminarShare() {
    if (
      document.getElementById(
        'lightbox'
      )
    ) {
      return;
    }

    const actions =
      document.querySelector(
        '.event-actions'
      );

    if (
      !actions ||
      actions.querySelector(
        '.fl-seminar-share'
      )
    ) {
      return;
    }

    const button =
      document.createElement(
        'button'
      );

    button.type = 'button';

    button.className =
      'fl-seminar-share';

    button.textContent =
      'COMPARTILHAR NO WHATSAPP';

    button.addEventListener(
      'click',
      () =>
        openWhatsApp(
          'seminario',
          null
        )
    );

    actions.appendChild(button);
  }

  protectMedia();

  setupGalleryShare();

  setupSeminarShare();

  new MutationObserver(
    mutations => {
      for (
        const mutation
        of mutations
      ) {
        mutation.addedNodes.forEach(
          node => {
            if (
              node.nodeType !== 1
            ) {
              return;
            }

            if (
              node.matches?.(
                '.gallery img, .lightbox img, video'
              )
            ) {
              protectMedia(
                node.parentElement ||
                document
              );
            } else if (
              node.querySelector?.(
                '.gallery img, .lightbox img, video'
              )
            ) {
              protectMedia(node);
            }
          }
        );
      }
    }
  ).observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );
})();
