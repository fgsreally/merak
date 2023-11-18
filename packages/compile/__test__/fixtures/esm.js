import c from 'c'

/** @merak */document.addEventListener('click', c);
(Math.random() > 0.5 ? /** @merak */document : /** @merak */document.body).addEventListener('click', c)
__HMR__.run()

window.onload = async () => {
  document.addEventListener('click', c)
}
