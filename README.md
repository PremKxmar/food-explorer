# Food Product Explorer 🥗

A modern, responsive web application for exploring food products using the [Open Food Facts](https://world.openfoodfacts.org/) API. Search, filter, and discover detailed nutrition information for millions of food products worldwide.

## Features

- **🔍 Search by Name** — Real-time debounced search with instant results
- **📊 Barcode Search** — Look up any product by its barcode number
- **🏷️ Category Filter** — Filter products by category (Beverages, Dairy, Snacks, etc.)
- **📈 Sort** — Sort by product name (A-Z / Z-A) or nutrition grade (best/worst first)
- **♾️ Infinite Scroll** — Seamless pagination using Intersection Observer
- **📋 Product Detail Page** — Full nutritional breakdown, ingredients, labels, and allergens
- **🛒 Shopping Cart** — Add/remove products, adjust quantities (persisted to localStorage)
- **🌙 Dark Mode** — System preference detection with manual toggle
- **📱 Responsive Design** — Mobile-first layout that works on all screen sizes

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Build tool & dev server |
| React Router v7 | Client-side routing |
| React Context API | Global state (cart) |
| Tailwind CSS v3 | Utility-first styling with custom design tokens |
| Google Fonts (Outfit + Inter) | Typography |
| Material Symbols | Icons |
| Open Food Facts API | Food product data |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
git clone https://github.com/PremKxmar/food-explorer.git
cd food-explorer
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── main.jsx                  # App entry, routing setup
├── App.jsx                   # Root layout (Navbar + Outlet + Footer)
├── index.css                 # Design system & global styles
│
├── context/
│   └── CartContext.jsx        # Cart state management
│
├── hooks/
│   ├── useProducts.js         # Product fetching, search, pagination
│   ├── useCategories.js       # Category list fetching
│   └── useDebounce.js         # Input debounce utility
│
├── services/
│   └── api.js                 # OpenFoodFacts API service layer
│
├── components/
│   ├── Navbar.jsx             # Sticky header with theme toggle & cart
│   ├── SearchBar.jsx          # Name/Barcode dual-mode search
│   ├── CategoryFilter.jsx     # Category dropdown
│   ├── SortControls.jsx       # Sort options
│   ├── ProductCard.jsx        # Product grid card
│   ├── ProductGrid.jsx        # Grid layout with infinite scroll
│   ├── NutriScore.jsx         # A-E nutrition grade badge
│   ├── CartDrawer.jsx         # Slide-out shopping cart
│   ├── Skeleton.jsx           # Loading skeleton
│   └── Footer.jsx             # Page footer
│
└── pages/
    ├── HomePage.jsx           # Main product listing
    └── ProductPage.jsx        # Product detail view
```

## API Endpoints Used

| Endpoint | Purpose |
|---|---|
| `/cgi/search.pl?search_terms={name}&json=true` | Search products by name |
| `/api/v0/product/{barcode}.json` | Get product by barcode |
| `/category/{category}.json` | Get products by category |
| `/categories.json` | List all categories |

> **Note**: The Open Food Facts API is maintained by a French non-profit. The server may occasionally return 503 errors — the app includes retry logic with exponential backoff to handle this gracefully.

## Method / Approach

1. **Architecture**: Component-based React architecture with clean separation of concerns — API layer (`services/`), state logic (`hooks/`, `context/`), presentation (`components/`, `pages/`)
2. **API Integration**: Centralized API service with retry logic, AbortController for request cancellation, and response normalization
3. **State Management**: React Context API for cart state (persisted to localStorage), custom hooks for product/category data
4. **Infinite Scroll**: Implemented using Intersection Observer API for performant, native scrolling
5. **Design System**: Tailwind CSS with a custom Material 3 color palette, Outfit/Inter typography, and glassmorphism components — designed using Google Stitch
6. **Responsive**: Mobile-first Tailwind Grid layout that adapts from 1 column (mobile) to 4 columns (desktop)



## License

This project uses data from [Open Food Facts](https://world.openfoodfacts.org/), available under the [Open Database License (ODbL)](https://opendatacommons.org/licenses/odbl/1.0/).
