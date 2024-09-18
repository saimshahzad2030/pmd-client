import { Request, Response } from "express";
import prisma from "../db/db";
import { changePasswordType, userCreation, userLogin, emailVerificationType, otpType, changePasswordOnForgetType, updateUserInfoType } from '../types/req';
import bcrypt from "bcrypt";
import jwtConfig from "../middleware/jwt";
import { sendEmail } from '../services/send-email';
import { generateOtp } from '../services/generate-token';
import { stripe } from "../stripe/stripe";
import config from "../config";
import { uploadFile } from "../services/upload-file";
import { User } from "@prisma/client";
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body as userCreation;
    if (!email || !lastName || !firstName || !password) {
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
    const stripeAccount = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: email,
      capabilities: {
        transfers: { requested: true },
        card_payments: {
          requested: true,
        },
      },
    });

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPaswd,
        lastName,
        firstName,
        stripeConnectedAccountId: stripeAccount.id
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
      return res.status(409).json({ message: "Wrong credentials" });

    }
    const token = jwtConfig.sign({ user: { id: userExist.id, email: userExist.email, stripeConnectedAccountId: userExist.stripeConnectedAccountId } })
    const updatedUser = await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        token
      },
    })
    res.status(200).json({ message: "Login Succesfull", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}

export const changePasswordOnForget = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body as changePasswordOnForgetType;
    if (!password) {
      return res.status(404).json({ message: "Enter new Password please" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    // const userId:number = res.locals.user.id
    await prisma.user.update({
      where: {
        email
      },
      data: {
        password: encryptedPassword
      }
    }).catch((error) => {
      return res.status(520).json({ error })
    });
    const updatedUser = await prisma.user.findFirst({
      where: {
        email

      }

    })
    res.status(200).json({ message: "Password Succesfully changed", updatedUser });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword } = req.body as changePasswordType;
    if (!oldPassword || !newPassword) {
      return res.status(404).json({ message: "Enter both passwords please" });
    }

    const userId: number = res.locals.user.id
    const userExist = await prisma.user.findFirst({
      where: {
        id: userId

      }
    })
    if (!userExist) {
      return res.status(401).json({ message: "You are not authorized" });

    }
    const decryptedPassword = await bcrypt.compare(oldPassword, userExist.password)


    if (!decryptedPassword) {
      return res.status(401).json({ message: "you've entered wrong password" });

    }
    const encryptedPassword2 = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: encryptedPassword2
      }
    })
    res.status(200).json({ message: "Password Succesfully updated" });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otp, otpId

    } = req.body as otpType;
    if (!otp || !otpId) {
      return res.status(404).json({ message: "Enter the Otp" });
    }

    const otpAlreadyExist = await prisma.otp.findFirst({
      where: {
        id: otpId,
        otp
      }
    }).catch((error) => {
      console.error('Error in Prisma query:', error);
      throw new Error('Database query failed');
    })
    if (otpAlreadyExist) {
      await prisma.otp.delete({
        where: {
          id: otpAlreadyExist.id
        }
      })
      return res.status(200).json({ message: `Otp verified` });

    }
    res.status(400).json({ message: `Otp not verified` });

  } catch (error) {
    console.log(error, 'error from catch');
    res.status(520).json({ error });
  }
}
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body as emailVerificationType;
    if (!email) {
      return res.status(404).json({ message: "Enter the email" });
    }

    const userExist: User | null = await prisma.user.findFirst({
      where: {
        email
      }

    }).catch((error) => {
      throw new Error(error)
    });
    if (!userExist) {
      return res.status(404).json({ message: "No user found" });

    }
    const verificationToken = generateOtp();
    const id: number = userExist.id;
    const otpAlreadyExist = await prisma.otp.findFirst({
      where: {
        userId: userExist.id
      }
    })
    if (otpAlreadyExist) {
      const otp = await prisma.otp.update({
        where: {
          id: otpAlreadyExist.id
        },
        data: {
          otp: verificationToken,
        }
      })
      await sendEmail(
        userExist.email,

        'Email Verification',
        `${verificationToken} is your OTP`
      );
      return res.status(302).json({ message: `Otp Sent to ${userExist.email}`, otpId: otp.id });

    }
    const otp = await prisma.otp.create({
      data: {
        otp: verificationToken,
        userId: userExist.id
      }
    })
    await sendEmail(
      userExist.email,
      'Email Verification',
      `${verificationToken} is your OTP`
    );

    res.status(302).json({ message: `Otp Sent to ${userExist.email}`, otpId: otp.id });

  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}


