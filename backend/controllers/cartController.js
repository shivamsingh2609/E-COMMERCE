import Cart from '../models/cartModel.js';

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(200).json({ cart: [] });
    }

    res.status(200).json({ cart: cart.items });
  } catch (err) {
    console.error('Failed to fetch cart:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, name, image, price, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(item => item.productId.toString() === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, name, image, price, quantity });
  }

  await cart.save();
  res.status(201).json({ message: 'Product added to cart' });
};

// PUT /api/cart/:id
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const productId = req.params.id;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.find(item => item.productId.toString() === productId);
  if (!item) return res.status(404).json({ message: 'Item not found' });

  item.quantity = quantity;
  await cart.save();
  res.json({ message: 'Cart updated' });
};

// DELETE /api/cart/:id
export const removeFromCart = async (req, res) => {
  const productId = req.params.id;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item.productId.toString() !== productId);
  await cart.save();
  res.json({ message: 'Item removed from cart' });
};

// DELETE /api/cart
export const clearCart = async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: 'Cart cleared' });
};

// POST /api/cart/sync
export const syncCart = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: user not found' });
    }

    const userId = req.user._id;
    const newItems = req.body.items;

    console.log('🔄 Syncing cart for user:', userId);
    console.log('🛒 Incoming cart items:', newItems);

    if (!Array.isArray(newItems)) {
      return res.status(400).json({ message: 'Invalid cart items format' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      cart.items = newItems;
    } else {
      cart = new Cart({
        user: userId,
        items: newItems,
      });
    }

    await cart.save();
    res.status(200).json({ message: '✅ Cart synced successfully' });

  } catch (err) {
    console.error('❌ Cart sync failed:', err.message);
    res.status(500).json({ message: 'Server error syncing cart', error: err.message });
  }
};
