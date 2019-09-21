package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.apporderservice.entity.OrderPayment;
import uz.pdp.apporderservice.payload.ReqOrderPayment;
import uz.pdp.apporderservice.service.OrderPaymentService;

@RestController
@RequestMapping("/api/orderPayment")
public class OrderPaymentController {

    @Autowired
    OrderPaymentService orderPaymentService;

    @PostMapping
    public HttpEntity<?> saveOrderPayment(@RequestBody ReqOrderPayment reqOrderPayment){
        return orderPaymentService.saveOrderPayment(reqOrderPayment);
    }
}
