package uz.pdp.apporderservice.bot.actions;

import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.*;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.entity.enums.RoleName;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ReqInlineButton;
import uz.pdp.apporderservice.payload.ReqOrderBot;
import uz.pdp.apporderservice.payload.ReqPdf;
import uz.pdp.apporderservice.repository.*;
import uz.pdp.apporderservice.service.OrderService;
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
    @Autowired
    OrderService orderService;
    @Autowired
    BasketRepository basketRepository;

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
                } else if (currentState.equals(BotState.ADMIN_CABINET)) {
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.setText("Mijozlarga xabar yuborish uchun javob berish tugmasini bosing.");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    pdpOrderBot.execute(sendMessage);
                } else if (currentState.equals(BotState.DIRECTOR_NAME)) {
                    TelegramState telegramState1 = telegramStateRepository.findByTgUserId(update.getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                    Order order = orderRepository.findById(telegramState1.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                    File file = pdfService.readPdf(new ReqPdf(order.getId(), order.getUser().getCompanyName(), update.getMessage().getText()));
                    Long clientChatId = update.getMessage().getChatId();
                    pdpOrderBot.execute(new DeleteMessage(clientChatId, update.getMessage().getMessageId()));
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
                            "<b>Mijoz:</b> " + order.getUser().getLastName() + " " + order.getUser().getFirstName() + "\n" +
                            "<b>Raxbar:</b> " + update.getMessage().getText() + "\n" +
                            "<b>Maxsulot:</b> " + order.getProductName() + "\n" +
                            "<b>Price:</b> " + order.getPrice() + "\n" +
                            "<b>Count:</b> " + order.getCount());
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
                    botMainService.cabinetPage(update);
                } else if (currentState.equals(BotState.GENERATE_ORDER)) {
                    botMainService.sale(update);
                } else if (currentState.equals(BotState.SETTINGS_FIRSTNAME)) {
                    lastStateOptional.get().setFirstName(update.getMessage().getText());
                    telegramStateRepository.save(lastStateOptional.get());
                    botMainService.sendSimpleMessage(update, "Familiyangizni kiriting", BotState.SETTINGS_LASTNAME);
                } else if (currentState.equals(BotState.SETTINGS_LASTNAME)) {
                    lastStateOptional.get().setLastName(update.getMessage().getText());
                    telegramStateRepository.save(lastStateOptional.get());
                    botMainService.sendSimpleMessage(update, "Sharifingizni kiriting", BotState.SETTINGS_PATRON);
                } else if (currentState.equals(BotState.SETTINGS_PATRON)) {
                    lastStateOptional.get().setPatron(update.getMessage().getText());
                    telegramStateRepository.save(lastStateOptional.get());
                    botMainService.sendSimpleMessage(update, "Kompaniya nomini kiriting", BotState.SETTINGS_COMPANY_NAME);
                } else if (currentState.equals(BotState.SETTINGS_COMPANY_NAME)) {
                    lastStateOptional.get().setCompanyName(update.getMessage().getText());
                    telegramStateRepository.save(lastStateOptional.get());
                    User user = userRepository.findByTelegramId(update.getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
                    user.setFirstName(lastStateOptional.get().getFirstName());
                    user.setLastName(lastStateOptional.get().getLastName());
                    user.setPatron(lastStateOptional.get().getPatron());
                    user.setCompanyName(lastStateOptional.get().getCompanyName());
                    userRepository.save(user);
                    SendMessage sendMessage = new SendMessage();
                    sendMessage.setText("O'zgarishlar muvaffaqiyatli saqlandi");
                    sendMessage.setChatId(update.getMessage().getChatId());
                    pdpOrderBot.execute(sendMessage);
                    botMainService.cabinetPage(update);
                } else if (currentState.equals(BotState.ADMIN_CUSTOMER_CHAT)) {
                    Optional<User> customer = userRepository.findByTelegramId(update.getMessage().getFrom().getId());
                    User admin = new User();
                    if (telegramState.getMyAdmin()==null) {
                        String uuidString = orderRepository.getUserWithLessOrder();
                        admin = userRepository.findById(UUID.fromString(uuidString)).orElseThrow(() -> new ResourceNotFoundException("user", "id", uuidString));
                        telegramState.setMyAdmin(admin);
                        telegramStateRepository.save(telegramState);
                    } else {
                        admin = telegramState.getMyAdmin();
                    }
                    if (admin.getTelegramId() != null) {
                        SendMessage sendMessage1 = new SendMessage();
                        InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                        List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                        List<ReqInlineButton> buttons = new ArrayList<>();
                        buttons.add(new ReqInlineButton("Javob berish⬆", "FromAdmin#" + update.getMessage().getFrom().getId()));
                        buttons.add(new ReqInlineButton("Buyurtma ochish", "PdfSend#" + update.getMessage().getFrom().getId()));
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
                    } else {
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setText("Xabaringiz adminga bormadi. Nosozlikni bartaraf etish to'g'risidagi xabar xodimlarimizga yetib bordi. Iltimos bir necha daqiqalardan so'ng yana urinib ko'ring. Murojaat uchun tel: <b>" + admin.getPhoneNumber() + "</b>");
                        sendMessage.setChatId(customer.get().getTelegramId().longValue());
                        sendMessage.setParseMode(ParseMode.HTML);
                        pdpOrderBot.execute(sendMessage);
                        List<User> director = userRepository.findByRolesIn(new HashSet<>(roleRepository.findAllByName(RoleName.ROLE_ADMIN)));
                        SendMessage sendMessage1 = new SendMessage();
                        sendMessage1.setText(admin.getLastName() + " " + admin.getFirstName() + " nomli manager telegram botda ro'yxatdan o'tmagan. Mijozlarga noqulaylik tug'dirmaslik uchun uni o'chirib tashlang yoki botda registratsiyadan o'tkazing");
                        sendMessage1.setChatId(director.get(0).getTelegramId().longValue());
                        sendMessage1.setParseMode(ParseMode.HTML);
                        pdpOrderBot.execute(sendMessage1);
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
                        User admin1 = lastState1.get().getMyAdmin();
                        Order order3 = orderRepository.findById(lastState1.get().getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", lastState1));
                        User client = userRepository.findByTelegramId(update.getMessage().getFrom().getId()).orElseThrow(() -> new ResourceNotFoundException("User", "id", update));
                        Order order = orderService.saveOrderByBot(new ReqOrderBot("HIDDEN", client.getId(), new Timestamp(System.currentTimeMillis()), order3.getProductName(), order3.getPrice(), Double.parseDouble(update.getMessage().getText()), admin1.getId()));
                        Basket basket = botMainService.saveToBasket(client, order);
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setText("Savatchaga qo'shildi");
                        sendMessage.setChatId(client.getTelegramId().longValue());
                        pdpOrderBot.execute(sendMessage);
                        botMainService.savatChaPage(update, basket);
                    } else {
                        SendMessage sendMessage = new SendMessage();
                        sendMessage.setChatId(update.getMessage().getChatId());
                        sendMessage.setText("Mahsulot sonini xato kirityapsiz. Iltimos takroran kiriting");
                        pdpOrderBot.execute(sendMessage);
                    }
                }
            } else {
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Iltimos kontakt yuborish tugmasini bosing");
                sendMessage.setChatId(update.getMessage().getChatId());
                pdpOrderBot.execute(sendMessage);
            }
        } catch (
                TelegramApiException e) {
            e.printStackTrace();
        }
    }

}
