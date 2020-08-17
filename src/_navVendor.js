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
          name: 'Product Specification Details',
          url: '/product/products-specification-details',
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
      name: 'discount & Promocode',
      url: '/discount-promocode',
      icon: 'icon-puzzle',
      children :[
        {
          name: 'Add Discount',
          url: '/discount-promocode/add-new-discount',
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

      ],
    },



  ]
}
