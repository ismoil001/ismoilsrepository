package uz.pdp.apporderservice.payload;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class ReqSignIn {
    @NotBlank
    private String username;
    @NotBlank
    private String password;
}
