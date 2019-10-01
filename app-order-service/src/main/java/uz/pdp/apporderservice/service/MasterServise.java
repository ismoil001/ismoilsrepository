package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Master;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ReqEditMAster;
import uz.pdp.apporderservice.payload.ReqMaster;
import uz.pdp.apporderservice.repository.AttachmentRepository;
import uz.pdp.apporderservice.repository.MasterRepository;

import java.util.UUID;

@Service
public class MasterServise {
    @Autowired
    MasterRepository masterRepository;
    @Autowired
    AttachmentRepository attachmentRepository;

    public ApiResponse editingMaster(ReqEditMAster reqEditMAster) {
        Master master = masterRepository.findById(reqEditMAster.getId()).orElseThrow(() -> new ResourceNotFoundException("s", "s", reqEditMAster.getId()));
        master.setActive(reqEditMAster.getActive());
        master.setAttachment(attachmentRepository.findById(reqEditMAster.getAttachment()).orElseThrow(() ->  new ResourceNotFoundException("s","s",reqEditMAster.getAttachment())));
        master.setFullName(reqEditMAster.getName());
        master.setDescription(reqEditMAster.getDescription());
        masterRepository.save(master);
        return new ApiResponse("Edited",true);
    }
}
