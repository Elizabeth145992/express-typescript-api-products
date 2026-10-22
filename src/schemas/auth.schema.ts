import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string("El nombre debe ser una cadena").min(2, "El nombre debe tener al menos dos caracteres.").trim(),
    lastName: z.string("El apellido debe ser una cadena").min(2, "El nombre debe tener al menos dos caracteres.").trim(),
    email: z.string().trim().email("Debe tener un formato de correo"),
    phone: z.string("El telefono debe ser una cadena").trim(),
    password: z.string().min(8, "La contraeña debe tener al menos 8 caracteres")
});

export const loginSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(1)
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;