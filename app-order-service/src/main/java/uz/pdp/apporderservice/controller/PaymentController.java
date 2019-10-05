package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.payload.ReqPayment;
import uz.pdp.apporderservice.service.PaymentService;

import java.util.UUID;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    PaymentService paymentService;


    @GetMapping
    public HttpEntity<?> getPayment(@RequestParam Integer page,@RequestParam Integer size,@RequestParam String name,@RequestParam Boolean isArchive){
        return paymentService.getPayments(page,size,name,isArchive);
    }

    @PostMapping
    public HttpEntity<?> savePayment(@RequestBody ReqPayment reqPayment){
        return paymentService.savePayment(reqPayment);
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> deletePayment(@PathVariable UUID id){
        return paymentService.deletePayment(id);
    }

}
