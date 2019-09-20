package uz.pdp.apporderservice.entity;

import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import uz.pdp.apporderservice.entity.enums.RoleName;

import javax.persistence.*;

@Data
@Entity
public class Role implements GrantedAuthority {

    @Id
    private Integer id;

    @Basic
    @Enumerated(EnumType.STRING)
    @Column(name = "name", nullable = false)
    private RoleName name;

    private String description;
    @Override
    public String getAuthority() {
        return null;
    }
}
