import { cartRepository } from "../repositories/cartRepository";

export class CartService {
  async getCart(userId: string) {
    return await cartRepository.getCartByUserId(userId);
  }

  async addToCart(userId: string, productId: string, variantId: string, quantity: number) {
    const cart = await cartRepository.getCartByUserId(userId);
    await cartRepository.addItemToCart(cart.id, productId, variantId, quantity);
    return await this.getCart(userId);
  }

  async removeFromCart(userId: string, itemId: string) {
    await cartRepository.removeItemFromCart(itemId);
    return await this.getCart(userId);
  }

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    await cartRepository.updateItemQuantity(itemId, quantity);
    return await this.getCart(userId);
  }
}

export const cartService = new CartService();
