package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByPhoneNumber(String phoneNumber);

    Optional<User> findByTelegramId(Integer telegramId);

    List<User> findByRolesIn(Set<Role> roles);

    @Query(value = "select * from users where id in (select t.user_id from user_role t where t.role_id=20) and (lower (first_name) like lower(concat('%',:name,'%')) or lower (last_name) like lower(concat('%',:name,'%'))or lower (phone_number) like lower(concat('%',:name,'%')) or lower (company_name) like lower(concat('%',:name,'%')))",nativeQuery = true)
    List<User> searchCustomers(@Param("name") String name);

}
