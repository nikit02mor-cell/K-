/* Реклама Google AdSense для веб-версии SvinCompany.
 *
 * Как включить:
 *   1. Зарегистрируйте сайт в https://adsense.google.com (нужен свой домен, github.io обычно не одобряют).
 *   2. Создайте рекламный блок «Адаптивный» и скопируйте два значения.
 *   3. Впишите их ниже. Пока поля пустые, реклама не загружается и место под неё скрыто.
 * В Android-приложении этот скрипт ничего не делает: там показывается баннер AdMob (см. README).
 */
(function () {
  var ADS = {
    client: "",   // например "ca-pub-1234567890123456"
    slot: ""      // например "1234567890"
  };

  var box = document.getElementById("adSlot");
  if (!box) return;
  var inApp = /SvinApp/.test(navigator.userAgent || "");
  var web = /^https?:$/.test(location.protocol);
  if (!ADS.client || !ADS.slot || inApp || !web) { box.parentNode.removeChild(box); return; }

  var st = document.createElement("style");
  st.textContent = "#adSlot{margin:16px 0 0;min-height:90px;text-align:center;overflow:hidden}" +
    "#adSlot small{display:block;font-size:11px;opacity:.6;margin-bottom:4px}";
  document.head.appendChild(st);

  box.innerHTML = '<small>Реклама</small>' +
    '<ins class="adsbygoogle" style="display:block" data-ad-client="' + ADS.client +
    '" data-ad-slot="' + ADS.slot + '" data-ad-format="auto" data-full-width-responsive="true"></ins>';

  var s = document.createElement("script");
  s.async = true;
  s.crossOrigin = "anonymous";
  s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(ADS.client);
  s.onload = function () { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} };
  document.head.appendChild(s);
})();
