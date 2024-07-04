import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { getSession } from 'next-auth/react';


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

      // await dbConnect();
      const username = req.query;

      if(!username){
        return res.status(408).json({message:'Username is required'})
      }
      
      await dbConnect()

      try {    
        const session = await getSession({req})

        if(!session){
          return res.status(410).json({message:'Unauthorised Request session cant be fetched'})
        }

        const user = await UserModel.findOne(
          {
              $or:[{username:username}],
          }
        );

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();

        if (
          session.user.resetToken !== user.resetToken || // Assuming the resetToken is stored in the session
          !user.resetPasswordExpiry ||
          now > user.resetPasswordExpiry
        ) {
          return res.status(404).json({ message: 'Invalid or expired token' });
        }
        
        return res.status(200).json({message:'Token is Valid'})

      } catch (error) {
           console.error('Error validating token:', error);
            return res.status(500).json({ message: 'Internal server error' });
      }
    
}
