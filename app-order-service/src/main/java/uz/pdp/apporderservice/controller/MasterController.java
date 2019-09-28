package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.Master;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqMaster;
import uz.pdp.apporderservice.payload.ReqPayment;
import uz.pdp.apporderservice.repository.AttachmentRepository;
import uz.pdp.apporderservice.repository.MasterRepository;

import javax.xml.ws.Action;
import java.util.UUID;

@RestController
@RequestMapping("/api/master")
public class MasterController {

    @Autowired
    MasterRepository masterRepository;
    @Autowired
    AttachmentRepository attachmentRepository;

    @GetMapping
    public HttpEntity<?> getAksverka(){
        return ResponseEntity.ok(new ApiResponseData(true,"success",masterRepository.findAll()));
    }
    @PostMapping
    public HttpEntity<?> savePayment(@RequestBody ReqMaster reqMaster){
        return ResponseEntity.ok(new ApiResponseData(true,"success",masterRepository.save(new Master(reqMaster.getName(),reqMaster.getDescription(),attachmentRepository.findById(reqMaster.getAttachment()).orElseThrow(() -> new ResourceNotFoundException("master","id",reqMaster)),reqMaster.getActive()))));
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
