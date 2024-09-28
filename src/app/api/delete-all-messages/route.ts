import { getServerSession } from "next-auth";
import {authOptions} from '../auth/[...nextauth]/options'
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";

export async function DELETE(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions); // For currently logged in user
  const user: User = session?.user as User;

  console.log("this is session *****",session)
  if (!session || !user) { // If not authenticated
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Not Authenticated',
      }),
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: user._id }, // Finding user
      { $set: { messages: [] } } // Clear all messages
    );

    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'There are no messages in your inbox.',
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'All messages deleted',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log("This is message delete route error", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error Deleting Messages',
      }),
      { status: 500 }
    );
  }
}