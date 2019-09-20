package uz.pdp.apporderservice.entity.template;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import uz.pdp.apporderservice.entity.User;

import javax.persistence.*;

@Data
@EqualsAndHashCode(callSuper = true, exclude = {"createdBy", "updatedBy"})
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class UserDateAudit extends DateAudit {

    @CreatedBy
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(updatable = false)
    private User createdBy;

    @LastModifiedBy
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private User updatedBy;

}
