package uz.pdp.apporderservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Portfolio;

import java.util.UUID;

public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
}
