package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Attachment;


import java.util.List;
import java.util.UUID;


public interface AttachmentRepository extends JpaRepository<Attachment, UUID> {

}
