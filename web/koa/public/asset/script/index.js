const $waiting = document.querySelector('.form .waiting');

function startWaiting() {
  $waiting.classList.remove('stop');
}

function stopWaiting() {
  $waiting.classList.add('stop');
}

const $input = document.querySelector('.form input.text');

let timer = null;
$input.addEventListener('input', () => {
  startWaiting();

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  timer = setTimeout(async () => {
    const resp = await fetch(`/api/question?q=${$input.value}`);
    stopWaiting();
  }, 500);
});
