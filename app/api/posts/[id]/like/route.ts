import dbConnect from "@/lib/db";
import FeaturePost from "@/lib/featurePost";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await FeaturePost.findById(params.id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    let isLiked = false;

    if (post.likes.includes(userId)) {
        post.likes.pull(userId);
    } else {
        post.likes.push(userId);
        isLiked = true;
    }

    await post.save();

    return NextResponse.json({ isLiked, likeCount: post.likes.length });
}
