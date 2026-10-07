import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string("Debe proporcionar una cadena").min(1, "El nombre es obligatorio"),
  price: z.number("Debe proporcionar un número").positive("El precio debe ser mayor que 0"),
  stock: z.number("Debe proporcionar un número").min(0, "El stock debe ser mayor o igual a 0"),
});

export const updateProductSchema = z
  .object({
    name: z.string("Debe proporcionar una cadena").min(1, "El nombre es obligatorio").optional(),
    price: z.number("Debe proporcionar un número").positive("El precio debe ser mayor a 0").optional(),
    stock: z.number("ebe proporcionar un número").min(0, "El stock debe ser mayor o igual a 0").optional(),
  })
  .refine((data) => data.name !== undefined || data.price !== undefined || data.stock !== undefined, {
    message: "Debes proporcionar al menos un campo para actualizar",
  });

export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
