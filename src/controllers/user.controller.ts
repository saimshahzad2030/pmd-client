import { Request, Response } from "express";
import prisma from "../db/db";
import { changePasswordType, userCreation, userLogin, emailVerificationType } from '../types/req';
import bcrypt from "bcrypt";
import jwtConfig from "../middleware/jwt"; 
import { sendEmail } from '../services/send-email'; 
import { generateOtp } from '../services/generate-token';
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, email, password } = req.body as userCreation;
    if (!email || !lastname || !firstname || !password) {
      return res.status(404).json({ message: "All fields requried" });
    }
    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return res.status(409).json({ message: "User already exist" });
    }
    const hashPaswd = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPaswd,
        lastname,
        firstname
      }
    })
    res.status(200).json({ message: "User created Succesfully", user });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}


export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as userLogin;
    if (!email || !password) {
      return res.status(404).json({ message: "All fields requried" });
    }

    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    if (!userExist) {
      return res.status(409).json({ message: "Wrong Credentials" });
    }
    const encryptedPassword = await bcrypt.compare(password, userExist.password);
    console.log(encryptedPassword)
    if (!encryptedPassword) {
      return res.status(200).json({ message: "Wrong credentials" });

    }
    const token = jwtConfig.sign({ user: userExist })
    const updatedUser = await prisma.user.update({
      where: {
        id:userExist.id,
      },
      data: {
        token:token
      },
    })
    res.status(200).json({ message: "Login Succesfull",updatedUser});
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { password } = req.body as changePasswordType;
    if (!password) {
      return res.status(404).json({ message: "Enter new Password please" });
    }

    const encryptedPassword =  await bcrypt.hash(password, 10);
    const userId:number = res.locals.user.id
    await prisma.user.update({
      where: {
        id:userId ,
      },
      data:{
        password:encryptedPassword
      }
    }).catch((error)=>{
      return res.status(520).json({error})
    });   
    const updatedUser = await prisma.user.findFirst({
      where: {
        id:userId ,
      }
       
    })
    res.status(200).json({ message: "Password Succesfully changed",updatedUser});
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}

export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as emailVerificationType;
    if (!email) {
      return res.status(404).json({ message: "Enter the email" });
    }
 
    const userExist = await prisma.user.findFirst({
      where: {
        email:email ,
      }
      
    }).catch((error)=>{
      return res.status(520).json({error})
    });   
    if(!userExist){
     return res.status(404).json({ message: "No user found"});

  }
  const verificationToken = generateOtp(); 
    await sendEmail(
      'saimshehzad2030@gmail.com',
      'Email Verification',
      `${verificationToken} is your OTP`
    );

   res.status(302).json({ message: "user found",email});

    // res.status(200).json({ message: "Password Succesfully changed",updatedUser});
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}
export const getUsers = async (req: Request, res: Response) => {
  try {
    
    const users = await prisma.user.findMany({ });
     
    res.status(200).json({ message: "Login Succesfull",users,currentUser:res?.locals?.user});
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}