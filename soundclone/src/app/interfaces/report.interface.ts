
export interface SystemReportDTO {
  systemReportId: number;
  userId: number;
  content: string;
  isReplied: boolean;
}

export interface SystemReportDetailDTO {
  systemReportId: number;
  userId: number;
  content: string;
  reportDate: string;
  replyContent: string;
  replyDate: string;
}

export interface ReplySystemReportDTO {
  systemReportId: number;
  replyContent: string;
}
