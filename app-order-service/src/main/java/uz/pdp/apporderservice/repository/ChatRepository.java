package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Chat;

import java.util.UUID;

public interface ChatRepository extends JpaRepository<Chat, UUID> {
}
