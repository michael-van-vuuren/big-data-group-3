// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { users } from "@/lib/users";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (users.find(user => user.email === email)) {
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });
  }

  users.push({ name, email, password });
  return NextResponse.json({ success: true, message: "User registered!" });
}