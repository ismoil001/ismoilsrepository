package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.payload.ReqOrder;
import uz.pdp.apporderservice.service.OrderService;

import java.util.UUID;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    OrderService orderService;

    @GetMapping("aksverka")
    public HttpEntity<?> getAksverka(@RequestParam UUID id){
        return orderService.aksverka(id);
    }

    @GetMapping("active")
    public HttpEntity<?> getActiveOrders(@RequestParam Integer page,@RequestParam Integer size,@RequestParam String name){
        return orderService.getActiveOrders(page,size,name);
    }

    @PostMapping
    public HttpEntity<?> saveOrder(@RequestBody ReqOrder reqOrder) {
        return orderService.saveOrder(reqOrder);
    }
    @PutMapping("{id}")
    public HttpEntity<?> editOrder(@RequestBody ReqOrder reqOrder, @PathVariable UUID id) {
        return orderService.editOrder(reqOrder,id);
    }

    @DeleteMapping("{id}")
    public HttpEntity deleteOrder(@PathVariable UUID id){
        return orderService.delete(id);
    }
}
