
export interface ArtistDetailDTO{
  userId: number;
  name: string;
  profilePictureUrl: string;
  followingQuantity: number
  followerQuantity: number;
  bio:string;
  dayOfBirth: Date;
  email: string;
  phoneNumber: string;
}

export interface Artist {
  userId: number;
  name: string;
  profilePictureUrl: string;
}
