'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Categories', [
      {
        id: 1,
        name: 'Giấy Dán Tường',
        slug: 'giay-dan-tuong',
        description: 'Sản phẩm giấy dán tường đa dạng phong cách và chất liệu, mang lại vẻ đẹp sang trọng cho không gian.',
        image: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,w_200,h_200/v1711026611/cronos-rw/product-group/designer.jpg',
        parentId: null,
        isActive: true,
        displayOrder: 1,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Giấy Dán Tường',
          metaDescription: 'Khám phá các sản phẩm giấy dán tường với đa dạng phong cách và chất liệu',
          keywords: ['giấy dán tường', 'trang trí nội thất', 'giấy dán'],
          iconClass: 'fas fa-paint-roller',
          featuredOrder: 1
        }),
        level: 0,
        path: '1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Rèm Cửa',
        slug: 'rem-cua',
        description: 'Các loại rèm cửa hiện đại và truyền thống, phù hợp với mọi không gian.',
        image: 'https://www.curtarra.com/media/catalog/product/_/l/_lindseypedey-sabrina-dovewhite-1_1_.jpg?tr=w-345,h-345',
        parentId: null,
        isActive: true,
        displayOrder: 2,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Rèm Cửa',
          metaDescription: 'Khám phá các mẫu rèm cửa đẹp cho không gian của bạn',
          keywords: ['rèm cửa', 'trang trí nội thất', 'rèm'],
          iconClass: 'fas fa-window-restore',
          featuredOrder: 2
        }),
        level: 0,
        path: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Phụ Kiện',
        slug: 'phu-kien',
        description: 'Phụ kiện trang trí nội thất như cột rèm, dây kéo và thanh kéo.',
        image: 'https://www.curtarra.com/media/catalog/product/j/a/jason-electric-curtain-track07.jpg?tr=w-340,h-340',
        parentId: null,
        isActive: true,
        displayOrder: 3,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Phụ Kiện',
          metaDescription: 'Khám phá các phụ kiện trang trí nội thất độc đáo',
          keywords: ['phụ kiện', 'trang trí nội thất', 'cột rèm', 'dây kéo'],
          iconClass: 'fas fa-toolbox',
          featuredOrder: 3
        }),
        level: 0,
        path: '3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Categories for "Giấy Dán Tường"
      {
        id: 4,
        name: 'Hiện Đại',
        slug: 'hien-dai',
        description: 'Phong cách hiện đại, tối giản, phù hợp với xu hướng nội thất mới.',
        image: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,w_500,h_500/v1711632468/articles/R20468_interior1.jpg',
        parentId: 1,
        isActive: true,
        displayOrder: 1,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Giấy Dán Tường Hiện Đại',
          metaDescription: 'Khám phá các sản phẩm giấy dán tường phong cách hiện đại',
          keywords: ['giấy dán tường', 'hiện đại', 'nội thất'],
          iconClass: 'fas fa-palette',
          featuredOrder: 1
        }),
        level: 1,
        path: '1/1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Truyền Thống',
        slug: 'truyen-thong',
        description: 'Giấy dán tường với họa tiết truyền thống, mang lại cảm giác ấm cúng và thân thiện.',
        image: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,w_500,h_500/v1638278349/articles/R15501_interior1.jpg',
        parentId: 1,
        isActive: true,
        displayOrder: 2,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Giấy Dán Tường Truyền Thống',
          metaDescription: 'Khám phá các sản phẩm giấy dán tường phong cách truyền thống',
          keywords: ['giấy dán tường', 'truyền thống', 'nội thất'],
          iconClass: 'fas fa-paint-brush',
          featuredOrder: 2
        }),
        level: 1,
        path: '1/2',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Trẻ Em',
        slug: 'tre-em',
        description: 'Giấy dán tường với họa tiết dễ thương, phù hợp cho phòng của trẻ em.',
        image: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,w_500,h_500/v1709806693/articles/R18930_interior1.jpg',
        parentId: 1,
        isActive: true,
        displayOrder: 3,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Giấy Dán Tường Trẻ Em',
          metaDescription: 'Khám phá các sản phẩm giấy dán tường dành cho phòng trẻ em',
          keywords: ['giấy dán tường', 'trẻ em', 'nội thất'],
          iconClass: 'fas fa-child',
          featuredOrder: 3
        }),
        level: 1,
        path: '1/3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Categories for "Rèm Cửa"
      {
        id: 7,
        name: 'Trong Sáng',
        slug: 'trong-sang',
        description: 'Rèm cửa mỏng nhẹ, mang lại ánh sáng tự nhiên cho không gian.',
        image: 'https://www.curtarra.com/Sheercurtains-iZJ.jpg',
        parentId: 2,
        isActive: true,
        displayOrder: 1,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Rèm Cửa Trong Sáng',
          metaDescription: 'Khám phá các mẫu rèm cửa trong sáng cho không gian thoáng đãng',
          keywords: ['rèm cửa', 'trong sáng', 'nội thất'],
          iconClass: 'fas fa-sun',
          featuredOrder: 1
        }),
        level: 1,
        path: '2/7',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'Chắn Sáng',
        slug: 'chan-sang',
        description: 'Rèm cửa chắn sáng hoàn hảo, đảm bảo sự riêng tư và tiện nghi.',
        image: 'https://www.curtarra.com/Blackoutcurtains-vo7.jpg',
        parentId: 2,
        isActive: true,
        displayOrder: 2,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Rèm Cửa Chắn Sáng',
          metaDescription: 'Khám phá các mẫu rèm cửa chắn sáng hiệu quả',
          keywords: ['rèm cửa', 'chắn sáng', 'nội thất'],
          iconClass: 'fas fa-moon',
          featuredOrder: 2
        }),
        level: 1,
        path: '2/8',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        name: 'Có Vân',
        slug: 'co-van',
        description: 'Rèm cửa với các họa tiết vân tinh tế, tạo điểm nhấn cho không gian.',
        image: 'https://www.curtarra.com/Linencurtains-9C5.jpg',
        parentId: 2,
        isActive: true,
        displayOrder: 3,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Rèm Cửa Có Vân',
          metaDescription: 'Khám phá các mẫu rèm cửa với họa tiết vân độc đáo',
          keywords: ['rèm cửa', 'họa tiết', 'nội thất'],
          iconClass: 'fas fa-swatchbook',
          featuredOrder: 3
        }),
        level: 1,
        path: '2/9',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Categories for "Phụ Kiện"
      {
        id: 10,
        name: 'Cột Rèm',
        slug: 'cot-rem',
        description: 'Cột rèm chất lượng cao, đa dạng mẫu mã và chất liệu.',
        image: 'https://www.curtarra.com/media/catalog/product/j/u/justin_adjustable_curtain_rods_-_gold_5__1.jpg?tr=w-340,h-340',
        parentId: 3,
        isActive: true,
        displayOrder: 1,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Cột Rèm',
          metaDescription: 'Khám phá các mẫu cột rèm chất lượng cao',
          keywords: ['cột rèm', 'phụ kiện', 'nội thất'],
          iconClass: 'fas fa-columns',
          featuredOrder: 1
        }),
        level: 1,
        path: '3/10',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: 'Dây Kéo',
        slug: 'day-keo',
        description: 'Dây kéo trang trí, mang lại sự tiện nghi và phong cách cho rèm cửa.',
        image: 'https://www.curtarra.com/media/catalog/product/j/u/juno_curtain_tie_backs_2_.jpg?tr=w-340,h-340',
        parentId: 3,
        isActive: true,
        displayOrder: 2,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Dây Kéo',
          metaDescription: 'Khám phá các mẫu dây kéo trang trí đa dạng',
          keywords: ['dây kéo', 'phụ kiện', 'nội thất'],
          iconClass: 'fas fa-grip-lines',
          featuredOrder: 2
        }),
        level: 1,
        path: '3/11',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: 'Thanh Kéo',
        slug: 'thanh-keo',
        description: 'Thanh kéo đa năng, dễ lắp đặt và sử dụng.',
        image: 'https://www.curtarra.com/media/catalog/product/w/e/wesley_custom_curtain_track-_3__1.jpg?tr=w-340,h-340',
        parentId: 3,
        isActive: true,
        displayOrder: 3,
        metadata: JSON.stringify({
          metaTitle: 'Danh mục Thanh Kéo',
          metaDescription: 'Khám phá các mẫu thanh kéo đa dụng cho rèm cửa',
          keywords: ['thanh kéo', 'phụ kiện', 'nội thất'],
          iconClass: 'fas fa-bars',
          featuredOrder: 3
        }),
        level: 1,
        path: '3/12',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};