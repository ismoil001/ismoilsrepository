package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.Portfolio;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqPortfolio;
import uz.pdp.apporderservice.repository.AttachmentRepository;
import uz.pdp.apporderservice.repository.PortfolioRepository;

import java.util.UUID;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    @Autowired
    PortfolioRepository portfolioRepository;
    @Autowired
    AttachmentRepository attachmentRepository;

    @GetMapping
    public HttpEntity<?> getPortfolio() {
        return ResponseEntity.ok(new ApiResponseData(true, "success", portfolioRepository.findAll()));
    }

    @PostMapping
    public HttpEntity<?> savePortfolio(@RequestBody ReqPortfolio reqPortfolio) {
        try {
            portfolioRepository.save(new Portfolio(attachmentRepository.findById(reqPortfolio.getAttachment()).orElseThrow(() -> new ResourceNotFoundException("attachment", "id", reqPortfolio)), reqPortfolio.getTitle(), reqPortfolio.getDescription()));
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("false", false));
        }
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> deletePortfolio(@PathVariable UUID id) {
        try {
            portfolioRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success",true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error",false));
        }
    }
}
