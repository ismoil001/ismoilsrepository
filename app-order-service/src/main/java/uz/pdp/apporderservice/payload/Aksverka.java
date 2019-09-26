package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Aksverka implements Comparable<Aksverka>{

    private Timestamp date;

    private String productName;

    private Double productCount;

    private Double productPrice;

    private Double sum;

    private Double paymentSum;

    @Override
    public int compareTo(Aksverka o) {
        return this.getDate().compareTo(o.getDate());
    }
}
