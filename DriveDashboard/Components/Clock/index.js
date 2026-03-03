import { startTicker } from '../../componentsUtil.js';
import { ValueCard } from '../../card.js';

function clockWidget() {
    const card = new ValueCard('Uhr', '');
    const update = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        card.setValue(`${hh}:${mm}:${ss}`);
    };
    update();
    const stop = startTicker(update, 1000);
    return { node: card.cardElement, unmount: () => stop && stop() };
}

export const widgets = {
    'opt-clock': () => clockWidget(),
};