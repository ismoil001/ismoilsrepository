package uz.pdp.apporderservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Master;

import java.util.UUID;

public interface MasterRepository extends JpaRepository<Master, UUID> {
}
