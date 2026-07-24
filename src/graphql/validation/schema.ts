import {z} from "zod";

export const taskTitleSchema = z.string().min(1).max(100);
export const uuidSchema = z.string().uuid("id must be a valid uuid");
