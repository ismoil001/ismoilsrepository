package uz.pdp.apporderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.*;
import java.util.List;
import java.util.UUID;

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

    private String companyName;

    private Long customerChatId;

    private UUID orderId;

    private Double count;

    private Double newPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    private User myAdmin;

    @OneToMany(fetch = FetchType.LAZY)
    private List<DeletingMessage> deletingMessages;

}
