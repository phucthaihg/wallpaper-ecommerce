'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Products', [
            {
                id: 1,
                name: 'BELLEWOOD',
                slug: 'bellewood',
                categoryId: 1,
                price: 6.60,
                compareAtPrice: null,
                sku: 'BELL-001',
                stockQuantity: 100,
                images: [
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1677592124/articles/R13051_interior8.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1664364491/articles/R13051_product.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1677592123/articles/R13051_interior4.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1677592124/articles/R13051_interior3.jpg'
                ],
                featuredImage: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1677592124/articles/R13051_interior8.jpg',
                description: 'There is something indescribably beautiful about a classic toile pattern based on small hand-drawn strokes painting up romantic scenes usually consisting of lovebirds talking in the shade. We wanted to create a modern toile but maintain the traditional craftsmanship. This inviting, and a little mysterious, forest wallpaper is based on several toile designs where we only picked the trees from the romantic sceneries.',
                tags: ['toile', 'forest', 'wallpaper'],
                metadata: JSON.stringify({
                    metaTitle: 'BELLEWOOD Wallpaper',
                    metaDescription: 'Discover the beauty of BELLEWOOD, our modern take on a classic toile pattern.',
                    keywords: ['bellewood', 'toile', 'wallpaper', 'forest'],
                    features: ['Classic toile pattern', 'Modern design', 'Romantic forest scenery'],
                    dimensions: {
                        length: 52,
                        width: 24,
                        height: 0.1
                    }
                }),
                brand: 'Gimmersta',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.5,
                reviewCount: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 2,
                name: 'PETALS, SAND',
                slug: 'petals-sand',
                categoryId: 1,
                price: 6.60,
                compareAtPrice: null,
                sku: 'PETA-001',
                stockQuantity: 100,
                images: [
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1663317792/articles/R18588_interior1.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1663317325/articles/R18588_product.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1663317792/articles/R18588_interior2.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1719392218/articles/R18588_interior3.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1719392245/articles/R18588_interior4.jpg'
                ],
                featuredImage: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1663317792/articles/R18588_interior1.jpg',
                description: 'With its toned-down quiet appearance and natural colors, Petal, Sand creates a calm base for any room.',
                tags: ['petal', 'sand', 'wallpaper', 'natural'],
                metadata: JSON.stringify({
                    metaTitle: 'PETALS, SAND Wallpaper',
                    metaDescription: 'Discover the calming and natural PETALS, SAND wallpaper.',
                    keywords: ['petals', 'sand', 'wallpaper', 'natural', 'calm'],
                    features: ['Toned-down appearance', 'Natural colors', 'Calming base'],
                    dimensions: {
                        length: 52,
                        width: 24,
                        height: 0.1
                    }
                }),
                brand: 'Gimmersta',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.5,
                reviewCount: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 3,
                name: 'MISCHIEVOUS MONKEYS, LUSH',
                slug: 'mischievous-monkeys-lush',
                categoryId: 3,
                price: 6.60,
                compareAtPrice: null,
                sku: 'MISC-001',
                stockQuantity: 100,
                images: [
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1683276570/articles/R14592_interior2.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1664364487/articles/R14592_product.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1719384889/articles/R14592_interior6.jpg'
                ],
                featuredImage: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1683276570/articles/R14592_interior2.jpg',
                description: 'With its toned-down quiet appearance and natural colors, Petal, Sand creates a calm base for any room.',
                tags: ['monkeys', 'lush', 'wallpaper', 'nature'],
                metadata: JSON.stringify({
                    metaTitle: 'MISCHIEVOUS MONKEYS, LUSH Wallpaper',
                    metaDescription: 'Discover the playful and lush MISCHIEVOUS MONKEYS, LUSH wallpaper.',
                    keywords: ['monkeys', 'lush', 'wallpaper', 'nature', 'playful'],
                    features: ['Mischievous monkey design', 'Lush, natural colors', 'Playful atmosphere'],
                    dimensions: {
                        length: 52,
                        width: 24,
                        height: 0.1
                    }
                }),
                brand: 'Gimmersta',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.5,
                reviewCount: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 4,
                name: 'CUDDLE CLOUDS',
                slug: 'cuddle-clouds',
                categoryId: 1,
                price: 6.60,
                compareAtPrice: null,
                sku: 'CUDD-001',
                stockQuantity: 100,
                images: [
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1666787889/articles/R14011_interior6.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1638278016/articles/R14011_interior4.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1719388005/articles/R14011_interior8.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1664364486/articles/R14011_product.jpg'
                ],
                featuredImage: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1666787889/articles/R14011_interior6.jpg',
                description: 'With its toned-down quiet appearance and natural colors, Petal, Sand creates a calm base for any room.',
                tags: ['clouds', 'wallpaper', 'soft'],
                metadata: JSON.stringify({
                    metaTitle: 'CUDDLE CLOUDS Wallpaper',
                    metaDescription: 'Discover the soft and comforting CUDDLE CLOUDS wallpaper.',
                    keywords: ['clouds', 'wallpaper', 'soft', 'comfort'],
                    features: ['Soft, cloud-like design', 'Calming atmosphere', 'Cozy feel'],
                    dimensions: {
                        length: 52,
                        width: 24,
                        height: 0.1
                    }
                }),
                brand: 'Gimmersta',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.5,
                reviewCount: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 5,
                name: 'CHINOISERIE CHIC',
                slug: 'chinoiserie-chic',
                categoryId: 2,
                price: 6.60,
                compareAtPrice: null,
                sku: 'CHIN-001',
                stockQuantity: 100,
                images: [
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1661354916/articles/R16744_interior3.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1638269687/articles/R16744_product.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1638269688/articles/R16744_interior1.jpg',
                    'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1638269690/articles/R16744_interior2.jpg'
                ],
                featuredImage: 'https://res.cloudinary.com/gimmersta-wallpaper/image/upload/c_fill,f_auto,fl_progressive,q_auto,h_1200/v1661354916/articles/R16744_interior3.jpg',
                description: 'Our luxurious yet sophisticated "Chinoiserie Chic" mural is a lovely Diane Hill collab, featuring citrus trees, exotic birds and swirling butterflies.',
                tags: ['chinoiserie', 'mural', 'wallpaper', 'luxury'],
                metadata: JSON.stringify({
                    metaTitle: 'CHINOISERIE CHIC Wallpaper',
                    metaDescription: 'Discover the elegant and sophisticated CHINOISERIE CHIC wallpaper.',
                    keywords: ['chinoiserie', 'mural', 'wallpaper', 'luxury', 'diane hill'],
                    features: ['Luxurious design', 'Sophisticated patterns', 'Exotic elements'],
                    dimensions: {
                        length: 52,
                        width: 24,
                        height: 0.1
                    }
                }),
                brand: 'Gimmersta',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.5,
                reviewCount: 10,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 6,
                name: 'Sabrina',
                slug: 'sabrina',
                categoryId: 4,
                price: 134.10,
                compareAtPrice: null,
                sku: 'SABR-001',
                stockQuantity: 50,
                images: [
                    'https://www.curtarra.com/media/catalog/product/_/l/_lindseypedey-sabrina-dovewhite-1_1_.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/c/u/curtarra_custom_made-sabrina_blend_linen_curtains-dove-white-1_4_.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/c/u/curtarra_custom_made-sabrina_blend_linen_curtains-dove-white-1_5_.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/_/l/_lindseypedey-sabrina-dovewhite-1_3_.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/_/l/_lindseypedey-sabrina-dovewhite-1_1_.jpg?tr=w-700,h-700',
                description: 'Natural Atmosphere\nInspired by the natural colors of flax plants,\ndecked with subtle slubs, your Sabrina adds a natural vibe.',
                tags: ['curtain', 'natural', 'linen'],
                metadata: JSON.stringify({
                    metaTitle: 'Sabrina Curtain',
                    metaDescription: 'Discover the natural and sophisticated Sabrina curtain.',
                    keywords: ['sabrina', 'curtain', 'natural', 'linen'],
                    features: ['Natural colors', 'Subtle slubs', 'Natural aesthetic'],
                    dimensions: {
                        length: 84,
                        width: 50,
                        height: 0.1
                    }
                }),
                brand: 'Curtarra',
                warranty: '2 years',
                weight: 1000,
                avgRating: 4.8,
                reviewCount: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 7,
                name: 'Oakley',
                slug: 'oakley',
                categoryId: 5,
                price: 125.10,
                compareAtPrice: null,
                sku: 'OAKL-001',
                stockQuantity: 50,
                images: [
                    'https://www.curtarra.com/media/catalog/product/o/a/oakley-3_1.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/o/a/oakley-warm-taupe-7.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/o/a/oakley-warm-taupe-1.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/o/a/oakley-3_1.jpg?tr=w-700,h-700',
                description: 'Delicate&Soft\nOakley maximizes its soft look and feel,\nwhen hung in a window due to its soft texture and fine grain.',
                tags: ['curtain', 'soft', 'delicate'],
                metadata: JSON.stringify({
                    metaTitle: 'Oakley Curtain',
                    metaDescription: 'Discover the delicate and soft Oakley curtain.',
                    keywords: ['oakley', 'curtain', 'soft', 'delicate'],
                    features: ['Soft texture', 'Fine grain', 'Delicate appearance'],
                    dimensions: {
                        length: 84,
                        width: 50,
                        height: 0.1
                    }
                }),
                brand: 'Curtarra',
                warranty: '2 years',
                weight: 1000,
                avgRating: 4.8,
                reviewCount: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 8,
                name: 'Lesley',
                slug: 'lesley',
                categoryId: 5,
                price: 125.10,
                compareAtPrice: null,
                sku: 'LESL-001',
                stockQuantity: 50,
                images: [
                    'https://www.curtarra.com/media/catalog/product/l/e/lesley-white.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/c/u/curtarra_custom_curtains-lesley_linen_blend_curtains_white_5_.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/l/e/lesley-white_1.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/l/e/lesley-white.jpg?tr=w-700,h-700',
                description: 'Graceful Draping\nLesley is thoughtfully designed to hang down gracefully.\nEngage your windows with more depth & character.',
                tags: ['curtain', 'graceful', 'draping'],
                metadata: JSON.stringify({
                    metaTitle: 'Lesley Curtain',
                    metaDescription: 'Discover the graceful and draping Lesley curtain.',
                    keywords: ['lesley', 'curtain', 'graceful', 'draping'],
                    features: ['Graceful draping', 'Adds depth and character', 'Thoughtful design'],
                    dimensions: {
                        length: 84,
                        width: 50,
                        height: 0.1
                    }
                }),
                brand: 'Curtarra',
                warranty: '2 years',
                weight: 1000,
                avgRating: 4.8,
                reviewCount: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 9,
                name: 'Margaret',
                slug: 'margaret',
                categoryId: 6,
                price: 125.10,
                compareAtPrice: null,
                sku: 'MARG-001',
                stockQuantity: 50,
                images: [
                    'https://www.curtarra.com/media/catalog/product/m/a/margaret-white-1_1__1.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/m/a/margaret-white-1_6_.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/m/a/margaret-white-1_5_.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/m/a/margaret-white-1_1__1.jpg?tr=w-700,h-700',
                description: 'Refreshing Aesthetic\nMargaret is made of high-quality fabrics that have been specially treated\nto have excellent wear and scratch resistance.',
                tags: ['curtain', 'refreshing', 'high-quality'],
                metadata: JSON.stringify({
                    metaTitle: 'Margaret Curtain',
                    metaDescription: 'Discover the refreshing and high-quality Margaret curtain.',
                    keywords: ['margaret', 'curtain', 'refreshing', 'high-quality'],
                    features: ['Refreshing aesthetic', 'High-quality fabrics', 'Excellent wear and scratch resistance'],
                    dimensions: {
                        length: 84,
                        width: 50,
                        height: 0.1
                    }
                }),
                brand: 'Curtarra',
                warranty: '2 years',
                weight: 1000,
                avgRating: 4.8,
                reviewCount: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 10,
                name: 'Amber',
                slug: 'amber',
                categoryId: 6,
                price: 88.00,
                compareAtPrice: null,
                sku: 'AMBER-001',
                stockQuantity: 50,
                images: [
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-1_1.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-5.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-3.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-1_1.jpg?tr=w-700,h-700',
                description: 'Refreshing Aesthetic\nAmber is made of high-quality fabrics that have been specially treated\nto have excellent wear and scratch resistance.',
                tags: ['curtain', 'refreshing', 'high-quality'],
                metadata: JSON.stringify({
                    metaTitle: 'Amber Curtain',
                    metaDescription: 'Discover the refreshing and high-quality Amber curtain.',
                    keywords: ['amber', 'curtain', 'refreshing', 'high-quality'],
                    features: ['Refreshing aesthetic', 'High-quality fabrics', 'Excellent wear and scratch resistance'],
                    dimensions: {
                        length: 84,
                        width: 50,
                        height: 0.1
                    }
                }),
                brand: 'Curtarra',
                warranty: '2 years',
                weight: 1000,
                avgRating: 4.8,
                reviewCount: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 11,
                name: 'Decorative Curtain Rod',
                slug: 'decorative-curtain-rod',
                categoryId: 7,
                price: 34.99,
                compareAtPrice: null,
                sku: 'DCUR-001',
                stockQuantity: 75,
                images: [
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-1_1.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-5.jpg?tr=w-700,h-700',
                    'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-6.jpg?tr=w-700,h-700'
                ],
                featuredImage: 'https://www.curtarra.com/media/catalog/product/a/m/amber-thin-stripe-1_1.jpg?tr=w-700,h-700',
                description: 'Stylish curtain rod with ornate finials.',
                tags: ['curtain rod', 'decorative', 'ornate'],
                metadata: JSON.stringify({
                    metaTitle: 'Decorative Curtain Rod',
                    metaDescription: 'Discover the stylish and ornate Decorative Curtain Rod.',
                    keywords: ['curtain rod', 'decorative', 'ornate'],
                    features: ['Stylish design', 'Ornate finials', 'High-quality construction'],
                    dimensions: {
                        length: 48,
                        width: 1,
                        height: 1
                    }
                }),
                brand: 'Curtarra',
                warranty: '1 year',
                weight: 500,
                avgRating: 4.2,
                reviewCount: 15,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Products', null, {});
    }
};