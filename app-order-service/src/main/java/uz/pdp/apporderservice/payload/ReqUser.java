package uz.pdp.apporderservice.payload;

import lombok.Data;

@Data
public class ReqUser {

    private String firstName;
    private String lastName;
    private String patron;
    private String phoneNumber;
    private String password;

}
