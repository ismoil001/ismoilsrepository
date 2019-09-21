package uz.pdp.apporderservice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.entity.Payment;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqPayment;
import uz.pdp.apporderservice.repository.PayTypeRepository;
import uz.pdp.apporderservice.repository.PaymentRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PayTypeRepository payTypeRepository;

    public HttpEntity<?> savePayment(ReqPayment reqPayment) {
        try {
            paymentRepository.save(new Payment(
                    userRepository.findById(reqPayment.getUserId()).orElseThrow(() -> new ResourceNotFoundException("user","id",reqPayment)),
                    payTypeRepository.findById(reqPayment.getPayTypeId()).orElseThrow( () -> new ResourceNotFoundException("payType","id",reqPayment)),
                    reqPayment.getPayDate(),
                    reqPayment.getPaySum(),
                    reqPayment.getPaySum()
            ));

            return ResponseEntity.ok(new ApiResponse("success",true));

        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));
        }
    }

    public HttpEntity<?> getAll() {
        try {
            return ResponseEntity.ok(new ApiResponseData(true,"success",paymentRepository.findAll()));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("success",true));
        }

    }

    public HttpEntity<?> deletePayment(UUID id) {
        try {
            paymentRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success",true));
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));
        }
    }
}
