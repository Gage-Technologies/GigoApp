export interface LaunchLspRequest {
  lang: number;
  content: string;
  file_name?: string;
  byte_id?: string;
  difficulty?: string;
}

export interface LaunchLspResponse {
  success: boolean;
}
