package uz.pdp.apporderservice.bot.actions;

import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.Role;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ReqInlineButton;
import uz.pdp.apporderservice.payload.ReqPdf;
import uz.pdp.apporderservice.repository.*;
import uz.pdp.apporderservice.service.PdfService;

import java.io.File;
import java.sql.Timestamp;
import java.util.*;

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
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    PdfService pdfService;

    public void runState(Update update) throws TelegramApiException {
        try {
            Optional<TelegramState> lastStateOptional = botMainService.getLastState(update);
            if (lastStateOptional.isPresent()) {
                TelegramState telegramState = lastStateOptional.get();
                String currentState = lastStateOptional.get().getState();
                if (currentState.equals(BotState.CHECK_PASSWORD)) {
                    try {
                        botMainService.checkPassword(update);
                    } catch (TelegramApiException e1) {
                        e1.printStackTrace();
                    }
                } else if (currentState.equals(BotState.REGISTRATION_FIRSTNAME)) {
                    SendMessage sendMessage = new SendMessage();
                    telegramState.setFirstName(update.getMessage().getText());
                    telegramState.setState(BotState.REGISTRATION_LASTNAME);
                    sendMessage.setText("Familiyangizni kiriting:");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    telegramStateRepository.save(telegramState);
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.REGISTRATION_LASTNAME)) {
                    SendMessage sendMessage = new SendMessage();
                    telegramState.setLastName(update.getMessage().getText());
                    telegramState.setState(BotState.REGISTRATION_PATRON);
                    sendMessage.setText("Sharifingizni(Otangizning ismi) kiriting:");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    telegramStateRepository.save(telegramState);
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.DIRECTOR_NAME)) {
                    TelegramState telegramState1 = telegramStateRepository.findByTgUserId(update.getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                    Order order = orderRepository.findById(telegramState1.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                    File file = pdfService.readPdf(new ReqPdf(order.getId(),order.getUser().getCompanyName(),update.getMessage().getText()));
                    Long clientChatId = update.getMessage().getChatId();
                    SendDocument sendDocumentRequest = new SendDocument();
                    sendDocumentRequest.setChatId(clientChatId);
                    sendDocumentRequest.setDocument(file);
                    sendDocumentRequest.setCaption("Buyurtmangizni olishga borganingizda shartnomani unutmang!");
                    TelegramState telegramState2 = telegramStateRepository.findByTgUserId(order.getCreatedBy().getTelegramId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", order));
                    telegramState2.setState(BotState.ADMIN_CABINET);
                    telegramStateRepository.save(telegramState2);
                    pdpOrderBot.execute(sendDocumentRequest);
                    botMainService.cabinetPage(update);


                    sendDocumentRequest.setChatId(telegramState2.getTgUserId().longValue());
                    sendDocumentRequest.setCaption("<b>Shartnoma yuborildi</b>\n" +
                            "<b>Mijoz:</b> "+order.getUser().getLastName()+" "+order.getUser().getFirstName()+"\n" +
                            "<b>Raxbar:</b> "+update.getMessage().getText()+"\n" +
                            "<b>Maxsulot:</b> "+order.getProductName()+"\n" +
                            "<b>Price:</b> "+order.getPrice()+"\n" +
                            "<b>Count:</b> "+order.getCount());
                    sendDocumentRequest.setParseMode(ParseMode.HTML);
                    pdpOrderBot.execute(sendDocumentRequest);
                } else if (currentState.equals(BotState.REGISTRATION_PATRON)) {
                    SendMessage sendMessage = new SendMessage();
                    telegramState.setPatron(update.getMessage().getText());
                    telegramState.setState(BotState.REGISTRATION_COMPANY);
                    sendMessage.setText("Kompaniyangiz nomini kiriting:");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    telegramStateRepository.save(telegramState);
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.REGISTRATION_COMPANY)) {
                    SendMessage sendMessage = new SendMessage();
                    telegramState.setCompanyName(update.getMessage().getText());
                    telegramState.setState(BotState.REGISTRATION_PASSWORD);
                    sendMessage.setText("Parolingizni kiriting(Kiritgan parolingizni unutmasligingizni yoki biror joyga yozib qo'yishingizni iltimos qilamz.)");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    telegramStateRepository.save(telegramState);
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.REGISTRATION_PASSWORD)) {
                    SendMessage sendMessage = new SendMessage();
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
                            lastStateOptional.get().getCompanyName(),
                            telegramState.getTgUserId(),
                            new HashSet<>(roles),
                            update.getMessage().getChatId()
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
                } else if (currentState.equals(BotState.CABINET_PAGE)) {
                    TelegramState lastState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "state", update));
                    lastState.setState(BotState.CHECK_PASSWORD);
                    telegramStateRepository.save(lastState);
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.setChatId(update.getMessage().getChatId());
                    sendMessage.setText("Parolingizni kiriting");
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.ENTERED_CABINET_PAGE)) {
                    SendMessage sendMessage1 = new SendMessage();
                    sendMessage1.setChatId(update.getMessage().getChatId());
                    sendMessage1.setText("Yangi buyurtma yarating yoki avvalki buyurtmalaringizdan andoza oling");
                    pdpOrderBot.execute(sendMessage1);
                } else if (currentState.equals(BotState.GENERATE_ORDER)) {
                    TelegramState telegramState1 = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "chatid", update));
                    String text = update.getMessage().getText();
                    if (text.contains("/") && text.split("/").length == 3 && NumberUtils.isCreatable(text.split("/")[1]) && NumberUtils.isCreatable(text.split("/")[2])) {
                        String productName = text.split("/")[0];
                        Double price = Double.parseDouble(text.split("/")[1]);
                        Double count = Double.parseDouble(text.split("/")[2]);
                        User client = userRepository.findByTelegramId(telegramState1.getCustomerChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "telegramid", currentState));
                        User admin = userRepository.findByTelegramId(telegramState1.getTgUserId()).orElseThrow(() -> new ResourceNotFoundException("admin", "id", update));

                        Order order = new Order(OrderStatus.CLOSED, client, null, new Timestamp(System.currentTimeMillis()), productName, price, count);
                        order.setCreatedBy(admin);
                        Order save = orderRepository.save(order);
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setText("Mijoz tasdiqlagandan so'ng buyurtma aktivlashtiriladi");
                        sendMessage.setChatId(update.getMessage().getChatId());
                        pdpOrderBot.execute(sendMessage);

                        SendMessage sendMessage1 = new SendMessage();
                        sendMessage1.setText("<b>Buyurtma:</b>\n" +
                                "<b>Maxsulot nomi:</b> " + order.getProductName() + "\n" +
                                "<b>Narxi(dona):</b> " + order.getPrice() + "\n" +
                                "<b>Soni:</b>: " + order.getCount());
                        List<ReqInlineButton> buttons = new ArrayList<>();
                        buttons.add(new ReqInlineButton("✅ Tasdiqlash", "ActivateOrder/" + order.getId()));
                        buttons.add(new ReqInlineButton("❌ Bekror qilish", "DeactivateOrder/" + order.getId()));
                        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                        List<InlineKeyboardButton> row = createButtonService.createOneRowButtons(buttons);
                        rows.add(row);
                        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                        inlineKeyboardMarkup.setKeyboard(rows);
                        sendMessage1.setReplyMarkup(inlineKeyboardMarkup);
                        sendMessage1.setChatId(telegramState1.getCustomerChatId());
                        sendMessage1.setParseMode(ParseMode.HTML);
                        pdpOrderBot.execute(sendMessage1);
                    } else {
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setText("Ma'lumotlarni kiritishda xatolikka yo'l qo'ydingiz. Iltimos qaytadan urinib ko'ring. kiritishni quyidagi qonuniyatga muvofiq xolda amalga oshiring:\n" +
                                "Maxsulot nomi/Birta maxsulot narxi/soni");
                        sendMessage.setChatId(update.getMessage().getChatId());
                        pdpOrderBot.execute(sendMessage);
                    }

                } else if (currentState.equals(BotState.ADMIN_CUSTOMER_CHAT)) {
                    String uuidString = orderRepository.getUserWithLessOrder();
                    User admin = userRepository.findById(UUID.fromString(uuidString)).orElseThrow(() -> new ResourceNotFoundException("user", "id", uuidString));
                    Optional<User> customer = userRepository.findByTelegramId(update.getMessage().getFrom().getId());
                    if (admin.getChatId() != null) {
//                                Chat chat = new Chat();
//                                chat.setFromClient(customer.get());
//                                chat.setText(update.getMessage().getText());
//                                chat.setToClient(admin);
//                                chatRepository.save(chat);
                        SendMessage sendMessage1 = new SendMessage();
                        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                        List<ReqInlineButton> buttons = new ArrayList<>();
                        buttons.add(new ReqInlineButton("Javob berish⬆", "FromAdmin#" + update.getMessage().getFrom().getId()));
                        buttons.add(new ReqInlineButton("Shartnoma yuborish", "PdfSend#" + update.getMessage().getFrom().getId()));
                        buttons.add(new ReqInlineButton("Компредложение", "PdfSendkmp#" + update.getMessage().getFrom().getId()));
                        rows.add(createButtonService.createOneRowButtons(buttons));
                        inlineKeyboardMarkup.setKeyboard(rows);
                        sendMessage1.setReplyMarkup(inlineKeyboardMarkup);
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
                } else if (currentState.equals(BotState.REPLY_TO_CUSTOMER)) {
                    SendMessage sendMessage1 = new SendMessage();
                    sendMessage1.setText(update.getMessage().getText());
                    sendMessage1.setChatId(telegramState.getCustomerChatId());
                    telegramState.setState(BotState.ADMIN_CABINET);
                    telegramStateRepository.save(telegramState);
                    pdpOrderBot.execute(sendMessage1);
                } else if (currentState.equals(BotState.BACK_TO_CABINET)) {
                    botMainService.cabinetPage(update);
                } else if (currentState.equals(BotState.WAITING_ADMIN_RESPONSE)) {
                    SendMessage sendMessage2 = new SendMessage();
                    sendMessage2.setText("Adminning javobini kuting!");
                    sendMessage2.setChatId(update.getMessage().getChatId());
                    pdpOrderBot.execute(sendMessage2);
                } else if (currentState.equals(BotState.NEW_PRICE_EXSISTING_ORDER)) {
                    TelegramState managerState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "id", update));
                    Long clientChatId = managerState.getCustomerChatId();
                    User client = userRepository.findByTelegramId(clientChatId.intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "telegramid", clientChatId));
                    TelegramState clientState = telegramStateRepository.findByTgUserId(client.getTelegramId()).orElseThrow(() -> new ResourceNotFoundException("telegramstate", "telegramid", client));
                    clientState.setNewPrice(Double.parseDouble(update.getMessage().getText()));
                    telegramStateRepository.save(clientState);
                    SendMessage toClient = new SendMessage();
                    toClient.setChatId(client.getTelegramId().longValue());
                    toClient.setText("Hozirda ushbu maxsulotning narxi " + update.getMessage().getText() + " bo'lgan.\n" +
                            "Davom etishni xoxlasangiz tasdiqlash tugmasini bosing.");
                    List<ReqInlineButton> buttons = new ArrayList<>();
                    InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                    buttons.add(new ReqInlineButton("✅ Tasdiqlash", BotConstant.APLY_ORDER_WITH_NEW_PRICE + "/" + update.getMessage().getChatId()));
                    buttons.add(new ReqInlineButton("Orqaga", BotState.BACK_TO_CABINET));
                    List<InlineKeyboardButton> oneRowButtons = createButtonService.createOneRowButtons(buttons);
                    List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                    rows.add(createButtonService.createOneRowButtons(buttons));
                    inlineKeyboardMarkup.setKeyboard(rows);
                    toClient.setReplyMarkup(inlineKeyboardMarkup);
                    pdpOrderBot.execute(toClient);
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.setChatId(update.getMessage().getChatId());
                    sendMessage.setText("Mijoz tasdiqlagandan so'ng buyurtma rasmiylashtiriladi");
                    pdpOrderBot.execute(sendMessage);
                    botMainService.adminCabinetPage(update);

                } else if (currentState.equals(BotState.EXISTING_ORDER_COUNT)) {
                    if (botMainService.isNumeric(update.getMessage().getText())) {
                        Optional<TelegramState> lastState1 = botMainService.getLastState(update);
                        lastState1.get().setCount(Double.parseDouble(update.getMessage().getText()));
                        String uuidString1 = orderRepository.getUserWithLessOrder();
                        User admin1 = userRepository.findById(UUID.fromString(uuidString1)).orElseThrow(() -> new ResourceNotFoundException("user", "id", uuidString1));
                        Order order3 = orderRepository.findById(lastState1.get().getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", lastState1));
                        lastState1.get().setOrderId(order3.getId());
                        if (admin1.getChatId() != null) {
                            SendMessage sendMessage2 = new SendMessage();
                            sendMessage2.setText("Mavjud buyurtmani takrorlash so'raldi\n" +
                                    "<b>Mijoz: </b> " + lastState1.get().getLastName() + " " + lastState1.get().getFirstName() + " " + lastState1.get().getCompanyName() + "\n" +
                                    "<b>Maxsulot: </b> " + order3.getProductName() + "\n" +
                                    "<b>Narxi: </b> " + order3.getPrice() + "\n" +
                                    "<b>Soni: </b> " + update.getMessage().getText());
                            sendMessage2.setChatId(admin1.getChatId());
                            sendMessage2.setParseMode(ParseMode.HTML);
                            List<ReqInlineButton> buttons1 = new ArrayList<>();
                            buttons1.add(new ReqInlineButton("❌ Bekor qilish", BotState.ADMIN_CABINET + "/" + update.getMessage().getChatId()));
                            buttons1.add(new ReqInlineButton("✅ Tasdiqlash/", "Apply/" + update.getMessage().getChatId()));
                            buttons1.add(new ReqInlineButton("\uD83D\uDD04 Narxni o'zgartirish", BotConstant.CHANGE_EXISTING_ORDER_PRICE + "/" + update.getMessage().getChatId()));
                            InlineKeyboardMarkup inlineKeyboardMarkup1 = new InlineKeyboardMarkup();
                            List<List<InlineKeyboardButton>> rows1 = new ArrayList<>();
                            rows1.add(createButtonService.createOneRowButtons(buttons1));
                            inlineKeyboardMarkup1.setKeyboard(rows1);
                            sendMessage2.setReplyMarkup(inlineKeyboardMarkup1);
                            pdpOrderBot.execute(sendMessage2);

                            SendMessage sendMessage3 = new SendMessage();
                            sendMessage3.setChatId(update.getMessage().getChatId());
                            sendMessage3.setText("Xabaringiz adminstratorimizga yuborildi. Tez orada javob olasiz");
                            pdpOrderBot.execute(sendMessage3);
                            lastState1.get().setState(BotState.WAITING_ADMIN_RESPONSE);
                            telegramStateRepository.save(lastState1.get());
                        }
                    } else {
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setChatId(update.getMessage().getChatId());
                        sendMessage.setText("Mahsulot sonini xato kirityapsiz. Iltimos takroran kiriting");
                        pdpOrderBot.execute(sendMessage);
                    }
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
                                SendMessage sendMessage = new SendMessage();
                                sendMessage.setChatId(update.getMessage().getChatId());
                                sendMessage.setText("Siz tizimdan ro'yxatdan o'tgansiz parolni kiriting");
                                pdpOrderBot.execute(sendMessage);
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
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setReplyMarkup(new ReplyKeyboardRemove());
                        String phoneNumber;
                        phoneNumber = update.getMessage().getText();
                        TelegramState telegramState = new TelegramState();
                        telegramState.setPhoneNumber(phoneNumber);
                        telegramState.setTgUserId(update.getMessage().getFrom().getId());
                        telegramState.setState(BotState.REGISTRATION_FIRSTNAME);
                        telegramStateRepository.save(telegramState);
                        sendMessage.setText("Ismingizni kiriting");
                        pdpOrderBot.execute(sendMessage);
                    }
                } else {
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.setText("Raqam noto'g'ri kiritilgan");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    pdpOrderBot.execute(sendMessage);
                }
            }

        } catch (
                TelegramApiException e) {
            e.printStackTrace();
        }
    }

}
