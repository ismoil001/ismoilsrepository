package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.Master;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.*;
import uz.pdp.apporderservice.repository.AttachmentRepository;
import uz.pdp.apporderservice.repository.MasterRepository;
import uz.pdp.apporderservice.service.MasterServise;

import javax.xml.ws.Action;
import java.util.UUID;

@RestController
@RequestMapping("/api/master")
public class MasterController {

    @Autowired
    MasterRepository masterRepository;
    @Autowired
    AttachmentRepository attachmentRepository;
    @Autowired
    MasterServise masterServise;

    @GetMapping
    public HttpEntity<?> getMasters(){
        return ResponseEntity.ok(new ApiResponseData(true,"success",masterRepository.findAll()));
    }
    @PostMapping
    public HttpEntity<?> saveMaster(@RequestBody ReqMaster reqMaster){
        return ResponseEntity.ok(new ApiResponseData(true,"success",masterRepository.save(new Master(reqMaster.getName(),reqMaster.getDescription(),attachmentRepository.findById(reqMaster.getAttachment()).orElseThrow(() -> new ResourceNotFoundException("master","id",reqMaster)),reqMaster.getActive()))));
    }

    @PutMapping
    public HttpEntity<?>editMaster(@RequestBody ReqEditMAster reqEditMAster){
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(
               masterServise.editingMaster(reqEditMAster));
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> deletePayment(@PathVariable UUID id){
        try {
            masterRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success",true));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));

        }


    }



}
