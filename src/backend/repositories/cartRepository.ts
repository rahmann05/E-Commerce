import prisma from "../prisma/client";

export class CartRepository {
  async getCartByUserId(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async addItemToCart(cartId: string, productId: string, variantId: string, quantity: number) {
    return await prisma.cartItem.upsert({
      where: {
        cartId_productVariantId: {
          cartId,
          productVariantId: variantId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId,
        productId,
        productVariantId: variantId,
        quantity,
      },
    });
  }

  async getVariantById(variantId: string) {
    return await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
  }

  async getCartItemByVariant(cartId: string, variantId: string) {
    return await prisma.cartItem.findUnique({
      where: {
        cartId_productVariantId: {
          cartId,
          productVariantId: variantId,
        },
      },
    });
  }

  async getCartItemWithVariant(itemId: string) {
    return await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: {
        variant: true,
      },
    });
  }

  async removeItemFromCart(itemId: string) {
    return await prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async updateItemQuantity(itemId: string, quantity: number) {
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }
}

export const cartRepository = new CartRepository();
