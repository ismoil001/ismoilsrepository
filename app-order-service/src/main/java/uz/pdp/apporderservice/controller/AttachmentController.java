package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.pdp.apporderservice.entity.Attachment;
import uz.pdp.apporderservice.repository.AttachmentContentRepository;
import uz.pdp.apporderservice.repository.AttachmentRepository;
import uz.pdp.apporderservice.service.AttachmentService;

import javax.servlet.http.HttpServletResponse;

/**
 * Created by Sirojov on 19.11.2018.
 */
@RestController
@RequestMapping("api/file")
public class AttachmentController {
    @Autowired
    private AttachmentService attachmentService;

    @Autowired
    AttachmentContentRepository attachmentContentRepository;

    @Autowired
    AttachmentRepository attachmentRepository;

    @PostMapping("/save")
    public Attachment save(MultipartHttpServletRequest request) {
        return attachmentService.saveFile(request);
    }

    @GetMapping("/get/{id}")
    public void getFile(HttpServletResponse response, @PathVariable String id) {
        attachmentService.getFile(response, id);
    }

}
