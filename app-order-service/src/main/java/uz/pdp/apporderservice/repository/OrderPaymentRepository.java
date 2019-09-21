package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.OrderPayment;

import java.util.UUID;

public interface OrderPaymentRepository extends JpaRepository<OrderPayment, UUID> {
}
