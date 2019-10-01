package uz.pdp.apporderservice.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.entity.User;

import java.util.List;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {

    List<Payment> findAllByUserAndLeftoverNotIn(User user,Double leftOver);

    List<Payment> findAllByUser_Id(UUID id);

    Page<Payment> findAllByLeftoverNotInAndUser_FirstNameContainingIgnoreCaseOrLeftoverNotInAndUser_LastNameContainingIgnoreCaseOrLeftoverNotInAndUser_PhoneNumberContainingOrLeftoverNotInAndUser_CompanyNameContainingIgnoreCase(Pageable pageable,Double leftOver1, String name1, Double leftOver2,String name2,Double leftOver3, String name3,Double leftOver4, String name4);

    Page<Payment> findAllByLeftoverAndUser_FirstNameContainingIgnoreCaseOrLeftoverAndUser_LastNameContainingIgnoreCaseOrLeftoverAndUser_PhoneNumberContainingOrLeftoverAndUser_CompanyNameContainingIgnoreCase(Pageable pageable,Double leftOver1, String name1, Double leftOver2,String name2,Double leftOver3, String name3,Double leftOver4, String name4);
}
