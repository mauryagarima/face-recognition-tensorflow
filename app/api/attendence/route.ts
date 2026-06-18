import { MongoClient, ObjectId } from "mongodb";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const studentId = request.nextUrl.searchParams.get("studentId")

    if (!studentId) {
        return Response.json({ message: "Student ID is required" }, { status: 400 })
    }

    if (!ObjectId.isValid(studentId)) {
        return Response.json({ message: "Invalid student ID" }, { status: 400 })
    }

    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
        await client.connect();
        const db = client.db("ists")
        const myAttendence = db.collection("attendence")
        const result = await myAttendence
            .find({ studentId: new ObjectId(studentId) })
            .sort({ timestamp: -1 })
            .toArray()

        return Response.json(result, { status: 200 });
    } catch {
        return Response.json({ message: "not connected" }, { status: 500 })
    } finally {
        await client.close()
    }
}

export async function POST(request: Request) {

    const body = await request.json()
    if (!body.qr) {
        return Response.json({ message: "QR code is required" }, { status: 400 })
    }
    const client = new MongoClient(process.env.MONGODB_URI as string);
    try {
        await client.connect();
        const db = client.db("ists")
        const myCollection = db.collection("students")
        const finded = await myCollection.findOne({ _id: new ObjectId(body.qr) })
        if (!finded) {
            return Response.json({ message: "Student not found" }, { status: 404 })
        }
        const myAttendence = db.collection("attendence")
        const todayAttendenceFinded = await myAttendence.findOne({
            studentId: new ObjectId(body.qr),
            date: new Date().toLocaleDateString()
        })
        if (todayAttendenceFinded) {
            return Response.json({ message: "Attendence already marked for today" }, { status: 400 })
        }

        await myAttendence.insertOne({
            studentId: new ObjectId(body.qr),
            timestamp: new Date(),
            date: new Date().toLocaleDateString()
        })
        return Response.json({ message: "Attendence marked successfully" }, { status: 200 })


    } catch {
        return Response.json({ message: "not connected" }, { status: 500 })
    } finally {
        await client.close()
    }

}
