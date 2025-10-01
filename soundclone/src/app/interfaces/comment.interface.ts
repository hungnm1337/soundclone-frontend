import { Artist } from "./artist.interface";

export interface CommentDTO {
  commentId: number;
  writeBy: number;
  writeByUser?: Artist;
  writeDate: string;
  trackId: number;
  parentCommentId?: number | null;
  content: string;
}
