package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.Company;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqCompany;
import uz.pdp.apporderservice.repository.CompanyRepository;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    @Autowired
    CompanyRepository companyRepository;

    @GetMapping
    public HttpEntity<?> getCompany() {
        return ResponseEntity.ok(new ApiResponseData(true, "success", companyRepository.findAll()));
    }

    @PostMapping
    public HttpEntity<?> saveCompany(@RequestBody ReqCompany reqCompany) {
        try {
            Company company = companyRepository.findById(1).get();
            company.setAddress(reqCompany.getAddress());
            company.setEmail(reqCompany.getEmail());
            company.setFacebook(reqCompany.getFacebook());
            company.setInstagram(reqCompany.getInstagram());
            company.setTelegram(reqCompany.getTelegram());
            company.setYoutube(reqCompany.getYoutube());
            company.setPhoneNumber1(reqCompany.getPhonenumber1());
            company.setPhoneNumber2(reqCompany.getPhonenumber2());
            company.setPhoneNumber3(reqCompany.getPhonenumber3());
            company.setAddressRu(reqCompany.getAddressRu());
            companyRepository.save(company);
            return ResponseEntity.ok(new ApiResponse("success",true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));
        }
    }

}
