export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
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
      name: 'Products',
      url: '/product',
      icon: 'icon-puzzle',
      children: [

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
          name: 'Add Product',
          url: '/product/products',
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
      name: 'Sales',
      url: '/sales',
      icon: 'icon-puzzle',
      children: [
        {
          name: 'Sales Info',
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

  ],
};
