(function () {
  var base = document.querySelector('script[data-layout-base]');
  var basePath = base ? base.getAttribute('data-layout-base') : '';
  if (!basePath) {
    var s = document.currentScript;
    basePath = s ? s.src.replace(/\/[^/]+$/, '/') : '';
  }
  if (!basePath && window.location.href.indexOf('file:') === 0) {
    basePath = window.location.href.replace(/\/[^/]*$/, '/');
  }
  function path(p) {
    if (basePath) return basePath + p;
    var href = window.location.href;
    return href.replace(/\/[^/]*$/, '/') + p;
  }
  function load(id, file) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(path(file))
      .then(function (r) { return r.text(); })
      .then(function (html) {
        el.innerHTML = html;
        if (id === 'header-wrap') {
          var menuToggle = el.querySelector('.menu-toggle');
          var overlay = el.querySelector('.nav-overlay');
          var header = el.querySelector('.header');
          if (menuToggle && overlay) {
            menuToggle.addEventListener('click', function () {
              header && header.classList.toggle('nav-open');
              document.body.style.overflow = header && header.classList.contains('nav-open') ? 'hidden' : '';
            });
            overlay.addEventListener('click', function () {
              header && header.classList.remove('nav-open');
              document.body.style.overflow = '';
            });
          }
          try {
            var user = JSON.parse(sessionStorage.getItem('shillastay_user') || 'null');
            var loginEl = el.querySelector('#headerLogin');
            var regEl = el.querySelector('#headerRegister');
            var userEl = el.querySelector('#headerUser');
            if (user && user.email && userEl) {
              if (loginEl) loginEl.style.display = 'none';
              if (regEl) regEl.style.display = 'none';
              userEl.style.display = '';
              userEl.textContent = user.name || user.email;
              userEl.innerHTML = '<a href="mypage.html">' + (user.name || user.email) + '</a> <button type="button" id="headerLogout">로그아웃</button>';
              var logoutBtn = userEl.querySelector('#headerLogout');
              if (logoutBtn) logoutBtn.addEventListener('click', function () {
                sessionStorage.removeItem('shillastay_user');
                window.location.reload();
              });
            }
          } catch (e) {}
        }
      })
      .catch(function () {});
  }
  load('header-wrap', 'include/header.html');
  load('footer-wrap', 'include/footer.html');
})();
