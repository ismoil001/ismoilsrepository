package uz.pdp.apporderservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.apporderservice.entity.Attachment;
import uz.pdp.apporderservice.entity.AttachmentContent;


import java.util.Optional;
import java.util.UUID;

/**
 * Created by Sirojov on 19.11.2018.
 */
public interface AttachmentContentRepository extends JpaRepository<AttachmentContent,UUID> {
    AttachmentContent getByAttachment(Attachment attachment);

    Optional<AttachmentContent> findByAttachment(Attachment attachment);
}
