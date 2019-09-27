package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.OrderPayment;

import java.util.List;
import java.util.UUID;

public interface OrderPaymentRepository extends JpaRepository<OrderPayment, UUID> {
    List<OrderPayment> findAllByPayment_Id(UUID id);

    List<OrderPayment> findAllByOrder_Id(UUID id);
}
