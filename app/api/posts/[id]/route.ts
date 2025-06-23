import dbConnect from "@/lib/db";
import FeaturePost from "@/lib/featurePost";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const post = await FeaturePost.findById(params.id).populate('userId', 'username');
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, status } = await req.json();
    const post = await FeaturePost.findById(params.id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (session.user.role === 'admin') {
        if (status) {
            post.status = status;
        }
    }

    if (post.userId.toString() === session.user.id) {
        if (title) {
            post.title = title;
        }
        if (body) {
            post.body = body;
        }
    } else if (session.user.role !== 'admin') {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await post.save();

    return NextResponse.json({ message: "Post updated successfully", post });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await FeaturePost.findById(params.id);

    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    if (post.userId.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await post.deleteOne();

    return NextResponse.json({ message: "Post deleted successfully" });
}
