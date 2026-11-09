/* My Raipur: small, dependency-free helpers. */
(function () {
  'use strict';
  var d = document;

  // Today's date and a greeting, in Raipur time.
  try {
    var now = new Date();
    var dateEl = d.querySelector('[data-today]');
    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('en-IN', {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Asia/Kolkata'
      }).format(now);
    }
    var greet = d.querySelector('[data-greeting]');
    if (greet) {
      var h = parseInt(new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, timeZone: 'Asia/Kolkata' }).format(now), 10);
      greet.textContent = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    }
  } catch (e) { /* keep the static text */ }

  // Filter chips: <div class="chips" data-filter="#list" data-key="area"> filters [data-item][data-area].
  function apply(list) {
    var f = list.__f || {};
    var any = false;
    list.querySelectorAll('[data-item]').forEach(function (it) {
      var ok = true;
      for (var k in f) {
        if (f[k] !== '*' && (it.dataset[k] || '').split('|').indexOf(f[k]) < 0) ok = false;
      }
      it.hidden = !ok;
      if (ok) any = true;
    });
    var none = list.querySelector('[data-none]');
    if (none) none.hidden = any;
  }
  d.querySelectorAll('[data-filter]').forEach(function (bar) {
    var list = d.querySelector(bar.getAttribute('data-filter'));
    if (!list) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b) return;
      bar.querySelectorAll('.chip').forEach(function (c) {
        c.classList.toggle('is-on', c === b);
        c.setAttribute('aria-pressed', c === b ? 'true' : 'false');
      });
      list.__f = list.__f || {};
      list.__f[bar.getAttribute('data-key')] = b.getAttribute('data-v');
      apply(list);
    });
  });

  // Search page.
  var q = d.getElementById('q');
  var results = d.getElementById('results');
  if (q && results) {
    var index = null;
    var render = function () {
      var terms = q.value.toLowerCase().split(/\s+/).filter(Boolean);
      results.textContent = '';
      if (!terms.length) return;
      var scored = [];
      index.forEach(function (it) {
        var hay = (it.t + ' ' + it.c + ' ' + it.d).toLowerCase();
        var title = it.t.toLowerCase();
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (hay.indexOf(terms[i]) < 0) return;
          score += title.indexOf(terms[i]) > -1 ? 3 : 1;
        }
        scored.push({ it: it, s: score });
      });
      scored.sort(function (a, b) { return b.s - a.s; });
      if (!scored.length) {
        var p = d.createElement('p');
        p.className = 'muted';
        p.textContent = 'Nothing found yet. Try a shorter word, or browse the menu.';
        results.appendChild(p);
        return;
      }
      scored.slice(0, 30).forEach(function (r) {
        var a = d.createElement('a');
        a.className = 'result';
        a.href = r.it.u;
        var s = d.createElement('strong');
        s.textContent = r.it.t;
        var m = d.createElement('span');
        m.textContent = r.it.c;
        a.appendChild(s);
        a.appendChild(m);
        results.appendChild(a);
      });
    };
    var start = new URLSearchParams(location.search).get('q');
    if (start) q.value = start;
    fetch('/search-index.json')
      .then(function (r) { return r.json(); })
      .then(function (j) { index = j; render(); q.addEventListener('input', render); })
      .catch(function () { results.textContent = 'Search could not load. Please try again.'; });
  }

  // "Send us something" form: opens the visitor's email app (or WhatsApp) with the message filled in.
  var form = d.querySelector('[data-submit-form]');
  if (form) {
    var type = new URLSearchParams(location.search).get('type');
    var sel = form.elements.type;
    if (type && sel) {
      var map = { cafes: 'listing', 'street-food': 'listing', shopping: 'listing', doctors: 'listing', hospitals: 'listing', schools: 'listing', colleges: 'listing', training: 'listing', places: 'listing', 'day-trips': 'listing' };
      var want = map[type] || type;
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === want) sel.selectedIndex = i;
    }
    var compose = function () {
      var label = sel.options[sel.selectedIndex].text;
      var body = 'Type: ' + label + '\nName: ' + form.elements.name.value + '\n\n' + form.elements.details.value + '\n\nContact: ' + form.elements.contact.value;
      return { subject: 'My Raipur: ' + label, body: body };
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var m = compose();
      location.href = 'mailto:' + form.getAttribute('data-email') + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
    });
    var wa = form.querySelector('[data-wa-btn]');
    if (wa) {
      wa.addEventListener('click', function () {
        if (!form.reportValidity()) return;
        var m = compose();
        window.open('https://wa.me/' + form.getAttribute('data-wa').replace(/\D/g, '') + '?text=' + encodeURIComponent(m.subject + '\n' + m.body), '_blank', 'noopener');
      });
    }
  }

  // Sticky ad: let visitors close it for the session.
  var sticky = d.querySelector('[data-sticky-ad]');
  if (sticky) {
    try { if (sessionStorage.getItem('adClosed')) { sticky.remove(); d.body.classList.remove('has-sticky'); } } catch (e) {}
    var x = sticky.querySelector('[data-dismiss]');
    if (x) x.addEventListener('click', function () {
      sticky.remove();
      d.body.classList.remove('has-sticky');
      try { sessionStorage.setItem('adClosed', '1'); } catch (e) {}
    });
  }
})();
