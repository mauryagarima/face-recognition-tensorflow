import { MongoClient } from "mongodb";
import { cookies } from "next/headers";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ enrollmentNumber: string }> }
) {
    const { enrollmentNumber } = await params;
    const cookieStore = await cookies();
    const collegeId = cookieStore.get("user")?.value;
    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
        await client.connect();
        const db = client.db("ists");
        const myCollection = db.collection("students");
        const result = await myCollection.findOne({ enrollmentNumber: String(enrollmentNumber), collegeId });

        if (result) {
            return Response.json(result, { status: 200 });
        }

        return Response.json({ message: "Student not found" }, { status: 404 });
    } catch {
        return Response.json(
            { message: "not connected" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ enrollmentNumber: string }> }
) {
    const { enrollmentNumber } = await params;
    const cookieStore = await cookies();
    const collegeId = cookieStore.get("user")?.value;
    const body = await request.json();
    const currentEnrollmentNumber = String(body.currentEnrollmentNumber || enrollmentNumber || body.enrollmentNumber || "");

    if (!currentEnrollmentNumber) {
        return Response.json({ message: "enrollmentNumber not found" }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGODB_URI as string);

    try {
        await client.connect();

        const db = client.db("ists");
        const myCollection = db.collection("students");
        const existingStudent = await myCollection.findOne({ enrollmentNumber: currentEnrollmentNumber, collegeId });

        if (!existingStudent) {
            return Response.json({ message: "Student not found" }, { status: 404 });
        }

        const updateFields: Record<string, unknown> = {};

        if (typeof body.name === "string" && body.name.trim()) {
            updateFields.name = body.name.trim();
        }

        if (typeof body.branch === "string" && body.branch.trim()) {
            updateFields.branch = body.branch.trim();
        }

        if (body.semester !== undefined && body.semester !== "") {
            updateFields.semester = String(body.semester);
        }

        if (typeof body.introduction === "string") {
            updateFields.introduction = body.introduction;
        }

        if (typeof body.first_year_marks === "string") {
            updateFields.first_year_marks = body.first_year_marks;
        }

        if (typeof body.second_year_marks === "string") {
            updateFields.second_year_marks = body.second_year_marks;
        }

        if (typeof body.third_year_marks === "string") {
            updateFields.third_year_marks = body.third_year_marks;
        }

        if (body.enrollmentNumber !== undefined && body.enrollmentNumber !== "") {
            const nextEnrollmentNumber = String(body.enrollmentNumber).trim();
            const duplicateStudent = await myCollection.findOne({ enrollmentNumber: nextEnrollmentNumber, collegeId });

            if (duplicateStudent && duplicateStudent._id.toString() !== existingStudent._id.toString()) {
                return Response.json({ message: "Enrollment number already exists" }, { status: 400 });
            }

            updateFields.enrollmentNumber = nextEnrollmentNumber;
        }

        if (Object.keys(updateFields).length === 0) {
            return Response.json({ message: "No update fields provided" }, { status: 400 });
        }

        const updatedDoc = await myCollection.findOneAndUpdate(
            { enrollmentNumber: currentEnrollmentNumber, collegeId },
            { $set: updateFields },
            { returnDocument: "after" }
        );

        return Response.json({ message: "Student updated", updatedDoc });
    } catch (error) {
        return Response.json({ message: "ERROR", error }, { status: 500 });
    }
}