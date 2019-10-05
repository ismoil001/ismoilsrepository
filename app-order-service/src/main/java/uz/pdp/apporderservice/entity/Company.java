package uz.pdp.apporderservice.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Company {

    @Id
    private Integer id;
    @Column(nullable = false)
    private String address;
    @Column(nullable = false)
    private String addressRu;
    @Column(nullable = false)
    private String email;
    private String facebook;
    private String instagram;
    private String youtube;
    private String telegram;
    @Column(nullable = false)
    private String phoneNumber1;
    @Column(nullable = false)
    private String phoneNumber2;
    @Column(nullable = false)
    private String phoneNumber3;
    @Column(nullable = false)
    private Integer countCustomer;
    @Column(nullable = false)
    private Integer orderCount;
    @Column(nullable = false)
    private Integer masterCount;


}
