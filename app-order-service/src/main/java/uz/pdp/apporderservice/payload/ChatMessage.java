package uz.pdp.apporderservice.payload;

import lombok.Data;

/**
 * Created by Sirojov on 12.12.2018.
 */
@Data
public class ChatMessage {
    private MessageType type;
    private String content;
    private String sender;

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}
