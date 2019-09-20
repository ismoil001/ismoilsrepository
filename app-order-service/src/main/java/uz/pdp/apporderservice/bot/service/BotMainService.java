package uz.pdp.apporderservice.bot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Contact;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.actions.CreateButtonService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.TelegramStateRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class BotMainService {
    @Autowired
    TelegramStateRepository telegramStateRepository;
    @Autowired
    PdpOrderBot pdpOrderBot;
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    CreateButtonService createButtonService;

    public Optional<TelegramState> getLastState(Update update) {
        return telegramStateRepository.findByTgUserId(update.hasCallbackQuery()?update.getCallbackQuery().getFrom().getId():update.getMessage().getFrom().getId());
    }

    public boolean isCheckPhoneNumber(Update update) {
        String regex = "[0-9*#+() -]*";
        Pattern pattern = Pattern.compile(regex);
        if (update.getMessage().hasContact()) {
            Contact contact = update.getMessage().getContact();
            Matcher matcher = pattern.matcher(contact.getPhoneNumber());
            if (matcher.matches() && contact.getPhoneNumber().length() <= 13 && contact.getPhoneNumber().length() > 11) {
                return true;
            }
        } else if (update.getMessage().hasText()) {
            Matcher matcher = pattern.matcher(update.getMessage().getText());
            if (matcher.matches() && update.getMessage().getText().length() <= 13 && update.getMessage().getText().length() > 11) {
                return true;
            }
        }
        return false;
    }

    public SendMessage shareContact(Update update) throws TelegramApiException {

        SendMessage sendMessage = new SendMessage();
        if (isCheckPhoneNumber(update)) {
            sendMessage.setReplyMarkup(new ReplyKeyboardRemove());
            String phoneNumber;
            if (update.getMessage().hasContact()) {
                phoneNumber = update.getMessage().getContact().getPhoneNumber();
            } else {
                phoneNumber = update.getMessage().getText();
            }
            Optional<User> userOptional = userRepository.findByPhoneNumber(phoneNumber);

            if (userOptional.isPresent()) {

                    TelegramState telegramState = new TelegramState();
                    telegramState.setState(BotState.CHECK_PASSWORD);
                    telegramState.setPhoneNumber(userOptional.get().getPhoneNumber());
                    telegramState.setTgUserId(update.getMessage().getFrom().getId());
                    telegramState.setFirstName(userOptional.get().getFirstName());
                    telegramState.setLastName(userOptional.get().getLastName());
                    telegramState.setPatron(userOptional.get().getPatron());
                    telegramStateRepository.save(telegramState);
                    userOptional.get().setTelegramId(update.getMessage().getFrom().getId());
                    userRepository.save(userOptional.get());

                sendMessage.setText("Siz tizimdan ro'yxatdan o'tgansiz. Iltimos parolingizni kiriting");
            } else {
                sendMessage.setReplyMarkup(new ReplyKeyboardRemove());
                TelegramState telegramState = new TelegramState();
                telegramState.setPhoneNumber(phoneNumber);
                telegramState.setTgUserId(update.getMessage().getFrom().getId());
                telegramState.setState(BotState.REGISTRATION_FIRSTNAME);
                telegramStateRepository.save(telegramState);
                sendMessage.setText("Ismingizni kiriting");
            }
        } else {
            sendMessage.setText("Raqam noto'g'ri kiritilgan");
        }
        sendMessage.setChatId(update.getMessage().getChatId());
        return sendMessage;
    }

    public void checkPassword(Update update) throws TelegramApiException {
        TelegramState lastState = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate","state",update));
        SendMessage sendMessage = new SendMessage();
        User user = userRepository.findByTelegramId(update.getMessage().getFrom().getId()).orElseThrow(() -> new ResourceNotFoundException("user","id",update));
        if(passwordEncoder.matches(update.getMessage().getText(), user.getPassword())){
            if (user.getRoles().stream().anyMatch(item -> item.getName().equals(RoleName.ROLE_ADMIN))){
                lastState.setState(BotState.ADMIN_CABINET);
                telegramStateRepository.save(lastState);
                user.setChatId(update.getMessage().getChatId());
                userRepository.save(user);
                adminCabinetPage(update);
            }
            else{
                lastState.setState(BotState.CABINET_PAGE);
                telegramStateRepository.save(lastState);
                cabinetPage(update);
            }

        }else{
            sendMessage.setText("Parol xato kiritildi");
        }
        sendMessage.setChatId(update.getMessage().getChatId());
        pdpOrderBot.execute(sendMessage);
    }

    public void cabinetPage(Update update) throws TelegramApiException {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setText("Cabinetga hush keldiz\n" +
                "order\norder\norder\norder\norder\n");
        sendMessage.setChatId(update.getMessage().getChatId());
        sendMessage.setReplyMarkup(createButtonService.createInlineButton("Yangi buyurtma", BotConstant.NEW_ORDER));

        pdpOrderBot.execute(sendMessage);
    }

    public  void startPage(Update update){
        try {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setReplyMarkup(createButtonService.createShareContactButton());
            sendMessage.setText("Assalamu alaykum!\n" +
                    "Botga xush kelibsiz.Iltimos botdan " +
                    "to'liq foydalanish uchun telefon raqamingizni kiriting");
            sendMessage.setChatId(update.hasCallbackQuery()?update.getCallbackQuery().getMessage().getChatId(): update.getMessage().getChatId());
            Optional<TelegramState> stateOptional = telegramStateRepository.findByTgUserId(update.getMessage().getFrom().getId());
            if (stateOptional.isPresent()) {
                telegramStateRepository.deleteById(stateOptional.get().getId());
            }
            pdpOrderBot.execute(sendMessage);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public void adminCabinetPage(Update update) throws TelegramApiException {
        SendMessage sendMessage = new SendMessage();
        sendMessage.setText("Admin kabinetga xush kelibsiz!");
        sendMessage.setChatId(update.getMessage().getChatId());
        pdpOrderBot.execute(sendMessage);
    }
}
