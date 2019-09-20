package uz.pdp.apporderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.Column;
import javax.persistence.Entity;

@EqualsAndHashCode(callSuper = true)
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TelegramState extends AbsEntity {
    @Column(unique = true)
    private Integer tgUserId;

    @Column(unique = true)
    private String phoneNumber;

    private String state;

    private String firstName;

    private String lastName;

    private String patron;

    private Long customerChatId;

}
