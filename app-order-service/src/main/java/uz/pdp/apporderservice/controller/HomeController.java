package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.apporderservice.entity.Company;
import uz.pdp.apporderservice.entity.Master;
import uz.pdp.apporderservice.entity.PhoneNumber;
import uz.pdp.apporderservice.entity.Portfolio;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.HomePageResponse;
import uz.pdp.apporderservice.repository.*;

import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/api/homepage")
public class HomeController {
    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PhoneNumberRepository phoneNumberRepository;
    @Autowired
    PortfolioRepository portfolioRepository;
    @Autowired
    MasterRepository masterRepository;
    @Autowired
    OrderRepository orderRepository;

    @GetMapping
    public HttpEntity<?> getHomePageData(){
        Integer customerCount = userRepository.countAllByRolesIn(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_CUSTOMER)));
        Company company = companyRepository.findById(1).orElseThrow(() -> new ResourceNotFoundException("company", "id", 1));
        List<Portfolio> portfolios = portfolioRepository.findAll();
        List<Master> masters = masterRepository.findAll();
        HomePageResponse homePageResponse = new HomePageResponse();
        homePageResponse.setCompany(company);
        homePageResponse.setPortfolios(portfolios);
        homePageResponse.setMasters(masters);
        return ResponseEntity.ok(new ApiResponseData(true,"success",homePageResponse));
    }

}
