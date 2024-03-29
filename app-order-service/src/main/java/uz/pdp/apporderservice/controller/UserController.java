package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.ApiResponseData;
import uz.pdp.apporderservice.payload.ReqUser;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.security.CurrentUser;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("search")
    public HttpEntity<?> searchUsers(@RequestParam String name) {
        try {
            return ResponseEntity.ok(new ApiResponseData(true, "success", userRepository.searchCustomers(name)));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    @GetMapping("/managers")
    public HttpEntity<?> getManagers() {
        return ResponseEntity.ok(userRepository.getManagers());
    }

    @GetMapping
    public HttpEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("customer")
    public HttpEntity<?> getCustomers() {
        return ResponseEntity.ok(new ApiResponseData(true, "success", userRepository.findByRolesIn(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_CUSTOMER)))));
    }

    @DeleteMapping("{id}")
    public HttpEntity<?> deleteUser(@PathVariable UUID id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }

    }

    @PostMapping
    public HttpEntity<?> saveUser(@RequestBody ReqUser reqUser) {
        try {
            User user = new User();
            user.setFirstName(reqUser.getFirstName());
            user.setLastName(reqUser.getLastName());
            user.setPatron(reqUser.getPatron());
            user.setPhoneNumber(reqUser.getPhoneNumber());
            user.setPassword(passwordEncoder.encode(reqUser.getPassword()));
            user.setRoles(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_MANAGER)));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    @PutMapping("{id}")
    public HttpEntity<?> editUser(@PathVariable UUID id, @RequestBody ReqUser reqUser) {
        try {
            User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("ss","ss",id));
            user.setFirstName(reqUser.getFirstName());
            user.setLastName(reqUser.getLastName());
            user.setPatron(reqUser.getPatron());
            user.setPhoneNumber(reqUser.getPhoneNumber());
            user.setPassword(passwordEncoder.encode(reqUser.getPassword()));
            user.setRoles(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_MANAGER)));
            userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(new ApiResponse("error", false));
        }
    }

    @GetMapping("me")
    public ResponseEntity<?> userMe(@CurrentUser User user) {
        return ResponseEntity.ok(user);
    }

}
