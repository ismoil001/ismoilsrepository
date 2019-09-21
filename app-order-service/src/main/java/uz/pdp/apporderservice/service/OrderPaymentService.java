package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.OrderPayment;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ReqOrderPayment;
import uz.pdp.apporderservice.repository.OrderPaymentRepository;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.PaymentRepository;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderPaymentService {

    @Autowired
    OrderPaymentRepository orderPaymentRepository;
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    PaymentRepository paymentRepository;

    public HttpEntity<?> saveOrderPayment(ReqOrderPayment reqOrderPayment) {
        try {
            Order order = orderRepository.findById(reqOrderPayment.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("orderpayment", "id", reqOrderPayment));
            List<Payment> payments = paymentRepository.findAllByUserAndLeftoverNotIn(order.getUser(), 0.0);
            Double p = reqOrderPayment.getAmount();
            List<OrderPayment> orderPayments = new ArrayList<>();
            for (Payment payment : payments) {
                if (payment.getPaySum() >= p) {
                    OrderPayment orderPayment = new OrderPayment();
                    orderPayment.setPayment(payment);
                    orderPayment.setAmount(p);
                    orderPayment.setOrder(order);
                    payment.setLeftover(payment.getPaySum() - p);
                    orderPayments.add(orderPayment);
                    break;
                } else {
                    payment.setLeftover(0.0);
                    OrderPayment orderPayment = new OrderPayment();
                    orderPayment.setOrder(order);
                    orderPayment.setAmount(payment.getPaySum());
                    orderPayment.setPayment(payment);
                    p -= payment.getPaySum();
                    orderPayments.add(orderPayment);
                }
            }
            paymentRepository.saveAll(payments);
            orderPaymentRepository.saveAll(orderPayments);
            return ResponseEntity.ok(new ApiResponse("success", true));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
