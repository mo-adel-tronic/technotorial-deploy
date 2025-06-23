import { RevalidateKey } from "@/constants/RevalidateKey";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const req = await request.json();
  const { path, tag } = req;
  if (!path && !tag) {
    return NextResponse.json(
      {
        message: "Missing required fields tag or path",
        data: null,
        error: true,
      },
      { status: 400 }
    );
  }
  try {
    if(path) {
      revalidatePath(path, 'layout')
    }
    if (tag) {
      if (tag == '*') {
        for(const t of Object.values(RevalidateKey)) {
          revalidateTag(t)
        }
      } else {
        revalidateTag(tag)
      }
    }
    return NextResponse.json({
        message: "Cache revalidated",
        data: null,
        error: false
    });
  } catch (error) {
    return NextResponse.json({
      message: "revalidated error: " + (error instanceof Error ? error.message : "Unknown error"),
      data: null,
      error: true
    }, {status: 500})
  }
}