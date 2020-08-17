export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },

    {
      name: 'Products',
      url: '/product',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Product',
          url: '/product/products',
          icon: 'icon-puzzle',
        },

        {
          name: 'Product Specification',
          url: '/product/products-specifications',
          icon: 'icon-basket',
        },

        {
          name: 'Product Specification Details',
          url: '/product/products-specification-details',
          icon: 'icon-basket',
        },

        {
          name: 'Color Info',
          url: '/product/color-infos',
          icon: 'icon-basket',
        },

        {
          name: 'Size Type',
          url: '/product/size-type',
          icon: 'icon-basket',
        },

        {
          name: 'Size Info',
          url: '/product/size-info',
          icon: 'icon-basket',
        },

        // {
        //   name: 'Sold Product List',
        //   url: '/product/sold-products-list',
        //   icon: 'icon-basket',
        // },

        // {
        //   name: 'Discount List',
        //   url: '/product/discount-list',
        //   icon: 'icon-basket',
        // },

        // {
        //   name: 'Product Discount List',
        //   url: '/product/product-discount-list',
        //   icon: 'icon-basket',
        // },
      ],
    },

    {
      name: 'Users',
      url: '/create-users',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Vendor',
          url: '/create-users/vendor-create',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add User',
          url: '/create-users/user-create',
          icon: 'icon-puzzle',
        },
      ],
    },

    {
      name: 'Purchase',
      url: '/purchase',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Purchase',
          url: '/purchase/purchase',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add Purchase Return',
          url: '/purchase/purchase-return',
          icon: 'icon-puzzle',
        },
      ],
    },

    {
      name: 'Sales',
      url: '/sales',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add sales',
          url: '/sales/sales',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add Sales Return',
          url: '/sales/sales-return',
          icon: 'icon-puzzle',
        },
      ],
    },

    {
      name: 'Category',
      url: '/category',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Category',
          url: '/category/categories',
          icon: 'icon-basket',
        },
        {
          name: 'Add Featured Category',
          url: '/category/fetured-categories',
          icon: 'icon-basket',
        },
        {
          name: 'Add Side Navbar Categories',
          url: '/category/navbar-categories',
          icon: 'icon-basket',
        },
        {
          name: 'Add Top Navbar Categories',
          url: '/category/top-navbar-categories',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'Feature',
      url: '/feature',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add feature Name',
          url: '/feature/feature_name',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add feature Products',
          url: '/feature/feature',
          icon: 'icon-puzzle',
        },

      ],
    },

    {
      name: 'Customer',
      url: '/customer',
      icon: 'icon-puzzle',
      children :[
        {
          name: 'Customer List',
          url: '/customer/customer-List',
          icon: 'icon-puzzle',
        },
        {
          name: 'Order List',
          url: '/customer/order-List',
          icon: 'icon-puzzle',
        },
      ],
    },

    {
      name: 'Vendor Payment',
      url: '/vendor-payment',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Vendor Payment',
          url: '/vendor-payment/add-vendor-payment',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'discount & Promocode',
      url: '/discount-promocode',
      icon: 'icon-puzzle',
      children :[
        {
          name: 'Add Discount',
          url: '/discount-promocode/add-new-discount',
          icon: 'icon-puzzle',
        },
        {
          name: 'Add Promocode',
          url: '/discount-promocode/add-new-promocode',
          icon: 'icon-puzzle',
        }
      ],
    },

    {
      name: 'Banner',
      url: '/banner',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Main Banner',
          url: '/banner/add-main-banner',
          icon: 'icon-basket',
        },
        // {
        //   name: 'Add Sub Banner',
        //   url: '/banner/add-sub-banner',
        //   icon: 'icon-basket',
        // },
      ],
    },

    {
      name: 'Advertisement',
      url: '/advertisement',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Advertisement',
          url: '/advertisement/add-advertisement',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'Delivery',
      url: '/delivery',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Delivery',
          url: '/delivery/add-new-delivery',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'Delivery & Charge',
      url: '/deliver-and-charge',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Delivery & Charge',
          url: '/deliver-and-charge/add-deliver-and-charge',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'Vat Tax',
      url: '/vat-tax',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Add Vat Tax',
          url: '/vat-tax/add-vat-tax',
          icon: 'icon-basket',
        },
      ],
    },

    {
      name: 'Terms & Condition',
      url: '/terms-condition',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Terms & Condition',
          url: '/terms-condition/add-terms-condition',
          icon: 'icon-puzzle',
        },
      ],
    },

    // {
    //   name: 'Colors',
    //   url: '/theme/colors',
    //   icon: 'icon-drop',
    // },
    // {
    //   name: 'Typography',
    //   url: '/theme/typography',
    //   icon: 'icon-pencil',
    // },
    // {
    //   title: true,
    //   name: 'Components',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Base',
    //   url: '/base',
    //   icon: 'icon-puzzle',
    //   children: [
    //     {
    //       name: 'Breadcrumbs',
    //       url: '/base/breadcrumbs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Cards',
    //       url: '/base/cards',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Carousels',
    //       url: '/base/carousels',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Collapses',
    //       url: '/base/collapses',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Dropdowns',
    //       url: '/base/dropdowns',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Forms',
    //       url: '/base/forms',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Jumbotrons',
    //       url: '/base/jumbotrons',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'List groups',
    //       url: '/base/list-groups',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Navs',
    //       url: '/base/navs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Paginations',
    //       url: '/base/paginations',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Popovers',
    //       url: '/base/popovers',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Progress Bar',
    //       url: '/base/progress-bar',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Switches',
    //       url: '/base/switches',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tables',
    //       url: '/base/tables',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tabs',
    //       url: '/base/tabs',
    //       icon: 'icon-puzzle',
    //     },
    //     {
    //       name: 'Tooltips',
    //       url: '/base/tooltips',
    //       icon: 'icon-puzzle',
    //     },
    //   ],
    // },
    // {
    //   name: 'Buttons',
    //   url: '/buttons',
    //   icon: 'icon-cursor',
    //   children: [
    //     {
    //       name: 'Buttons',
    //       url: '/buttons/buttons',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button dropdowns',
    //       url: '/buttons/button-dropdowns',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Button groups',
    //       url: '/buttons/button-groups',
    //       icon: 'icon-cursor',
    //     },
    //     {
    //       name: 'Brand Buttons',
    //       url: '/buttons/brand-buttons',
    //       icon: 'icon-cursor',
    //     },
    //   ],
    // },
    // {
    //   name: 'Charts',
    //   url: '/charts',
    //   icon: 'icon-pie-chart',
    // },
    // {
    //   name: 'Icons',
    //   url: '/icons',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'CoreUI Icons',
    //       url: '/icons/coreui-icons',
    //       icon: 'icon-star',
    //       badge: {
    //         variant: 'info',
    //         text: 'NEW',
    //       },
    //     },
    //     {
    //       name: 'Flags',
    //       url: '/icons/flags',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Font Awesome',
    //       url: '/icons/font-awesome',
    //       icon: 'icon-star',
    //       badge: {
    //         variant: 'secondary',
    //         text: '4.7',
    //       },
    //     },
    //     {
    //       name: 'Simple Line Icons',
    //       url: '/icons/simple-line-icons',
    //       icon: 'icon-star',
    //     },
    //   ],
    // },
    // {
    //   name: 'Notifications',
    //   url: '/notifications',
    //   icon: 'icon-bell',
    //   children: [
    //     {
    //       name: 'Alerts',
    //       url: '/notifications/alerts',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Badges',
    //       url: '/notifications/badges',
    //       icon: 'icon-bell',
    //     },
    //     {
    //       name: 'Modals',
    //       url: '/notifications/modals',
    //       icon: 'icon-bell',
    //     },
    //   ],
    // },
    // {
    //   name: 'Widgets',
    //   url: '/widgets',
    //   icon: 'icon-calculator',
    //   badge: {
    //     variant: 'info',
    //     text: 'NEW',
    //   },
    // },
    // {
    //   divider: true,
    // },
    // {
    //   title: true,
    //   name: 'Extras',
    // },
    // {
    //   name: 'Pages',
    //   url: '/pages',
    //   icon: 'icon-star',
    //   children: [
    //     {
    //       name: 'Login',
    //       url: '/login',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Register',
    //       url: '/register',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Error 404',
    //       url: '/404',
    //       icon: 'icon-star',
    //     },
    //     {
    //       name: 'Error 500',
    //       url: '/500',
    //       icon: 'icon-star',
    //     },
    //   ],
    // },
    // {
    //   name: 'Disabled',
    //   url: '/dashboard',
    //   icon: 'icon-ban',
    //   attributes: { disabled: true },
    // }
  ],
};
