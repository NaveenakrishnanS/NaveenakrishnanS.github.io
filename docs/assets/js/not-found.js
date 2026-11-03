// 404 page: "Go back" returns to the previous page, or home if there isn't one
document.querySelector('[data-back]')?.addEventListener('click', () => {
  if (history.length > 1) history.back();
  else location.assign('index.html');
});
