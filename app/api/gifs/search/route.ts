import { NextResponse } from "next/server";
import { searchGifs, getTrendingGifs } from "@/lib/tenor";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "20");

    let gifs;
    if (query) {
      gifs = await searchGifs(query, limit);
    } else {
      gifs = await getTrendingGifs(limit);
    }

    return NextResponse.json(gifs);
  } catch (error) {
    console.log("[GIFS_SEARCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


