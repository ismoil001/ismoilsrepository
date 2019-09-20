package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqOrder {
    private String status;

    private UUID userId;

    private Timestamp orderedDate;

    private String productName;

    private Double price;

    private Integer count;

}
