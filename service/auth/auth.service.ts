import { api } from "@/lib/axios";
import type { RegisterInput } from "@/lib/validations/auth";

export async function registerUser(payload: RegisterInput) {
  const { data } = await api.post("/api/register", payload);
  return data;
}
