export interface UserProfile {
   userId: number;
  name: string;
  email: string;
  dayOfBirth: string;
  phoneNumber: string;
  bio?: string;
  profilePictureUrl?: string;
  createAt: string;
  updateAt: string;
  username: string;
  hashedPassword: string;
  status: string;
  roleId: number;
}
export interface ChangeProfilePicture {
  userId: number;
  profilePictureUrl: string;

}
export interface UserInformation {
  userId: number;
  name: string;
  email: string;
  dayOfBirth: string;
  phoneNumber: string;
  bio?: string;
}
