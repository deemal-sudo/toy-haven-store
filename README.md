# Toy Haven

A multi-page front-end website for a collectibles store (figurines, toys, board games, diecast cars), built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Folder structure

```
toy-haven/
├── index.html          Home page (hero slider, featured products, categories)
├── products.html       Shop page (filters, search, pagination)
├── cart.html           Shopping cart
├── checkout.html       Checkout form + order confirmation
├── wishlist.html       Wishlist / collection tracker
├── support.html        Feedback form + FAQ accordion
├── manifest.json       PWA manifest
├── sw.js               Service worker (offline caching)
├── css/
│   └── style.css       All styling, mobile-first with media queries
├── js/
│   ├── data.js         Products, categories, hero slides (all image paths)
│   └── main.js         Shared logic: header/footer, cart, wishlist, forms
└── assets/
    ├── icon.svg
    ├── favicon.svg
    └── images/
        ├── home/       Homepage photos (name_home.jpg): hero banners + category tiles
        └── store/      Product photos (name_store.jpg): shop, cart, wishlist
```

## Running it

Open through a local server rather than double-clicking the file (the service worker needs http):

- **VS Code**: install "Live Server", right-click `index.html`, then **Open with Live Server**.
- **Or** in a terminal in this folder: `python3 -m http.server 5500`, then visit `http://localhost:5500`.

## Notes

- Photos follow the pattern `what_where.jpg` (e.g. `toy-car_store.jpg`). To swap a photo, replace the file or edit its path in `js/data.js`.
- All data (cart, wishlist, newsletter emails, orders, feedback) is stored in `localStorage`.
- Google Fonts (Baloo 2, Work Sans) load from fonts.googleapis.com; everything else is self-contained.
