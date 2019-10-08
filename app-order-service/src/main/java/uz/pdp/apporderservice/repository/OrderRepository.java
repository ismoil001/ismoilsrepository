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

    Page<Order> findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCaseOrderByCreatedAtDesc(Pageable pageable, OrderStatus status,String name,OrderStatus status1,String name1,OrderStatus status2,String name2,OrderStatus status3,String name3);

    Page<Order> findAllByCreatedByAndStatusAndUser_CompanyNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_FirstNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_LastNameContainingIgnoreCaseOrCreatedByAndStatusAndProductNameContainingIgnoreCaseOrderByCreatedAtDesc(Pageable pageable,User user, OrderStatus status,String name,User user1,OrderStatus status1,String name1,User user2,OrderStatus status2,String name2,User user3,OrderStatus status3,String name3);

    Page<Order> findAllByStatusOrderByCreatedAtDesc(Pageable pageable,OrderStatus status);

    List<Order> findAllByUser_Id(UUID userId);
    Order findTop1ByUser_IdOrderByCreatedAtDesc(UUID userId);

    Integer countAllByStatus(OrderStatus status);

    List<Order> findAllByUserAndStatusOrderByCreatedAtDesc(User user,OrderStatus status);

    @Query(value = "select * from orders t where t.id=(select id from orders where product_name=t.product_name order by created_at desc limit 1) and t.user_id=:userId and t.status<>'HIDDEN'",nativeQuery = true)
    List<Order> findAllByUser_Id1(UUID userId);

    @Query(value = "select cast(t.id as varchar ) from users t where t.id in (select user_id from user_role where role_id=30) order by (select count(*) from orders o where o.created_by_id=t.id) limit 1",nativeQuery = true)
    String getUserWithLessOrder();

    Integer countAllByUser(User user);
}
