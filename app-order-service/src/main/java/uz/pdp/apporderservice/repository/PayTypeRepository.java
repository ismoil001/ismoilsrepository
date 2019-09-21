package uz.pdp.apporderservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import uz.pdp.apporderservice.entity.PayType;
import uz.pdp.apporderservice.projection.CustomPayType;

@RepositoryRestResource(path = "payType",collectionResourceRel = "list",excerptProjection = CustomPayType.class)
public interface PayTypeRepository extends JpaRepository<PayType,Integer> {
}
