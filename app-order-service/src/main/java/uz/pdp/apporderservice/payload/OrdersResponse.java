package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdersResponse {

    private UUID id;

    private Timestamp date;

    private String userFullName;

    private String status;

    private UUID userId;

    private String productName;

    private String companyName;

    private Integer count;

    private Double price;

    private Double sum;

    private List<ResPayment> payments;
}
