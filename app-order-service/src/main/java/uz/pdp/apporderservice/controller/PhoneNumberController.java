package uz.pdp.apporderservice.controller;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.PhoneNumber;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqPhoneNumber;
import uz.pdp.apporderservice.repository.PhoneNumberRepository;

import javax.xml.ws.Action;
import java.util.UUID;

@RestController
@RequestMapping("/api/phonenumber")
public class PhoneNumberController {

    @Autowired
    PhoneNumberRepository phoneNumberRepository;

    @GetMapping
    public HttpEntity<?> getNumbers(){
        return ResponseEntity.ok(new ApiResponseData(true,"success",phoneNumberRepository.findAll()));
    }
    @DeleteMapping("{id}")
    public HttpEntity<?> getNumbers(@PathVariable UUID id){
        phoneNumberRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse("success",true));
    }
    @PostMapping
    public HttpEntity<?> addNumber(@RequestBody ReqPhoneNumber number){
        try {
            phoneNumberRepository.save(new PhoneNumber(number.getNumber()));
            return ResponseEntity.ok(new ApiResponse("success",true));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));
        }
    }


}
