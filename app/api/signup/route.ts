import { MongoClient } from "mongodb";

export async function POST(request: Request) {

    const body = await request.json()

    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
        await client.connect();
        const db = client.db("ists")
        const myCollection = db.collection("colleges")
        const finded = await myCollection.findOne({email:body.email})
        if(finded){
            return Response.json({message:"Email already exists"}, {status:400})
        }
        const result = await myCollection.insertOne({
            name: body.name,
            email: body.email,
            password: body.password
        })
        if (result) {
            return Response.json({
                message: "Data inserted successfully",
                result
            }, { status: 200 });
        } else {
            return Response.json({ message: "Failed to insert data" }, { status: 500 });
        }


    } catch (error) {
        return Response.json(
            { message: "not connected" },
            { status: 500, });
    }
}