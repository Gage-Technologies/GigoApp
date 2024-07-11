import {CodeFile} from './code_file';

export interface BytesLivePingRequest {
  byte_attempt_id: string;
}

export interface ByteUpdateCodeRequest {
  byte_attempt_id: string;
  content: string;
}

export interface AgentWsRequestMessage {
  byte_attempt_id: string;
  payload: ExecRequestPayload; // add "or lint" when lint is implemented
}

export interface ExecRequestPayload {
  lang: number;
  code: string;
}

export interface ExecResponsePayload {
  command_id_string: string;
  stdout: OutputRow[];
  stderr: OutputRow[];
  status_code: number;
  done: boolean;
}

export interface OutputRow {
  timestamp: number;
  content: string;
}

export interface Byte {
  _id: string;
  name: string;
  description_easy: string;
  description_medium: string;
  description_hard: string;
  files_easy: CodeFile[];
  files_medium: CodeFile[];
  files_hard: CodeFile[];
  dev_steps_easy: string;
  dev_steps_medium: string;
  dev_steps_hard: string;
  questions_easy: string[];
  questions_medium: string[];
  questions_hard: string[];
  lang: number;
  published: boolean;
  color: string;
}
