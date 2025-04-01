// src/app/api/login/route.ts
import { NextResponse } from "next/server";
import { users } from "@/lib/users";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Login successful!" });
}