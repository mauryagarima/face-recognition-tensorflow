import { MongoClient, ObjectId } from "mongodb";

export async function GET(request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const client = new MongoClient(process.env.MONGODB_URI as string);

    try{
        await client.connect();
        const db = client.db("ists")
        const myCollection = db.collection("students")
        const result = await myCollection.findOne({ _id: new ObjectId(id) })
        if(result){
            return Response.json(result , { status: 200 });
        }else{
            return Response.json({message:"Student not found"}, {status:404})
        }

    }catch{
        return Response.json(
            { message: "not connected" },
            { status: 500, });
    }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const client = new MongoClient(process.env.MONGODB_URI as string);

  try {
    await client.connect();

    const db = client.db("ists");
    const students = db.collection("students");

    const result = await students.deleteOne({
      _id: new ObjectId(id),
    });

    return Response.json(
      {
        message: "Student Deleted Successfully",
        result,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        message: "Delete Failed",
        error,
      },
      { status: 500 }
    );
  }
}