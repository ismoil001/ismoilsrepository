package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResAksverka {

    private Double saldo;

    private Double sumPayment;

    private Double sumCost;

    private Integer sumCount;

    private List<Aksverka> aksverkaList;

}
