package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.*;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.awt.print.Pageable;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;

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

    public HttpEntity<?> getActiveOrders(Integer page,Integer size,String name) {
        PageRequest pageable = PageRequest.of(page,size);
        return ResponseEntity.ok(new ApiResponseData(true, "success",
                new PageResponse((int) orderRepository.findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCase(pageable,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name).getTotalElements(),page,
                orderRepository.findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCase(pageable,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name,OrderStatus.ACTIVE,name).getContent().stream().map(order -> {
                    return new OrdersResponse(
                            order.getId(),
                            order.getOrderedDate(),
                            order.getUser().getLastName()+" "+order.getUser().getFirstName(),
                            order.getStatus().name(),
                            order.getUser().getId(),
                            order.getProductName(),
                            order.getUser().getCompanyName(),
                            order.getCount(),
                            order.getPrice(),
                            order.getPrice() * order.getCount(),
                            order.getOrderPayments().stream().map(orderPayment -> new ResPayment(orderPayment.getAmount(), orderPayment.getCreatedAt(), orderPayment.getPayment().getPayType().getName())).collect(Collectors.toList())
                    );
                }).collect(Collectors.toList())
        )));
    }
}
