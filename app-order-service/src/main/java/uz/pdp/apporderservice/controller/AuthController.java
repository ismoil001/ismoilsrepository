package uz.pdp.apporderservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.payload.ApiResponse;
import uz.pdp.apporderservice.payload.JwtAuthenticationResponse;
import uz.pdp.apporderservice.payload.ReqSignIn;
import uz.pdp.apporderservice.payload.ReqSignUp;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.security.JwtTokenProvider;

import javax.validation.Valid;
import java.util.HashSet;
import java.util.Optional;

import static uz.pdp.apporderservice.entity.enums.RoleName.ROLE_CUSTOMER;

@RestController
@RequestMapping("/api/auth")
public class
AuthController {
    @Autowired
    JwtTokenProvider tokenProvider;
    @Autowired
    AuthenticationManager authenticationManager;
//    @Autowired
//    UserService userService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody ReqSignIn reqSignIn) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(reqSignIn.getUsername(), reqSignIn.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));


    }

    @PostMapping("/signUp")
    public ResponseEntity<?> signUp(@RequestBody ReqSignUp reqSignUp) {
        Optional<User> optionalUser = userRepository.findByPhoneNumber(reqSignUp.getPhoneNumber());
        if (optionalUser.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ApiResponse("User is exist.",false));
        } else {
            User user = new User(
                    reqSignUp.getPhoneNumber(),
                    passwordEncoder.encode(reqSignUp.getPassword()),
                    reqSignUp.getFirstName(),
                    reqSignUp.getLastName(),
                    reqSignUp.getPatron(),
                    new HashSet<Role>(roleRepository.findAllByName(ROLE_CUSTOMER)),
                    "");

            userRepository.save(user);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse("User successfully created!",true));
        }
    }
//


}

