import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export function verifyAdminToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { success: false, error: "ไม่พบ Token" };
  }

  const token = authHeader.substring(7);
  const decoded = verifyToken(token);

  if (!decoded || decoded.role !== "admin") {
    return { success: false, error: "ไม่มีสิทธิ์เข้าถึง" };
  }

  return { success: true, user: decoded };
}
