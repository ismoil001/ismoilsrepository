package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.entity.User;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findAllByUserAndLeftoverNotIn(User user,Double leftOver);

    List<Payment> findAllByUser_Id(UUID id);

}
