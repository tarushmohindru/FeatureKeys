import FeaturePost from "@/lib/featurePost";
import User from "@/lib/user";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";

export async function POST(req: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);

    console.log('Session:', session);

    if(!session?.user?.email){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    console.log('Looking for user with email:', session.user.email);
    
    // Let's see what users exist in the database
    const allUsers = await User.find({});
    console.log('All users in database:', allUsers.map(u => ({ id: u._id, email: u.email, username: u.username })));
    
    const user = await User.findOne({email: session.user.email});
    console.log('Found user:', user);

    if(!user){
        console.log('User not found in database');
        return NextResponse.json({error: "User not found"}, {status: 404});
    };

    const form = await req.formData();

    const title = form.get('title');
    const body = form.get('body');

    if (!title || !body) {
        return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
    }

    const newPost = await FeaturePost.create({title: title.toString(), body: body.toString(), userId: user._id});
    
    return NextResponse.json({message: "Feature post created successfully", post: newPost}, {status: 201});
}