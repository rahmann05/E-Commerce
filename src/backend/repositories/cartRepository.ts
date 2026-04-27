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

  async getCartItemWithVariant(itemId: string, userId: string) {
    return await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      include: {
        cart: {
          select: {
            userId: true,
          },
        },
        variant: true,
      },
    });
  }

  async removeItemFromCart(userId: string, itemId: string) {
    const result = await prisma.cartItem.deleteMany({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
    });

    if (result.count === 0) {
      throw new Error("Item cart tidak ditemukan.");
    }

    return result;
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    const result = await prisma.cartItem.updateMany({
      where: {
        id: itemId,
        cart: {
          userId,
        },
      },
      data: { quantity },
    });

    if (result.count === 0) {
      throw new Error("Item cart tidak ditemukan.");
    }

    return result;
  }
}

export const cartRepository = new CartRepository();
