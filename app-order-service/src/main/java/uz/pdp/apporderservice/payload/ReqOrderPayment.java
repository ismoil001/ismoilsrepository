package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqOrderPayment {

    private Double amount;

    private UUID orderId;

}
