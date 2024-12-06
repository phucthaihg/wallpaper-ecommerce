const { Cart, CartItem, Product } = require('../models');

/**
* Get current cart
* Lấy giỏ hàng hiện tại
*/
exports.getCart = async (req, res) => {
    try {
        const { sessionId } = req.cookies;
        const userId = req.user?.id;

        const cart = await Cart.findOne({
            where: {
                [Op.or]: [
                    { sessionId },
                    { userId }
                ],
                status: 'active'
            },
            include: [{
                model: CartItem,
                as: 'items',
                include: ['product']
            }]
        });

        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Add item to cart
* Thêm mặt hàng vào giỏ
*/
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, specifications } = req.body;
        const { sessionId } = req.cookies;
        const userId = req.user?.id;

        // Get or create cart / Lấy hoặc tạo giỏ hàng
        let cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            }
        });

        if (!cart) {
            cart = await Cart.create({
                userId,
                sessionId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            });
        }

        // Get product details / Lấy thông tin sản phẩm 
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Add to cart / Thêm vào giỏ
        const cartItem = await CartItem.create({
            cartId: cart.id,
            productId,
            quantity,
            price: product.price,
            specifications
        });

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Update cart item
* Cập nhật mặt hàng trong giỏ
*/
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cartItem = await CartItem.findByPk(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.update({ quantity });
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Remove item from cart
* Xóa mặt hàng khỏi giỏ
*/
exports.removeCartItem = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        await cartItem.destroy();
        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Get all carts for user
* Lấy tất cả giỏ hàng của người dùng
*/
exports.getUserCarts = async (req, res) => {
    try {
        const carts = await Cart.findAll({
            where: { userId: req.user.id },
            include: ['items']
        });
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Merge guest cart with user cart
* Gộp giỏ hàng khách với giỏ hàng người dùng
*/
exports.mergeCarts = async (req, res) => {
    try {
        const { sessionId } = req.cookies;
        const userId = req.user.id;

        const [guestCart, userCart] = await Promise.all([
            Cart.findOne({
                where: { sessionId, status: 'active' },
                include: ['items']
            }),
            Cart.findOne({
                where: { userId, status: 'active' },
                include: ['items']
            })
        ]);

        if (guestCart) {
            if (!userCart) {
                // Convert guest cart to user cart / Chuyển giỏ khách thành giỏ người dùng
                await guestCart.update({ userId, sessionId: null });
            } else {
                // Merge items / Gộp các mặt hàng
                for (const item of guestCart.items) {
                    await CartItem.create({
                        cartId: userCart.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        specifications: item.specifications
                    });
                }
                await guestCart.update({ status: 'merged' });
            }
        }

        const updatedCart = await Cart.findOne({
            where: { userId, status: 'active' },
            include: ['items']
        });

        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};