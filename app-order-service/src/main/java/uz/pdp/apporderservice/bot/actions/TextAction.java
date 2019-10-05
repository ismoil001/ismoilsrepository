package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.repository.TelegramStateRepository;
import uz.pdp.apporderservice.repository.UserRepository;

import java.util.Optional;

@Service
public class TextAction {

    @Autowired
    PdpOrderBot pdpOrderBot;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CreateButtonService buttonService;

    @Autowired
    BotMainService botMainService;

    @Autowired
    TelegramStateRepository telegramStateRepository;
    @Autowired
    StateAction stateAction;

    public void runText(String text, Update update) {
        switch (text) {
            case "/start":
                try {
                    pdpOrderBot.execute(new DeleteMessage().setChatId(update.getMessage().getChatId()).setMessageId(update.getMessage().getMessageId()));
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                botMainService.startPage(update);
                break;

            default:
                try {
                    stateAction.runState(update);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
        }
    }
}
