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
