package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqPayment {

    private Timestamp payDate;

    private Double paySum;

    private Integer payTypeId;

    private UUID userId;



}
