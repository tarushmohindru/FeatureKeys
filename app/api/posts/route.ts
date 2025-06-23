import dbConnect from "@/lib/db";
import FeaturePost from "@/lib/featurePost";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await dbConnect();

    const posts = await FeaturePost.find({}).populate('userId', 'username');

    return NextResponse.json({ posts });
}
