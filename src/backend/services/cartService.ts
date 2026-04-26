import { cartRepository } from "../repositories/cartRepository";

export class CartService {
  async getCart(userId: string) {
    return await cartRepository.getCartByUserId(userId);
  }

  async addToCart(userId: string, productId: string, variantId: string, quantity: number) {
    if (!variantId) {
      throw new Error("Variant harus dipilih sebelum menambahkan ke cart.");
    }

    if (!quantity || quantity <= 0) {
      throw new Error("Quantity tidak valid.");
    }

    const cart = await cartRepository.getCartByUserId(userId);
    const variant = await cartRepository.getVariantById(variantId);

    if (!variant) {
      throw new Error("Variant produk tidak ditemukan.");
    }

    if (variant.stock <= 0) {
      throw new Error("Stock untuk variant ini habis.");
    }

    const existingItem = await cartRepository.getCartItemByVariant(cart.id, variantId);
    const existingQty = existingItem?.quantity ?? 0;

    if (existingQty + quantity > variant.stock) {
      throw new Error(`Stock tidak cukup. Sisa stock: ${variant.stock}.`);
    }

    await cartRepository.addItemToCart(cart.id, productId, variantId, quantity);
    return await this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    await cartRepository.removeItemFromCart(itemId);
    return await this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity minimal 1.");
    }

    const existingItem = await cartRepository.getCartItemWithVariant(itemId);
    if (!existingItem) {
      throw new Error("Item cart tidak ditemukan.");
    }

    if (quantity > existingItem.variant.stock) {
      throw new Error(`Stock tidak cukup. Sisa stock: ${existingItem.variant.stock}.`);
    }

    await cartRepository.updateItemQuantity(itemId, quantity);
    return await this.getCart(userId);
  }
}

export const cartService = new CartService();
