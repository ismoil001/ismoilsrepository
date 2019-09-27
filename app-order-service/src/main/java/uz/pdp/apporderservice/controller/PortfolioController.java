package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqPortfolio;
import uz.pdp.apporderservice.repository.PortfolioRepository;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    PortfolioRepository portfolioRepository;

    @GetMapping
    public HttpEntity<?> getPortfolio() {
        return ResponseEntity.ok(new ApiResponseData(true, "success", portfolioRepository.findAll()));
    }

    @PostMapping
    public HttpEntity<?> savePortfolio(@RequestBody ReqPortfolio reqPortfolio){
        return null;
    }
}