export const changeInfo = async (req: Request, res: Response) => {
  try {
    const { email, dateOfBirth, phone, fullName, gender } = req.body as updateUserInfoType;
    if (!email || !dateOfBirth || !phone || !fullName || !gender) {
      return res.status(404).json({ message: "Enter all fields please" });
    }

    // const encryptedPassword =  await bcrypt.hash(oldPassword, 10);
    const userId: number = res.locals.user.id
    const uppdatedUser = await prisma.user.update({
      where: {
        id: userId

      },
      data: {
        email,
        dateOfBirth,
        phone,
        gender,
        fullName
      }
    }).catch((error) => {
      throw new Error(error)

    });

    return res.status(200).json({ message: "user information updated succesfully", uppdatedUser });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}


export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(404).json({ message: "Enter Id please" });
    }

    const userId = res.locals.user.id
    await prisma.user.delete({
      where: {
        id: Number(userId)

      }

    }).catch((error) => {
      throw new Error(error)
    });
    await stripe.accounts.del(res.locals.user.stripeConnectedAccountId).then(() => {
      return res.status(200).json({ message: "user deleted succesfully" });

    }).catch((error) => {
      throw new Error(error)
    });

  } catch (error) {
    res.status(520).send(error);
  }
}
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({});
    const products = await prisma.products.findMany({
      include: {
        Specifications: true,
        seller: true,
        images: true

      }
    })
    // await prisma.products.create({
    //   data: {
    //     sellerId: 4,
    //     name: "Elegant Platinum Necklace",
    //     quantity: 10,
    //     metalType: "Platinum",
    //     available: 17,
    //     rating: 4,
    //     price: 1500,
    //     productDetails: "A beautifully crafted gold necklace perfect for special occasions.",
    //     description: "This elegant gold necklace is made from 24k gold and features a simple yet stunning design.",
    //     Specifications: {
    //       create: [
    //         { specification: "24k gold, 18-inch chain, 5g weight" },
    //         { specification: "Handcrafted with intricate details" }
    //       ]
    //     },
    //     images: {
    //       create: [
    //         { image: "https://example.com/images/gold-necklace-1.jpg" },
    //         { image: "https://example.com/images/gold-necklace-2.jpg" }
    //       ]
    //     },
    //     productHighlights: {
    //       create: [
    //         { highlight: "Best Seller" },
    //         { highlight: "Limited Edition" }
    //       ]
    //     },
    //     videos: {
    //       create: [
    //         { video: "https://example.com/videos/gold-necklace.mp4" },
    //         { video: "https://example.com/videos/gold-necklace.mp4" },
    //         { video: "https://example.com/videos/gold-necklace.mp4" },
    //       ]
    //     },
    //   },
    // });
    res.status(200).json({ message: "Login Succesfull", users, currentUser: res?.locals?.user, products });
  } catch (error) {
    console.log(error);
    res.status(520).send(error);
  }
}



export const getSellerAccountDetails = async (req: Request, res: Response) => {
  try {
    const accountId = res.locals.user.stripeConnectedAccountId;
    // const accountId = 'acct_1PmsHFQFAm3jyZZu' 
    const account = await stripe.accounts.retrieve(
      accountId
    )
    const chargesEnabled = account.charges_enabled;
    const payoutsEnabled = account.payouts_enabled;

    if (chargesEnabled && payoutsEnabled) {

      return res.status(200).json({ authenticationRequired: false })

    } else {
      const accountLink = await stripe.accountLinks.create({
        account: accountId,
        refresh_url: `${config.CLIENT_URL}my-account/my-shop`,
        return_url: `${config.CLIENT_URL}my-account/my-shop`,
        type: 'account_onboarding',
      });

      return res.status(200).json({ url: accountLink.url, message: 'You must provide your business details like payment options on whcih u will recieve payments etc', authenticationRequired: true })

    }
  }
  catch (error) {
    res.status(520).send(error);

  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }
    const userId = Number(res.locals.user.id);
    const imageUrl = await uploadFile(req.file, 'images');
    let updatedUser;
    updatedUser = await prisma.user.update({
      where: {
        id: userId
      },
      data: {
        imageUrl
      }
    })


    res.status(200).json({ imageUrl, updatedUser });
  }
  catch (error) {
    res.status(520).send(error);

  }
}

