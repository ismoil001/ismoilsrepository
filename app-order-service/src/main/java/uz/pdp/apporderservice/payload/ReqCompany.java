package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqCompany {

    private String address;
    private String addressRu;
    private String email;
    private String facebook;
    private String instagram;
    private String youtube;
    private String telegram;
    private String phonenumber1;
    private String phonenumber2;
    private String phonenumber3;


}
