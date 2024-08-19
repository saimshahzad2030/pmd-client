
import { Addresstype, Highlights, Images, ShippingAddresstype, Specifications, Videos } from "@prisma/client"
//user
export type userCreation = {
  firstName: string
  lastName: string
  email: string
  password: string
}

export type userLogin = {
  email: string
  password: string
}
export type changePasswordOnForgetType = {
  password: string
  email: string
}
export type changePasswordType = {
  oldPassword: string
  newPassword: string
}
export type emailVerificationType = {
  email: string
}
export type otpType = {
  otp: number
  otpId: number
}

export type updateUserInfoType = {
  fullName: string
  email: string
  dateOfBirth: Date | string;
  phone: string
  gender: string
}


//reviews

export type productReviewType = {
  ratings: number
  review: string
  productId: number
}
export type websiteReviewType = {
  ratings: number
  review: string
}

export type addToFavouritesType = {
  productId: number
}


//address

export type addNewAddressType = {
  address: string
  city: string
  state: string
  postalcode: number
  phone: string
  fullName: string
  addressType: Addresstype
}

export type updateNewAddressType = {
  id: number
  address: string
  city: string
  state: string
  postalcode: number
  phone: string
  fullName: string
  addressType: Addresstype
  shippingAddressType: ShippingAddresstype
}

export type deleteAddressType = {
  id: number
}


//digital card
export type addNewDigitalWalletType = {
  accountNumber: number
  email: string 
  walletName: string 
}

//credit card
export type addNewCreditCardType = {
  cardNumber: bigint
  expiryDate: Date | string 
  cvv: bigint
  nameOnCard: string
}


//bank account
export type addNewBankAccoutType = {
  accountNo: bigint
  accountName:   string  
  bankName: string
}

//products

export type productReqType = {
  name: string
  available: number
  metalType: MetalType
  price: number
  specifications: string[]
  productDetails: string
  description: string
  productHighlights: string[] 


}

export enum MetalType {
  gold = 'gold',
  silver = 'silver',
  platinum = 'platinum',
  palladium = 'palladium',
  rare = 'rare'
}



//cart

export type cart = {
  productId: string
}


//order

export type placeOrderType = {
  productId: number
  quantity:number
  price: number
  orderPlacedDate: Date
  orderExpectedDate: Date 
  senderId: number
  paymentMethod: string 
  messageForSeller: string
  metalAuthenticaitonService: boolean
  shippingCost: number

}