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

    private String address;

    private String email;

    private String facebook;

    private String instagram;

    private String youtube;

    private String telegram;

    private String phoneNumber1;
    private String phoneNumber2;
    private String phoneNumber3;

}
