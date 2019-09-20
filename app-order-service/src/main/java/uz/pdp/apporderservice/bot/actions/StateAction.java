package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.Chat;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.repository.ChatRepository;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.TelegramStateRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class StateAction {

    @Autowired
    BotMainService botMainService;
    @Autowired
    TelegramStateRepository telegramStateRepository;
    @Autowired
    PdpOrderBot pdpOrderBot;
    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    CreateButtonService createButtonService;
    @Autowired
    ChatRepository chatRepository;

    public void runState(Update update) {
        try {
            SendMessage sendMessage = new SendMessage();
            Optional<TelegramState> lastStateOptional = botMainService.getLastState(update);
            if (lastStateOptional.isPresent()) {
                TelegramState telegramState = lastStateOptional.get();
                String currentState = lastStateOptional.get().getState();
                switch (currentState) {
                    case BotState.CHECK_PASSWORD:
                        botMainService.checkPassword(update);
                        break;
                    case BotState.REGISTRATION_FIRSTNAME:
                        sendMessage = new SendMessage();
                        telegramState.setFirstName(update.getMessage().getText());
                        telegramState.setState(BotState.REGISTRATION_LASTNAME);
                        sendMessage.setText("Familiyangizni kiriting:");
                        sendMessage.setChatId(update.getMessage().getChatId());
                        telegramStateRepository.save(telegramState);
                        pdpOrderBot.execute(sendMessage);
                        break;
                    case BotState.REGISTRATION_LASTNAME:
                        sendMessage = new SendMessage();
                        telegramState.setLastName(update.getMessage().getText());
                        telegramState.setState(BotState.REGISTRATION_PATRON);
                        sendMessage.setText("Sharifingizni(Otangizning ismi) kiriting:");
                        sendMessage.setChatId(update.getMessage().getChatId());
                        telegramStateRepository.save(telegramState);
                        pdpOrderBot.execute(sendMessage);
                        break;
                    case BotState.REGISTRATION_PATRON:
                        sendMessage = new SendMessage();
                        telegramState.setPatron(update.getMessage().getText());
                        telegramState.setState(BotState.REGISTRATION_PASSWORD);
                        sendMessage.setText("Parolingizni kiriting:");
                        sendMessage.setChatId(update.getMessage().getChatId());
                        telegramStateRepository.save(telegramState);
                        pdpOrderBot.execute(sendMessage);
                        break;
                    case BotState.REGISTRATION_PASSWORD:
                        sendMessage = new SendMessage();
                        sendMessage.setChatId(update.getMessage().getChatId());
                        telegramStateRepository.save(telegramState);
                        Role role = roleRepository.findById(20).orElseThrow(() -> new ResourceNotFoundException("role", "id", new Object()));
                        Set<Role> roles = new HashSet<>();
                        roles.add(role);
                        User user = new User(
                                telegramState.getPhoneNumber(),
                                passwordEncoder.encode(update.getMessage().getText()),
                                telegramState.getFirstName(),
                                telegramState.getLastName(),
                                telegramState.getPatron(),
                                new HashSet<>(roles),
                                telegramState.getTgUserId()
                        );
                        try {
                            userRepository.save(user);
                            telegramState.setState(BotState.CABINET_PAGE);
                            telegramStateRepository.save(telegramState);
                            sendMessage.setText("Siz muvaffaqiyatli ro'yxatdan o'tdingiz");
                            pdpOrderBot.execute(sendMessage);
                            botMainService.cabinetPage(update);
                        } catch (Exception e) {
                            e.printStackTrace();
                            sendMessage.setText("Ro'yxatdan o'tish jarayonida xatolik");
                            pdpOrderBot.execute(sendMessage);
                        }
                        break;
                    case BotState.CABINET_PAGE:
                        TelegramState lastState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "state", update));
                        lastState.setState(BotState.CHECK_PASSWORD);
                        telegramStateRepository.save(lastState);
                        sendMessage = new SendMessage();
                        sendMessage.setChatId(update.getMessage().getChatId());
                        sendMessage.setText("Parolingizni kiriting");
                        pdpOrderBot.execute(sendMessage);
                        break;
                    case BotState.ADMIN_CUSTOMER_CHAT:
                        List<User> users = userRepository.findByRolesIn(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_ADMIN)));
                        Optional<User> customer = userRepository.findByTelegramId(update.getMessage().getFrom().getId());
                        for (User admin : users) {
                            if (admin.getChatId() != null) {
                                Chat chat = new Chat();
                                chat.setFromClient(customer.get());
                                chat.setText(update.getMessage().getText());
                                chat.setToClient(admin);
                                chatRepository.save(chat);
                                SendMessage sendMessage1 = new SendMessage();
                                sendMessage1.setReplyMarkup(createButtonService.createInlineButton("Javob berish ⬆️ ", "FromAdmin#" + update.getMessage().getFrom().getId()));
                                sendMessage1.setChatId(admin.getChatId());
                                sendMessage1.setText("<b>Foydalanuvchi</b>:" + customer.get().getLastName() + " " + customer.get().getFirstName() + " " + customer.get().getPhoneNumber() + "\n" +
                                        "<b>Xabar:</b>" + update.getMessage().getText());
                                sendMessage1.setParseMode(ParseMode.HTML);
                                try {
                                    pdpOrderBot.execute(sendMessage1);
                                } catch (TelegramApiException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                        break;
                    case BotState.REPLY_TO_CUSTOMER:
                        SendMessage sendMessage1 = new SendMessage();
                        sendMessage1.setText(update.getMessage().getText());
                        sendMessage1.setChatId(telegramState.getCustomerChatId());
                        telegramState.setState(BotState.ADMIN_CABINET);
                        telegramStateRepository.save(telegramState);
                        pdpOrderBot.execute(sendMessage1);
                        break;

                }
            } else {
                if (botMainService.isCheckPhoneNumber(update)) {
                    Optional<User> userOptional = userRepository.findByPhoneNumber(update.getMessage().getText());
                    Optional<TelegramState> lastState = botMainService.getLastState(update);
                    if (userOptional.isPresent()) {
                        if (!lastState.isPresent()) {
                            try {
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
                                sendMessage.setText("Siz tizimdan ro'yxatdan o'tgansiz parolni kiriting");
                            } catch (Exception e) {
                                e.printStackTrace();
                                SendMessage sendMessage1 = new SendMessage();
                                sendMessage1.setText("Bunday foydalanuvchi mavjud");
                                sendMessage1.setChatId(update.getMessage().getChatId());
                                pdpOrderBot.execute(sendMessage1);
                                botMainService.startPage(update);

                            }
                        } else {
                            lastState.get().setState(BotState.CHECK_PASSWORD);
                            telegramStateRepository.save(lastState.get());
                        }
                    } else {
                        sendMessage.setReplyMarkup(new ReplyKeyboardRemove());
                        String phoneNumber;
                        phoneNumber = update.getMessage().getText();
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
                pdpOrderBot.execute(sendMessage);
            }

        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

}
