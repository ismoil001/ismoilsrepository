package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.TelegramState;

import java.util.Optional;
import java.util.UUID;

public interface TelegramStateRepository extends JpaRepository<TelegramState, UUID> {
    Optional<TelegramState> findByTgUserId(Integer tgId);
}
