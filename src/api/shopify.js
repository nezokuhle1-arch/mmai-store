/* ============================================================
   MMAI — SHOPIFY STOREFRONT API
   Thin connector layer. Phase 1: stubs only (mock data is used
   by DropContext). Phase 4: implement these against the
   Shopify Storefront API using the credentials in .env

   Required .env vars:
     VITE_SHOPIFY_DOMAIN   e.g. mmai-store.myshopify.com
     VITE_SHOPIFY_TOKEN    Storefront API access token
   ============================================================ */

const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const SHOPIFY_TOKEN = import.meta.env.VITE_SHOPIFY_TOKEN;
const API_VERSION = '2024-10';

const ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
    console.warn(
      '[shopify.js] Missing VITE_SHOPIFY_DOMAIN or VITE_SHOPIFY_TOKEN. ' +
      'Using mock data until Phase 4 integration.'
    );
    return null;
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`Shopify API error: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(', '));
  }
  return json.data;
}

/* ---------- PRODUCTS ---------- */

export async function getProducts() {
  const query = `
    query GetProducts {
      products(first: 20) {
        edges {
          node {
            id
            handle
            title
            description
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            images(first: 1) {
              edges { node { url altText } }
            }
            variants(first: 10) {
              edges { node { id title availableForSale } }
            }
          }
        }
      }
    }
  `;
  return shopifyFetch(query);
}

export async function getProductByHandle(handle) {
  const query = `
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        priceRange {
          minVariantPrice { amount currencyCode }
        }
        images(first: 5) {
          edges { node { url altText } }
        }
        variants(first: 10) {
          edges { node { id title availableForSale price { amount } } }
        }
      }
    }
  `;
  return shopifyFetch(query, { handle });
}

/* ---------- CART ---------- */

export async function createCart() {
  const query = `
    mutation CreateCart {
      cartCreate {
        cart { id checkoutUrl }
      }
    }
  `;
  return shopifyFetch(query);
}

/**
 * Add a line item to the cart, attaching customization data
 * as Shopify line item "attributes" (key-value properties).
 *
 * customAttributes example:
 *   [
 *     { key: "Name Badge", value: "Inkosiyapha M." },
 *     { key: "Quote", value: "I wear myself." },
 *     { key: "Placement", value: "Back centre" },
 *     { key: "Barcode ID", value: "MMAI-001-INK9" }
 *   ]
 */
export async function addToCart(cartId, variantId, quantity = 1, customAttributes = []) {
  const query = `
    mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { id checkoutUrl }
      }
    }
  `;
  const lines = [
    {
      merchandiseId: variantId,
      quantity,
      attributes: customAttributes,
    },
  ];
  return shopifyFetch(query, { cartId, lines });
}

export async function getCart(cartId) {
  const query = `
    query GetCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        lines(first: 50) {
          edges {
            node {
              id
              quantity
              attributes { key value }
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  price { amount currencyCode }
                  product { title }
                }
              }
            }
          }
        }
        cost {
          subtotalAmount { amount currencyCode }
          totalAmount { amount currencyCode }
        }
      }
    }
  `;
  return shopifyFetch(query, { cartId });
}
