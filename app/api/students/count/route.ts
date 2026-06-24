import { MongoClient } from "mongodb";
export async function GET() {
    const client = new MongoClient(process.env.MONGODB_URI as string);
    try {
        await client.connect();
        const db = client.db("ists")
        const myCollection = db.collection("students")
        const result = await myCollection.count()

        return Response.json({ count: result }, { status: 200 });
    } catch {
        return Response.json(
            { message: "not connected" },
            { status: 500, });
    }

}