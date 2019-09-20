package uz.pdp.apporderservice.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class ReqSignUp {
    @NotBlank
    private String phoneNumber;

    @NotBlank
    @Size(min = 5, max = 16)
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String patron;

}
