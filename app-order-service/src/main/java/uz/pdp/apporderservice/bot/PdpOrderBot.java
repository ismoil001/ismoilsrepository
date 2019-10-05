package uz.pdp.apporderservice.bot;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.actions.DocumentAction;
import uz.pdp.apporderservice.bot.actions.QueryAction;
import uz.pdp.apporderservice.bot.actions.TextAction;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.entity.DeletingMessage;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.repository.TelegramStateRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class PdpOrderBot extends TelegramLongPollingBot {

    @Autowired
    TextAction textAction;

    @Autowired
    QueryAction queryAction;
    @Autowired
    BotMainService botMainService;
    @Autowired
    DocumentAction documentAction;
    @Autowired
    TelegramStateRepository telegramStateRepository;

    @Value("${bot.token}")
    private String botToken;
    @Value("${bot.username}")
    private String botUsername;

    @Override
    public void onUpdateReceived(Update update) {
        if (update.hasMessage()) {
            //text
            if (update.getMessage().hasText()) {
                textAction.runText(update.getMessage().getText(), update);
            }
            //contact
            else if (update.getMessage().hasContact()) {
                try {
                   execute(botMainService.shareContact(update));
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            }else if(update.getMessage().hasDocument()){
                documentAction.run(update);
            }
            //query

        } else if (update.hasCallbackQuery()) {
            queryAction.runQuery(update);
        }
    }

    @Override
    public String getBotToken() {
        return this.botToken;
    }

    @Override
    public String getBotUsername() {
        return this.botUsername;
    }
}
