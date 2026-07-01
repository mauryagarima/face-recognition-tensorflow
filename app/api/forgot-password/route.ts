import { MongoClient } from "mongodb";

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.email) {
    return Response.json({ message: "Email is required" }, { status: 400 });
  }

  if (!body.password) {
    return Response.json({ message: "New password is required" }, { status: 400 });
  }

  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    await client.connect();
    const db = client.db("ists");
    const colleges = db.collection("colleges");

    const result = await colleges.updateOne(
      { email: body.email },
      { $set: { password: body.password } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ message: "No account found with this email" }, { status: 404 });
    }

    return Response.json({ message: "Password updated successfully" }, { status: 200 });
  } catch {
    return Response.json({ message: "Unable to reset password" }, { status: 500 });
  }
}
