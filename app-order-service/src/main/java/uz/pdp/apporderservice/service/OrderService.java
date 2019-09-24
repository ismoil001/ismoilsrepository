package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.*;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.PaymentRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.security.CurrentUser;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService  {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PaymentRepository paymentRepository;

    public HttpEntity<?> saveOrder(ReqOrder reqOrder) {
        try {
            orderRepository.save(new Order(
                    Enum.valueOf(OrderStatus.class, reqOrder.getStatus()),
                    userRepository.findById(reqOrder.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrder)),
                    reqOrder.getOrderedDate(),
                    reqOrder.getProductName(),
                    reqOrder.getPrice(),
                    reqOrder.getCount()
            ));
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> editOrder(ReqOrder reqOrder, UUID id) {
        try {
            Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("order", "id", id));
            order.setUser(userRepository.findById(reqOrder.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrder)));
            order.setCount(reqOrder.getCount());
            order.setOrderedDate(reqOrder.getOrderedDate());
            order.setPrice(reqOrder.getPrice());
            order.setProductName(reqOrder.getProductName());
            order.setStatus(Enum.valueOf(OrderStatus.class, reqOrder.getStatus()));
            orderRepository.save(order);
            return ResponseEntity.ok(new ApiResponse("success", true));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> getActiveOrders(Integer page, Integer size, String name, String status, boolean ismine, User currentUser) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> result;
        if(status.equals("notactive")){
            result= orderRepository.findAllByStatusOrderByCreatedAtDesc(pageable,OrderStatus.CLOSED);
        }else if(ismine){
            result = orderRepository.findAllByCreatedByAndStatusAndUser_CompanyNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_FirstNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_LastNameContainingIgnoreCaseOrCreatedByAndStatusAndProductNameContainingIgnoreCase(pageable,currentUser, OrderStatus.ACTIVE, name, currentUser,OrderStatus.ACTIVE, name, currentUser,OrderStatus.ACTIVE, name, currentUser,OrderStatus.ACTIVE, name);
        }else{
            result = orderRepository.findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCase(pageable, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name);
        }

        return ResponseEntity.ok(new ApiResponseData(true, "success",
                new PageResponse((int) result.getTotalElements(), page,
                        result.getContent().stream().map(order -> {
                            return new OrdersResponse(
                                    order.getId(),
                                    order.getOrderedDate(),
                                    order.getUser().getLastName() + " " + order.getUser().getFirstName(),
                                    order.getStatus().name(),
                                    order.getUser().getId(),
                                    order.getProductName(),
                                    order.getUser().getCompanyName(),
                                    order.getCount(),
                                    order.getPrice(),
                                    order.getPrice() * order.getCount(),
                                    order.getOrderPayments().stream().map(orderPayment -> new ResPayment(orderPayment.getAmount(), orderPayment.getCreatedAt(), orderPayment.getPayment().getPayType().getName())).collect(Collectors.toList()),
                                    order.getCreatedBy().getLastName()+" "+order.getCreatedBy().getFirstName()
                            );
                        }).collect(Collectors.toList())
                )));
    }

    public HttpEntity delete(UUID id) {
        try {
            orderRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("deleted", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }

    }

    public HttpEntity<?> aksverka(UUID id) {
        try {
            List<Order> orderList = orderRepository.findAllByUser_Id(id);
            List<Payment> paymentList = paymentRepository.findAllByUser_Id(id);
            List<Aksverka> aksverkaList = new ArrayList<>();
            Double sumOrderCost = 0.0;
            Double sumPayment = 0.0;
            Integer sumCount = 0;
            for (Order order : orderList) {
                sumOrderCost+=order.getPrice();
                sumCount+=order.getCount();
                aksverkaList.add(new Aksverka(
                        order.getOrderedDate(),
                        order.getProductName(),
                        order.getCount(),
                        order.getPrice(),
                        order.getPrice() * order.getCount(),
                        null
                ));
            }
            for (Payment payment : paymentList) {
                sumPayment+=payment.getPaySum();
                aksverkaList.add(new Aksverka(
                        payment.getPayDate(),
                        null,
                        null,
                        null,
                        null,
                        payment.getPaySum()
                ));
            }

            aksverkaList.sort(new Comparator<Aksverka>() {
                @Override
                public int compare(Aksverka u1, Aksverka u2) {
                    return u2.getDate().compareTo(u1.getDate());
                }
            });
           Double saldo = sumPayment-sumOrderCost;

            return ResponseEntity.ok(new ApiResponseData(true,"success",new ResAksverka(saldo,sumPayment,sumOrderCost,sumCount,aksverkaList)));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

}
