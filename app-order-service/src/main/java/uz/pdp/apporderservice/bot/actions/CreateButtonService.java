package uz.pdp.apporderservice.bot.actions;

import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.payload.ReqInlineButton;

import java.util.ArrayList;
import java.util.List;

@Service
public class CreateButtonService {

    public InlineKeyboardMarkup createInlineButton(String text, String query) {
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
        List<InlineKeyboardButton> row = new ArrayList<>();
        InlineKeyboardButton button = new InlineKeyboardButton();
        button.setText(text);
        button.setCallbackData(query);
        row.add(button);
        rows.add(row);
        inlineKeyboardMarkup.setKeyboard(rows);
        return inlineKeyboardMarkup;
    }
    public List<InlineKeyboardButton> createRowWithOneButton(String text, String query) {
        List<InlineKeyboardButton> row = new ArrayList<>();
        InlineKeyboardButton button = new InlineKeyboardButton();
        button.setText(text);
        button.setCallbackData(query);
        row.add(button);
        return row;
    }
    public List<InlineKeyboardButton> createOneRowButtons(List<ReqInlineButton> req) {
        List<InlineKeyboardButton> row = new ArrayList<>();
        for (ReqInlineButton reqInlineButton : req) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText(reqInlineButton.getText());
            button.setCallbackData(reqInlineButton.getQuery());
            row.add(button);
        }
        return row;
    }

    public ReplyKeyboardMarkup createReplyButton(String text){
        ReplyKeyboardMarkup replyKeyboardMarkup = new ReplyKeyboardMarkup();
        List<KeyboardRow> keyboard = new ArrayList<>();
        KeyboardRow keyboardRow = new KeyboardRow();
        KeyboardButton keyboardButton = new KeyboardButton();
        keyboardButton.setText(text);
        keyboardRow.add(keyboardButton);
        keyboard.add(keyboardRow);
        replyKeyboardMarkup.setKeyboard(keyboard);
        return replyKeyboardMarkup;
    }

    public ReplyKeyboardMarkup createShareContactButton(){
        ReplyKeyboardMarkup replyKeyboardMarkup = new ReplyKeyboardMarkup();
        replyKeyboardMarkup.setSelective(true);
        replyKeyboardMarkup.setResizeKeyboard(true);
        List<KeyboardRow> keyboard = new ArrayList<>();
        KeyboardRow keyboardRow = new KeyboardRow();
        KeyboardButton keyboardButton = new KeyboardButton().setRequestContact(true);
        keyboardButton.setText(BotConstant.SHARE_CONTACT);
        keyboardRow.add(keyboardButton);
        keyboard.add(keyboardRow);
        replyKeyboardMarkup.setKeyboard(keyboard);
        return replyKeyboardMarkup;
    }


}
