package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.repository.TelegramStateRepository;

@Service
public class DocumentAction {

    @Autowired
    TelegramStateRepository telegramStateRepository;
    @Autowired
    PdpOrderBot pdpOrderBot;
    @Autowired
    BotMainService botMainService;

    public void run(Update update) {
        TelegramState telegramState = telegramStateRepository.findByTgUserId(update.getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
        if (telegramState.getState().equals(BotState.FILE_SEND)) {
            SendDocument sendDocument = new SendDocument();
            sendDocument.setChatId(telegramState.getCustomerChatId());
            sendDocument.setDocument(update.getMessage().getDocument().getFileId());
            try {
                pdpOrderBot.execute(sendDocument);
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }

}
