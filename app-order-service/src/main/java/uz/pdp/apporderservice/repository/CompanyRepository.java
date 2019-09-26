package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Company;

import java.util.UUID;

public interface CompanyRepository extends JpaRepository<Company, Integer> {
}
