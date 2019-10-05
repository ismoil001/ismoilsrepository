package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
import uz.pdp.apporderservice.payload.PageResponse;
import uz.pdp.apporderservice.payload.ReqPayment;
import uz.pdp.apporderservice.repository.*;

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
    @Autowired
    OrderPaymentRepository orderPaymentRepository;

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
            Payment save = paymentRepository.save(payment);
            orderRepository.saveAll(changedOrders);
            return ResponseEntity.ok(new ApiResponse(save.getLeftover()==0?"true":"false", true));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getPayments(Integer page,Integer size,String name,Boolean isArchive) {
        try {
            Pageable pageable = PageRequest.of(page,size);
            Page<Payment> paymentList;
            if(isArchive){
                paymentList = paymentRepository.findAllByLeftoverAndUser_FirstNameContainingIgnoreCaseOrLeftoverAndUser_LastNameContainingIgnoreCaseOrLeftoverAndUser_PhoneNumberContainingOrLeftoverAndUser_CompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(pageable,0.0, name,0.0, name, 0.0,name,0.0, name);
            }else{
                paymentList= paymentRepository.findAllByLeftoverNotInAndUser_FirstNameContainingIgnoreCaseOrLeftoverNotInAndUser_LastNameContainingIgnoreCaseOrLeftoverNotInAndUser_PhoneNumberContainingOrLeftoverNotInAndUser_CompanyNameContainingIgnoreCaseOrderByCreatedAtDesc(pageable,0.0, name,0.0, name, 0.0,name,0.0, name);
            }
            return ResponseEntity.ok(new PageResponse((int)paymentList.getTotalElements(),page,paymentList.getContent()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }

    }

    public HttpEntity<?> deletePayment(UUID id) {
        try {
            List<OrderPayment> payments = orderPaymentRepository.findAllByPayment_Id(id);
            for (OrderPayment payment : payments) {
                payment.getOrder().setStatus(OrderStatus.ACTIVE);
                orderRepository.save(payment.getOrder());
            }
            orderPaymentRepository.deleteAll(payments);
            paymentRepository.deleteById(id);

            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }
}
