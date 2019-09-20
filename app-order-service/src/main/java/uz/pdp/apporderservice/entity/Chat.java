package uz.pdp.apporderservice.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.*;

/**
 * Created by Sirojov on 11.12.2018.
 */
@EqualsAndHashCode(callSuper = true)
@Entity
@Data
public class Chat extends AbsEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_client")
    private User fromClient;//client dan

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_client")
    private User toClient;//client ga

    private String text;


}
