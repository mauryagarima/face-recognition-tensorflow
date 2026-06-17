import { MongoClient } from "mongodb";

export async function POST(request: Request) {

    const client = new MongoClient(process.env.MONGODB_URI as string);
    try {
        await client.connect();
        const db = client.db("ists")
        const myCollection = db.collection("colleges")
       
        const result = await myCollection.findOne({
            email: "a",
            password: "b"
        })
        if(result){
            return Response.json(result);
        }else{
            return Response.json({message: "Data not found"},{status:404});

        }

    } catch (error) {
        return Response.json(
            { message: "not connected" },
            { status: 500, });
    }

}