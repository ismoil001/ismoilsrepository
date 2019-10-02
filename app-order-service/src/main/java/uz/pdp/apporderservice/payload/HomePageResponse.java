package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.apporderservice.entity.Company;
import uz.pdp.apporderservice.entity.Master;
import uz.pdp.apporderservice.entity.PhoneNumber;
import uz.pdp.apporderservice.entity.Portfolio;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HomePageResponse {
    private List<Portfolio> portfolios;
    private List<Master> masters;
    private Company company;
}
