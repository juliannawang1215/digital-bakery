import { BakeryGallery } from './bakery.js';
import { bakeryItems } from './bakery-items.js';

const root = document.getElementById('bakery-root');
if (root) {
  BakeryGallery.mount(root, {
    items: bakeryItems,
    subtitle:
      'Things I bake and make. Click any item to view it in 3D — drag to rotate, scroll to zoom.',
  });
}
