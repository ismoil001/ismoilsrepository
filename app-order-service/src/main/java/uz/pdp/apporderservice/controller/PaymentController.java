package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
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
    public HttpEntity<?> getPayment(){
        return paymentService.getAll();
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
