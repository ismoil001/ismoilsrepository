package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.OrderPayment;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqPayment;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.PayTypeRepository;
import uz.pdp.apporderservice.repository.PaymentRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PayTypeRepository payTypeRepository;
    @Autowired
    OrderRepository orderRepository;

    public HttpEntity<?> savePayment(ReqPayment reqPayment) {
        try {
            User user = userRepository.findById(reqPayment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqPayment));
            Payment payment = paymentRepository.save(new Payment(
                    user,
                    payTypeRepository.findById(reqPayment.getPayTypeId()).orElseThrow(() -> new ResourceNotFoundException("payType", "id", reqPayment)),
                    reqPayment.getPayDate(),
                    reqPayment.getPaySum(),
                    reqPayment.getPaySum()
            ));
            List<Order> orders = orderRepository.findAllByUserAndStatusOrderByCreatedAtDesc(user, OrderStatus.ACTIVE);
            List<Order> changedOrders = new ArrayList<>();
            for (Order order : orders) {
                Double payed = order.getOrderPayments().stream().mapToDouble(OrderPayment::getAmount).sum();
                Double mustPay = order.getCount() * order.getPrice();
                if (mustPay - payed >= payment.getLeftover()) {
                    order.getOrderPayments().add(new OrderPayment(payment,payment.getLeftover(),order));
                    payment.setLeftover(0.0);
                    changedOrders.add(order);
                    break;
                }else{
                    order.getOrderPayments().add(new OrderPayment(payment,mustPay-payed,order));
                    payment.setLeftover(payment.getLeftover()-(mustPay-payed));
                    changedOrders.add(order);
                }
            }
            paymentRepository.save(payment);
            orderRepository.saveAll(changedOrders);
            return ResponseEntity.ok(new ApiResponse("success", true));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getAll() {
        try {
            return ResponseEntity.ok(new ApiResponseData(true, "success", paymentRepository.findAll()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("success", true));
        }

    }

    public HttpEntity<?> deletePayment(UUID id) {
        try {
            paymentRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
