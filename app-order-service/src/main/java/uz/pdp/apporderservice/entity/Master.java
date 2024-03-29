package uz.pdp.apporderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Master extends AbsEntity {

    @Column(nullable = false)
    private String fullName;

    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    private Attachment attachment;

    private Boolean active;

}
