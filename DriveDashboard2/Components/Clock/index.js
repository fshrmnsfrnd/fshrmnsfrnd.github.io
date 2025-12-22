import { createCard, startTicker } from '../../componentsUtil.js';

function clockWidget() {
  const card = createCard('Uhr');
  const update = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    card.setValue(`${hh}:${mm}:${ss}`);
  };
  update();
  const stop = startTicker(update, 1000);
  return { node: card.el, unmount: () => stop && stop() };
}

export const widgets = {
  'opt-clock': () => clockWidget(),
};
