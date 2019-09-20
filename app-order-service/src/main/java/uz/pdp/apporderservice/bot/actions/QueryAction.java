package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.TelegramStateRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.Optional;

@Service
public class QueryAction {

    @Autowired
    UserRepository userRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    PdpOrderBot pdpOrderBot;
    @Autowired
    BotMainService botMainService;
    @Autowired
    TelegramStateRepository telegramStateRepository;

    public void runQuery(Update update) {
        String query = update.getCallbackQuery().getData();
        if (query.equals(BotConstant.NEW_ORDER)) {
            Optional<TelegramState> lastState = botMainService.getLastState(update);
            if (lastState.isPresent()) {
                lastState.get().setState(BotState.ADMIN_CUSTOMER_CHAT);
                telegramStateRepository.save(lastState.get());
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Admin bilan aloqa o'rnatildi. Xabaringizni qoldiring");
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                try {
                    pdpOrderBot.execute(sendMessage);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            } else {
                botMainService.startPage(update);
            }
        }
        if (query.startsWith("FromAdmin#")) {
            SendMessage sendMessage = new SendMessage();
            Optional<User> user = userRepository.findByTelegramId(Integer.parseInt(query.split("#")[1]));
            sendMessage.setText("<b>Javob berish:</b>\n" +
                    "<b>Mijoz:</b>" + user.get().getFirstName() + " " + user.get().getLastName() + " " + user.get().getPhoneNumber() + "\n" +
                    "Xabaringizni qoldiriing!");
            sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
            sendMessage.setParseMode(ParseMode.HTML);
            Optional<TelegramState> lastState = botMainService.getLastState(update);
            lastState.get().setState(BotState.REPLY_TO_CUSTOMER);
            lastState.get().setCustomerChatId(Long.parseLong(query.split("#")[1]));
            telegramStateRepository.save(lastState.get());
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }


        }

    }

}
