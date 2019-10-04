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
import uz.pdp.apporderservice.payload.*;
import uz.pdp.apporderservice.repository.OrderPaymentRepository;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.PaymentRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.security.CurrentUser;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    OrderRepository orderRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    OrderPaymentRepository orderPaymentRepository;

    public HttpEntity<?> saveOrder(ReqOrder reqOrder) {
        try {
            Order order = orderRepository.save(new Order(
                    Enum.valueOf(OrderStatus.class, reqOrder.getStatus()),
                    userRepository.findById(reqOrder.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrder)),
                    reqOrder.getOrderedDate(),
                    reqOrder.getProductName(),
                    reqOrder.getPrice(),
                    reqOrder.getCount()
            ));
            List<Payment> changingPayments = new ArrayList<>();
            List<Payment> payments = paymentRepository.findAllByUserAndLeftoverNotIn(order.getUser(), 0.0);
            for (Payment payment : payments) {
                if (payment.getLeftover() >= order.getCount() * order.getPrice()) {
                    if (order.getOrderPayments() != null) {
                        order.getOrderPayments().add(new OrderPayment(payment, order.getPrice() * order.getCount(), order));
                    } else {
                        List<OrderPayment> orderPayments = new ArrayList<>();
                        orderPayments.add(new OrderPayment(payment, order.getPrice() * order.getCount(), order));
                        order.setOrderPayments(orderPayments);
                    }
                    payment.setLeftover(payment.getLeftover() - order.getCount() * order.getPrice());
                    changingPayments.add(payment);
                    break;
                } else {
                    if (order.getOrderPayments() != null) {
                        order.getOrderPayments().add(new OrderPayment(payment, payment.getLeftover(), order));
                    }else{
                        List<OrderPayment> orderPayments = new ArrayList<>();
                        orderPayments.add(new OrderPayment(payment,payment.getLeftover(),order));
                        order.setOrderPayments(orderPayments);
                    }
                    payment.setLeftover(0.0);
                    changingPayments.add(payment);
                }
            }
            paymentRepository.saveAll(changingPayments);
            orderRepository.save(order);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }


    public Order saveOrderByBot(ReqOrderBot reqOrderBot) {
        try {
            Order order1= new Order();
            order1.setOrderedDate(reqOrderBot.getOrderedDate());
            order1.setStatus(Enum.valueOf(OrderStatus.class, reqOrderBot.getStatus()));
            order1.setProductName(reqOrderBot.getProductName());
            order1.setUser(userRepository.findById(reqOrderBot.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrderBot)));
            order1.setPrice(reqOrderBot.getPrice());
            order1.setCount(reqOrderBot.getCount());
            order1.setCreatedBy(userRepository.findById(reqOrderBot.getCreatedById()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrderBot)));
            order1.setUpdatedBy(userRepository.findById(reqOrderBot.getCreatedById()).orElseThrow(() -> new ResourceNotFoundException("user", "id", reqOrderBot)));
            Order order = orderRepository.save(order1);
            List<Payment> changingPayments = new ArrayList<>();
            List<Payment> payments = paymentRepository.findAllByUserAndLeftoverNotIn(order.getUser(), 0.0);
            for (Payment payment : payments) {
                if (payment.getLeftover() >= order.getCount() * order.getPrice()) {
                    if (order.getOrderPayments() != null) {
                        order.getOrderPayments().add(new OrderPayment(payment, order.getPrice() * order.getCount(), order));
                    } else {
                        List<OrderPayment> orderPayments = new ArrayList<>();
                        orderPayments.add(new OrderPayment(payment, order.getPrice() * order.getCount(), order));
                        order.setOrderPayments(orderPayments);
                    }
                    payment.setLeftover(payment.getLeftover() - order.getCount() * order.getPrice());
                    changingPayments.add(payment);
                    break;
                } else {
                    if (order.getOrderPayments() != null) {
                        order.getOrderPayments().add(new OrderPayment(payment, payment.getLeftover(), order));
                    }else{
                        List<OrderPayment> orderPayments = new ArrayList<>();
                        orderPayments.add(new OrderPayment(payment,payment.getLeftover(),order));
                        order.setOrderPayments(orderPayments);
                    }
                    payment.setLeftover(0.0);
                    changingPayments.add(payment);
                }
            }
            paymentRepository.saveAll(changingPayments);
            return orderRepository.save(order);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
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
        if (status.equals("notactive")) {
            result = orderRepository.findAllByStatusOrderByCreatedAtDesc(pageable, OrderStatus.CLOSED);
        } else if (ismine) {
            result = orderRepository.findAllByCreatedByAndStatusAndUser_CompanyNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_FirstNameContainingIgnoreCaseOrCreatedByAndStatusAndUser_LastNameContainingIgnoreCaseOrCreatedByAndStatusAndProductNameContainingIgnoreCaseOrderByCreatedAtDesc(pageable, currentUser, OrderStatus.ACTIVE, name, currentUser, OrderStatus.ACTIVE, name, currentUser, OrderStatus.ACTIVE, name, currentUser, OrderStatus.ACTIVE, name);
        } else {
            result = orderRepository.findAllByStatusAndUser_CompanyNameContainingIgnoreCaseOrStatusAndUser_FirstNameContainingIgnoreCaseOrStatusAndUser_LastNameContainingIgnoreCaseOrStatusAndProductNameContainingIgnoreCaseOrderByCreatedAtDesc(pageable, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name, OrderStatus.ACTIVE, name);
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
                                    order.getCreatedBy().getLastName() + " " + order.getCreatedBy().getFirstName()
                            );
                        }).collect(Collectors.toList())
                )));
    }

    public HttpEntity delete(UUID id) {
        try {
            List<OrderPayment> orderPayments = orderPaymentRepository.findAllByOrder_Id(id);
            List<Payment> paymentList = new ArrayList<>();
            for (OrderPayment orderPayment : orderPayments) {
                orderPayment.getPayment().setLeftover(orderPayment.getPayment().getLeftover()+orderPayment.getAmount());
                paymentList.add(orderPayment.getPayment());
            }
            paymentRepository.saveAll(paymentList);
            orderPaymentRepository.deleteAll(orderPayments);
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
            Double sumCount = 0.0;
            for (Order order : orderList) {
                sumOrderCost += order.getCount() * order.getPrice();
                sumCount += order.getCount();
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
                sumPayment += payment.getPaySum();
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
            Double saldo = sumPayment - sumOrderCost;

            return ResponseEntity.ok(new ApiResponseData(true, "success", new ResAksverka(saldo, sumPayment, sumOrderCost, sumCount, aksverkaList)));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    public HttpEntity<?> archiveOrder(UUID id) {
        try {
            Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("order", "id", id));
            order.setStatus(OrderStatus.CLOSED);
            orderRepository.save(order);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }

    }
    public HttpEntity<?> archiveOrder1(UUID id) {
        try {
            Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("order", "id", id));
            order.setStatus(OrderStatus.ACTIVE);
            orderRepository.save(order);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }

    }
}
