import {CodeFile} from "./code_file";

export interface AdminUpdateByteCodeRequest {
    byte_id: string;
    files: CodeFile[];
    content_difficulty: number;
}

export interface AdminUpdateByteCodeResponse {
    success: boolean;
}
