package uz.pdp.apporderservice.projection;


import org.springframework.data.rest.core.config.Projection;
import uz.pdp.apporderservice.entity.PayType;

import java.util.UUID;

@Projection(name = "customPayType", types = {PayType.class})
public interface CustomPayType {
    Integer getId();

    String getName();
}
