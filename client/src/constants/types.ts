export interface MsgAttachment {
    id: string; // unique identifier for the attachment
    url: string; // link to the attachment
    type: "image" | "video" | "document" | "other"; // type of the attachment
}


export interface Message {
    id: string; // unique identifier for the message
    sender: {
        id: string; // sender's unique identifier
        name: {
            first: string;
            last: string;
        }; // sender's name
        email: string; // sender's email 
    };
    recipient: {
        id: string; // recipient's unique identifier
        name: {
            first: string;
            last: string;
        }; // recipient's name
        email: string; // recipient's email 
    };
    content: string; // the actual message content
    timestamp: Date | string; // when the message was sent
    status: "sent" | "delivered" | "read"; // status of the message
    attachments?: MsgAttachment[]; // list of attachments
    isImportant?: boolean; // flag to mark the message as important
    threadId?: string; // identifier for grouping related messages in a thread
    metadata?: Record<string, any>; // additional metadata for the message
}

export interface MessageResult {
    id: string;
    sender_id: string;
    reciever_id: string;
    data: string;
    created_at: string | Date;
}
