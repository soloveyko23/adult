var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var require_index_min = __commonJS({
  "js/index.min.js"(exports, module) {
    (function polyfill() {
      const relList = document.createElement("link").relList;
      if (relList && relList.supports && relList.supports("modulepreload")) {
        return;
      }
      for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
        processPreload(link);
      }
      new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type !== "childList") {
            continue;
          }
          for (const node of mutation.addedNodes) {
            if (node.tagName === "LINK" && node.rel === "modulepreload")
              processPreload(node);
          }
        }
      }).observe(document, { childList: true, subtree: true });
      function getFetchOpts(link) {
        const fetchOpts = {};
        if (link.integrity) fetchOpts.integrity = link.integrity;
        if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
        if (link.crossOrigin === "use-credentials")
          fetchOpts.credentials = "include";
        else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
        else fetchOpts.credentials = "same-origin";
        return fetchOpts;
      }
      function processPreload(link) {
        if (link.ep)
          return;
        link.ep = true;
        const fetchOpts = getFetchOpts(link);
        fetch(link.href, fetchOpts);
      }
    })();
    let bodyLockStatus = true;
    let bodyUnlock = (delay = 500) => {
      if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        setTimeout(() => {
          lockPaddingElements.forEach((lockPaddingElement) => {
            lockPaddingElement.style.paddingRight = "";
          });
          document.body.style.paddingRight = "";
          document.documentElement.removeAttribute("data-scrolllock");
        }, delay);
        bodyLockStatus = false;
        setTimeout(function() {
          bodyLockStatus = true;
        }, delay);
      }
    };
    let bodyLock = (delay = 500) => {
      if (bodyLockStatus) {
        const lockPaddingElements = document.querySelectorAll("[data-lp]");
        const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
        lockPaddingElements.forEach((lockPaddingElement) => {
          lockPaddingElement.style.paddingRight = lockPaddingValue;
        });
        document.body.style.paddingRight = lockPaddingValue;
        document.documentElement.setAttribute("data-scrolllock", "");
        bodyLockStatus = false;
        setTimeout(function() {
          bodyLockStatus = true;
        }, delay);
      }
    };
    class Popup {
      constructor(options) {
        let config = {
          logging: true,
          init: true,
          //Для кнопок
          attributeOpenButton: "data-popup-link",
          // Атрибут для кнопки, яка викликає попап
          attributeCloseButton: "data-popup-close",
          // Атрибут для кнопки, що закриває попап
          // Для сторонніх об'єктів
          fixElementSelector: "[data-lp]",
          // Атрибут для елементів із лівим паддингом (які fixed)
          // Для об'єкту попапа
          attributeMain: "data-popup",
          youtubeAttribute: "data-popup-youtube",
          // Атрибут для коду youtube
          youtubePlaceAttribute: "data-popup-youtube-place",
          // Атрибут для вставки ролика youtube
          setAutoplayYoutube: true,
          // Зміна класів
          classes: {
            popup: "popup",
            // popupWrapper: 'popup__wrapper',
            popupContent: "data-popup-body",
            popupActive: "data-popup-active",
            // Додається для попапа, коли він відкривається
            bodyActive: "data-popup-open"
            // Додається для боді, коли попап відкритий
          },
          focusCatch: true,
          // Фокус усередині попапа зациклений
          closeEsc: true,
          // Закриття ESC
          bodyLock: true,
          // Блокування скролла
          hashSettings: {
            location: true,
            // Хеш в адресному рядку
            goHash: true
            // Перехід по наявності в адресному рядку
          },
          on: {
            // Події
            beforeOpen: function() {
            },
            afterOpen: function() {
            },
            beforeClose: function() {
            },
            afterClose: function() {
            }
          }
        };
        this.youTubeCode;
        this.isOpen = false;
        this.targetOpen = {
          selector: false,
          element: false
        };
        this.previousOpen = {
          selector: false,
          element: false
        };
        this.lastClosed = {
          selector: false,
          element: false
        };
        this._dataValue = false;
        this.hash = false;
        this._reopen = false;
        this._selectorOpen = false;
        this.lastFocusEl = false;
        this._focusEl = [
          "a[href]",
          'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
          "button:not([disabled]):not([aria-hidden])",
          "select:not([disabled]):not([aria-hidden])",
          "textarea:not([disabled]):not([aria-hidden])",
          "area[href]",
          "iframe",
          "object",
          "embed",
          "[contenteditable]",
          '[tabindex]:not([tabindex^="-"])'
        ];
        this.options = {
          ...config,
          ...options,
          classes: {
            ...config.classes,
            ...options == null ? void 0 : options.classes
          },
          hashSettings: {
            ...config.hashSettings,
            ...options == null ? void 0 : options.hashSettings
          },
          on: {
            ...config.on,
            ...options == null ? void 0 : options.on
          }
        };
        this.bodyLock = false;
        this.options.init ? this.initPopups() : null;
      }
      initPopups() {
        this.buildPopup();
        this.eventsPopup();
      }
      buildPopup() {
      }
      eventsPopup() {
        document.addEventListener("click", (function(e) {
          const buttonOpen = e.target.closest(`[${this.options.attributeOpenButton}]`);
          if (buttonOpen) {
            e.preventDefault();
            this._dataValue = buttonOpen.getAttribute(this.options.attributeOpenButton) ? buttonOpen.getAttribute(this.options.attributeOpenButton) : "error";
            this.youTubeCode = buttonOpen.getAttribute(this.options.youtubeAttribute) ? buttonOpen.getAttribute(this.options.youtubeAttribute) : null;
            if (this._dataValue !== "error") {
              if (!this.isOpen) this.lastFocusEl = buttonOpen;
              this.targetOpen.selector = `${this._dataValue}`;
              this._selectorOpen = true;
              this.open();
              return;
            }
            return;
          }
          const buttonClose = e.target.closest(`[${this.options.attributeCloseButton}]`);
          if (buttonClose || !e.target.closest(`[${this.options.classes.popupContent}]`) && this.isOpen) {
            e.preventDefault();
            this.close();
            return;
          }
        }).bind(this));
        document.addEventListener("keydown", (function(e) {
          if (this.options.closeEsc && e.which == 27 && e.code === "Escape" && this.isOpen) {
            e.preventDefault();
            this.close();
            return;
          }
          if (this.options.focusCatch && e.which == 9 && this.isOpen) {
            this._focusCatch(e);
            return;
          }
        }).bind(this));
        if (this.options.hashSettings.goHash) {
          window.addEventListener("hashchange", (function() {
            if (window.location.hash) {
              this._openToHash();
            } else {
              this.close(this.targetOpen.selector);
            }
          }).bind(this));
          if (window.location.hash) {
            this._openToHash();
          }
        }
      }
      open(selectorValue) {
        if (bodyLockStatus) {
          this.bodyLock = document.documentElement.hasAttribute("data-scrolllock") && !this.isOpen ? true : false;
          if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
            this.targetOpen.selector = selectorValue;
            this._selectorOpen = true;
          }
          if (this.isOpen) {
            this._reopen = true;
            this.close();
          }
          if (!this._selectorOpen) this.targetOpen.selector = this.lastClosed.selector;
          if (!this._reopen) this.previousActiveElement = document.activeElement;
          this.targetOpen.element = document.querySelector(`[${this.options.attributeMain}=${this.targetOpen.selector}]`);
          if (this.targetOpen.element) {
            const codeVideo = this.youTubeCode || this.targetOpen.element.getAttribute(`${this.options.youtubeAttribute}`);
            if (codeVideo) {
              const urlVideo = `https://www.youtube.com/embed/${codeVideo}?rel=0&showinfo=0&autoplay=1`;
              const iframe = document.createElement("iframe");
              const autoplay = this.options.setAutoplayYoutube ? "autoplay;" : "";
              iframe.setAttribute("allowfullscreen", "");
              iframe.setAttribute("allow", `${autoplay}; encrypted-media`);
              iframe.setAttribute("src", urlVideo);
              if (!this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
                this.targetOpen.element.querySelector("[data-popup-content]").setAttribute(`${this.options.youtubePlaceAttribute}`, "");
              }
              this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).appendChild(iframe);
            }
            if (this.options.hashSettings.location) {
              this._getHash();
              this._setHash();
            }
            this.options.on.beforeOpen(this);
            document.dispatchEvent(new CustomEvent("beforePopupOpen", {
              detail: {
                popup: this
              }
            }));
            this.targetOpen.element.setAttribute(this.options.classes.popupActive, "");
            document.documentElement.setAttribute(this.options.classes.bodyActive, "");
            if (!this._reopen) {
              !this.bodyLock ? bodyLock() : null;
            } else this._reopen = false;
            this.targetOpen.element.setAttribute("aria-hidden", "false");
            this.previousOpen.selector = this.targetOpen.selector;
            this.previousOpen.element = this.targetOpen.element;
            this._selectorOpen = false;
            this.isOpen = true;
            setTimeout(() => {
              this._focusTrap();
            }, 50);
            this.options.on.afterOpen(this);
            document.dispatchEvent(new CustomEvent("afterPopupOpen", {
              detail: {
                popup: this
              }
            }));
          }
        }
      }
      close(selectorValue) {
        if (selectorValue && typeof selectorValue === "string" && selectorValue.trim() !== "") {
          this.previousOpen.selector = selectorValue;
        }
        if (!this.isOpen || !bodyLockStatus) {
          return;
        }
        this.options.on.beforeClose(this);
        document.dispatchEvent(new CustomEvent("beforePopupClose", {
          detail: {
            popup: this
          }
        }));
        if (this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`)) {
          setTimeout(() => {
            this.targetOpen.element.querySelector(`[${this.options.youtubePlaceAttribute}]`).innerHTML = "";
          }, 500);
        }
        this.previousOpen.element.removeAttribute(this.options.classes.popupActive);
        this.previousOpen.element.setAttribute("aria-hidden", "true");
        if (!this._reopen) {
          document.documentElement.removeAttribute(this.options.classes.bodyActive);
          !this.bodyLock ? bodyUnlock() : null;
          this.isOpen = false;
        }
        this._removeHash();
        if (this._selectorOpen) {
          this.lastClosed.selector = this.previousOpen.selector;
          this.lastClosed.element = this.previousOpen.element;
        }
        this.options.on.afterClose(this);
        document.dispatchEvent(new CustomEvent("afterPopupClose", {
          detail: {
            popup: this
          }
        }));
        setTimeout(() => {
          this._focusTrap();
        }, 50);
      }
      // Отримання хешу 
      _getHash() {
        if (this.options.hashSettings.location) {
          this.hash = `#${this.targetOpen.selector}`;
        }
      }
      _openToHash() {
        let classInHash = window.location.hash.replace("#", "");
        const openButton = document.querySelector(`[${this.options.attributeOpenButton}="${classInHash}"]`);
        if (openButton) {
          this.youTubeCode = openButton.getAttribute(this.options.youtubeAttribute) ? openButton.getAttribute(this.options.youtubeAttribute) : null;
        }
        if (classInHash) this.open(classInHash);
      }
      // Встановлення хеша
      _setHash() {
        history.pushState("", "", this.hash);
      }
      _removeHash() {
        history.pushState("", "", window.location.href.split("#")[0]);
      }
      _focusCatch(e) {
        const focusable = this.targetOpen.element.querySelectorAll(this._focusEl);
        const focusArray = Array.prototype.slice.call(focusable);
        const focusedIndex = focusArray.indexOf(document.activeElement);
        if (e.shiftKey && focusedIndex === 0) {
          focusArray[focusArray.length - 1].focus();
          e.preventDefault();
        }
        if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
          focusArray[0].focus();
          e.preventDefault();
        }
      }
      _focusTrap() {
        const focusable = this.previousOpen.element.querySelectorAll(this._focusEl);
        if (!this.isOpen && this.lastFocusEl) {
          this.lastFocusEl.focus();
        } else {
          focusable[0].focus();
        }
      }
    }
    document.querySelector("[data-popup]") ? window.addEventListener("load", () => window.flsPopup = new Popup({})) : null;
    function preloader() {
      const preloaderImages = document.querySelectorAll("img");
      const htmlDocument = document.documentElement;
      const isPreloaded = localStorage.getItem(location.href) && document.querySelector('[data-preloader="true"]');
      if (preloaderImages.length && !isPreloaded) {
        let setValueProgress2 = function(progress2) {
          showPecentLoad ? showPecentLoad.innerText = `${progress2}%` : null;
          showLineLoad ? showLineLoad.style.width = `${progress2}%` : null;
        }, imageLoaded2 = function() {
          imagesLoadedCount++;
          progress = Math.round(100 / preloaderImages.length * imagesLoadedCount);
          const intervalId = setInterval(() => {
            counter >= progress ? clearInterval(intervalId) : setValueProgress2(++counter);
            counter >= 100 ? addLoadedClass() : null;
          }, 10);
        };
        var setValueProgress = setValueProgress2, imageLoaded = imageLoaded2;
        const preloaderTemplate = `
					<div class="preloader">
						<div class="preloader__body">
							<div class="preloader__logo">
                <svg width="332" height="82" viewBox="0 0 332 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_57_11049)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.3702 0.0488208L20.3722 0.096665L21.7714 5.11553L23.1706 10.1346L22.535 15.5456L21.8993 20.9568L21.2779 22.1498L20.6567 23.3427L19.9323 23.633L19.2079 23.9231L18.9716 23.9174L18.7352 23.9114L17.0839 20.9989L15.4324 18.0861L14.879 11.4358L14.3254 4.7854H14.2059H14.0866L11.511 12.2013L8.93565 19.6171L8.83957 24.6697L8.7435 29.722L7.60771 27.636L6.47211 25.5498L5.50752 23.8354L4.54274 22.1213L4.3994 22.5915L4.25606 23.0619L2.96616 27.942L1.67627 32.8221L0.838501 35.4673L0.000732422 38.1127V39.5173V40.922L0.288571 42.422L0.57641 43.922L1.27967 46.167L1.98294 48.4123L1.42417 49.7075L0.865402 51.0029V51.1333V51.2634L9.31995 58.8327L17.7745 66.4019L24.7084 66.4053L31.6423 66.4088L39.696 59.2157L47.7497 52.0226L48.2212 51.565L48.693 51.1074L48.0696 49.8112L47.4463 48.515L48.5139 43.7698L49.5814 39.0245L47.6492 30.8519L45.717 22.6791L45.6165 22.3934L45.5162 22.1075L45.1918 22.5174L44.8675 22.9274L42.4821 26.0093L40.0968 29.0912L40.0474 29.042L39.998 28.9929L40.4932 27.5585L40.9882 26.1239L39.3188 18.5743L37.6494 11.0245L37.6075 10.9833L37.5658 10.9422L29.0409 5.47149L20.5163 0.000976562H20.4423H20.3685L20.3702 0.0488208ZM19.5227 33.8747L24.4088 35.7885H24.7309H25.0531L29.9469 33.8669L34.8408 31.9452L34.9904 32.0966L35.1399 32.248L36.6612 35.7885L38.1824 39.3289L38.3102 39.731L38.4382 40.1329L35.5041 41.2465L32.5699 42.3602L32.4393 42.4712L32.3086 42.5824L35.1774 46.4063L38.0462 50.23L38.0452 50.4252L38.0443 50.6202L37.6129 51.1568L37.1815 51.6934L30.9717 53.4838L24.7616 55.2743L18.59 53.4736L12.4183 51.6728H12.3811H12.3438L11.8348 51.0079L11.3256 50.3431L14.2124 46.4709L17.0995 42.599L16.9565 42.4691L16.8137 42.3393L13.9363 41.2536L11.0591 40.1679L11.0105 40.1195L10.9619 40.0711L12.5117 36.4466L14.0616 32.8221L14.232 32.3915L14.4023 31.9609H14.5195H14.6367L19.5227 33.8747ZM15.1805 37.8814L18.779 39.0358L22.5782 40.2858L23.0743 39.1079L19.5321 37.5438L15.99 35.9798H15.8916H15.7931L15.1805 37.8814ZM29.8145 37.5088L26.1842 39.1079L26.6133 40.2858L30.4021 39.1242L34.1071 37.8999L33.6364 35.9798L33.4875 35.9925L33.3385 36.0051L29.8145 37.5088ZM20.8929 43.8129L20.7958 44.1821L21.4468 45.1449L22.0978 46.1077V46.4949V46.8818L23.0661 47.3706L24.0345 47.8594L23.9788 46.1923L23.9233 44.5252L22.597 43.9844L21.2708 43.4436H21.1304H20.9897L20.8929 43.8129ZM26.7094 44.023L25.4604 44.5643L25.4051 46.1971L25.3496 47.8301L26.3658 47.3848L27.3819 46.9394L27.4461 46.4001L27.5103 45.8608L28.1432 45.0829L28.7762 44.3047L28.5781 43.8741L28.3799 43.4436L28.1692 43.4629L27.9584 43.482L26.7094 44.023ZM19.8368 56.1697L24.7816 57.6738L30.1848 56.0966L35.5882 54.5195L35.6447 54.5792L35.7012 54.6391L33.6552 56.9683L31.6092 59.2976L24.7633 59.3127L17.9176 59.3278L16.298 57.1748L14.6786 55.0219L14.5137 54.7501L14.3489 54.4783L14.6206 54.5719L14.8923 54.6657L19.8368 56.1697Z" fill="#CCFF00"></path>
      </g>
      <path d="M91.0267 49.9154L90.328 49.9154C76.0051 49.9154 71.5073 40.964 71.5073 33.6718L71.5073 32.4929C71.5073 25.5938 75.6994 16.5114 90.5027 16.5114L91.9874 16.5114C106.136 16.5114 110.633 22.6682 110.633 28.039L110.633 28.1264L101.332 28.1263C100.983 27.2967 99.7165 23.8471 91.2887 23.8471C83.2975 23.8471 80.8522 28.3447 80.8522 32.7112L80.8522 33.2789C80.8522 37.5144 83.5595 42.5796 91.5943 42.5796C99.2798 42.5796 100.983 38.475 101.114 37.5144L92.293 37.5144L92.293 31.7069L111.026 31.7069L111.026 49.4351L103.865 49.4351C103.734 48.2561 103.254 45.9855 102.773 44.9375C102.075 45.8545 98.6685 49.9154 91.0267 49.9154Z" fill="#CCFF00"></path>
      <path d="M136.366 16.3776L138.287 16.3776C153.484 16.3776 157.807 25.2853 157.807 32.4028L157.807 33.7127C157.807 40.6992 153.484 49.9126 138.287 49.9126L136.366 49.9126C121.17 49.9126 116.847 40.6992 116.847 33.7127L116.847 32.4028C116.847 25.329 121.17 16.3776 136.366 16.3776ZM148.462 33.3634L148.462 32.7521C148.462 28.7349 146.497 23.8007 137.327 23.8007C128.244 23.8007 126.192 28.7349 126.192 32.7521L126.192 33.3634C126.192 37.2933 128.375 42.4458 137.327 42.4458C146.453 42.4458 148.462 37.2933 148.462 33.3634Z" fill="#CCFF00"></path>
      <path d="M172.716 24.5832L172.716 31.4824L185.248 31.4824C188.916 31.4824 189.921 29.9104 189.921 28.0328L189.921 27.9455C189.921 26.0679 188.916 24.5832 185.248 24.5832L172.716 24.5832ZM192.497 34.277C196.907 35.2813 199.571 37.9449 199.571 42.7044L199.571 46.0666C199.571 48.5119 199.79 49.1669 200.095 49.6909L200.095 49.9092L190.794 49.9092C190.663 49.6909 190.488 49.0795 190.488 47.6386L190.488 44.975C190.488 40.7831 188.96 38.8618 184.419 38.8618L172.716 38.8618L172.716 49.9092L163.72 49.9092L163.72 17.4221L185.598 17.4221C197.955 17.4221 199.353 22.5746 199.353 26.1115L199.353 26.5482C199.353 30.6091 196.558 33.36 192.497 34.277Z" fill="#CCFF00"></path>
      <path d="M215.005 17.4221L215.005 49.9092L206.009 49.9092L206.009 17.4221L215.005 17.4221Z" fill="#CCFF00"></path>
      <path d="M220.917 17.4221L229.913 17.4221L229.913 42.2677L249.782 42.2677L249.782 49.9092L220.917 49.9092L220.917 17.4221Z" fill="#CCFF00"></path>
      <path d="M255.694 17.4221L264.69 17.4221L264.69 42.2677L284.559 42.2677L284.559 49.9092L255.694 49.9092L255.694 17.4221Z" fill="#CCFF00"></path>
      <path d="M316.672 37.2025L310.777 23.9719L305.057 37.2025L316.672 37.2025ZM322.349 49.9092L319.685 43.8834L302.131 43.8834L299.511 49.9092L290.472 49.9092L304.882 17.4221L316.934 17.4221L332 49.9092L322.349 49.9092Z" fill="#CCFF00"></path>
      <path d="M73.814 69.7279H78.4577C79.015 69.7279 79.5155 69.764 79.9592 69.8362C80.4029 69.9085 80.7796 70.0426 81.0892 70.2387C81.3988 70.4244 81.6361 70.6876 81.8012 71.0281C81.9663 71.3583 82.0489 71.7865 82.0489 72.3128C82.0489 72.6224 82.0025 72.9268 81.9096 73.226C81.8167 73.515 81.6774 73.7781 81.4916 74.0154C81.3162 74.2424 81.0995 74.4333 80.8415 74.5881C80.5939 74.7429 80.3049 74.8409 79.9747 74.8822V74.9132C80.501 75.0576 80.9034 75.3363 81.1821 75.749C81.471 76.1515 81.6155 76.621 81.6155 77.1576C81.6155 77.7561 81.4968 78.2823 81.2595 78.7364C81.0324 79.1904 80.7228 79.567 80.3307 79.8663C79.9386 80.1655 79.4897 80.3926 78.984 80.5473C78.4784 80.7021 77.9469 80.7795 77.3897 80.7795H71.5076L73.814 69.7279ZM77.2813 78.8911C77.8386 78.8911 78.2926 78.7415 78.6435 78.4423C79.0047 78.143 79.1852 77.6993 79.1852 77.1111C79.1852 76.8222 79.1233 76.5952 78.9995 76.4301C78.886 76.265 78.7364 76.1411 78.5506 76.0586C78.3649 75.9657 78.1585 75.909 77.9314 75.8883C77.7044 75.8677 77.4825 75.8574 77.2658 75.8574H74.882L74.2319 78.8911H77.2813ZM77.9779 74.2012C78.4216 74.2012 78.8034 74.0825 79.1233 73.8452C79.4536 73.5975 79.6187 73.2312 79.6187 72.7462C79.6187 72.3128 79.5 72.0187 79.2626 71.8639C79.0356 71.6988 78.726 71.6163 78.3339 71.6163H75.7643L75.2226 74.2012H77.9779Z" fill="white"></path>
      <path d="M85.7744 69.7279H88.1737L86.5484 77.3897L92.3686 69.7279H95.1703L92.8329 80.7795H90.4337L92.059 73.1022L86.2388 80.7795H83.4525L85.7744 69.7279Z" fill="white"></path>
      <path d="M98.0822 69.7279H107.277L104.939 80.7795H102.509L104.413 71.7711H100.079L98.1751 80.7795H95.7603L98.0822 69.7279Z" fill="white"></path>
      <path d="M109.683 80.9653C109.445 80.9653 109.177 80.9446 108.878 80.9033C108.578 80.8724 108.357 80.8311 108.212 80.7795L108.646 78.8292C108.78 78.8602 108.924 78.886 109.079 78.9066C109.244 78.9273 109.44 78.9376 109.667 78.9376C110.07 78.9376 110.42 78.8189 110.72 78.5816C111.019 78.3442 111.169 78.0295 111.169 77.6374C111.169 77.4516 111.143 77.2711 111.091 77.0956C111.04 76.9202 110.988 76.7448 110.936 76.5694L108.924 69.7279H111.525L112.98 75.6097L116.323 69.7279H119.109L113.8 78.1482C113.46 78.6848 113.135 79.1336 112.825 79.4948C112.526 79.856 112.216 80.1449 111.896 80.3616C111.576 80.5783 111.236 80.7331 110.875 80.826C110.524 80.9188 110.126 80.9653 109.683 80.9653Z" fill="white"></path>
      <path d="M123.891 81.0272C122.313 81.0272 121.1 80.6144 120.254 79.7889C119.408 78.9531 118.985 77.7406 118.985 76.1515C118.985 75.2537 119.124 74.4024 119.402 73.5975C119.681 72.7926 120.078 72.0858 120.594 71.477C121.121 70.8578 121.755 70.3677 122.498 70.0065C123.252 69.6453 124.093 69.4648 125.021 69.4648C125.661 69.4648 126.255 69.5525 126.802 69.7279C127.348 69.9033 127.818 70.1665 128.21 70.5173C128.613 70.8578 128.922 71.2861 129.139 71.802C129.356 72.3076 129.459 72.8958 129.448 73.5666H127.018C127.018 72.8855 126.833 72.3747 126.461 72.0342C126.1 71.6833 125.625 71.5079 125.037 71.5079C124.418 71.5079 123.876 71.6524 123.412 71.9413C122.958 72.2199 122.581 72.5862 122.282 73.0403C121.993 73.484 121.776 73.9845 121.631 74.5417C121.487 75.0886 121.415 75.6252 121.415 76.1515C121.415 76.5333 121.461 76.8944 121.554 77.2349C121.657 77.5755 121.807 77.8799 122.003 78.1482C122.209 78.4062 122.467 78.6125 122.777 78.7673C123.097 78.9221 123.479 78.9995 123.922 78.9995C124.253 78.9995 124.562 78.9427 124.851 78.8292C125.15 78.7054 125.414 78.5455 125.641 78.3494C125.868 78.143 126.059 77.9057 126.213 77.6374C126.368 77.3691 126.471 77.0905 126.523 76.8016H128.953C128.705 77.5755 128.411 78.2307 128.071 78.7673C127.741 79.3039 127.364 79.7425 126.941 80.083C126.528 80.4132 126.064 80.6505 125.548 80.795C125.042 80.9498 124.49 81.0272 123.891 81.0272Z" fill="white"></path>
      <path d="M132.904 69.7279H135.334L134.374 74.356H134.405L139.42 69.7279H142.64L137.331 74.2786L140.721 80.7795H137.981L135.458 75.8109L133.77 77.2814L133.043 80.7795H130.613L132.904 69.7279Z" fill="white"></path>
      <path d="M147.944 69.7279H150.437L152.279 80.7795H149.864L149.508 78.3184H145.375L143.982 80.7795H141.428L147.944 69.7279ZM149.291 76.5075L148.749 72.1116H148.718L146.335 76.5075H149.291Z" fill="white"></path>
      <path d="M153.928 80.7795L156.25 69.7279H158.649L157.024 77.3897L162.844 69.7279H165.646L163.309 80.7795H160.909L162.535 73.1022L156.714 80.7795H153.928ZM160.971 68.7837C160.321 68.7837 159.785 68.6392 159.361 68.3503C158.949 68.0511 158.742 67.597 158.742 66.9882C158.742 66.7921 158.763 66.5961 158.804 66.4H159.671C159.661 66.7612 159.785 67.0346 160.043 67.2204C160.311 67.4061 160.662 67.499 161.095 67.499C161.529 67.499 161.915 67.4061 162.256 67.2204C162.597 67.0346 162.839 66.7612 162.984 66.4H163.85C163.675 67.2049 163.34 67.8034 162.844 68.1955C162.349 68.5876 161.725 68.7837 160.971 68.7837Z" fill="white"></path>
      <path d="M173.64 69.7279H181.318L180.884 71.7711H175.637L173.733 80.7795H171.318L173.64 69.7279Z" fill="white"></path>
      <path d="M186.507 81.0272C184.928 81.0272 183.715 80.6144 182.869 79.7889C182.023 78.9531 181.6 77.7406 181.6 76.1515C181.6 75.2537 181.739 74.4024 182.018 73.5975C182.296 72.7926 182.694 72.0858 183.21 71.477C183.736 70.8578 184.37 70.3677 185.113 70.0065C185.867 69.6453 186.708 69.4648 187.637 69.4648C188.38 69.4648 189.056 69.5679 189.664 69.7743C190.273 69.9704 190.789 70.2696 191.212 70.6721C191.635 71.0745 191.96 71.5698 192.187 72.158C192.425 72.7462 192.543 73.4272 192.543 74.2012C192.543 75.1092 192.409 75.976 192.141 76.8016C191.873 77.6271 191.481 78.3546 190.965 78.984C190.459 79.6135 189.829 80.1139 189.076 80.4854C188.333 80.8466 187.477 81.0272 186.507 81.0272ZM186.538 78.9995C187.136 78.9995 187.657 78.8602 188.101 78.5816C188.545 78.2926 188.916 77.9263 189.215 77.4826C189.515 77.0286 189.737 76.5281 189.881 75.9812C190.036 75.4343 190.113 74.8977 190.113 74.3714C190.113 73.9793 190.067 73.613 189.974 73.2725C189.891 72.9216 189.752 72.6172 189.556 72.3592C189.36 72.1013 189.107 71.8949 188.798 71.7401C188.488 71.5853 188.106 71.5079 187.652 71.5079C187.033 71.5079 186.491 71.6524 186.027 71.9413C185.573 72.2199 185.196 72.5862 184.897 73.0403C184.608 73.484 184.391 73.9845 184.247 74.5417C184.102 75.0886 184.03 75.6252 184.03 76.1515C184.03 76.5333 184.076 76.8944 184.169 77.2349C184.272 77.5755 184.422 77.8799 184.618 78.1482C184.825 78.4062 185.083 78.6125 185.392 78.7673C185.712 78.9221 186.094 78.9995 186.538 78.9995Z" fill="white"></path>
      <path d="M196.093 69.7279H200.52C201.077 69.7279 201.588 69.7846 202.053 69.8982C202.527 70.0013 202.935 70.1768 203.276 70.4244C203.616 70.6721 203.879 71.0023 204.065 71.415C204.261 71.8278 204.359 72.3386 204.359 72.9474C204.359 73.5562 204.24 74.1031 204.003 74.5881C203.776 75.0628 203.461 75.4652 203.059 75.7955C202.667 76.1257 202.213 76.3785 201.697 76.5539C201.181 76.7293 200.634 76.817 200.056 76.817H197.053L196.217 80.7795H193.802L196.093 69.7279ZM199.932 74.9287C200.551 74.9287 201.036 74.7739 201.387 74.4643C201.748 74.1444 201.929 73.6543 201.929 72.9938C201.929 72.7152 201.877 72.4882 201.774 72.3128C201.681 72.1271 201.552 71.9877 201.387 71.8949C201.222 71.7917 201.036 71.7195 200.83 71.6782C200.634 71.6369 200.427 71.6163 200.211 71.6163H198.136L197.455 74.9287H199.932Z" fill="white"></path>
      <path d="M207.223 69.7279H209.622L207.997 77.3897L213.817 69.7279H216.618L214.281 80.7795H211.882L213.507 73.1022L207.687 80.7795H204.901L207.223 69.7279Z" fill="white"></path>
      <path d="M217.626 80.9033C217.523 80.9033 217.399 80.8982 217.255 80.8879C217.11 80.8775 216.966 80.8621 216.822 80.8414C216.667 80.8311 216.522 80.8156 216.388 80.795C216.254 80.7744 216.151 80.7486 216.079 80.7176L216.481 78.8602C216.522 78.8705 216.584 78.886 216.667 78.9066C216.749 78.9169 216.837 78.9273 216.93 78.9376C217.023 78.9376 217.11 78.9427 217.193 78.9531C217.276 78.9531 217.337 78.9531 217.379 78.9531C217.461 78.9531 217.559 78.9427 217.673 78.9221C217.797 78.9015 217.926 78.855 218.06 78.7828C218.204 78.7002 218.344 78.5816 218.478 78.4268C218.622 78.272 218.751 78.0605 218.865 77.7922C219.009 77.4826 219.149 77.0956 219.283 76.6313C219.427 76.1566 219.582 75.5891 219.747 74.9287C219.912 74.2682 220.088 73.5098 220.273 72.6533C220.469 71.7968 220.681 70.8217 220.908 69.7279H228.864L226.511 80.7795H224.097L226.016 71.7711H222.781C222.554 72.7514 222.353 73.613 222.177 74.356C222.012 75.0886 221.857 75.7284 221.713 76.2753C221.568 76.8222 221.429 77.2917 221.295 77.6838C221.171 78.0759 221.037 78.4216 220.893 78.7209C220.748 79.0098 220.588 79.2678 220.413 79.4948C220.248 79.7115 220.057 79.923 219.84 80.1294C219.52 80.4287 219.174 80.6351 218.803 80.7486C218.431 80.8517 218.039 80.9033 217.626 80.9033Z" fill="white"></path>
      <path d="M231.297 80.9653C231.06 80.9653 230.791 80.9446 230.492 80.9033C230.193 80.8724 229.971 80.8311 229.827 80.7795L230.26 78.8292C230.394 78.8602 230.539 78.886 230.693 78.9066C230.859 78.9273 231.055 78.9376 231.282 78.9376C231.684 78.9376 232.035 78.8189 232.334 78.5816C232.633 78.3442 232.783 78.0295 232.783 77.6374C232.783 77.4516 232.757 77.2711 232.706 77.0956C232.654 76.9202 232.603 76.7448 232.551 76.5694L230.539 69.7279H233.139L234.594 75.6097L237.938 69.7279H240.724L235.415 78.1482C235.074 78.6848 234.749 79.1336 234.439 79.4948C234.14 79.856 233.831 80.1449 233.511 80.3616C233.191 80.5783 232.85 80.7331 232.489 80.826C232.138 80.9188 231.741 80.9653 231.297 80.9653Z" fill="white"></path>
      <defs>
        <clipPath id="clip0_57_11049">
          <rect width="49.5807" height="66.4078" fill="white"></rect>
        </clipPath>
      </defs>
    </svg>  
              </div>
						</div>
					</div>`;
        document.body.insertAdjacentHTML("beforeend", preloaderTemplate);
        document.querySelector(".preloader");
        const showPecentLoad = document.querySelector(".preloader__counter"), showLineLoad = document.querySelector(".preloader__line span");
        let imagesLoadedCount = 0;
        let counter = 0;
        let progress = 0;
        htmlDocument.setAttribute("data-preloader-loading", "");
        htmlDocument.setAttribute("data-scrolllock", "");
        preloaderImages.forEach((preloaderImage) => {
          const imgClone = document.createElement("img");
          if (imgClone) {
            imgClone.onload = imageLoaded2;
            imgClone.onerror = imageLoaded2;
            preloaderImage.dataset.src ? imgClone.src = preloaderImage.dataset.src : imgClone.src = preloaderImage.src;
          }
        });
        setValueProgress2(progress);
        const preloaderOnce = () => localStorage.setItem(location.href, "preloaded");
        document.querySelector('[data-preloader="true"]') ? preloaderOnce() : null;
      } else {
        addLoadedClass();
      }
      function addLoadedClass() {
        htmlDocument.setAttribute("data-preloader-loaded", "");
        htmlDocument.removeAttribute("data-preloader-loading");
        htmlDocument.removeAttribute("data-scrolllock");
      }
    }
    document.addEventListener("DOMContentLoaded", preloader);
    (() => {
      const slideUp = (target, duration = 500, showmore = 0) => {
        if (target.classList.contains("_slide")) return;
        target.classList.add("_slide");
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = `${target.offsetHeight}px`;
        target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        setTimeout(() => {
          target.hidden = !showmore;
          if (!showmore) target.style.removeProperty("height");
          target.style.removeProperty("padding-top");
          target.style.removeProperty("padding-bottom");
          target.style.removeProperty("margin-top");
          target.style.removeProperty("margin-bottom");
          if (!showmore) target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          target.classList.remove("_slide");
          document.dispatchEvent(new CustomEvent("slideUpDone", { detail: { target } }));
        }, duration);
      };
      const slideDown = (target, duration = 500, showmore = 0) => {
        if (target.classList.contains("_slide")) return;
        target.classList.add("_slide");
        target.hidden = false;
        if (showmore) target.style.removeProperty("height");
        const height = target.offsetHeight;
        target.style.overflow = "hidden";
        target.style.height = showmore ? `${showmore}px` : `0px`;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + "ms";
        target.style.height = height + "px";
        target.style.removeProperty("padding-top");
        target.style.removeProperty("padding-bottom");
        target.style.removeProperty("margin-top");
        target.style.removeProperty("margin-bottom");
        setTimeout(() => {
          target.style.removeProperty("height");
          target.style.removeProperty("overflow");
          target.style.removeProperty("transition-duration");
          target.style.removeProperty("transition-property");
          target.classList.remove("_slide");
          document.dispatchEvent(new CustomEvent("slideDownDone", { detail: { target } }));
        }, duration);
      };
      const slideToggle = (target, duration = 500) => {
        return target.hidden ? slideDown(target, duration) : slideUp(target, duration);
      };
      function initFormFields(options = { viewPass: false, autoHeight: false }) {
        const formFields = document.querySelectorAll("input[data-required],textarea[data-required]");
        formFields.forEach((field) => {
          field.dataset.inputInitialized = "true";
          if (options.viewPass && field.type === "password") {
            initPasswordToggle(field);
          }
          if (options.autoHeight && field.tagName === "TEXTAREA") {
            initAutoHeightTextarea(field);
          }
          ["focus", "blur", "input"].forEach((eventType) => {
            field.addEventListener(eventType, updateFieldState);
          });
        });
        initCountrySelects();
        const passwordFields = document.querySelectorAll('input[type="password"]');
        passwordFields.forEach(initPasswordToggle);
      }
      function initPasswordToggle(passwordField) {
        const container = passwordField.closest(".form-field__input-container");
        if (!container) return;
        const toggleButton = container.querySelector(".form-field__toggle-password");
        if (!toggleButton) return;
        toggleButton.removeEventListener("click", toggleButton._clickHandler);
        toggleButton._clickHandler = function(e) {
          e.preventDefault();
          passwordField.type = passwordField.type === "password" ? "text" : "password";
          toggleButton.classList.toggle("show-password", passwordField.type === "text");
          passwordField.focus();
        };
        toggleButton.addEventListener("click", toggleButton._clickHandler);
      }
      function initAutoHeightTextarea(textarea) {
        const adjustHeight = () => {
          textarea.style.height = "auto";
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        adjustHeight();
        textarea.addEventListener("input", adjustHeight);
      }
      function updateFieldState(e) {
        const field = e.target;
        const container = field.closest(".form-field");
        if (!container) return;
        container.classList.toggle("filled", field.value.length > 0);
        if (e.type === "focus") {
          container.classList.add("focused");
        } else if (e.type === "blur") {
          container.classList.remove("focused");
        }
      }
      function initCountrySelects() {
        const countrySelects = document.querySelectorAll('select[name="countryCode"]');
        countrySelects.forEach((select) => {
          if (select.dataset.initialized === "true") return;
          const options = select.querySelectorAll("option");
          options.forEach((option) => {
            if (option.dataset.asset) {
              option.setAttribute("title", option.textContent || option.value);
              option.textContent = "";
            }
          });
          select.addEventListener("change", function() {
            const selectedOption = this.options[this.selectedIndex];
            const container = this.closest(".form-field");
            if (container && selectedOption.dataset.asset) {
              const flagElement = container.querySelector(".selected-country-flag");
              if (flagElement) {
                flagElement.style.backgroundImage = `url(${selectedOption.dataset.asset.replace("/assets/img", "img")})`;
              }
            }
          });
          select.dataset.initialized = "true";
        });
      }
      class CustomSelect {
        constructor(props = {}) {
          this.config = Object.assign({
            init: true,
            logging: false,
            speed: 150
          }, props);
          this.classes = {
            select: "select",
            body: "select__body",
            title: "select__title",
            value: "select__value",
            label: "select__label",
            input: "select__input",
            text: "select__text",
            options: "select__options",
            option: "select__option",
            content: "select__content",
            row: "select__row",
            data: "select__asset",
            disabled: "_select-disabled",
            tag: "_select-tag",
            open: "_select-open",
            active: "_select-active",
            focus: "_select-focus",
            multiple: "_select-multiple",
            checkbox: "_select-checkbox",
            selected: "_select-selected",
            pseudoLabel: "_select-pseudo-label"
          };
          if (this.config.init) {
            const selects = document.querySelectorAll("select");
            if (selects.length) {
              this.initSelects(selects);
            }
          }
        }
        initSelects(selects) {
          selects.forEach((select, index) => {
            this.initSelect(select, index + 1);
          });
          document.addEventListener("click", (e) => this.handleActions(e));
          document.addEventListener("keydown", (e) => this.handleActions(e));
          document.addEventListener("focusin", (e) => this.handleActions(e));
          document.addEventListener("focusout", (e) => this.handleActions(e));
        }
        initSelect(originalSelect, index) {
          const selectItem = document.createElement("div");
          selectItem.classList.add(this.classes.select);
          originalSelect.parentNode.insertBefore(selectItem, originalSelect);
          selectItem.appendChild(originalSelect);
          originalSelect.hidden = true;
          originalSelect.dataset.id = index;
          if (this.getPlaceholder(originalSelect)) {
            originalSelect.dataset.placeholder = this.getPlaceholder(originalSelect).value;
            if (this.getPlaceholder(originalSelect).label.show) {
              const selectTitle = selectItem.querySelector(`.${this.classes.title}`);
              if (selectTitle) {
                selectTitle.insertAdjacentHTML(
                  "afterbegin",
                  `<span class="${this.classes.label}">${this.getPlaceholder(originalSelect).label.text || this.getPlaceholder(originalSelect).value}</span>`
                );
              }
            }
          }
          selectItem.insertAdjacentHTML(
            "beforeend",
            `<div class="${this.classes.body}"><div hidden class="${this.classes.options}"></div></div>`
          );
          this.buildSelect(originalSelect);
          originalSelect.dataset.speed = originalSelect.dataset.speed || this.config.speed;
          this.config.speed = +originalSelect.dataset.speed;
          originalSelect.addEventListener("change", (e) => this.selectChange(e));
        }
        buildSelect(originalSelect) {
          const selectItem = originalSelect.parentElement;
          selectItem.dataset.id = originalSelect.dataset.id;
          if (originalSelect.dataset.classModif) {
            selectItem.classList.add(`select_${originalSelect.dataset.classModif}`);
          }
          if (originalSelect.multiple) {
            selectItem.classList.add(this.classes.multiple);
          }
          if (originalSelect.hasAttribute("data-checkbox") && originalSelect.multiple) {
            selectItem.classList.add(this.classes.checkbox);
          }
          this.setTitleValue(selectItem, originalSelect);
          this.setOptions(selectItem, originalSelect);
          if (originalSelect.hasAttribute("data-search")) {
            this.initSearch(selectItem);
          }
          if (originalSelect.hasAttribute("data-open")) {
            this.toggleSelect(selectItem);
          }
          this.setDisabled(selectItem, originalSelect);
        }
        handleActions(e) {
          const target = e.target;
          const selectItem = target.closest(`.${this.classes.select}`) || (target.closest(`.${this.classes.tag}`) ? document.querySelector(`.${this.classes.select}[data-id="${target.closest(`.${this.classes.tag}`).dataset.selectId}"]`) : null);
          if (!selectItem) {
            this.closeAllSelects();
            return;
          }
          const originalSelect = selectItem.querySelector("select");
          if (e.type === "click" && !originalSelect.disabled) {
            if (target.closest(`.${this.classes.tag}`)) {
              const tag = target.closest(`.${this.classes.tag}`);
              const option = selectItem.querySelector(`.${this.classes.option}[data-value="${tag.dataset.value}"]`);
              this.optionAction(selectItem, originalSelect, option);
            } else if (target.closest(`.${this.classes.title}`)) {
              this.toggleSelect(selectItem);
            } else if (target.closest(`.${this.classes.option}`)) {
              const option = target.closest(`.${this.classes.option}`);
              this.optionAction(selectItem, originalSelect, option);
            }
          } else if (e.type === "focusin" || e.type === "focusout") {
            if (target.closest(`.${this.classes.select}`)) {
              selectItem.classList.toggle(this.classes.focus, e.type === "focusin");
            }
          } else if (e.type === "keydown" && e.code === "Escape") {
            this.closeAllSelects();
          }
        }
        closeAllSelects(group) {
          const container = group || document;
          const openSelects = container.querySelectorAll(`.${this.classes.select}.${this.classes.open}`);
          openSelects.forEach((select) => this.closeSelect(select));
        }
        closeSelect(selectItem) {
          const originalSelect = selectItem.querySelector("select");
          const options = selectItem.querySelector(`.${this.classes.options}`);
          if (!options.classList.contains("_slide")) {
            selectItem.classList.remove(this.classes.open);
            slideUp(options, originalSelect.dataset.speed);
            setTimeout(() => {
              selectItem.style.zIndex = "";
            }, originalSelect.dataset.speed);
          }
        }
        toggleSelect(selectItem) {
          const originalSelect = selectItem.querySelector("select");
          const options = selectItem.querySelector(`.${this.classes.options}`);
          const zIndex = originalSelect.dataset.zIndex || 3;
          this.setOptionsPosition(selectItem);
          if (originalSelect.closest("[data-one-select]")) {
            const group = originalSelect.closest("[data-one-select]");
            this.closeAllSelects(group);
          }
          setTimeout(() => {
            if (!options.classList.contains("_slide")) {
              selectItem.classList.toggle(this.classes.open);
              slideToggle(options, originalSelect.dataset.speed);
              if (selectItem.classList.contains(this.classes.open)) {
                selectItem.style.zIndex = zIndex;
              } else {
                setTimeout(() => {
                  selectItem.style.zIndex = "";
                }, originalSelect.dataset.speed);
              }
            }
          }, 0);
        }
        setTitleValue(selectItem, originalSelect) {
          const body = selectItem.querySelector(`.${this.classes.body}`);
          const existingTitle = selectItem.querySelector(`.${this.classes.title}`);
          if (existingTitle) existingTitle.remove();
          body.insertAdjacentHTML("afterbegin", this.getTitleValue(selectItem, originalSelect));
          if (originalSelect.hasAttribute("data-search")) {
            this.initSearch(selectItem);
          }
        }
        getTitleValue(selectItem, originalSelect) {
          let titleValue = this.getSelectedOptionsData(originalSelect, 2).html;
          if (originalSelect.multiple && originalSelect.hasAttribute("data-tags")) {
            titleValue = this.getSelectedOptionsData(originalSelect).elements.map(
              (option) => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="${this.classes.tag}">
                          ${this.getElementContent(option)}
                      </span>`
            ).join("");
            if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
              document.querySelector(originalSelect.dataset.tags).innerHTML = titleValue;
              if (originalSelect.hasAttribute("data-search")) titleValue = false;
            }
          }
          titleValue = titleValue.length ? titleValue : originalSelect.dataset.placeholder || "";
          let pseudoAttribute = "";
          let pseudoClass = "";
          if (originalSelect.hasAttribute("data-pseudo-label")) {
            pseudoAttribute = originalSelect.dataset.pseudoLabel ? ` data-pseudo-label="${originalSelect.dataset.pseudoLabel}"` : ` data-pseudo-label="Заповніть атрибут"`;
            pseudoClass = ` ${this.classes.pseudoLabel}`;
          }
          selectItem.classList.toggle(
            this.classes.active,
            this.getSelectedOptionsData(originalSelect).values.length > 0
          );
          if (originalSelect.hasAttribute("data-search")) {
            return `<div class="${this.classes.title}">
                  <span${pseudoAttribute} class="${this.classes.value}">
                      <input autocomplete="off" type="text" placeholder="${titleValue}" 
                             data-placeholder="${titleValue}" class="${this.classes.input}">
                  </span>
              </div>`;
          } else {
            const customClass = this.getSelectedOptionsData(originalSelect).elements.length && this.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${this.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : "";
            return `<button type="button" class="${this.classes.title}">
                  <span${pseudoAttribute} class="${this.classes.value}${pseudoClass}">
                      <span class="${this.classes.content}${customClass}">${titleValue}</span>
                  </span>
              </button>`;
          }
        }
        getElementContent(option) {
          const assetData = option.dataset.asset || "";
          const assetHTML = assetData.includes("img") ? `<img src="${assetData}" alt="">` : assetData;
          const optionText = option.dataset.asset ? option.getAttribute("title") || option.textContent : option.textContent;
          let content = "";
          if (assetData) {
            content += `<span class="${this.classes.row}">`;
            content += `<span class="${this.classes.data}">${assetHTML}</span>`;
            content += `<span class="${this.classes.text}">${optionText}</span>`;
            content += `</span>`;
          } else {
            content = optionText;
          }
          return content;
        }
        getPlaceholder(originalSelect) {
          const placeholder = Array.from(originalSelect.options).find((option) => !option.value);
          if (placeholder) {
            return {
              value: placeholder.textContent,
              show: placeholder.hasAttribute("data-show"),
              label: {
                show: placeholder.hasAttribute("data-label"),
                text: placeholder.dataset.label
              }
            };
          }
        }
        getSelectedOptionsData(originalSelect) {
          let selected = [];
          if (originalSelect.multiple) {
            selected = Array.from(originalSelect.options).filter((option) => option.value && option.selected);
          } else {
            selected.push(originalSelect.options[originalSelect.selectedIndex]);
          }
          return {
            elements: selected,
            values: selected.filter((option) => option.value).map((option) => option.value),
            html: selected.map((option) => this.getElementContent(option))
          };
        }
        getOptions(originalSelect) {
          const scrollAttr = originalSelect.hasAttribute("data-scroll") ? "data-simplebar" : "";
          const maxHeight = +originalSelect.dataset.scroll || null;
          let options = Array.from(originalSelect.options);
          if (options.length > 0) {
            let html = "";
            if (this.getPlaceholder(originalSelect) && !this.getPlaceholder(originalSelect).show || originalSelect.multiple) {
              options = options.filter((option) => option.value);
            }
            html += `<div ${scrollAttr} ${scrollAttr ? `style="max-height: ${maxHeight}px"` : ""} class="select__scroll">`;
            options.forEach((option) => {
              html += this.getOption(option, originalSelect);
            });
            html += `</div>`;
            return html;
          }
        }
        getOption(option, originalSelect) {
          const selectedClass = option.selected && originalSelect.multiple ? ` ${this.classes.selected}` : "";
          const hideAttr = option.selected && !originalSelect.hasAttribute("data-show-selected") && !originalSelect.multiple ? "hidden" : "";
          const optionClass = option.dataset.class ? ` ${option.dataset.class}` : "";
          const link = option.dataset.href || false;
          const target = option.hasAttribute("data-href-blank") ? `target="_blank"` : "";
          let html = "";
          if (link) {
            html += `<a ${target} ${hideAttr} href="${link}" data-value="${option.value}" 
                         class="${this.classes.option}${optionClass}${selectedClass}">`;
          } else {
            html += `<button ${hideAttr} class="${this.classes.option}${optionClass}${selectedClass}" 
                         data-value="${option.value}" type="button">`;
          }
          html += this.getElementContent(option);
          html += link ? `</a>` : `</button>`;
          return html;
        }
        setOptions(selectItem, originalSelect) {
          const optionsContainer = selectItem.querySelector(`.${this.classes.options}`);
          optionsContainer.innerHTML = this.getOptions(originalSelect);
        }
        setOptionsPosition(selectItem) {
          const originalSelect = selectItem.querySelector("select");
          const options = selectItem.querySelector(`.${this.classes.options}`);
          const scroll = selectItem.querySelector(".select__scroll");
          const customMaxHeight = +originalSelect.dataset.scroll ? `${+originalSelect.dataset.scroll}px` : "";
          const margin = +originalSelect.dataset.optionsMargin || 10;
          if (!selectItem.classList.contains(this.classes.open)) {
            options.hidden = false;
            const scrollHeight = scroll.offsetHeight || parseInt(window.getComputedStyle(scroll).getPropertyValue("max-height"));
            const optionsHeight = options.offsetHeight > scrollHeight ? options.offsetHeight : scrollHeight + options.offsetHeight;
            options.hidden = true;
            const itemHeight = selectItem.offsetHeight;
            const itemPos = selectItem.getBoundingClientRect().top;
            const total = itemPos + optionsHeight + itemHeight;
            const result = window.innerHeight - (total + margin);
            if (result < 0) {
              const newMaxHeight = optionsHeight + result;
              if (newMaxHeight < 100) {
                selectItem.classList.add("select--show-top");
                scroll.style.maxHeight = itemPos < optionsHeight ? `${itemPos - (optionsHeight - itemPos)}px` : customMaxHeight;
              } else {
                selectItem.classList.remove("select--show-top");
                scroll.style.maxHeight = `${newMaxHeight}px`;
              }
            }
          } else {
            setTimeout(() => {
              selectItem.classList.remove("select--show-top");
              scroll.style.maxHeight = customMaxHeight;
            }, +originalSelect.dataset.speed);
          }
        }
        optionAction(selectItem, originalSelect, optionItem) {
          const options = selectItem.querySelector(`.${this.classes.options}`);
          if (options.classList.contains("_slide")) return;
          if (originalSelect.multiple) {
            optionItem.classList.toggle(this.classes.selected);
            const selectedItems = this.getSelectedOptionsData(originalSelect).elements;
            selectedItems.forEach((item) => item.removeAttribute("selected"));
            const newSelected = selectItem.querySelectorAll(`.${this.classes.selected}`);
            newSelected.forEach((item) => {
              originalSelect.querySelector(`option[value="${item.dataset.value}"]`).setAttribute("selected", "selected");
            });
          } else {
            if (!originalSelect.hasAttribute("data-show-selected")) {
              setTimeout(() => {
                const hidden = selectItem.querySelector(`.${this.classes.option}[hidden]`);
                if (hidden) hidden.hidden = false;
                optionItem.hidden = true;
              }, this.config.speed);
            }
            originalSelect.value = optionItem.hasAttribute("data-value") ? optionItem.dataset.value : optionItem.textContent;
            this.toggleSelect(selectItem);
          }
          this.setTitleValue(selectItem, originalSelect);
          this.triggerChange(originalSelect);
        }
        selectChange(e) {
          const originalSelect = e.target;
          this.buildSelect(originalSelect);
          this.triggerChange(originalSelect);
        }
        triggerChange(originalSelect) {
          originalSelect.parentElement;
          document.dispatchEvent(new CustomEvent("selectCallback", {
            detail: { select: originalSelect }
          }));
        }
        setDisabled(selectItem, originalSelect) {
          const title = selectItem.querySelector(`.${this.classes.title}`);
          if (originalSelect.disabled) {
            selectItem.classList.add(this.classes.disabled);
            if (title) title.disabled = true;
          } else {
            selectItem.classList.remove(this.classes.disabled);
            if (title) title.disabled = false;
          }
        }
        initSearch(selectItem) {
          const input = selectItem.querySelector(`.${this.classes.input}`);
          const options = selectItem.querySelector(`.${this.classes.options}`);
          const optionItems = options.querySelectorAll(`.${this.classes.option}`);
          input.addEventListener("input", () => {
            optionItems.forEach((item) => {
              item.hidden = !item.textContent.toUpperCase().includes(input.value.toUpperCase());
            });
            if (options.hidden) this.toggleSelect(selectItem);
          });
        }
      }
      const PHONE_MESSAGES = {
        uk: {
          phoneForbidden: "Номер телефону не обслуговується. Скористайся номером іншого оператора або звернись у підтримку.",
          phoneZero: "Схоже, ти ввів неправильний код оператора. Перевір правильність свого номера.",
          phoneRepeat: "Схоже, ти повторно ввів код країни. Перевір правильність введеного номера.",
          phoneError: "Введи правильний номер",
          emptyPhone: "Введіть номер телефону"
        },
        en: {
          phoneForbidden: "The phone number is not serviced. Use another operator's number or contact support.",
          phoneZero: "Seems you entered the wrong operator code. Check the correctness of your number.",
          phoneRepeat: "Seems you re-entered the country code. Check the correctness of the entered number.",
          phoneError: "Enter Correct Number",
          emptyPhone: "Enter phone number"
        },
        ru: {
          phoneForbidden: "Номер телефона не обслуживается. Воспользуйтесь номером другого оператора или обратитесь в поддержку.",
          phoneZero: "Похоже, вы ввели неправильный код оператора. Проверьте правильность своего номера.",
          phoneRepeat: "Похоже, вы повторно ввели код страны. Проверьте правильность введенного номера.",
          phoneError: "Введите правильный номер",
          emptyPhone: "Введите номер телефона"
        }
      };
      const COUNTRY_MASKS = {
        "380": "+380 (XX) XXX-XX-XX",
        // Ukraine
        "61": "+61 (XXX) XXX XXX",
        // Australia
        "43": "+43 (XXX) XX XX XX",
        // Austria
        "32": "+32 (XXX) XX XX XX",
        // Belgium
        "357": "+357 (XX) XXX XXX",
        // Cyprus
        "420": "+420 (XXX) XXX XXX",
        // Czech Republic
        "1": "+1 (XXX) XXX-XXXX",
        // USA
        "45": "+45 (XX) XX XX XX",
        // Denmark
        "33": "+33 (X) XX XX XX XX",
        // France
        "358": "+358 (XX) XXX XXXX",
        // Finland
        "49": "+49 (XXX) XXXXXXXX",
        // Germany
        "30": "+30 (XXX) XXX XXXX",
        // Greece
        "44": "+44 (XXXX) XXXXXX",
        // UK
        "386": "+386 (XX) XXX-XXX",
        // Slovenia
        "34": "+34 (XXX) XXX-XXX",
        // Spain
        "46": "+46 (XX) XXX-XXXX",
        // Sweden
        "41": "+41 (XX) XXX-XXXX",
        // Switzerland
        "48": "+48 (XXX) XXX-XXX"
        // Poland
      };
      const COUNTRIES_DATA = [
        { iso2: "AT", iso3: "AUT", id: 40, name: "Austria", phoneCode: "+43" },
        { iso2: "AU", iso3: "AUS", id: 36, name: "Australia", phoneCode: "+61" },
        { iso2: "BE", iso3: "BEL", id: 56, name: "Belgium", phoneCode: "+32" },
        { iso2: "CY", iso3: "CYP", id: 196, name: "Cyprus", phoneCode: "+357" },
        { iso2: "CZ", iso3: "CZE", id: 203, name: "Czech Republic", phoneCode: "+420" },
        { iso2: "US", iso3: "USA", id: 840, name: "United States", phoneCode: "+1" },
        { iso2: "DK", iso3: "DNK", id: 208, name: "Denmark", phoneCode: "+45" },
        { iso2: "FR", iso3: "FRA", id: 250, name: "France", phoneCode: "+33" },
        { iso2: "FI", iso3: "FIN", id: 246, name: "Finland", phoneCode: "+358" },
        { iso2: "DE", iso3: "DEU", id: 276, name: "Germany", phoneCode: "+49" },
        { iso2: "GE", iso3: "GEO", id: 268, name: "Georgia", phoneCode: "+995" },
        { iso2: "GR", iso3: "GRC", id: 300, name: "Greece", phoneCode: "+30" },
        { iso2: "GB", iso3: "GBR", id: 826, name: "United Kingdom", phoneCode: "+44" },
        { iso2: "IT", iso3: "ITA", id: 380, name: "Italy", phoneCode: "+39" },
        { iso2: "IE", iso3: "IRL", id: 372, name: "Ireland", phoneCode: "+353" },
        { iso2: "IS", iso3: "ISL", id: 352, name: "Iceland", phoneCode: "+354" },
        { iso2: "LV", iso3: "LVA", id: 428, name: "Latvia", phoneCode: "+371" },
        { iso2: "LU", iso3: "LUX", id: 442, name: "Luxembourg", phoneCode: "+352" },
        { iso2: "NO", iso3: "NOR", id: 578, name: "Norway", phoneCode: "+47" },
        { iso2: "NZ", iso3: "NZL", id: 554, name: "New Zealand", phoneCode: "+64" },
        { iso2: "NL", iso3: "NLD", id: 528, name: "Netherlands", phoneCode: "+31" },
        { iso2: "PT", iso3: "PRT", id: 620, name: "Portugal", phoneCode: "+351" },
        { iso2: "PL", iso3: "POL", id: 616, name: "Poland", phoneCode: "+48" },
        { iso2: "CH", iso3: "CHE", id: 756, name: "Switzerland", phoneCode: "+41" },
        { iso2: "SE", iso3: "SWE", id: 752, name: "Sweden", phoneCode: "+46" },
        { iso2: "ES", iso3: "ESP", id: 724, name: "Spain", phoneCode: "+34" },
        { iso2: "SI", iso3: "SVN", id: 705, name: "Slovenia", phoneCode: "+386" },
        { iso2: "UA", iso3: "UKR", id: 804, name: "Ukraine", phoneCode: "+380" }
      ];
      function getCurrentLanguage() {
        const lang = navigator.language.split("-")[0];
        return ["ru", "uk", "en"].includes(lang) ? lang : "uk";
      }
      function getErrorMessages() {
        return PHONE_MESSAGES[getCurrentLanguage()];
      }
      function createMaskFromPhoneCode(phoneCode) {
        const cleanCode = phoneCode.replace("+", "");
        return COUNTRY_MASKS[cleanCode] || `${phoneCode} (${"X".repeat(3)})-${"X".repeat(3)}-${"X".repeat(4)}`;
      }
      function fillSelectWithCountries(select) {
        const sortedCountries = [...COUNTRIES_DATA].sort((a, b) => a.name.localeCompare(b.name));
        select.innerHTML = sortedCountries.map((country, index) => {
          const mask = createMaskFromPhoneCode(country.phoneCode);
          return `<option 
              value="${country.iso2}" 
              data-mask="${mask}" 
              data-countrykey="${country.iso3}"
              data-phone-code="${country.phoneCode}"
              data-index="${index + 1}"
              data-asset="img/flags/${country.iso2.toLowerCase()}.svg">
              ${country.name} (${country.phoneCode})
          </option>`;
        }).join("");
        const savedCountry = localStorage.getItem("phoneCountry") || "UA";
        const option = select.querySelector(`option[value="${savedCountry}"]`);
        if (option) option.selected = true;
        select.setAttribute("data-country-select", "true");
      }
      function findPhoneInput(selectElement) {
        var _a;
        if (!selectElement) return null;
        const phoneInputId = selectElement.getAttribute("data-phone-input");
        if (phoneInputId) {
          const input = document.getElementById(phoneInputId);
          if (input) return input;
        }
        const fieldGroup = selectElement.closest(".form-field-group, .form__group, .input-group");
        if (fieldGroup) {
          const input = fieldGroup.querySelector('input[type="tel"], input[name="phone"], input.phone-input');
          if (input) return input;
        }
        const parent = selectElement.parentElement;
        if (parent) {
          const input = parent.querySelector('input[type="tel"], input[name="phone"], input.phone-input') || ((_a = parent.nextElementSibling) == null ? void 0 : _a.querySelector('input[type="tel"], input[name="phone"], input.phone-input'));
          if (input) return input;
        }
        const form = selectElement.closest("form");
        if (form) {
          return form.querySelector('input[type="tel"], input[name="phone"], input.phone-input');
        }
        return null;
      }
      function extractDigits(value, countryCode) {
        if (!value) return "";
        if (value.startsWith(countryCode)) {
          value = value.substring(countryCode.length);
        }
        return value.replace(/\D/g, "");
      }
      function formatPhoneNumber(digits, mask, countryCode) {
        let result = countryCode;
        let digitIndex = 0;
        const openBracketPos = mask.indexOf("(", countryCode.length);
        if (openBracketPos !== -1 && openBracketPos <= countryCode.length + 1) {
          result += " (";
          if (digits.length > 0) {
            const closeBracketPos = mask.indexOf(")", openBracketPos);
            if (closeBracketPos !== -1) {
              const digitsInBrackets = mask.substring(openBracketPos + 1, closeBracketPos).split("").filter((c) => c === "X").length;
              for (let i = 0; i < Math.min(digitsInBrackets, digits.length); i++) {
                result += digits[i];
                digitIndex++;
              }
              if (digitIndex >= digitsInBrackets) {
                result += ")";
                let i = closeBracketPos + 1;
                while (i < mask.length && digitIndex < digits.length) {
                  if (mask[i] === "X") {
                    result += digits[digitIndex];
                    digitIndex++;
                  } else if (digitIndex > 0) {
                    result += mask[i];
                  }
                  i++;
                }
              }
            }
          }
        } else {
          for (let i = countryCode.length; i < mask.length; i++) {
            if (mask[i] === "X") {
              if (digitIndex < digits.length) {
                result += digits[digitIndex];
                digitIndex++;
              } else break;
            } else {
              if (digitIndex > 0 && digitIndex < digits.length) {
                result += mask[i];
              } else if (digitIndex >= digits.length) {
                break;
              }
            }
          }
        }
        while (digitIndex < digits.length) {
          result += digits[digitIndex];
          digitIndex++;
        }
        return result;
      }
      function findCursorPosition(value) {
        for (let i = value.length - 1; i >= 0; i--) {
          if (/\d/.test(value[i])) return i + 1;
        }
        return value.length;
      }
      function isControlKey(e) {
        return [8, 9, 46, 37, 39, 35, 36].includes(e.keyCode);
      }
      function isDigitKey(e) {
        return e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105;
      }
      function checkRepeatedCountryCode(input) {
        const code = input.getAttribute("data-phone-code");
        if (!code) return false;
        const valueWithoutCode = input.value.substring(code.length);
        const cleanCode = code.replace(/\+/g, "");
        if (valueWithoutCode.startsWith(cleanCode) || valueWithoutCode.startsWith("+" + cleanCode)) {
          showPhoneError(input, getErrorMessages().phoneRepeat);
          return true;
        }
        return false;
      }
      function validatePhoneField(input, showError2 = true) {
        const mask = input.getAttribute("data-mask");
        const code = input.getAttribute("data-phone-code");
        const value = input.value;
        if (!mask || !code) return false;
        if (showError2) clearPhoneError(input);
        if (!input.hasBeenBlurred && !showError2 && (value === code && !input.hasBeenInteractedWith)) {
          return true;
        }
        if (!value || value === code) {
          if (showError2) showPhoneError(input, getErrorMessages().emptyPhone);
          dispatchPhoneEvent(input, false);
          return false;
        }
        if (checkRepeatedCountryCode(input)) {
          dispatchPhoneEvent(input, false);
          return false;
        }
        const requiredDigits = (mask.match(/X/g) || []).length;
        const digits = extractDigits(value, code);
        if (digits.length > requiredDigits + 3) {
          if (showError2) showPhoneError(input, getErrorMessages().phoneError);
          dispatchPhoneEvent(input, false);
          return false;
        }
        if (digits.length < requiredDigits) {
          if (showError2) showPhoneError(input, getErrorMessages().phoneError);
          dispatchPhoneEvent(input, false);
          return false;
        }
        if (digits.length > 0 && digits[0] === "0") {
          if (showError2) showPhoneError(input, getErrorMessages().phoneZero);
          dispatchPhoneEvent(input, false);
          return false;
        }
        if (code === "+380" && digits.length >= 2) {
          const operatorCode = digits.substring(0, 2);
          const validCodes = ["50", "63", "66", "67", "68", "73", "93", "95", "96", "97", "98", "99", "77", "78", "79"];
          if (!validCodes.includes(operatorCode)) {
            if (showError2) showPhoneError(input, getErrorMessages().phoneForbidden);
            dispatchPhoneEvent(input, false);
            return false;
          }
        }
        if (code === "+48" && digits.length >= 1) {
          const firstDigit = digits[0];
          if (!["5", "6", "7", "8"].includes(firstDigit)) {
            if (showError2) showPhoneError(input, getErrorMessages().phoneForbidden);
            dispatchPhoneEvent(input, false);
            return false;
          }
        }
        input.classList.add("valid");
        dispatchPhoneEvent(input, true);
        return true;
      }
      function dispatchPhoneEvent(input, isValid) {
        const event = new CustomEvent("phone:validated", {
          bubbles: true,
          detail: { valid: isValid, element: input }
        });
        input.dispatchEvent(event);
      }
      function showPhoneError(input, message) {
        input.classList.add("error");
        input.classList.remove("valid");
        const parent = input.closest(".form-field") || input.parentElement;
        if (parent) {
          parent.classList.add("invalid");
          parent.classList.remove("valid");
        }
        let errorElement = parent.querySelector(".form-error");
        if (!errorElement) {
          errorElement = document.createElement("div");
          errorElement.className = "form-error";
          parent.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.style.display = "block";
      }
      function clearPhoneError(input) {
        input.classList.remove("error");
        const parent = input.closest(".form-field") || input.parentElement;
        if (parent) parent.classList.remove("invalid");
        const errorElement = parent.querySelector(".form-error");
        if (errorElement) errorElement.style.display = "none";
      }
      function applyMaskToInput(input, mask, phoneCode) {
        if (input._phoneHandlers) {
          Object.keys(input._phoneHandlers).forEach((event) => {
            input.removeEventListener(event, input._phoneHandlers[event]);
          });
        }
        const previousCode = input.getAttribute("data-phone-code");
        const codeChanged = previousCode && previousCode !== phoneCode;
        if (codeChanged) input.value = "";
        input.setAttribute("data-mask", mask);
        input.setAttribute("data-phone-code", phoneCode);
        input.setAttribute("placeholder", mask);
        input.hasBeenInteractedWith = false;
        const handlers = {
          input: function(e) {
            this.hasBeenInteractedWith = true;
            const mask2 = this.getAttribute("data-mask");
            const code = this.getAttribute("data-phone-code");
            if (!mask2 || !code) return;
            if (!this.value.startsWith(code)) {
              this.value = code + this.value.replace(/\D/g, "");
            }
            checkRepeatedCountryCode(this);
            const digits = extractDigits(this.value, code);
            const maxDigits = (mask2.match(/X/g) || []).length;
            if (digits.length > maxDigits + 3) {
              showPhoneError(this, getErrorMessages().phoneError);
            }
            if (e && (e.inputType === "deleteContentBackward" || e.inputType === "deleteContentForward" || e.inputType === "deleteContent")) {
              if (digits.length > 0) {
                this.value = formatPhoneNumber(digits, mask2, code);
              } else {
                this.value = code;
              }
              const cursorPos2 = findCursorPosition(this.value);
              setTimeout(() => this.setSelectionRange(cursorPos2, cursorPos2), 0);
              validatePhoneField(this, this.hasBeenBlurred);
              return;
            }
            const limitedDigits = digits.slice(0, maxDigits);
            this.value = formatPhoneNumber(limitedDigits, mask2, code);
            const cursorPos = findCursorPosition(this.value);
            setTimeout(() => this.setSelectionRange(cursorPos, cursorPos), 0);
            validatePhoneField(this, this.hasBeenBlurred);
          },
          focus: function() {
            this.hasBeenInteractedWith = true;
            const code = this.getAttribute("data-phone-code");
            if (!code) return;
            if (!this.value) {
              this.value = code;
            } else if (!this.value.startsWith(code)) {
              this.value = code + this.value.replace(/\D/g, "");
            }
            const pos = Math.max(code.length, this.selectionStart);
            setTimeout(() => this.setSelectionRange(pos, pos), 0);
            clearPhoneError(this);
            this.classList.add("focused");
          },
          blur: function() {
            this.hasBeenBlurred = true;
            this.hasBeenInteractedWith = true;
            validatePhoneField(this, true);
            this.classList.remove("focused");
          },
          keydown: function(e) {
            const code = this.getAttribute("data-phone-code");
            const selStart = this.selectionStart;
            const selEnd = this.selectionEnd;
            const isSelection = selEnd > selStart;
            if (e.keyCode === 8 && selStart <= code.length) {
              if (!(isSelection && selEnd > code.length)) {
                e.preventDefault();
              }
              return;
            }
            if (e.keyCode === 46 && selStart < code.length) {
              if (!(isSelection && selEnd > code.length)) {
                e.preventDefault();
              }
              return;
            }
            if (!isControlKey(e) && !isDigitKey(e)) {
              e.preventDefault();
            }
          }
        };
        Object.keys(handlers).forEach((event) => {
          input.addEventListener(event, handlers[event]);
        });
        input._phoneHandlers = handlers;
        input.hasPhoneMask = true;
        if (codeChanged || !input.value) {
          input.value = phoneCode;
        } else {
          const digits = extractDigits(input.value, phoneCode);
          input.value = formatPhoneNumber(digits, mask, phoneCode);
        }
        clearPhoneError(input);
        input.hasBeenBlurred = false;
      }
      function applyMaskBySelect(phoneInput, selectElement) {
        if (!phoneInput || !selectElement) return;
        let selectedOption;
        if (selectElement.tagName === "SELECT") {
          if (selectElement.selectedIndex === -1) return;
          selectedOption = selectElement.options[selectElement.selectedIndex];
        } else {
          const originalSelect = selectElement.querySelector("select");
          if (!originalSelect || originalSelect.selectedIndex === -1) return;
          selectedOption = originalSelect.options[originalSelect.selectedIndex];
        }
        if (!selectedOption) return;
        const countryCode = selectedOption.value;
        const phoneCode = selectedOption.getAttribute("data-phone-code");
        const mask = selectedOption.getAttribute("data-mask") || createMaskFromPhoneCode(phoneCode);
        if (countryCode) {
          localStorage.setItem("phoneCountry", countryCode);
        }
        applyMaskToInput(phoneInput, mask, phoneCode);
        updateFlagImage(selectElement, countryCode);
      }
      function updateFlagImage(selectElement, countryCode) {
        const flagImg = selectElement.parentElement.querySelector("img.flag") || document.getElementById("flag_img");
        if (flagImg && countryCode) {
          const code = countryCode.toLowerCase();
          flagImg.src = `./img/flags/${code}.svg`;
          flagImg.alt = code;
        }
      }
      function initPhoneMasks() {
        const standardSelects = document.querySelectorAll('select[name="countryCode"], select#phone_code');
        standardSelects.forEach((select) => {
          if (select.options.length === 0) {
            fillSelectWithCountries(select);
          }
          const phoneInput = findPhoneInput(select);
          if (phoneInput) {
            applyMaskBySelect(phoneInput, select);
            select.addEventListener("change", function() {
              applyMaskBySelect(phoneInput, this);
            });
          }
        });
        document.addEventListener("selectCallback", function(e) {
          const originalSelect = e.detail.select;
          if (!originalSelect) return;
          if (originalSelect.name === "countryCode" || originalSelect.id === "phone_code" || originalSelect.classList.contains("country-select") || originalSelect.getAttribute("data-country-select") === "true") {
            const selectParent = originalSelect.closest(".select");
            const phoneInput = findPhoneInput(selectParent || originalSelect.parentElement);
            if (phoneInput) {
              if (selectParent) {
                applyMaskBySelect(phoneInput, selectParent);
              } else {
                applyMaskBySelect(phoneInput, originalSelect);
              }
            }
          }
        });
      }
      function setupPhoneValidation() {
        const forms = document.querySelectorAll("form");
        forms.forEach((form) => {
          const phoneInputs = form.querySelectorAll('input[type="tel"], input[name="phone"], input.phone-input');
          if (phoneInputs.length === 0) return;
          form.addEventListener("submit", function(e) {
            let hasErrors = false;
            phoneInputs.forEach((input) => {
              input.hasBeenBlurred = true;
              if (!validatePhoneField(input, true)) {
                hasErrors = true;
                const container = input.closest(".form-field") || input.parentElement;
                if (container) container.classList.add("invalid");
                if (!e.defaultPrevented) input.focus();
              }
            });
            if (hasErrors) {
              e.preventDefault();
              const submitButton = form.querySelector('button[type="submit"]');
              if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add("disabled");
              }
            }
          });
          phoneInputs.forEach((input) => {
            input.addEventListener("input", function() {
              validatePhoneField(this, this.hasBeenBlurred);
            });
            input.addEventListener("blur", function() {
              this.hasBeenBlurred = true;
              validatePhoneField(this, true);
            });
            if (input.value) {
              validatePhoneField(input, false);
            }
          });
        });
      }
      const VALIDATION_CONFIG = {
        MESSAGES: {
          PASSWORD_ERROR: "Пароль не соответствует требованиям",
          PHONE_ERROR: "Укажите корректный номер телефона",
          CHECKBOX_ERROR: "Необходимо принять условия"
        },
        FORMS: {
          MIN_PHONE_LENGTH: 11,
          PASSWORD_RULES: {
            MIN_LENGTH: 8
          }
        }
      };
      class FormValidator {
        constructor(form) {
          if (!form) return;
          this.form = form;
          this.submitButton = form.querySelector('button[type="submit"]');
          this.phoneInput = form.querySelector(".input-phone");
          this.passwordInput = form.querySelector("#password");
          this.checkboxes = Array.from(form.querySelectorAll(".checkbox__input[data-required]"));
          this.validation = {
            phone: false,
            password: false,
            checkboxes: this.checkboxes.length ? false : true
          };
          this.passwordRequirements = {
            minLength: false,
            hasDigit: false,
            hasLower: false,
            hasUpper: false
          };
          this.requirementsList = form.querySelector(".requirements");
          this.requirementsItems = this.requirementsList ? Array.from(this.requirementsList.querySelectorAll(".requirements__item")) : [];
          this.disableSubmitButton();
          this.init();
        }
        init() {
          if (this.passwordInput) {
            ["input", "keyup", "focus", "blur"].forEach((eventType) => {
              this.passwordInput.addEventListener(eventType, this.validatePassword.bind(this));
            });
            this.passwordInput.addEventListener("keydown", function(e) {
              if (e.key === " " || e.keyCode === 32) {
                e.preventDefault();
                return false;
              }
            });
          }
          if (this.phoneInput) {
            ["input", "blur", "change"].forEach((eventType) => {
              this.phoneInput.addEventListener(eventType, this.validatePhone.bind(this));
            });
            this.phoneInput.addEventListener("phone:validated", (e) => {
              this.validation.phone = e.detail.valid;
              this.updateFormValidity();
            });
            document.addEventListener("phone:error", (e) => {
              if (e.detail && e.detail.element === this.phoneInput) {
                this.disableSubmitButton();
              }
            });
          }
          if (this.checkboxes.length) {
            this.checkboxes.forEach((checkbox) => {
              checkbox.addEventListener("change", this.validateCheckboxes.bind(this));
            });
          }
          this.form.addEventListener("form:validate", this.validateForm.bind(this));
          this.form.addEventListener("submit", this.submitForm.bind(this));
        }
        validatePassword() {
          const password = this.passwordInput.value;
          const hasSpaces = /\s/.test(password);
          if (hasSpaces) {
            this.passwordInput.value = password.replace(/\s/g, "");
            return;
          }
          this.passwordRequirements.minLength = password.length >= VALIDATION_CONFIG.FORMS.PASSWORD_RULES.MIN_LENGTH;
          this.passwordRequirements.hasDigit = /[0-9]/.test(password);
          this.passwordRequirements.hasLower = /[a-z]/.test(password);
          this.passwordRequirements.hasUpper = /[A-Z]/.test(password);
          this.updateRequirementsDisplay();
          this.validation.password = Object.values(this.passwordRequirements).every(Boolean);
          const container = this.passwordInput.parentElement;
          container.classList.toggle("valid", this.validation.password);
          container.classList.toggle("invalid", !this.validation.password && password.length > 0);
          this.updateFormValidity();
        }
        updateRequirementsDisplay() {
          if (!this.requirementsItems.length || this.requirementsItems.length < 4) return;
          this.requirementsItems[0].classList.toggle("valid", this.passwordRequirements.minLength);
          this.requirementsItems[1].classList.toggle("valid", this.passwordRequirements.hasDigit);
          this.requirementsItems[2].classList.toggle("valid", this.passwordRequirements.hasLower);
          this.requirementsItems[3].classList.toggle("valid", this.passwordRequirements.hasUpper);
        }
        validatePhone() {
          if (!this.phoneInput) return;
          const phoneValue = this.phoneInput.value;
          if (!phoneValue.length) {
            this.validation.phone = false;
            return;
          }
          const digitsOnly = phoneValue.replace(/\D/g, "");
          this.validation.phone = digitsOnly.length >= VALIDATION_CONFIG.FORMS.MIN_PHONE_LENGTH;
          const container = this.phoneInput.parentElement;
          container.classList.toggle("valid", this.validation.phone);
          container.classList.toggle("invalid", !this.validation.phone && phoneValue.length > 0);
          this.updateFormValidity();
        }
        validateCheckboxes() {
          if (!this.checkboxes.length) {
            this.validation.checkboxes = true;
            return;
          }
          this.validation.checkboxes = this.checkboxes.every((checkbox) => checkbox.checked);
          this.checkboxes.forEach((checkbox) => {
            const container = checkbox.closest(".checkbox");
            if (container) {
              container.classList.toggle("checkbox-error", !checkbox.checked);
            }
          });
          this.updateFormValidity();
        }
        updateFormValidity() {
          const isFormValid = Object.values(this.validation).every(Boolean);
          const hasPhoneErrors = this.phoneInput && (this.phoneInput.classList.contains("error") || this.phoneInput.parentElement.classList.contains("invalid"));
          if (isFormValid && !hasPhoneErrors) {
            this.enableSubmitButton();
          } else {
            this.disableSubmitButton();
          }
          return isFormValid && !hasPhoneErrors;
        }
        enableSubmitButton() {
          if (this.submitButton) {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove("disabled");
          }
        }
        disableSubmitButton() {
          if (this.submitButton) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add("disabled");
          }
        }
        validateForm() {
          if (this.passwordInput) this.validatePassword();
          if (this.phoneInput) this.validatePhone();
          this.validateCheckboxes();
          return this.updateFormValidity();
        }
        submitForm(event) {
          if (!this.validateForm()) {
            event.preventDefault();
            this.highlightInvalidFields();
          }
        }
        highlightInvalidFields() {
          let firstInvalidField = null;
          if (!this.validation.password && this.passwordInput) {
            this.passwordInput.parentElement.classList.add("invalid");
            firstInvalidField = firstInvalidField || this.passwordInput;
            this.showErrorMessage(this.passwordInput, VALIDATION_CONFIG.MESSAGES.PASSWORD_ERROR);
          }
          if (!this.validation.phone && this.phoneInput) {
            this.phoneInput.parentElement.classList.add("invalid");
            firstInvalidField = firstInvalidField || this.phoneInput;
            this.showErrorMessage(this.phoneInput, VALIDATION_CONFIG.MESSAGES.PHONE_ERROR);
          }
          if (!this.validation.checkboxes) {
            this.checkboxes.forEach((checkbox) => {
              if (!checkbox.checked) {
                const container = checkbox.closest(".checkbox");
                if (container) container.classList.add("checkbox-error");
                firstInvalidField = firstInvalidField || checkbox;
                this.showErrorMessage(checkbox, VALIDATION_CONFIG.MESSAGES.CHECKBOX_ERROR);
              }
            });
          }
          if (firstInvalidField) firstInvalidField.focus();
        }
        showErrorMessage(field, message) {
          const container = field.closest(".form-field") || field.parentElement;
          if (!container) return;
          let errorElement = container.querySelector(".form-error");
          if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.className = "form-error";
            container.appendChild(errorElement);
          }
          errorElement.textContent = message;
          errorElement.style.display = "block";
        }
      }
      const AUTH_ERRORS = {
        en: {
          INVALID_SSO_USERNAME: "The phone number is already registered, try another one.",
          ACCOUNT_ALREADY_REGISTERED: "It seems you already have an account associated with this email. Log in or reset your password if you forgot it.",
          ACCOUNT_IS_BLOCKED: "The account is blocked. For more information, contact support.",
          ACCOUNT_NOT_FOUND: "It seems the information entered is incorrect, or you don't have an account yet.",
          UNEXPECTED_ERROR: "An error occurred. Please contact support.",
          PASSWORD_TOO_LONG: "Password must not exceed 32 characters",
          PASSWORD_TOO_SHORT: "Password must be at least 8 characters",
          PASSWORD_NO_DIGIT: "Password must contain at least 1 digit",
          PASSWORD_NO_UPPERCASE: "Password must contain at least 1 uppercase letter",
          PASSWORD_NO_LOWERCASE: "Password must contain at least 1 lowercase letter",
          NETWORK_ERROR: "Network error occurred. Please check your connection and try again."
        },
        ua: {
          INVALID_SSO_USERNAME: "Номер телефону вже зареєстрований, спробуйте інший",
          ACCOUNT_ALREADY_REGISTERED: "Схоже, у тебе вже є обліковий запис, пов'язаний із цим e-mail. Увійди в систему або скинь пароль, якщо ти його забув.",
          ACCOUNT_IS_BLOCKED: "Обліковий запис заблоковано. За додатковою інформацією звернься до служби підтримки.",
          ACCOUNT_NOT_FOUND: "Схоже, дані введено некоректно або у тебе ще немає облікового запису.",
          UNEXPECTED_ERROR: "Сталася помилка. Звернися до служби підтримки.",
          PASSWORD_TOO_LONG: "Пароль не повинен перевищувати 32 символи",
          PASSWORD_TOO_SHORT: "Пароль повинен містити мінімум 8 символів",
          PASSWORD_NO_DIGIT: "Пароль повинен містити мінімум 1 цифру",
          PASSWORD_NO_UPPERCASE: "Пароль повинен містити мінімум 1 велику літеру",
          PASSWORD_NO_LOWERCASE: "Пароль повинен містити мінімум 1 малу літеру",
          NETWORK_ERROR: "Сталася помилка мережі. Перевірте підключення та спробуйте ще раз."
        },
        ru: {
          INVALID_SSO_USERNAME: "Номер телефона уже зарегистрирован, попробуйте другой",
          ACCOUNT_ALREADY_REGISTERED: "Похоже, у тебя уже есть учетная запись, связанная с этим e-mail. Войди в систему или сбрось пароль, если ты забыл его.",
          ACCOUNT_IS_BLOCKED: "Аккаунт заблокирован. За дополнительной информацией обратись в службу поддержки.",
          ACCOUNT_NOT_FOUND: "Похоже, данные введены некорректно или у тебя еще нет аккаунта",
          UNEXPECTED_ERROR: "Произошла ошибка. Обратись в службу поддержки",
          PASSWORD_TOO_LONG: "Пароль не должен превышать 32 символа",
          PASSWORD_TOO_SHORT: "Пароль должен содержать минимум 8 символов",
          PASSWORD_NO_DIGIT: "Пароль должен содержать минимум 1 цифру",
          PASSWORD_NO_UPPERCASE: "Пароль должен содержать минимум 1 заглавную букву",
          PASSWORD_NO_LOWERCASE: "Пароль должен содержать минимум 1 строчную букву",
          NETWORK_ERROR: "Произошла ошибка сети. Проверьте подключение и попробуйте снова."
        }
      };
      function getAuthLanguage() {
        const lang = navigator.language.split("-")[0];
        return ["ru", "uk", "en"].includes(lang) ? lang : "uk";
      }
      function getLocalizedAuthErrors() {
        return AUTH_ERRORS[getAuthLanguage()];
      }
      function getXChannel() {
        const wideViewThreshold = 1280;
        const webViewRules = ["WebView", "(iPhone|iPod|iPad)(?!.*Safari)", "Android.*(wv|.0.0.0)", "Linux; U; Android"];
        const isWebView = () => {
          const regex = new RegExp(`(${webViewRules.join("|")})`, "i");
          return regex.test(navigator.userAgent.toLowerCase()) && !navigator.userAgent.toLowerCase().includes("build");
        };
        const isStandalone = () => {
          return "standalone" in navigator && navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
        };
        const isWideView = () => window.innerWidth >= wideViewThreshold;
        if (isWebView()) return "MOBILE_WEB";
        if (isStandalone() && !isWideView()) return "MOBILE_WEB";
        if (isWideView()) return "DESKTOP_AIR_PM";
        return "MOBILE_WEB";
      }
      function transformPhoneNumber(phoneNumber) {
        return String(phoneNumber).replace(/[^\d+]/g, "");
      }
      function validatePhone(phone) {
        return /^\+\d{10,}$/.test(phone);
      }
      function validatePassword(password) {
        const errors = [];
        const localizedErrors = getLocalizedAuthErrors();
        if (!password) {
          errors.push("Пароль обязателен");
        } else {
          if (password.length < 8) errors.push(localizedErrors.PASSWORD_TOO_SHORT);
          if (password.length > 32) errors.push(localizedErrors.PASSWORD_TOO_LONG);
          if (!/\d/.test(password)) errors.push(localizedErrors.PASSWORD_NO_DIGIT);
          if (!/[A-Z]/.test(password)) errors.push(localizedErrors.PASSWORD_NO_UPPERCASE);
          if (!/[a-z]/.test(password)) errors.push(localizedErrors.PASSWORD_NO_LOWERCASE);
        }
        return {
          isValid: errors.length === 0,
          errors
        };
      }
      function toggleLoader(targetSelector, action) {
        const LOADER_CLASS = "js-loader";
        const IS_LOADING_CLASS = "is-loading";
        const loaderTemplate = `
          <div class="c-loader ${LOADER_CLASS} ${IS_LOADING_CLASS}">
              <div class="c-loader__content">
                  <img src="img/loader.svg" class="c-loader__item" alt="loader">
              </div>
          </div>`;
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) return;
        if (action === "show") {
          if (!targetElement.querySelector(`.${LOADER_CLASS}`)) {
            targetElement.insertAdjacentHTML("afterbegin", loaderTemplate);
          } else {
            targetElement.querySelector(`.${LOADER_CLASS}`).classList.add(IS_LOADING_CLASS);
          }
        } else if (action === "hide") {
          const loader = document.querySelector(`.${LOADER_CLASS}`);
          if (loader) {
            loader.classList.remove(IS_LOADING_CLASS);
            setTimeout(() => {
              if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
              }
            }, 300);
          }
        }
      }
      function showError(message) {
        const phoneErrorBlock = document.getElementById("phoneError");
        if (phoneErrorBlock) {
          phoneErrorBlock.textContent = message;
          phoneErrorBlock.style.display = "block";
        } else {
          alert(message);
        }
      }
      async function getVisitorId() {
        if (typeof FingerprintJS === "undefined") {
          return crypto.randomUUID();
        }
        try {
          const fpLoad = FingerprintJS.load();
          const fp = await fpLoad;
          const result = await fp.get();
          return result.visitorId;
        } catch (error) {
          console.error("Error getting visitorId:", error);
          return crypto.randomUUID();
        }
      }
      async function sendRegistrationRequest(formData) {
        var _a, _b, _c;
        const visitorId = await getVisitorId();
        const marketingData = {
          mlv: "v0.6.2",
          sourceURL: window.location.href,
          registerURL: window.location.href,
          dhash: crypto.randomUUID(),
          isep: "true",
          entrance_url: document.referrer || window.location.origin
        };
        const requestData = {
          phone: transformPhoneNumber(formData.phone),
          password: formData.password,
          defaultCurrency: formData.defaultCurrency || "UAH",
          selectedLanguage: formData.selectedLanguage || "uk",
          formName: formData.formName,
          marketingMeta: formData.marketingMeta || marketingData,
          nnBonus: formData.nnBonus,
          bonusProductType: formData.bonusProductType,
          isBonusActivated: formData.isBonusActivated === "true",
          isPlayerAgree: formData.isPlayerAgree === "true"
        };
        const headers = {
          "Content-Type": "application/json",
          "X-Api-Key": "baee5942-5e1e-4ad1-89c4-63e6860375c3",
          "X-ClientId": visitorId,
          "X-Channel": getXChannel(),
          "X-Response-Error": "true",
          "X-Landing": "true",
          "X-VerificationLinkVersion": "2",
          "X-IncludeLogin": "false"
        };
        const apiUrl = "https://apg.gorilla.ua/v0/identity/registration/byform";
        try {
          const response = await fetch(apiUrl, {
            method: "POST",
            headers,
            body: JSON.stringify(requestData),
            credentials: "include"
          });
          const localizedErrors = getLocalizedAuthErrors();
          if (response.ok) {
            const data = await response.json();
            if (data.token) {
              const mainDomain = "gorilla.ua";
              document.cookie = `thirdPartyAuthToken=${data.token}; domain=${mainDomain}; path=/; Secure; SameSite=Lax`;
              const redirectTarget = data.redirectUrl || data.redirectDomain || `https://${mainDomain}/uk/deposit`;
              window.location.href = redirectTarget;
            }
            return data;
          }
          let errorData = {};
          try {
            errorData = await response.json();
          } catch (e) {
            console.warn("Could not parse error response JSON");
          }
          let errorMessage = localizedErrors.UNEXPECTED_ERROR;
          if (((_a = errorData == null ? void 0 : errorData.modelError) == null ? void 0 : _a.code) && localizedErrors[errorData.modelError.code]) {
            errorMessage = localizedErrors[errorData.modelError.code];
          } else if ((errorData == null ? void 0 : errorData.message) && localizedErrors[errorData.message]) {
            errorMessage = localizedErrors[errorData.message];
          } else if ((_b = errorData == null ? void 0 : errorData.modelError) == null ? void 0 : _b.message) {
            errorMessage = errorData.modelError.message;
          } else if (response.status === 401) {
            errorMessage = localizedErrors.UNAUTHORIZED || "Authorization required";
          }
          if (response.status === 400 && ((_c = errorData == null ? void 0 : errorData.modelError) == null ? void 0 : _c.code) === "INVALID_SSO_USERNAME") {
            errorMessage = localizedErrors.INVALID_SSO_USERNAME;
          }
          showError(errorMessage);
          throw new Error(`Registration API Error: ${response.status} - ${errorMessage}`);
        } catch (error) {
          console.error("Registration request error:", error);
          const localizedErrors = getLocalizedAuthErrors();
          if (error.name === "TypeError" && !error.message.startsWith("Registration API Error")) {
            showError(localizedErrors.NETWORK_ERROR);
          } else if (!error.message.startsWith("Registration API Error")) {
            showError(error.message || localizedErrors.UNEXPECTED_ERROR);
          }
          throw error;
        }
      }
      function initFormRedirect() {
        const registrationForm = document.getElementById("formReg");
        const phoneErrorBlock = document.getElementById("phoneError");
        if (!registrationForm) {
          setTimeout(initFormRedirect, 500);
          return;
        }
        let submitButton = registrationForm.querySelector('button[type="submit"]');
        if (!submitButton) {
          const genericButton = registrationForm.querySelector("button");
          if (genericButton) {
            genericButton.type = "submit";
            submitButton = genericButton;
          }
        }
        registrationForm.addEventListener("submit", async function(event) {
          event.preventDefault();
          if (phoneErrorBlock) phoneErrorBlock.style.display = "none";
          try {
            toggleLoader("body", "show");
            const formData = new FormData(registrationForm);
            const formDataObject = Object.fromEntries(formData.entries());
            let clientIsValid = true;
            const errorsToShow = [];
            const phoneInput = formDataObject.phone;
            const countryCode = formDataObject.countryCode;
            let fullPhoneNumber = "";
            if (phoneInput) {
              if (countryCode) {
                const selectedOption = registrationForm.querySelector(`select[name="countryCode"] option[value="${countryCode}"]`);
                const phonePrefix = selectedOption ? selectedOption.getAttribute("data-phone-code") : "";
                let cleanedPhoneInput = phoneInput;
                if (phonePrefix && cleanedPhoneInput.startsWith(phonePrefix)) {
                  cleanedPhoneInput = cleanedPhoneInput.slice(phonePrefix.length);
                }
                fullPhoneNumber = phonePrefix + cleanedPhoneInput;
              } else {
                fullPhoneNumber = phoneInput;
              }
              const validatedPhone = transformPhoneNumber(fullPhoneNumber);
              if (!validatePhone(validatedPhone)) {
                clientIsValid = false;
                errorsToShow.push("Неверный формат номера телефона.");
              } else {
                formDataObject.phone = validatedPhone;
              }
            } else if (formDataObject.formName && formDataObject.formName.toUpperCase().includes("PHONE")) {
              clientIsValid = false;
              errorsToShow.push("Номер телефона обязателен.");
            }
            const passwordValidation = validatePassword(formDataObject.password);
            if (!passwordValidation.isValid) {
              clientIsValid = false;
              errorsToShow.push(...passwordValidation.errors);
            }
            if (formDataObject.isPlayerAgree === void 0 || formDataObject.isPlayerAgree !== "true") {
              clientIsValid = false;
              errorsToShow.push("Необходимо принять условия.");
            }
            if (!clientIsValid) {
              showError(errorsToShow.join(" "));
              toggleLoader("body", "hide");
              return;
            }
            await sendRegistrationRequest(formDataObject);
          } catch (error) {
            console.error("Form submission error:", error.message);
          } finally {
            toggleLoader("body", "hide");
          }
        });
        if (phoneErrorBlock) {
          const inputFields = registrationForm.querySelectorAll("input, select");
          inputFields.forEach((input) => {
            input.addEventListener("focus", () => {
              phoneErrorBlock.style.display = "none";
            });
          });
        }
      }
      document.addEventListener("DOMContentLoaded", function() {
        document.addEventListener("phone:validated", function(e) {
          if (e.target && e.target.matches(".input-phone")) {
            const form = e.target.closest("form");
            if (form) {
              const validationEvent = new CustomEvent("form:validate");
              form.dispatchEvent(validationEvent);
            }
          }
        });
        initFormFields({
          viewPass: true,
          autoHeight: false
        });
        new CustomSelect({});
        setTimeout(() => {
          initPhoneMasks();
          setupPhoneValidation();
        }, 800);
        const registrationForm = document.getElementById("formReg");
        if (registrationForm) {
          new FormValidator(registrationForm);
        }
        setTimeout(initFormRedirect, 200);
      });
      window.addEventListener("error", function(event) {
        console.error("Global error:", {
          message: event.message,
          source: event.filename,
          line: event.lineno,
          column: event.colno,
          error: event.error
        });
      });
    })();
    function setVh() {
      document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
    }
    window.addEventListener("resize", setVh);
    setVh();
    const MarqueeModule = /* @__PURE__ */ (() => {
      function initMarquee(selector, speed = 60) {
        if (typeof selector !== "string" || !selector) {
          console.error("Invalid selector provided");
          return;
        }
        const container = document.querySelector(selector);
        if (!container || !container.children.length) {
          console.warn(`No valid container found for selector: ${selector}`);
          return;
        }
        const wrapper = document.createElement("div");
        Object.assign(wrapper.style, {
          display: "flex",
          whiteSpace: "nowrap",
          willChange: "transform"
        });
        const originalLines = Array.from(container.children);
        originalLines.forEach((line) => {
          line.style.flex = "0 0 auto";
          wrapper.appendChild(line.cloneNode(true));
          wrapper.appendChild(line.cloneNode(true));
        });
        container.innerHTML = "";
        container.appendChild(wrapper);
        const marqueeSpeed = typeof speed === "number" && speed > 0 ? speed : 60;
        let offset = 0;
        let lastTime = performance.now();
        let animationFrame;
        function animate(now) {
          const dt = (now - lastTime) / 1e3;
          lastTime = now;
          offset += marqueeSpeed * dt;
          const totalWidth = wrapper.offsetWidth / 2;
          if (offset >= totalWidth) offset -= totalWidth;
          wrapper.style.transform = `translateX(-${offset}px)`;
          animationFrame = requestAnimationFrame(animate);
        }
        animationFrame = requestAnimationFrame(animate);
        container.addEventListener("mouseenter", () => cancelAnimationFrame(animationFrame));
        container.addEventListener("mouseleave", () => {
          lastTime = performance.now();
          animationFrame = requestAnimationFrame(animate);
        });
      }
      function safeInitialize() {
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", () => {
            requestAnimationFrame(() => initMarquee(".page__marquee.marquee-row", 60));
            requestAnimationFrame(() => initMarquee(".popup .page__marquee.marquee-row", 60));
          });
        } else {
          requestAnimationFrame(() => initMarquee(".popup .page__marquee.marquee-row", 60));
          requestAnimationFrame(() => initMarquee(".page__marquee.marquee-row", 60));
        }
      }
      return { init: safeInitialize };
    })();
    const QueryParamsModule = (() => {
      const initialUrl = window.location.href;
      const queryParams = getQueryParams(initialUrl);
      function getQueryParams(url) {
        const queryString = url.split("?")[1];
        if (!queryString) return {};
        const params = new URLSearchParams(queryString);
        const paramsObj = {};
        for (const [key, value] of params.entries()) {
          paramsObj[key] = value;
        }
        return paramsObj;
      }
      function appendQueryParamsToLinks() {
        const links = document.querySelectorAll("a");
        links.forEach((link) => {
          link.addEventListener("click", function(event) {
            event.preventDefault();
            const newUrl = new URL(link.href);
            for (const key in queryParams) {
              newUrl.searchParams.set(key, queryParams[key]);
            }
            link.href = newUrl.toString();
            window.location.href = link.href;
          });
        });
      }
      return { init: appendQueryParamsToLinks };
    })();
    const AnimationUtils = /* @__PURE__ */ (() => {
      const EASING = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      const TIMING = {
        cloud: 800,
        background: 1200,
        card: 1500
      };
      function animateCloud(element, newText, callback) {
        if (!element) {
          callback == null ? void 0 : callback();
          return;
        }
        const cloud = element.closest(".cloud-left, .cloud-right");
        if (!cloud) {
          element.innerHTML = newText;
          callback == null ? void 0 : callback();
          return;
        }
        const originalTransform = getComputedStyle(cloud).transform;
        cloud.style.transition = `all ${TIMING.cloud}ms ${EASING}`;
        cloud.style.transform = "translateY(-80px)";
        cloud.style.opacity = "0";
        setTimeout(() => {
          element.innerHTML = newText;
          cloud.style.transition = "none";
          cloud.style.transform = "translateY(-100px)";
          cloud.style.opacity = "0";
          requestAnimationFrame(() => {
            cloud.style.transition = `all 1000ms ${EASING}`;
            cloud.style.transform = "translateY(0px)";
            cloud.style.opacity = "1";
            setTimeout(() => {
              cloud.style.transition = "";
              cloud.style.transform = originalTransform;
              cloud.style.opacity = "";
              callback == null ? void 0 : callback();
            }, 1e3);
          });
        }, TIMING.cloud);
      }
      function animateBackground(pictureElement, newImages, callback) {
        if (!pictureElement || !newImages) {
          callback == null ? void 0 : callback();
          return;
        }
        const images = typeof newImages === "string" ? { desktop: newImages, mobile: newImages.replace(".webp", "-mob.webp") } : newImages;
        const container = pictureElement.parentElement;
        if (!container) {
          callback == null ? void 0 : callback();
          return;
        }
        const preloadPromises = [];
        const preloadDesktop = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = images.desktop;
        });
        const preloadMobile = new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = images.mobile;
        });
        preloadPromises.push(preloadDesktop, preloadMobile);
        Promise.all(preloadPromises).then(() => {
          const newPicture = document.createElement("picture");
          newPicture.innerHTML = `
        <source media="(min-width:29.9988em)" srcset="${images.desktop}">
        <img src="${images.mobile}" alt="Background image" style="width: 100%; height: 100%; object-fit: cover;">
      `;
          newPicture.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        transition: opacity ${TIMING.background}ms ${EASING};
        z-index: 1;
      `;
          const containerStyle = getComputedStyle(container);
          if (containerStyle.position === "static") {
            container.style.position = "relative";
          }
          container.appendChild(newPicture);
          requestAnimationFrame(() => {
            newPicture.style.opacity = "1";
            setTimeout(() => {
              const source = pictureElement.querySelector("source");
              const img = pictureElement.querySelector("img");
              if (source) {
                source.srcset = images.desktop;
              }
              if (img) {
                img.src = images.mobile;
              }
              container.removeChild(newPicture);
              callback == null ? void 0 : callback();
            }, TIMING.background);
          });
        }).catch(() => {
          const source = pictureElement.querySelector("source");
          const img = pictureElement.querySelector("img");
          if (source) {
            source.srcset = images.desktop;
          }
          if (img) {
            img.src = images.mobile;
          }
          callback == null ? void 0 : callback();
        });
      }
      return {
        animateCloud,
        animateBackground,
        EASING,
        TIMING
      };
    })();
    class CardGame {
      constructor() {
        this.config = {
          maxRounds: 3,
          initialAttempts: 3,
          flipDuration: 800,
          clickCooldown: 2e3
        };
        this.state = {
          currentRound: 1,
          attempts: this.config.initialAttempts,
          isGameActive: false,
          isCardFlipped: false,
          gameState: "initial",
          clickBlocked: false,
          lastActionTime: 0
        };
        this.elements = {};
        this.cards = {
          red: ["/assets/img/card-front-2.webp", "/assets/img/card-front-4.webp"],
          black: ["/assets/img/card-front-1.webp", "/assets/img/card-front-3.webp"]
        };
        this.gameContent = {
          "round1_after_button": {
            text1: "Не засмучуйся 😘<br>Спробуй ще раз",
            text2: "КАРТУ У ВІДБІЙ!<br>ХА-хА-ХА",
            buttons: { retreat: true }
          },
          "round1_after_retreat": {
            text1: "Не зупиняйся 💋<br>Давай ще разок",
            text2: "Ну що, <br>В цей раз роздягнеш?",
            backgroundImage: {
              desktop: "/assets/img/bg-round-2.webp",
              mobile: "/assets/img/bg-round-2-mob.webp"
            },
            buttons: { game: true }
          },
          "round2_after_card": {
            text1: "Уууупс...😳<br>Хочу ще 😊",
            text2: "ОГОООО!<br>ПРОДОВЖУЙ, БРО!",
            backgroundImage: {
              desktop: "/assets/img/bg-round-4.webp",
              mobile: "/assets/img/bg-round-4-mob.webp"
            },
            buttons: { retreat: true }
          },
          "round2_after_retreat": {
            text1: "В мене є для тебе<br>Особливий бонус!",
            text2: "Давай ще разок<br>Глянем що за бонус",
            backgroundImage: {
              desktop: "/assets/img/bg-round-5.webp",
              mobile: "/assets/img/bg-round-5-mob.webp"
            },
            buttons: { game: true }
          },
          "round3_after_card": {
            text1: "ВАУ!<br>АЛЕ ЦЕ ЩЕ НЕ ВСЕ 😏",
            text2: "Оце бонус! Забирай!<br>ОГО",
            backgroundImage: {
              desktop: "/assets/img/bg-round-5.webp",
              mobile: "/assets/img/bg-round-5-mob.webp"
            },
            buttons: { bonus: true },
            header: {
              h1: "ТИ ВИГРАВ!",
              h2: "Заслужив на бонус!"
            }
          },
          "bonus_final": {
            text1: "Я вся палаю🔥",
            text2: "Ти красава!<br>Забирай свій бонус",
            backgroundImage: {
              desktop: "/assets/img/bg-round-4.webp",
              mobile: "/assets/img/bg-round-4-mob.webp"
            },
            buttons: { final: true },
            showPrizeText: true,
            hideCards: true,
            addDataGotoForm: true
          }
        };
        this.init();
      }
      init() {
        try {
          this.findElements();
          this.bindEvents();
          this.clearRetreats();
          this.createCard();
          this.setupAnimationClasses();
          this.startGame();
        } catch (e) {
          console.warn("CardGame initialization failed:", e);
        }
      }
      findElements() {
        const selectors = {
          buttonRed: ".button-red",
          buttonBlack: ".button-black",
          buttonAtTheEdge: ".button-at-the-edge",
          buttonGotoBonus: ".button-goto-bonus",
          buttonGotoForm: ".button-goto-form",
          gameOverlay: ".gameoverlay",
          pageGameBg: ".page-game__bg picture",
          pageGameText: ".page-game__text",
          pageGameCards: ".page-game__cards",
          retreat1: ".retreat-1",
          retreat2: ".retreat-2",
          retreat3: ".retreat-3",
          headerH1: ".page-game__header h1",
          headerH2: ".page-game__header h2"
        };
        Object.entries(selectors).forEach(([key, selector]) => {
          this.elements[key] = document.querySelector(selector);
        });
      }
      bindEvents() {
        const eventMap = [
          [this.elements.buttonRed, () => this.handleButtonClick("red")],
          [this.elements.buttonBlack, () => this.handleButtonClick("black")],
          [this.elements.buttonAtTheEdge, () => this.handleRetreatClick()],
          [this.elements.buttonGotoBonus, () => this.handleBonusClick()],
          [this.elements.buttonGotoForm, () => this.handleFinalClick()]
        ];
        eventMap.forEach(([element, handler]) => {
          if (element) {
            element.addEventListener("click", (e) => {
              e.preventDefault();
              if (this.isClickBlocked()) {
                return;
              }
              handler();
            });
          }
        });
      }
      // Упрощенная система блокировки кликов
      isClickBlocked() {
        const now = Date.now();
        const timeSinceLastAction = now - this.state.lastActionTime;
        return this.state.clickBlocked || timeSinceLastAction < this.config.clickCooldown;
      }
      blockClicks(duration = this.config.clickCooldown) {
        this.state.clickBlocked = true;
        this.state.lastActionTime = Date.now();
        this.setButtonsInteractivity(false);
        setTimeout(() => {
          this.state.clickBlocked = false;
          this.setButtonsInteractivity(true);
        }, duration);
      }
      setButtonsInteractivity(enabled) {
        const buttons = [
          this.elements.buttonRed,
          this.elements.buttonBlack,
          this.elements.buttonAtTheEdge,
          this.elements.buttonGotoBonus,
          this.elements.buttonGotoForm
        ].filter(Boolean);
        buttons.forEach((button) => {
          button.style.pointerEvents = enabled ? "" : "none";
          button.style.opacity = enabled ? "" : "0.6";
        });
      }
      clearRetreats() {
        [1, 2, 3].forEach((i) => {
          const retreat = this.elements[`retreat${i}`];
          if (retreat) retreat.innerHTML = "";
        });
      }
      createCard() {
        const container = this.elements.pageGameCards;
        if (!container) return;
        const existingCard = container.querySelector(".page-game__card, .card");
        if (existingCard) existingCard.remove();
        const card = document.createElement("div");
        card.className = "page-game__card card";
        card.innerHTML = `
      <div class="card-back">
        <img src="/assets/img/card-back.webp" alt="Card Back">
      </div>
      <div class="card-front">
        <img src="/assets/img/card-front-1.webp" alt="Card Front">
      </div>
    `;
        card.style.cssText = `
      opacity: 0;
      transform: scale(0.6) translateY(50px);
      transition: all 800ms ${AnimationUtils.EASING};
    `;
        container.appendChild(card);
        this.updateCardRefs(card);
        this.state.isCardFlipped = false;
        requestAnimationFrame(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1) translateY(0)";
        });
      }
      updateCardRefs(card) {
        var _a, _b;
        this.elements.card = card;
        this.elements.cardBack = card.querySelector(".card-back");
        this.elements.cardFront = card.querySelector(".card-front");
        this.elements.cardBackImg = (_a = this.elements.cardBack) == null ? void 0 : _a.querySelector("img");
        this.elements.cardFrontImg = (_b = this.elements.cardFront) == null ? void 0 : _b.querySelector("img");
      }
      setupAnimationClasses() {
        const style = document.createElement("style");
        style.textContent = `
      .game-button {
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateY(40px) scale(0.7) !important;
        transition: all 1000ms ${AnimationUtils.EASING} !important;
        pointer-events: none !important;
      }
      .game-button--visible {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateY(0) scale(1) !important;
        pointer-events: auto !important;
      }
      .game-cards {
        transition: all 1000ms ${AnimationUtils.EASING} !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      .game-cards--hidden {
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateX(-50%) scale(0.6) !important;
        pointer-events: none !important;
      }
      .game-text {
        opacity: 0 !important;
        visibility: hidden !important;
        transform: translateX(-50%) translateY(50px) scale(0.7) !important;
        transition: all 1000ms ${AnimationUtils.EASING} !important;
      }
      .game-text--visible {
        opacity: 1 !important;
        visibility: visible !important;
        transform: translateX(-50%) translateY(0) scale(1) !important;
      }
    `;
        document.head.appendChild(style);
        this.initializeGameClasses();
      }
      initializeGameClasses() {
        const gameButtons = [
          this.elements.buttonRed,
          this.elements.buttonBlack,
          this.elements.buttonAtTheEdge,
          this.elements.buttonGotoBonus,
          this.elements.buttonGotoForm
        ].filter(Boolean);
        gameButtons.forEach((button) => {
          button.classList.add("game-button");
          button.classList.remove("game-button--visible", "show");
        });
        if (this.elements.pageGameCards) {
          this.elements.pageGameCards.classList.add("game-cards");
          this.elements.pageGameCards.classList.remove("game-cards--hidden");
        }
        if (this.elements.pageGameText) {
          this.elements.pageGameText.classList.add("game-text");
          this.elements.pageGameText.classList.remove("game-text--visible");
        }
      }
      // Центральный метод применения контента
      applyContent(stateKey) {
        const content = this.gameContent[stateKey];
        if (!content) return;
        console.log(`🎨 Applying content: ${stateKey}`);
        this.updateClouds(content);
        if (content.backgroundImage) {
          this.updateBackground(content.backgroundImage);
        }
        this.updateHeader(content);
        this.manageElements(content);
        if (content.addDataGotoForm) {
          document.documentElement.setAttribute("data-goto-form", "");
        }
      }
      updateClouds(content) {
        const cloudLeft = document.querySelector(".cloud-left p");
        const cloudRight = document.querySelector(".cloud-right p");
        if (cloudLeft && content.text1) {
          AnimationUtils.animateCloud(cloudLeft, content.text1);
        }
        if (cloudRight && content.text2) {
          AnimationUtils.animateCloud(cloudRight, content.text2);
        }
      }
      updateBackground(imageSrc) {
        const imageInfo = typeof imageSrc === "string" ? imageSrc : `${imageSrc.desktop} / ${imageSrc.mobile}`;
        console.log(`🖼️ Updating background to: ${imageInfo}`);
        if (this.elements.pageGameBg) {
          AnimationUtils.animateBackground(this.elements.pageGameBg, imageSrc, () => {
            console.log(`✅ Background updated to: ${imageInfo}`);
          });
        }
      }
      updateHeader(content) {
        var _a, _b;
        if (((_a = content.header) == null ? void 0 : _a.h1) && this.elements.headerH1) {
          this.elements.headerH1.innerHTML = content.header.h1;
        }
        if (((_b = content.header) == null ? void 0 : _b.h2) && this.elements.headerH2) {
          this.elements.headerH2.innerHTML = content.header.h2;
        }
      }
      // Упрощенное управление элементами
      manageElements(content) {
        const buttonMap = {
          game: [this.elements.buttonRed, this.elements.buttonBlack],
          retreat: [this.elements.buttonAtTheEdge],
          bonus: [this.elements.buttonGotoBonus],
          final: [this.elements.buttonGotoForm]
        };
        Object.values(buttonMap).flat().forEach((button) => {
          if (button) this.animateButton(button, false);
        });
        Object.entries(content.buttons || {}).forEach(([type, show]) => {
          if (show && buttonMap[type]) {
            buttonMap[type].forEach((button, index) => {
              if (button) {
                setTimeout(() => this.animateButton(button, true), index * 400);
              }
            });
          }
        });
        if (content.showPrizeText) {
          this.showPrizeText();
        } else {
          this.hidePrizeText();
        }
        if (content.hideCards) {
          this.hideCards();
        } else {
          this.showCards();
        }
      }
      animateButton(element, show) {
        if (!element) return;
        if (show) {
          element.classList.add("game-button--visible", "show");
          element.disabled = false;
        } else {
          element.classList.remove("game-button--visible", "show");
          element.disabled = true;
        }
      }
      showPrizeText() {
        if (!this.elements.pageGameText) return;
        this.elements.pageGameText.style.display = "block";
        requestAnimationFrame(() => {
          this.elements.pageGameText.classList.add("game-text--visible");
        });
      }
      hidePrizeText() {
        if (!this.elements.pageGameText) return;
        this.elements.pageGameText.classList.remove("game-text--visible");
        setTimeout(() => {
          this.elements.pageGameText.style.display = "none";
        }, 800);
      }
      showCards() {
        if (!this.elements.pageGameCards) return;
        this.elements.pageGameCards.style.display = "flex";
        this.elements.pageGameCards.classList.remove("game-cards--hidden");
      }
      hideCards() {
        if (!this.elements.pageGameCards) return;
        this.elements.pageGameCards.classList.add("game-cards--hidden");
        setTimeout(() => {
          this.elements.pageGameCards.style.display = "none";
        }, 800);
      }
      // Упрощенные методы получения карт
      getRandomCard(color) {
        const cards = this.cards[color];
        return cards[Math.floor(Math.random() * cards.length)];
      }
      getOppositeCard(color) {
        const oppositeColor = color === "red" ? "black" : "red";
        return this.getRandomCard(oppositeColor);
      }
      flipCard(callback) {
        if (this.elements.card && !this.state.isCardFlipped) {
          this.elements.card.classList.add("flipped");
          this.state.isCardFlipped = true;
          if (callback) setTimeout(callback, this.config.flipDuration);
        } else {
          callback == null ? void 0 : callback();
        }
      }
      // Основные обработчики событий
      handleButtonClick(color) {
        if (!this.state.isGameActive) return;
        console.log(`🎲 Button clicked: ${color}, Round: ${this.state.currentRound}`);
        this.blockClicks();
        this.hideGameButtons();
        this.state.isGameActive = false;
        const isWin = this.state.currentRound !== 1;
        const resultCard = isWin ? this.getRandomCard(color) : this.getOppositeCard(color);
        if (this.elements.cardFrontImg) {
          this.elements.cardFrontImg.src = resultCard;
        }
        this.flipCard(() => {
          this.processRoundResult(isWin);
        });
      }
      hideGameButtons() {
        this.animateButton(this.elements.buttonRed, false);
        this.animateButton(this.elements.buttonBlack, false);
      }
      processRoundResult(isWin) {
        const stateMap = {
          "initial": "round1_after_button",
          "round1_after_retreat_clicked": "round2_after_card",
          "round2_after_retreat_clicked": "round3_after_card"
        };
        const contentKey = stateMap[this.state.gameState];
        if (contentKey) {
          this.applyContent(contentKey);
          this.updateGameState(contentKey);
        }
        if (!isWin) {
          this.handleLoss();
        }
      }
      updateGameState(contentKey) {
        const stateMapping = {
          "round1_after_button": "round1_card_selected",
          "round2_after_card": "round2_card_selected",
          "round3_after_card": "round3_card_selected"
        };
        this.state.gameState = stateMapping[contentKey] || this.state.gameState;
      }
      handleLoss() {
        this.state.attempts--;
        this.updateAttempts();
        this.showOverlay();
        setTimeout(() => this.hideOverlay(), 1e3);
        if (this.state.attempts <= 0) {
          this.gameOver(false);
        }
      }
      handleRetreatClick() {
        console.log("🎯 Retreat clicked");
        this.blockClicks();
        this.animateButton(this.elements.buttonAtTheEdge, false);
        this.moveToRetreat();
        this.processRetreat();
      }
      processRetreat() {
        const retreatActions = {
          "round1_card_selected": () => {
            this.applyContent("round1_after_retreat");
            this.state.gameState = "round1_after_retreat_clicked";
            this.state.currentRound = 2;
            this.prepareNextRound();
          },
          "round2_card_selected": () => {
            this.applyContent("round2_after_retreat");
            this.state.gameState = "round2_after_retreat_clicked";
            this.state.currentRound = 3;
            this.prepareNextRound();
          }
        };
        const action = retreatActions[this.state.gameState];
        if (action) action();
      }
      prepareNextRound() {
        this.blockClicks(3e3);
        setTimeout(() => {
          this.createCard();
          this.showCards();
          setTimeout(() => {
            this.animateButton(this.elements.buttonRed, true);
            setTimeout(() => {
              this.animateButton(this.elements.buttonBlack, true);
              this.state.isGameActive = true;
            }, 400);
          }, 700);
        }, 1800);
      }
      handleBonusClick() {
        console.log("🎁 Bonus clicked");
        if (this.state.gameState === "round3_card_selected") {
          this.animateButton(this.elements.buttonGotoBonus, false);
          this.blockClicks(3e3);
          this.moveToRetreat();
          setTimeout(() => {
            this.applyContent("bonus_final");
            this.state.gameState = "bonus_final";
            this.state.isGameActive = false;
          }, 1500);
        }
      }
      handleFinalClick() {
        console.log("Final button clicked - redirecting to form");
        const popup = document.querySelector(".popup");
        if (popup) {
          popup.classList.add("popup_show");
        }
        const html = document.documentElement;
        html.classList.add("popup-show");
      }
      // Оптимизированная анимация перемещения карточки
      moveToRetreat() {
        if (!this.elements.card || !this.elements.cardFrontImg) return;
        const retreat = this.findEmptyRetreat();
        if (!retreat) return;
        const cardSrc = this.elements.cardFrontImg.src;
        this.animateCardToRetreat(retreat, cardSrc);
      }
      findEmptyRetreat() {
        for (let i = 1; i <= 3; i++) {
          const retreat = this.elements[`retreat${i}`];
          if (retreat && retreat.children.length === 0) {
            return retreat;
          }
        }
        return null;
      }
      animateCardToRetreat(retreat, cardSrc) {
        const cardRect = this.elements.card.getBoundingClientRect();
        const retreatRect = retreat.getBoundingClientRect();
        const deltaX = retreatRect.left + retreatRect.width / 2 - (cardRect.left + cardRect.width / 2);
        const deltaY = retreatRect.top + retreatRect.height / 2 - (cardRect.top + cardRect.height / 2);
        const scaleX = retreatRect.width / cardRect.width;
        const scaleY = retreatRect.height / cardRect.height;
        const scale = Math.min(scaleX, scaleY) * 0.95;
        this.elements.card.style.transition = `all ${AnimationUtils.TIMING.card}ms ${AnimationUtils.EASING}`;
        this.elements.card.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
        this.elements.card.style.zIndex = "1000";
        this.elements.card.style.boxShadow = "none";
        setTimeout(() => {
          if (this.elements.cardBack) {
            this.elements.cardBack.style.transition = "opacity 600ms ease-out";
            this.elements.cardBack.style.opacity = "0";
          }
        }, 750);
        setTimeout(() => {
          this.createRetreatCard(retreat, cardSrc);
          this.removeAnimatedCard();
        }, AnimationUtils.TIMING.card);
      }
      createRetreatCard(retreat, cardSrc) {
        const img = document.createElement("img");
        img.src = cardSrc;
        img.alt = "Card in retreat";
        img.className = "retreat-card";
        img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    `;
        retreat.appendChild(img);
      }
      removeAnimatedCard() {
        var _a;
        if ((_a = this.elements.card) == null ? void 0 : _a.parentNode) {
          this.elements.card.parentNode.removeChild(this.elements.card);
        }
      }
      updateAttempts() {
        const attemptsSelectors = [
          ".attempts",
          ".attempt",
          ".попытки",
          ".tries",
          "[data-attempts]",
          ".cloud-right .attempts",
          ".cloud-left .attempts",
          "span.attempts",
          ".page-game__header .attempts"
        ];
        attemptsSelectors.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((el) => {
            el.textContent = this.state.attempts;
          });
        });
        const cloudRightP = document.querySelector(".cloud-right p");
        if (cloudRightP) {
          const attemptsSpan = cloudRightP.querySelector(".attempts");
          if (attemptsSpan) {
            attemptsSpan.textContent = this.state.attempts;
          }
        }
      }
      showOverlay() {
        if (this.elements.gameOverlay) {
          this.elements.gameOverlay.classList.add("show");
        }
      }
      hideOverlay() {
        if (this.elements.gameOverlay) {
          this.elements.gameOverlay.classList.remove("show");
        }
      }
      startGame() {
        this.state.gameState = "initial";
        this.state.clickBlocked = false;
        this.state.lastActionTime = 0;
        this.setButtonsInteractivity(true);
        const cloudLeft = document.querySelector(".cloud-left p");
        const cloudRight = document.querySelector(".cloud-right p");
        if (cloudLeft) {
          cloudLeft.innerHTML = "ВГАДАЙ КАРТУ <br> І <span class='text'>РОЗДЯГНИ</span> МЕНЕ";
        }
        if (cloudRight) {
          cloudRight.innerHTML = "Вона не жартує!<br>В тебе <strong>3 спроби</strong>";
        }
        if (this.elements.pageGameBg) {
          const source = this.elements.pageGameBg.querySelector("source");
          const img = this.elements.pageGameBg.querySelector("img");
          if (source) {
            source.srcset = "/assets/img/bg-round-1.webp";
          }
          if (img) {
            img.src = "/assets/img/bg-round-1-mob.webp";
          }
        }
        this.initializeElements();
        this.updateAttempts();
        this.state.isGameActive = true;
      }
      initializeElements() {
        if (this.elements.pageGameText) {
          this.elements.pageGameText.style.display = "none";
        }
        if (this.elements.pageGameCards) {
          this.elements.pageGameCards.style.display = "flex";
          this.elements.pageGameCards.classList.remove("game-cards--hidden");
        }
        setTimeout(() => {
          this.animateButton(this.elements.buttonRed, true);
        }, 1200);
        setTimeout(() => {
          this.animateButton(this.elements.buttonBlack, true);
        }, 1600);
      }
      gameOver(victory) {
        this.state.isGameActive = false;
        console.log(`Game over. Victory: ${victory}`);
      }
      restart() {
        this.state = {
          currentRound: 1,
          attempts: this.config.initialAttempts,
          isGameActive: false,
          isCardFlipped: false,
          gameState: "initial",
          clickBlocked: false,
          lastActionTime: 0
        };
        this.setButtonsInteractivity(true);
        this.clearRetreats();
        this.createCard();
        this.updateAttempts();
        this.hideOverlay();
        this.startGame();
      }
      getGameState() {
        return {
          ...this.state,
          maxRounds: this.config.maxRounds
        };
      }
    }
    document.addEventListener("DOMContentLoaded", () => {
      try {
        MarqueeModule.init();
        QueryParamsModule.init();
        window.cardGame = new CardGame();
      } catch (e) {
        console.warn("Initialization failed:", e);
      }
    });
    if (typeof module !== "undefined" && module.exports) {
      module.exports = { CardGame, AnimationUtils, MarqueeModule, QueryParamsModule };
    }
  }
});
export default require_index_min();
