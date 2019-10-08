package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Basket;
import uz.pdp.apporderservice.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BasketRepository extends JpaRepository<Basket, UUID> {
    Optional<Basket> findByUser(User user);
}
