/* ==========================================================================
   Toy Haven — Site Data
   Products, categories and hero slides live here. Every page loads this file
   before main.js. Image files follow the naming pattern  what_where.jpg
   (e.g. toy-car_store.jpg = a toy car shown in the store, _home = homepage).
   ========================================================================== */

const IMG_STORE = "assets/images/store/";
const IMG_HOME = "assets/images/home/";

const TOY_HAVEN_PRODUCTS = [
  {
    id: "fig-001",
    name: "Caped Hero Action Figure",
    variant: "Fully Articulated",
    category: "Figurines",
    price: 189.00,
    image: IMG_STORE + "action-figure-2_store.jpg",
    imagePosition: "center 20%",
    badge: "Bestseller",
    description: "A poseable hero figure with a fabric cape and detailed paint work."
  },
  {
    id: "fig-002",
    name: "Web Warrior Action Figure",
    variant: "6-inch Poseable",
    category: "Figurines",
    price: 149.00,
    image: IMG_STORE + "action-figure_store.jpg",
    imagePosition: "center 20%",
    badge: "New",
    description: "A sleek poseable figure in a red-and-black suit with multiple hand pieces."
  },
  {
    id: "toy-001",
    name: "Classic Wooden Play Set",
    variant: "Blocks & Train Bundle",
    category: "Toys",
    price: 48.00,
    image: IMG_HOME + "toys_home-banner-1.jpg",
    imagePosition: "center",
    badge: "Bestseller",
    description: "Colourful blocks, trains and playthings in one big bundle."
  },
  {
    id: "toy-002",
    name: "Mini Surprise Figure Collection",
    variant: "Shopping Cart Set",
    category: "Toys",
    price: 35.00,
    image: IMG_HOME + "toys_home-banner-2.jpg",
    imagePosition: "center",
    badge: "Gift Pick",
    description: "A shopping cart packed with tiny collectible surprise figures."
  },
  {
    id: "bg-001",
    name: "Classic Property Trading Game",
    variant: "Family Edition",
    category: "Board Games",
    price: 55.00,
    image: IMG_STORE + "board-games_store.jpg",
    imagePosition: "center",
    badge: "Bestseller",
    description: "The all-time family favourite: buy, trade and bargain your way to the top."
  },
  {
    id: "bg-002",
    name: "Four-Colour Race Board Set",
    variant: "2\u20134 Players",
    category: "Board Games",
    price: 29.00,
    image: IMG_STORE + "board-games-2_store.jpg",
    imagePosition: "center",
    badge: "",
    description: "A colourful race-to-home board game with dice and playing pawns."
  },
  {
    id: "bg-003",
    name: "Handcrafted Chess Set",
    variant: "Folding Wooden Board",
    category: "Board Games",
    price: 65.00,
    image: IMG_STORE + "chess-pieces-2_store.jpg",
    imagePosition: "center 60%",
    badge: "New",
    description: "A folding chess board with weighted pieces, made for long games."
  },
  {
    id: "dc-001",
    name: "Crimson Supercar Diecast",
    variant: "1:43 Scale",
    category: "Diecast Cars",
    price: 98.00,
    image: IMG_STORE + "toy-car_store.jpg",
    imagePosition: "center",
    badge: "Vault Certified",
    description: "A low-slung red supercar cast in metal with fine paint detail."
  },
  {
    id: "dc-002",
    name: "Midnight Roadster Diecast",
    variant: "1:24 Scale",
    category: "Diecast Cars",
    price: 120.00,
    image: IMG_STORE + "toy-car-3_store.jpg",
    imagePosition: "center",
    badge: "Limited",
    description: "A classic open-top roadster in gloss black with a tan interior."
  },
  {
    id: "dc-003",
    name: "Classic Red Bug Diecast",
    variant: "1:32 Scale",
    category: "Diecast Cars",
    price: 42.00,
    image: IMG_STORE + "toy-car-4_store.jpg",
    imagePosition: "center",
    badge: "",
    description: "A cheerful red retro compact with rolling wheels."
  },
  {
    id: "dc-004",
    name: "Vintage Racer Diecast",
    variant: "1:32 Vintage Series",
    category: "Diecast Cars",
    price: 79.00,
    image: IMG_STORE + "toy-car-5_store.jpg",
    imagePosition: "center",
    badge: "New",
    description: "A green vintage open-cockpit racer modelled on early motor sport."
  },
  {
    id: "dc-005",
    name: "Super Chrome Custom Van",
    variant: "Collector Series",
    category: "Diecast Cars",
    price: 25.00,
    image: IMG_STORE + "toy-car-6_store.jpg",
    imagePosition: "center",
    badge: "",
    description: "A gold chrome custom van with racing graphics."
  }
];

/* Category metadata: colour-coding plus the homepage tile photo */
const TOY_HAVEN_CATEGORIES = {
  "Figurines": { key: "figurines", color: "var(--cat-figurines)", tileImage: IMG_HOME + "action-figure_home.jpg" },
  "Toys": { key: "toys", color: "var(--cat-toys)", tileImage: IMG_HOME + "toys_home-banner-1.jpg" },
  "Board Games": { key: "board-games", color: "var(--cat-boardgames)", tileImage: IMG_HOME + "board-games_home.jpg" },
  "Diecast Cars": { key: "diecast", color: "var(--cat-diecast)", tileImage: IMG_HOME + "toy-car_home.jpg" }
};

/* Homepage auto-rotating banners */
const TOY_HAVEN_HERO_SLIDES = [
  { eyebrow: "Toy Box Drop", title: "Toys built for shelf and play alike", copy: "Blocks, trains and playthings for collectors who still like to play.", cta: "Shop Toys", category: "Toys", image: IMG_HOME + "toys_home-banner-1.jpg", position: "center" },
  { eyebrow: "Seasonal Spotlight", title: "Action figures with real presence", copy: "Poseable, hand-painted figures ready to display or to play with.", cta: "Shop Figurines", category: "Figurines", image: IMG_HOME + "action-figure_home.jpg", position: "center 30%" },
  { eyebrow: "Game Night", title: "Board games worth clearing the table for", copy: "Classics and colourful favourites picked for replay value.", cta: "Shop Board Games", category: "Board Games", image: IMG_HOME + "board-games_home.jpg", position: "center" },
  { eyebrow: "Diecast Garage", title: "Diecast cars cast in real metal", copy: "Vintage roadsters to modern supercars, with paint that hides no seams.", cta: "Shop Diecast Cars", category: "Diecast Cars", image: IMG_HOME + "toy-car_home.jpg", position: "center" },
  { eyebrow: "Classic Strategy", title: "Chess sets for the long game", copy: "Wooden boards and weighted pieces for players of every level.", cta: "Shop Board Games", category: "Board Games", image: IMG_HOME + "chess-pieces_home.jpg", position: "center" },
  { eyebrow: "Gift Picks", title: "Little surprises for every gift list", copy: "Mini collectibles and playsets that make easy, happy presents.", cta: "Shop Toys", category: "Toys", image: IMG_HOME + "toys_home-banner-2.jpg", position: "center" }
];
