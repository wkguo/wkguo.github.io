// Navbar burger toggle (the rest of the original Nerfies index.js was unused on this page).
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.navbar-burger').forEach(function (burger) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      document.querySelectorAll('.navbar-menu').forEach(function (menu) { menu.classList.toggle('is-active'); });
    });
  });
});
