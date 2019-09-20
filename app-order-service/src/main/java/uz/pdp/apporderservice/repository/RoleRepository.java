package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.enums.RoleName;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {

    List<Role> findAllByName(RoleName name);

    Optional<Role> findByName(RoleName name);

    List<Role> findAllByNameIn(List<RoleName> names);
}
