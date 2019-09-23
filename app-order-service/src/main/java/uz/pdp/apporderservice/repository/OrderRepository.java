package uz.pdp.apporderservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.OrderStatus;

import java.util.List;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {

    Page<Order> findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCase(Pageable pageable, OrderStatus status,String name,OrderStatus status1,String name1,OrderStatus status2,String name2,OrderStatus status3,String name3);

    List<Order> findAllByUser_Id(UUID userId);

    @Query(value = "select cast(t.id as varchar ) from users t where t.id in (select user_id from user_role where role_id=30) order by (select count(*) from orders o where o.created_by_id=t.id) limit 1",nativeQuery = true)
    String getUserWithLessOrder();

}
