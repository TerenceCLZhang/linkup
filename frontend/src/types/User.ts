export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  lastLogin: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  createdAt: string;
  updatedAt: string;
}
