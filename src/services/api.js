/**
 * OpenFoodFacts API Service
 * Centralized API layer with retry logic and response normalization.
 */

const BASE_URL = 'https://world.openfoodfacts.org';

const PRODUCT_FIELDS = [
  'code',
  'product_name',
  'image_url',
  'image_front_url',
  'image_front_small_url',
  'image_small_url',
  'categories',
  'categories_tags',
  'ingredients_text',
  'nutrition_grades',
  'nutriscore_grade',
  'nutriments',
  'labels',
  'labels_tags',
  'allergens_tags',
  'brands',
  'quantity',
  'nova_group',
].join(',');

const ALL_FIELDS = [
  ...PRODUCT_FIELDS.split(','),
  'ingredients',
  'allergens',
  'traces',
  'traces_tags',
  'packaging',
  'origins',
  'manufacturing_places',
  'generic_name',
  'ecoscore_grade',
  'selected_images',
].join(',');

/**
 * Fetch with retry logic and exponential backoff.
 */
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.status === 503 && attempt < retries) {
        // Server overloaded — wait and retry
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
        continue;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
}

/**
 * Search products by name.
 * @param {string} query - Search term
 * @param {number} page - Page number (1-indexed)
 * @param {number} pageSize - Products per page
 * @param {AbortSignal} signal - Optional abort signal
 * @returns {{ products: Array, count: number, page: number, pageSize: number }}
 */
export async function searchProducts(query, page = 1, pageSize = 24, signal) {
  const params = new URLSearchParams({
    search_terms: query,
    json: 'true',
    page: page.toString(),
    page_size: pageSize.toString(),
    fields: PRODUCT_FIELDS,
  });

  const data = await fetchWithRetry(
    `${BASE_URL}/cgi/search.pl?${params}`,
    { signal }
  );

  return {
    products: (data.products || []).map(normalizeProduct),
    count: data.count || 0,
    page: data.page || page,
    pageSize: data.page_size || pageSize,
  };
}

/**
 * Get a single product by barcode.
 * @param {string} barcode
 * @param {AbortSignal} signal
 * @returns {object|null}
 */
export async function getProductByBarcode(barcode, signal) {
  const data = await fetchWithRetry(
    `${BASE_URL}/api/v0/product/${barcode}.json?fields=${ALL_FIELDS}`,
    { signal }
  );

  if (data.status === 0) return null;
  return normalizeProduct(data.product);
}

/**
 * Get products by category.
 * @param {string} category - Category tag (e.g., "beverages")
 * @param {number} page
 * @param {number} pageSize
 * @param {AbortSignal} signal
 */
export async function getProductsByCategory(category, page = 1, pageSize = 24, signal) {
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: pageSize.toString(),
    json: 'true',
    fields: PRODUCT_FIELDS,
  });

  const data = await fetchWithRetry(
    `${BASE_URL}/category/${encodeURIComponent(category)}.json?${params}`,
    { signal }
  );

  return {
    products: (data.products || []).map(normalizeProduct),
    count: data.count || 0,
    page: data.page || page,
    pageSize: data.page_size || pageSize,
  };
}

/**
 * Fetch the list of categories.
 * @returns {Array<{id: string, name: string, products: number}>}
 */
export async function getCategories() {
  const data = await fetchWithRetry(`${BASE_URL}/categories.json`);

  return (data.tags || [])
    .filter((t) => t.products > 100 && t.name)
    .sort((a, b) => b.products - a.products)
    .slice(0, 60)
    .map((t) => ({
      id: t.id,
      name: t.name,
      url: t.url,
      products: t.products,
    }));
}

/**
 * Normalize product data into a consistent shape.
 */
function normalizeProduct(p) {
  if (!p) return null;
  return {
    code: p.code || '',
    name: p.product_name || 'Unknown Product',
    image: p.image_front_url || p.image_url || p.image_front_small_url || p.image_small_url || null,
    categories: p.categories || '',
    categoryTags: p.categories_tags || [],
    ingredients: p.ingredients_text || '',
    ingredientsList: p.ingredients || [],
    nutritionGrade: (p.nutrition_grades || p.nutriscore_grade || '').toLowerCase(),
    nutriments: p.nutriments || {},
    labels: p.labels || '',
    labelTags: p.labels_tags || [],
    allergenTags: p.allergens_tags || [],
    allergens: p.allergens || '',
    traces: p.traces || '',
    tracesTags: p.traces_tags || [],
    brands: p.brands || '',
    quantity: p.quantity || '',
    novaGroup: p.nova_group || null,
    genericName: p.generic_name || '',
    ecoscore: p.ecoscore_grade || '',
    packaging: p.packaging || '',
    origins: p.origins || '',
    selectedImages: p.selected_images || null,
  };
}
