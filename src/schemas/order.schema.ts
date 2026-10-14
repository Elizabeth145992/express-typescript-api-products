import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.number("Debe proporcionar un número entero").int().positive(),
  quantity: z.number("Debe proporcionar un número entero").int().positive(),
});
export const createOrderSchema = z.object({
  customerId: z.number("Debe proporcionar un número entero").int().positive(),
  shippingStreet: z.string("Debe proporcionar una cadena").trim().min(1),
  shippingNumber: z.string("Debe proporcionar una cadena").trim().min(1),
  shippingNeighborhood: z.string("Debe proporcionar una cadena").trim().min(1),
  shippingCity: z.string("Debe proporcionar una cadena").trim().min(1),
  shippingState: z.string("Debe proporcionar una cadena").trim().min(1),
  shippingPostalCode: z.string("Debe proporcionar una cadena").trim().min(1),
  items: z
    .array(orderItemSchema)
    .min(1)
    .superRefine((items, ctx) => {
      const productIds = new Set<number>();

      items.forEach((item, index) => {
        if (productIds.has(item.productId)) {
          ctx.addIssue({
            code: "custom",
            message: `El producto ${item.productId} está repetido`,
            path: [index, "productId"],
          });
        }

        productIds.add(item.productId);
      });
    }),
});

export type ICreateOrderInput = z.infer<typeof createOrderSchema>;
