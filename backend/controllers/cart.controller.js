const { Cart, CartItem, Product, Coupon } = require('../models');
const { Op } = require('sequelize');

/**
 * Get current cart
 * Lấy giỏ hàng hiện tại
 */
exports.getCart = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("getCart sessionId", sessionId)

        const userId = req.user?.id;

        

        // Find active cart for user or session
        // Tìm giỏ hàng đang hoạt động cho người dùng hoặc phiên
        const cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    attributes: ['name', 'featuredImage', 'stockQuantity', 'price']
                }]
            }]
        });

        if (!cart) {
            return res.json({ items: [] });
        }

        // Calculate totals / Tính tổng
        const cartData = cart.toJSON();
        cartData.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartData.total = cartData.subtotal + (cartData.tax || 0) - (cartData.discount || 0);

        res.json(cartData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Add item to cart
 * Thêm sản phẩm vào giỏ hàng
 */
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity, specifications } = req.body;
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("addToCart sessionId", sessionId)
        const userId = req.user?.id;

        // Validate product and stock / Kiểm tra sản phẩm và tồn kho
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found - Không tìm thấy sản phẩm' });
        }
        if (product.stockQuantity < quantity) {
            return res.status(409).json({
                message: 'Not enough stock - Không đủ hàng',
                available: product.stockQuantity,
                requested: quantity
            });
        }

        // Get or create cart / Lấy hoặc tạo giỏ hàng mới
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
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry / Hết hạn sau 7 ngày
            });
        }

        // Check if product already in cart / Kiểm tra sản phẩm đã có trong giỏ
        let cartItem = await CartItem.findOne({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (cartItem) {
            // Update existing item / Cập nhật số lượng nếu đã có
            cartItem = await cartItem.update({
                quantity: cartItem.quantity + quantity,
                specifications: { ...cartItem.specifications, ...specifications }
            });
        } else {
            // Create new item / Tạo mới nếu chưa có
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                price: product.price,
                specifications
            });
        }

        res.status(201).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Update cart item
* Cập nhật sản phẩm trong giỏ
*/
exports.updateCartItem = async (req, res) => {
    try {
        const { quantity, specifications } = req.body;
        const cartItem = await CartItem.findByPk(req.params.id, {
            include: [Product]
        });

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found - Không tìm thấy sản phẩm trong giỏ' });
        }

        // Check stock / Kiểm tra tồn kho
        if (quantity > cartItem.Product.stockQuantity) {
            return res.status(409).json({
                message: 'Not enough stock - Không đủ hàng',
                available: cartItem.Product.stockQuantity,
                requested: quantity
            });
        }

        await cartItem.update({
            quantity: quantity || cartItem.quantity,
            specifications: specifications ? { ...cartItem.specifications, ...specifications } : cartItem.specifications
        });

        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Remove item from cart
* Xóa sản phẩm khỏi giỏ
*/
exports.removeCartItem = async (req, res) => {
    try {
        const result = await CartItem.destroy({
            where: { id: req.params.id }
        });

        if (!result) {
            return res.status(404).json({ message: 'Cart item not found - Không tìm thấy sản phẩm trong giỏ' });
        }

        res.json({ message: 'Item removed from cart - Đã xóa sản phẩm khỏi giỏ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Clear entire cart
* Xóa toàn bộ giỏ hàng
*/
exports.clearCart = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("clearCart sessionId", sessionId)
        const userId = req.user?.id;

        const cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            }
        });

        if (cart) {
            await CartItem.destroy({ where: { cartId: cart.id } });
        }

        res.json({ message: 'Cart cleared - Đã xóa toàn bộ giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Apply coupon to cart
* Áp dụng mã giảm giá
*/
exports.applyCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("applyCoupon sessionId", sessionId)
        const userId = req.user?.id;

        // Validate coupon / Kiểm tra mã giảm giá
        const coupon = await Coupon.findOne({
            where: {
                code,
                expiresAt: { [Op.gt]: new Date() },
                isActive: true
            }
        });

        if (!coupon) {
            return res.status(400).json({ message: 'Invalid or expired coupon - Mã giảm giá không hợp lệ hoặc đã hết hạn' });
        }

        const cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            },
            include: ['items']
        });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found - Không tìm thấy giỏ hàng' });
        }

        // Check minimum purchase / Kiểm tra giá trị đơn hàng tối thiểu
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (coupon.minimumPurchase && subtotal < coupon.minimumPurchase) {
            return res.status(400).json({
                message: 'Minimum purchase amount not met - Chưa đạt giá trị đơn hàng tối thiểu',
                required: coupon.minimumPurchase,
                current: subtotal
            });
        }

        // Apply discount / Áp dụng giảm giá
        await cart.update({
            couponId: coupon.id,
            discount: coupon.type === 'percentage'
                ? subtotal * (coupon.value / 100)
                : coupon.value
        });

        res.json({
            code: coupon.code,
            discount: cart.discount,
            type: coupon.type
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Remove coupon from cart
* Xóa mã giảm giá
*/
exports.removeCoupon = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("removeCoupon sessionId", sessionId)
        const userId = req.user?.id;

        const cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            }
        });

        if (cart) {
            await cart.update({
                couponId: null,
                discount: 0
            });
        }

        res.json({ message: 'Coupon removed - Đã xóa mã giảm giá' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Get cart summary with totals
* Lấy tổng quan giỏ hàng với các tổng tiền
*/
exports.getCartSummary = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("getCartSummary sessionId", sessionId)
        const userId = req.user?.id;

        const cart = await Cart.findOne({
            where: {
                [Op.or]: [{ sessionId }, { userId }],
                status: 'active'
            },
            include: ['items']
        });

        if (!cart) {
            return res.json({
                itemCount: 0,
                subtotal: 0,
                discount: 0,
                tax: 0,
                total: 0
            });
        }

        // Calculate totals / Tính tổng tiền
        const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; // 10% tax / 10% thuế

        res.json({
            itemCount: cart.items.length,
            subtotal,
            discount: cart.discount || 0,
            tax,
            total: subtotal + tax - (cart.discount || 0)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Merge guest cart into user cart
* Gộp giỏ hàng khách vào giỏ hàng người dùng
*/
exports.mergeCarts = async (req, res) => {
    try {
        const sessionId = req.cookies?.sessionId || req.headers['x-session-id'];
        console.log("mergeCarts sessionId", sessionId)
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
                // Merge items / Gộp các sản phẩm
                for (const item of guestCart.items) {
                    const existingItem = userCart.items.find(i => i.productId === item.productId);

                    if (existingItem) {
                        await existingItem.update({
                            quantity: existingItem.quantity + item.quantity
                        });
                    } else {
                        await CartItem.create({
                            cartId: userCart.id,
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                            specifications: item.specifications
                        });
                    }
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

/**
* Save cart item for later
* Lưu sản phẩm để mua sau
*/
exports.saveForLater = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);

        if (!cartItem) {
            return res.status(404).json({
                message: 'Cart item not found - Không tìm thấy sản phẩm trong giỏ'
            });
        }

        await cartItem.update({ status: 'saved' });
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
* Move saved item back to cart
* Chuyển sản phẩm đã lưu vào giỏ hàng
*/
exports.moveToCart = async (req, res) => {
    try {
        const cartItem = await CartItem.findByPk(req.params.id);

        if (!cartItem) {
            return res.status(404).json({
                message: 'Cart item not found - Không tìm thấy sản phẩm đã lưu'
            });
        }

        await cartItem.update({ status: 'active' });
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};