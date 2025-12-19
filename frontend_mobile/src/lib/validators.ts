import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Email invalide"),
    password: z.string().min(1, "Mot de passe requis"),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    surname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(9, "Numéro de téléphone invalide"),
    city: z.string().optional(),
    country: z.string().optional(),
    birthday: z.string().optional(),
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Veuillez confirmer votre mot de passe"),
    role: z.enum(["client", "prestataire"] as const, {
        message: "Veuillez sélectionner un rôle",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export const domainSchema = z.object({
    nom_domaine: z.string().min(2, "Le nom du domaine est requis"),
    description: z.string().min(1, "La description est requise"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    surname: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    phone: z.string()
        .min(8, "Numéro de téléphone invalide")
        .regex(/^\+?[0-9\s\-()]+$/, "Le numéro de téléphone ne doit contenir que des chiffres, espaces, tirets ou parenthèses"),
    city: z.string().optional(),
    country: z.string().optional(),
    birthday: z.string().optional(),
    locality: z.string().min(3, "Le nom du quartier doit avoir au moins 3 caractères"),
});

export const updatePasswordSchema = z.object({
    currentPassword: z.string().min(6, "Le mot de passe actuel est requis"),
    newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().min(6, "Veuillez confirmer le mot de passe"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type DomainFormData = z.infer<typeof domainSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export const providerBioSchema = z.object({
    description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
    disponibilite: z.string().optional(),
    tarif_horaire: z.string().optional(),
    experience_years: z.string().optional(),
});

export type ProviderBioFormData = z.infer<typeof providerBioSchema>;
