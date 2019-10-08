package uz.pdp.apporderservice.bot.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.Contact;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.actions.CreateButtonService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.*;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ReqInlineButton;
import uz.pdp.apporderservice.payload.ReqOrderBot;
import uz.pdp.apporderservice.repository.*;
import uz.pdp.apporderservice.service.OrderService;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
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
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    PaymentRepository paymentRepository;
    @Autowired
    OrderService orderService;
    @Autowired
    BasketRepository basketRepository;

    public Optional<TelegramState> getLastState(Update update) {
        return telegramStateRepository.findByTgUserId(update.hasCallbackQuery() ? update.getCallbackQuery().getFrom().getId() : update.getMessage().getFrom().getId());
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
        TelegramState lastState = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "state", update));
        User user = userRepository.findByTelegramId(update.getMessage().getFrom().getId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
        if (passwordEncoder.matches(update.getMessage().getText(), user.getPassword())) {
            if (user.getRoles().stream().anyMatch(item -> item.getName().equals(RoleName.ROLE_MANAGER))) {
                lastState.setDeletingMessages(new ArrayList<>());
                lastState.setState(BotState.ADMIN_CABINET);
                telegramStateRepository.save(lastState);
                user.setChatId(update.getMessage().getChatId());
                userRepository.save(user);
                adminCabinetPage(update);
            } else {
                lastState.setState(BotState.CABINET_PAGE);
                telegramStateRepository.save(lastState);
                pdpOrderBot.execute(new DeleteMessage().setMessageId(update.getMessage().getMessageId()).setChatId(update.getMessage().getChatId()));
                cabinetPage(update);
            }

        } else {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Parol xato kiritildi");
            sendMessage.setChatId(update.getMessage().getChatId());
            pdpOrderBot.execute(sendMessage);
        }

    }

    public void cabinetPage(Update update) throws TelegramApiException {
        TelegramState telegramState = getLastState(update).get();
        telegramState.setState(BotState.ENTERED_CABINET_PAGE);
        telegramStateRepository.save(telegramState);
        SendMessage sendMessage = new SendMessage();
        User user = userRepository.findByTelegramId(update.hasCallbackQuery() ? update.getCallbackQuery().getMessage().getChatId().intValue() : update.getMessage().getFrom().getId()).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
        List<Order> allOrdersByUser_id = orderRepository.findAllByUser_Id1(user.getId());
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
        for (Order order : allOrdersByUser_id) {
            rows.add(createButtonService.createRowWithOneButton(
                    order.getProductName() + " " + order.getCount() + "ta " + order.getOrderedDate(),
                    "existingOrder/" + order.getId()
            ));
        }
        rows.add(createButtonService.createRowWithOneButton("Yangi buyurtma", BotConstant.NEW_ORDER));
        rows.add(createButtonService.createRowWithOneButton("\uD83D\uDD04", BotConstant.REFRESH_CABINET_PAGE));
        List<ReqInlineButton> buttons = new ArrayList<>();
        Optional<Basket> optBasket = basketRepository.findByUser(user);
        if(optBasket.isPresent()){
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("Savatcha");
            button.setCallbackData(BotConstant.BASKET_PAGE+"#"+optBasket.get().getId());
            List<InlineKeyboardButton> buttons1 = new ArrayList<>();
            buttons1.add(button);
            rows.add(buttons1);
        }
        buttons.add(new ReqInlineButton("Active Buyurtmalar", BotConstant.ACTIVE_ORDER_PAGE));
        buttons.add(new ReqInlineButton("\uD83D\uDCB5 Balance", BotConstant.BALANCE));
        buttons.add(new ReqInlineButton("⚒ Sozlamalar", BotConstant.SETTINGS));
        rows.add(createButtonService.createOneRowButtons(buttons));
        sendMessage.setText("Shaxsiy kabinet");
        sendMessage.setChatId(update.hasCallbackQuery() ? update.getCallbackQuery().getMessage().getChatId() : update.getMessage().getChatId());
        inlineKeyboardMarkup.setKeyboard(rows);
        sendMessage.setReplyMarkup(inlineKeyboardMarkup);
        pdpOrderBot.execute(sendMessage);
    }

    public void sendSimpleMessage(Update update, String messageText, String state) {
        TelegramState telegramState = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
        telegramState.setState(state);
        telegramStateRepository.save(telegramState);
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(update.hasCallbackQuery() ? update.getCallbackQuery().getMessage().getChatId() : update.getMessage().getChatId());
        sendMessage.setText(messageText);
        sendMessage.setReplyMarkup(createButtonService.createInlineButton("Orqaga", BotState.BACK_TO_CABINET));
        try {
            pdpOrderBot.execute(sendMessage);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public void startPage(Update update) {
        try {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setReplyMarkup(createButtonService.createShareContactButton());
            sendMessage.setText("Assalamu alaykum!\n" +
                    "Botga xush kelibsiz.Iltimos botdan " +
                    "to'liq foydalanish uchun telefon raqamingizni kiriting");
            sendMessage.setChatId(update.hasCallbackQuery() ? update.getCallbackQuery().getMessage().getChatId() : update.getMessage().getChatId());
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
        TelegramState telegramState = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
        telegramState.setState(BotState.ADMIN_CABINET);
        telegramStateRepository.save(telegramState);
        SendMessage sendMessage = new SendMessage();
        sendMessage.setText("Admin kabinetga xush kelibsiz!");
        sendMessage.setChatId(update.hasCallbackQuery() ? update.getCallbackQuery().getMessage().getChatId() : update.getMessage().getChatId());
        pdpOrderBot.execute(sendMessage);
    }

    public void activeOrderPage(Update update) {
        User user = userRepository.findByTelegramId(update.getCallbackQuery().getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
        List<Order> orderList = orderRepository.findAllByUserAndStatusOrderByCreatedAtDesc(user, OrderStatus.ACTIVE);
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
        sendMessage.setText("Active buyurtmalaringiz");
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
        for (Order order : orderList) {
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("❌");
            button.setCallbackData(BotConstant.IGNORE_ORDER + "/" + order.getId());
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            button1.setText(order.getProductName() + " " + order.getCount() + "ta " + order.getOrderedDate());
            button1.setCallbackData("#");
            List<InlineKeyboardButton> buttons = new ArrayList<>();
            buttons.add(button);
            buttons.add(button1);
            rows.add(buttons);
        }
        rows.add(createButtonService.createRowWithOneButton("Orqaga", BotState.BACK_TO_CABINET));
        inlineKeyboardMarkup.setKeyboard(rows);
        sendMessage.setReplyMarkup(inlineKeyboardMarkup);
        try {
            pdpOrderBot.execute(sendMessage);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }


    }

    public void getCustomerBalance(Update update) {
        try {
            EditMessageText editMessageText = new EditMessageText();
            editMessageText.setChatId(update.getCallbackQuery().getMessage().getChatId());
            editMessageText.setText(paymentRepository.getCustomerBalance(update.getCallbackQuery().getMessage().getChatId().intValue()) + " sum");
            editMessageText.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
            editMessageText.setReplyMarkup(createButtonService.createInlineButton("Orqaga", BotState.BACK_TO_CABINET));
            pdpOrderBot.execute(editMessageText);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public boolean isNumeric(String strNum) {
        return strNum.matches("[0-9]+");
    }


    public void removeDeletingButtons(Update update) {
        TelegramState telegramState = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
        for (DeletingMessage deletingMessage : telegramState.getDeletingMessages()) {
            DeleteMessage deleteMessage = new DeleteMessage();
            deleteMessage.setChatId(update.getMessage().getChatId());
            deleteMessage.setMessageId(deletingMessage.getMessageId());
            try {
                pdpOrderBot.execute(new DeleteMessage());
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }

    public void sale(Update update) {
        TelegramState telegramState1 = getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "chatid", update));
        String text = update.getMessage().getText();
        if (text.contains("/") && text.split("/").length == 3 && isNumeric(text.split("/")[1]) && isNumeric(text.split("/")[2])) {
            String productName = text.split("/")[0];
            Double price = Double.parseDouble(text.split("/")[1]);
            Double count = Double.parseDouble(text.split("/")[2]);
            User client = userRepository.findByTelegramId(telegramState1.getCustomerChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "telegramid", telegramState1));
            User admin = userRepository.findByTelegramId(telegramState1.getTgUserId()).orElseThrow(() -> new ResourceNotFoundException("admin", "id", update));
            Order order = orderService.saveOrderByBot(new ReqOrderBot("HIDDEN", client.getId(), new Timestamp(System.currentTimeMillis()), productName, price, count, admin.getId()));
            Basket basket = saveToBasket(client, order);
            Basket save = basketRepository.save(basket);
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(update.getMessage().getChatId());
            String msg = "<b>Basket</b>\n" +
                    "<b>Mijoz:</b>" + client.getLastName() + " " + client.getFirstName() + " " + client.getCompanyName()+"\n-------------\n";
            Double a = 0.0;
            for (Order saveOrder : save.getOrders()) {
                a += saveOrder.getPrice() * saveOrder.getCount();
                msg += (save.getOrders().indexOf(saveOrder)+1) +
                        "<b>Mahsulot:</b> " + saveOrder.getProductName() + "\n" +
                        "<b>Soni:</b> " + saveOrder.getCount() + "\n" +
                        "<b>Narx:</b> " + saveOrder.getPrice() * saveOrder.getCount() + "\n-------------\n";
            }
            msg += "\n<b>Umumit:</b>" + a;
            sendMessage.setText(msg);
            sendMessage.setParseMode(ParseMode.HTML);
            List<List<InlineKeyboardButton>> rows = new ArrayList<>();
            InlineKeyboardButton button = new InlineKeyboardButton();
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            InlineKeyboardButton button2 = new InlineKeyboardButton();
            button.setText("Yana maxsulot qo'shish");
            button.setCallbackData("PdfSend#"+client.getTelegramId());
            button1.setText("Xaridni yakunlash");
            button1.setCallbackData(BotConstant.FINISH_ORDER+"#"+save.getId());
            List<InlineKeyboardButton> row = new ArrayList<>();
            List<InlineKeyboardButton> row1 = new ArrayList<>();
            row.add(button);
            row.add(button1);
            button2.setCallbackData(BotState.ADMIN_IGNORE_ORDER_CABINET+"#"+save.getId());
            button2.setText("Bekor qilish");
            row1.add(button2);
            rows.add(row1);
            rows.add(row);
            InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
            inlineKeyboardMarkup.setKeyboard(rows);
            sendMessage.setReplyMarkup(inlineKeyboardMarkup);
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Ma'lumotlarni kiritishda xatolikka yo'l qo'ydingiz. Iltimos qaytadan urinib ko'ring. kiritishni quyidagi qonuniyatga muvofiq xolda amalga oshiring:\n" +
                    "Maxsulot nomi/Birta maxsulot narxi/soni");
            sendMessage.setChatId(update.getMessage().getChatId());
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }
    public String basketMessageGeneration(Basket basket){
        String msg = "<b>Basket</b>\n" +
                "<b>Mijoz:</b>" + basket.getUser().getLastName() + " " + basket.getUser().getFirstName() + " " + basket.getUser().getCompanyName()+"\n-------------\n";
        Double a = 0.0;
        for (Order saveOrder : basket.getOrders()) {
            a += saveOrder.getPrice() * saveOrder.getCount();
            msg += (basket.getOrders().indexOf(saveOrder)+1) +
                    "<b>Mahsulot:</b> " + saveOrder.getProductName() + "\n" +
                    "<b>Soni:</b> " + saveOrder.getCount() + "\n" +
                    "<b>Narx:</b> " + saveOrder.getPrice() * saveOrder.getCount() + "\n-------------\n";
        }
        msg += "\n<b>Umumiy:</b>" + a;
        return msg;
    }

    public Basket saveToBasket(User client,Order order){
        Optional<Basket> optB = basketRepository.findByUser(client);
        Basket basket = new Basket();
        basket.setUser(client);
        if (optB.isPresent()) {
            basket = optB.get();
            if (basket.getOrders() != null) {
                basket.getOrders().add(order);
            } else {
                List<Order> orders = new ArrayList<>();
                orders.add(order);
                basket.setOrders(orders);
            }
        }else{
            basket.setCreatedAt(new Timestamp(System.currentTimeMillis()));
            List<Order> orders = new ArrayList<>();
            orders.add(order);
            basket.setOrders(orders);
        }
        basket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        basket.setCreatedBy(order.getCreatedBy());
        basket.setUpdatedBy(order.getCreatedBy());
        return basketRepository.save(basket);
    }

    public void savatChaPage(Update update,Basket basket){
        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
        List<InlineKeyboardButton> row = new ArrayList<>();
        List<InlineKeyboardButton> row1 = new ArrayList<>();
        InlineKeyboardButton button = new InlineKeyboardButton();
        InlineKeyboardButton button1 = new InlineKeyboardButton();
        InlineKeyboardButton button2 = new InlineKeyboardButton();
        button.setText("Bekor qilish");
        button.setCallbackData(BotConstant.ORDER_IGNORE_BY_CUSTOMER+"#"+basket.getId());
        button1.setText("Yana maxsulot qo'shish");
        button1.setCallbackData(BotState.BACK_TO_CABINET);
        button2.setText("Xaridni aktivlashtirish");
        button2.setCallbackData(BotConstant.BASKET_ACTIVATE+"#"+basket.getId());
        row.add(button);
        row.add(button1);
        row1.add(button2);
        rows.add(row);
        rows.add(row1);
        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
        inlineKeyboardMarkup.setKeyboard(rows);
        SendMessage sendMessage = new SendMessage();
        sendMessage.setChatId(update.hasCallbackQuery()?update.getCallbackQuery().getMessage().getChatId():update.getMessage().getChatId());
        sendMessage.setText(basketMessageGeneration(basket));
        sendMessage.setReplyMarkup(inlineKeyboardMarkup);
        sendMessage.setParseMode(ParseMode.HTML);
        try {
            pdpOrderBot.execute(sendMessage);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    public void clearBasket(Basket basket){
        basketRepository.deleteById(basket.getId());
        for (Order order : basket.getOrders()) {
            orderRepository.deleteById(order.getId());
        }
    }
}
