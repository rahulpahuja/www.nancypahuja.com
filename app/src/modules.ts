export interface Module {
  id: string;
  name: string;
  path: string;
  icon: string;
  category: 'User' | 'Admin' | 'Showcase';
}

export const modules: Module[] = [
  {
    id: 'homepage',
    name: 'Homepage',
    path: '/homepage/code.html',
    icon: 'Home',
    category: 'User'
  },
  {
    id: 'product_listing',
    name: 'Product Listing',
    path: '/product_listing_page/code.html',
    icon: 'Grid',
    category: 'User'
  },
  {
    id: 'product_detail',
    name: 'Product Detail',
    path: '/product_detail_page/code.html',
    icon: 'FileText',
    category: 'User'
  },
  {
    id: 'pdp_add_to_bag',
    name: 'PDP (Add to Bag)',
    path: '/product_detail_page_add_to_bag/code.html',
    icon: 'ShoppingBag',
    category: 'User'
  },
  {
    id: 'cart_checkout',
    name: 'Cart & Checkout',
    path: '/cart_checkout/code.html',
    icon: 'ShoppingCart',
    category: 'User'
  },
  {
    id: 'order_history',
    name: 'Order History',
    path: '/order_history/code.html',
    icon: 'History',
    category: 'User'
  },
  {
    id: 'order_invoice',
    name: 'Order Invoice',
    path: '/order_invoice/code.html',
    icon: 'Receipt',
    category: 'User'
  },
  {
    id: 'artisanal_heritage',
    name: 'Artisanal Heritage',
    path: '/artisanal_heritage/code.html',
    icon: 'Sparkles',
    category: 'User'
  },
  {
    id: 'admin_dashboard',
    name: 'Admin Dashboard',
    path: '/admin_analytics_dashboard/code.html',
    icon: 'LayoutDashboard',
    category: 'Admin'
  },
  {
    id: 'admin_upload',
    name: 'Product Upload',
    path: '/admin_product_upload/code.html',
    icon: 'Upload',
    category: 'Admin'
  },
  {
    id: 'loading_showcase',
    name: 'Loading Showcase',
    path: '/loading_animations_showcase/code.html',
    icon: 'Loader',
    category: 'Showcase'
  },
  {
    id: 'app_design',
    name: 'App Design',
    path: '/app_design/app_design.html',
    icon: 'Palette',
    category: 'Showcase'
  }
];

const normalizedModulePathMap = new Map(
  modules.map((module) => [normalizePath(module.path), module])
);

const labelModuleIdMap: Record<string, string> = {
  home: 'homepage',
  homepage: 'homepage',
  shop: 'product_listing',
  collections: 'product_listing',
  collection: 'product_listing',
  'new arrivals': 'product_listing',
  'summer lawn': 'product_listing',
  'embroidered sets': 'product_listing',
  'final sale': 'product_listing',
  'view all': 'product_listing',
  story: 'artisanal_heritage',
  'our story': 'artisanal_heritage',
  about: 'artisanal_heritage',
  'about us': 'artisanal_heritage',
  account: 'order_history',
  'my account': 'order_history',
  orders: 'order_history',
  'order history': 'order_history',
  cart: 'cart_checkout',
  checkout: 'cart_checkout',
  bag: 'cart_checkout',
  'add to bag': 'pdp_add_to_bag',
  'return to cart': 'cart_checkout',
  invoice: 'order_invoice',
  'view invoice': 'order_invoice',
  details: 'product_detail',
  'view details': 'product_detail',
  inventory: 'admin_upload',
  dashboard: 'admin_dashboard',
};

export function normalizePath(path: string): string {
  try {
    const origin = typeof window === 'undefined' ? 'http://localhost' : window.location.origin;
    const parsed = new URL(path, origin);
    return parsed.pathname.replace(/\/+$/, '') || '/';
  } catch {
    return path.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  }
}

export function findModuleByPath(path: string): Module | undefined {
  const normalizedPath = normalizePath(path);
  return normalizedModulePathMap.get(normalizedPath)
    || modules.find((module) => normalizedPath.endsWith(normalizePath(module.path)));
}

export function findModuleByLabel(label: string): Module | undefined {
  const normalizedLabel = label.trim().toLowerCase().replace(/\s+/g, ' ');
  const moduleId = labelModuleIdMap[normalizedLabel] || Object
    .entries(labelModuleIdMap)
    .sort(([left], [right]) => right.length - left.length)
    .find(([key]) => normalizedLabel.includes(key))?.[1];

  return moduleId ? modules.find((module) => module.id === moduleId) : undefined;
}
