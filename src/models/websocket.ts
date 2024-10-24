export enum WsMessageType {
  NewIncomingChatMessage,
  NewChat,
  NewOutgoingChatMessage,
  ValidationError,
  GenericError,
  SubscribeWorkspace,
  WorkspaceStatusUpdate,
  UnsubscribeWorkspace,
  UpdateChat,
  KickChat,
  GetChats,
  GetChatMessages,
  NewChatBroadcast,
  ChatSubscribe,
  ChatUnsubscribe,
  DeleteChat,
  UpdateReadMessage,
  UpdateChatMute,
  ChatUpdatedEvent,
  RecordWebUsage,
  AgentExecRequest,
  AgentExecResponse,
  AgentLintRequest,
  AgentLintResponse,
  ByteLivePing,
  ByteUpdateCode,
  CancelExecRequest,
  CancelExecResponse,
  StdinExecRequest,
  StdinExecResponse,
  LaunchLspRequest,
  LaunchLspResponse,
  AdminUpdateByteCodeRequest,
  AdminUpdateByteCodeResponse,
  AgentSyncFsRequest,
  AgentSyncFsResponse,
}

export enum WsResponseCode {
  BadRequest,
  ServerError,
  WorkspaceDestroyed,
}

export interface WsMessage<T> {
  sequence_id: string;
  type: WsMessageType;
  payload: T;
}

export interface WsGenericErrorPayload {
  code: WsResponseCode;
  error: string;
}

export interface WsValidationErrorPayload extends WsGenericErrorPayload {
  validation_errors: Record<string, string>;
}

export const wsMessageTypeToString = (t: WsMessageType) => {
  return [
    'MessageTypeNewIncomingChatMessage',
    'MessageTypeNewChat',
    'MessageTypeNewOutgoingChatMessage',
    'MessageTypeValidationError',
    'MessageTypeGenericError',
    'MessageTypeSubscribeWorkspace',
    'MessageTypeWorkspaceStatusUpdate',
    'MessageTypeUnsubscribeWorkspace',
    'MessageTypeUpdateChat',
    'MessageTypeKickChat',
    'MessageTypeGetChats',
    'MessageTypeGetChatMessages',
    'MessageTypeNewChatBroadcast',
    'MessageTypeChatSubscribe',
    'MessageTypeChatUnsubscribe',
    'MessageTypeDeleteChat',
    'MessageTypeUpdateReadMessage',
    'MessageTypeUpdateChatMute',
    'MessageTypeChatUpdatedEvent',
    'MessageTypeRecordWebUsage',
    'MessageTypeAgentExecRequest',
    'MessageTypeAgentExecResponse',
    'MessageTypeAgentLintRequest',
    'MessageTypeAgentLintResponse',
    'MessageTypeByteLivePing',
    'MessageTypeByteUpdateCode',
    'MessageTypeCancelExecRequest',
    'MessageTypeCancelExecResponse',
    'MessageTypeStdinExecRequest',
    'MessageTypeStdinExecResponse',
    'MessageTypeLaunchLspRequest',
    'MessageTypeLaunchAgentRequest',
    'MessageTypeAdminUpdateByteCodeRequest',
    'MessageTypeAdminUpdateByteCodeResponse',
  ][t];
};
