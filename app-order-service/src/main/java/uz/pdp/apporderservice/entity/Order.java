package uz.pdp.apporderservice.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.entity.template.AbsEntity;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Orders")
public class Order extends AbsEntity{

    @Enumerated(EnumType.STRING)
    @Column
    private OrderStatus status;

    @ManyToOne(fetch = FetchType.LAZY,optional = false)
    private User user;

    @JsonBackReference
    @OneToMany(fetch = FetchType.LAZY,mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderPayment> orderPayments;

    @Column(nullable = false)
    private Timestamp orderedDate;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Double count;

    public Order(OrderStatus status, User user, Timestamp orderedDate, String productName, Double price, Double count) {
        this.status = status;
        this.user = user;
        this.orderedDate = orderedDate;
        this.productName = productName;
        this.price = price;
        this.count = count;
    }


}
