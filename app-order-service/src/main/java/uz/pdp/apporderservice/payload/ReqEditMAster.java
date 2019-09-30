package uz.pdp.apporderservice.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReqEditMAster {
    private UUID id;
    private String name;
    private String description;
    private UUID attachment;
    private Boolean active;
}

