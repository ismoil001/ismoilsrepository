package uz.pdp.apporderservice.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.pdp.apporderservice.entity.Company;
import uz.pdp.apporderservice.entity.PhoneNumber;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.payload.ReqPdf;
import uz.pdp.apporderservice.repository.CompanyRepository;
import uz.pdp.apporderservice.repository.PhoneNumberRepository;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.service.PdfService;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    PdfService pdfService;

    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    PhoneNumberRepository phoneNumberRepository;

    @Value("${spring.datasource.initialization-mode}")
    private String initializationMode;


    @Override
    public void run(String... args) throws Exception {
//        PhoneNumber phone = phoneNumberRepository.save(new PhoneNumber("+7777777"));
//        companyRepository.save(new Company(1,"Qoqon","sss@mail.ru","facebook","insta","youtube","tg"));

        if (initializationMode.equalsIgnoreCase("always")) {
            User user = new User("+998941211112", passwordEncoder.encode("root123"), "Sobir", "Xalimov", "Botirovich", new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_MANAGER)),"Europrint");
//            User user1 = new User("+998944155945", passwordEncoder.encode("root123"), "Aziz", "Mirzaahmatov", "Komil o'g'li", new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_MANAGER)),"PDP");
            userRepository.save(user);
//            userRepository.save(user1);
        }
    }
}
