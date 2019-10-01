package uz.pdp.apporderservice.component;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import uz.pdp.apporderservice.entity.Company;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.payload.ReqPdf;
import uz.pdp.apporderservice.repository.*;
import uz.pdp.apporderservice.service.PdfService;

import java.util.HashSet;

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
    OrderRepository orderRepository;

    @Autowired
    CompanyRepository companyRepository;
    @Autowired
    PhoneNumberRepository phoneNumberRepository;

    @Value("${spring.datasource.initialization-mode}")
    private String initializationMode;


    @Override
    public void run(String... args) throws Exception {
//        PhoneNumber phone = phoneNumberRepository.save(new PhoneNumber("+7777777"));
        companyRepository.save(new Company(1,"O'zbekiston R,  Farg'ona viloyati, Qo'qon sh. Usta bozor k, 1B uy.","O'zbekiston R,  Farg'ona viloyati, Qo'qon sh. Usta bozor k, 1B uy.","sss@mail.ru","facebook","insta","youtube","tg","+998941211112","+998941211111","+998989877898"));

        if (initializationMode.equalsIgnoreCase("always")) {

            User user = new User("+998941211112", passwordEncoder.encode("root123"), "Sobir", "Xalimov", "Botirovich", new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_MANAGER)),"Europrint");
            User user1 = new User("+998947777777", passwordEncoder.encode("root123"), "Sobir", "Xalimov", "Botirovich", new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_ADMIN)),"Europrint");
            userRepository.save(user);
            userRepository.save(user1);
           User user12=new User("+998993632582",passwordEncoder.encode("asd"),"Alisher","Atadjanov","Baxramovich",new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_CUSTOMER)),"PDP");
            userRepository.save(user12);
        }
    }
}
