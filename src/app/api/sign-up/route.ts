import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import {sendVerificationEmail} from  '@/utils/sendVerificationEmail';



export async function POST(request:Request) {
      await dbConnect();
      
      try {
        const {username,email,password}=  await request.json();
        // checks if the username is alread taken by a verified user if yes disallows the user to use that username
        const existingUserVerifiedByUsername= await UserModel.findOne({
            username,
            isVerified:true
        });
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success:false,
                    message:"Username already exists"
                },
                {
                    status:400
                }
            )
        }
       
        const existingUserByEmail= await UserModel.findOne({email});
        const verifyCode=Math.floor(100000+ Math.random() * 900000).toString();
         // checks if the user exists with that email if user exists 
        if (existingUserByEmail) {
            // if is verified-> blocks new user from using that email
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success:false,
                    message:"User already exists"
                },{status:400})
                // if user is not verified we update the user 
            }else{
               const hashedPassword=await bcrypt.hash(password,10);
               existingUserByEmail.password=hashedPassword;
               existingUserByEmail.verifyCode=verifyCode;
               existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000);
               await existingUserByEmail.save();
            }
            
        }
        else{
            const hashedPassword=await bcrypt.hash(password,10);
            const expiryDate=new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser= await UserModel.create({
                username,
                email,
                password:hashedPassword,
                verifyCode,
                verifyCodeExpiry:expiryDate,
            });

        }
        // send verification email
        const emailResponse= await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                success:false,
                message:emailResponse.message
            },{status:500})
        }
        return Response.json({
             success:true,
             message:"User registered successfully"
        },{status:201})
      } catch (error) {
        console.error("Error registering user",error);
        return Response.json(
        {
            success:false,
            message:"Error registering user"
        },
        {
            status:500
        }
    )
      }
}