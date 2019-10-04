package uz.pdp.apporderservice.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class OrderPayment extends AbsEntity {

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    private Payment payment;

    @Column(nullable = false)
    private Double amount;

    @JsonManagedReference
    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    private Order order;
}
