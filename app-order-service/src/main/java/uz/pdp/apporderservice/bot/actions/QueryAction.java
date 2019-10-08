package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.*;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ReqInlineButton;
import uz.pdp.apporderservice.payload.ReqOrder;
import uz.pdp.apporderservice.payload.ReqOrderBot;
import uz.pdp.apporderservice.repository.*;
import uz.pdp.apporderservice.service.OrderService;
import uz.pdp.apporderservice.service.PdfService;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

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
    @Autowired
    OrderRepository orderRepository;
    @Autowired
    CreateButtonService createButtonService;
    @Autowired
    PdfService pdfService;
    @Autowired
    OrderService orderService;
    @Autowired
    BasketRepository basketRepository;

    public void runQuery(Update update) {
        String query = update.getCallbackQuery().getData();
        if (query.equals(BotConstant.NEW_ORDER)) {
            Optional<TelegramState> lastState = botMainService.getLastState(update);
            if (lastState.isPresent()) {
                lastState.get().setState(BotState.ADMIN_CUSTOMER_CHAT);
                telegramStateRepository.save(lastState.get());
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Admin bilan aloqa o'rnatildi. Buyurtma qilmoqchi bo'lgan maxsulotingiz haqida yozing");
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                try {
                    pdpOrderBot.execute(sendMessage);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            } else {
                botMainService.startPage(update);
            }
        } else if (query.startsWith("FromAdmin#")) {
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


        } else if (query.equals(BotState.CHANGE_USER_INFO)) {
            botMainService.sendSimpleMessage(update, "Ismingizni kiriting", BotState.SETTINGS_FIRSTNAME);
        } else if (query.equals(BotConstant.SETTINGS)) {
            EditMessageText editMessageText = new EditMessageText();
            editMessageText.setText("⚒Sozlamalar:");
            List<List<InlineKeyboardButton>> rows = new ArrayList<>();
            List<InlineKeyboardButton> row1 = new ArrayList<>();
            List<InlineKeyboardButton> row2 = new ArrayList<>();
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            button1.setText("Shaxsiy ma'lumotlar");
            button1.setCallbackData(BotState.CLEINT_INFO);
            InlineKeyboardButton button2 = new InlineKeyboardButton();
            button2.setText("Yordam");
            button2.setCallbackData(BotConstant.HELP);
            row1.add(button1);
            row1.add(button2);
            rows.add(row1);
            InlineKeyboardButton button3 = new InlineKeyboardButton();
            button3.setCallbackData(BotState.BACK_TO_CABINET);
            button3.setText("Orqaga");
            row2.add(button3);
            rows.add(row2);
            InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
            inlineKeyboardMarkup.setKeyboard(rows);
            editMessageText.setReplyMarkup(inlineKeyboardMarkup);
            editMessageText.setChatId(update.getCallbackQuery().getMessage().getChatId());
            editMessageText.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
            try {
                pdpOrderBot.execute(editMessageText);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.BASKET_PAGE)) {
            Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("Basket", "id", update));
            botMainService.savatChaPage(update,basket);
        } else if (query.equals(BotState.CLEINT_INFO)) {
            User user = userRepository.findByTelegramId(update.getCallbackQuery().getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("<b>Shaxsiy ma'lumotlaringiz:</b>\n" +
                    "<b>FIO:</b> " + user.getLastName() + " " + user.getFirstName() + " " + user.getPatron() + "\n" +
                    "<b>Kompaniya nomi:</b> " + user.getCompanyName() + "\n" +
                    "<b>Tel:</b> " + user.getPhoneNumber() + "\n");
            sendMessage.setParseMode(ParseMode.HTML);
            sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
            InlineKeyboardButton button = new InlineKeyboardButton();
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            button.setText("Orqaga");
            button.setCallbackData(BotState.BACK_TO_CABINET);
            button1.setText("O'zgartirish");
            button1.setCallbackData(BotState.CHANGE_USER_INFO);
            List<InlineKeyboardButton> buttons = new ArrayList<>();
            buttons.add(button);
            buttons.add(button1);
            List<List<InlineKeyboardButton>> rows = new ArrayList<>();
            rows.add(buttons);
            InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
            inlineKeyboardMarkup.setKeyboard(rows);
            sendMessage.setReplyMarkup(inlineKeyboardMarkup);
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotConstant.HELP)) {
            EditMessageText sendMessage = new EditMessageText();
            sendMessage.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
            sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
            sendMessage.setText("<b>ℹ️Yordam</b>\n" +
                    "Ushbu bot orqali EURO PRINT tashkilotiga yangi buyurtmalarni amalga oshirishingiz, yoki mavjud buyurtmalaringizdan yana buyurtma qilishingiz mumkin. Birinchi marta buyurtma qilayotganlar yangi buyurtma tugmasini bosish orqali adminstrator bilan aloqa o'rnatishadi va o'zlarining buyurtmalari haqida to'liq ma'lumotlarni kiritishadi. Adminstrator  tasdiqlangan buyurtma to'g'risidagi shartnomani jo'natadi. Buyurtmangizni olish uchun shartnoma bilan kelishni unutmang!");
            sendMessage.setParseMode(ParseMode.HTML);
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Orqaga", BotState.BACK_TO_CABINET));
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith("existingOrder/")) {
            TelegramState lastState = botMainService.getLastState(update).get();
            Order order = orderRepository.findById(UUID.fromString(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
            EditMessageText sendMessage = new EditMessageText();
            sendMessage.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
            sendMessage.setText("<b>Maxsulot: </b> " + order.getProductName() + "\n" +
                    "<b>1ta Maxsulot narxi: </b> " + order.getPrice() + "\n" +
                    "<b>Sana: </b> " + order.getOrderedDate() + "\nSonini kiriting!");
            sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
            sendMessage.setParseMode(ParseMode.HTML);
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Orqaga", BotState.BACK_TO_CABINET));
            lastState.setState(BotState.EXISTING_ORDER_COUNT);
            lastState.setOrderId(order.getId());
            telegramStateRepository.save(lastState);
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.BASKET_ADMIN_FINISH)) {
            Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("basket", "id", update));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(basket.getUser().getTelegramId().longValue());
            sendMessage.setText("Buyurtmangiz rasmiylashtirildi.pdfpdfpdf");
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Bosh sahifa",BotState.BACK_TO_CABINET));
            for (Order order : basket.getOrders()) {
                order.setStatus(OrderStatus.ACTIVE);
                orderRepository.save(order);
            }
            basketRepository.deleteById(basket.getId());
            try {
                pdpOrderBot.execute(sendMessage);
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith(BotConstant.BASKET_ADMIN_IGNORE)) {
            Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("basket", "id", update));
            SendMessage sendMessage  =new SendMessage();
            sendMessage.setChatId(basket.getUser().getTelegramId().longValue());
            sendMessage.setText("Adminstrator buyurtmangizni bekor qildi. Murojaat uchun tel:"+basket.getOrders().get(0).getCreatedBy().getPhoneNumber());
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Bosh sahifa",BotState.BACK_TO_CABINET));
            basketRepository.deleteById(basket.getId());
            for (Order order : basket.getOrders()) {
                orderRepository.deleteById(order.getId());
            }
            try {
                pdpOrderBot.execute(sendMessage);
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.BASKET_ACTIVATE)) {
            try {
                Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("basket", "id", update));
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Adminstrator tasdiqlagandan so'ng buyurtma rasmiylashtiriladi");
                sendMessage.setChatId(basket.getUser().getTelegramId().longValue());
                SendMessage sendMessage1 = new SendMessage();
                sendMessage1.setText(botMainService.basketMessageGeneration(basket));
                sendMessage1.setChatId(basket.getOrders().get(0).getCreatedBy().getTelegramId().longValue());
                sendMessage1.setParseMode(ParseMode.HTML);
                List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                List<InlineKeyboardButton> row = new ArrayList<>();
                InlineKeyboardButton button = new InlineKeyboardButton();
                InlineKeyboardButton button1 = new InlineKeyboardButton();
                button.setText("Tasdiqlash");
                button.setCallbackData(BotConstant.BASKET_ADMIN_FINISH + "#" + basket.getId());
                button1.setText("Rad etish");
                button1.setCallbackData(BotConstant.BASKET_ADMIN_IGNORE + "#" + basket.getId());
                row.add(button);
                row.add(button1);
                rows.add(row);
                InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                inlineKeyboardMarkup.setKeyboard(rows);
                sendMessage1.setReplyMarkup(inlineKeyboardMarkup);
                pdpOrderBot.execute(sendMessage1);
                pdpOrderBot.execute(sendMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }

        } else if (query.startsWith("Apply/")) {
            try {
                pdpOrderBot.execute(new DeleteMessage().setMessageId(update.getCallbackQuery().getMessage().getMessageId()).setChatId(update.getCallbackQuery().getMessage().getChatId()));
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            User byId = userRepository.findByTelegramId(Integer.parseInt(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("user", "id", update));
            TelegramState lastState = botMainService.getLastState(update).get();
            TelegramState clientState = telegramStateRepository.findByTgUserId(byId.getTelegramId()).orElseThrow(() -> new ResourceNotFoundException("client", "id", update));
            Order order = orderRepository.findById(clientState.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", byId));
            User userAdmin = userRepository.findByTelegramId(update.getCallbackQuery().getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("user", "telegram id", update));
            orderService.saveOrderByBot(new ReqOrderBot("ACTIVE", byId.getId(), new Timestamp(System.currentTimeMillis()), order.getProductName(), order.getPrice(), clientState.getCount(), userAdmin.getId()));
            SendMessage sendMessage1 = new SendMessage();
            sendMessage1.setText("Buyurtma tasdiqlandi");
            sendMessage1.setChatId(lastState.getTgUserId().longValue());

            try {
                pdpOrderBot.execute(sendMessage1);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            lastState.setState(BotState.ADMIN_CABINET);
            telegramStateRepository.save(lastState);
            try {
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Xurmatli mijoz sizning buyurtmangiz tasdiqlandi. Iltimos raxbarning to'liq nomini(FIO) kiriting. Kiritilgan ma'lumot to'g'ri ekanligiga ishonch hosil qiling chunki ushbu ma'lumot shartnomaga kiritiladi.");
            sendMessage.setChatId(byId.getTelegramId().longValue());
            clientState.setState(BotState.DIRECTOR_NAME);
            clientState.setOrderId(order.getId());
            telegramStateRepository.save(clientState);
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotConstant.REFRESH_CABINET_PAGE)) {
            TelegramState lastState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "state", update));
            lastState.setState(BotState.CABINET_PAGE);
            try {
                pdpOrderBot.execute(new DeleteMessage().setMessageId(update.getCallbackQuery().getMessage().getMessageId()).setChatId(update.getCallbackQuery().getMessage().getChatId()));
                botMainService.cabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotState.BACK_TO_CABINET)) {
            try {
                DeleteMessage deleteMessage = new DeleteMessage().setMessageId(update.getCallbackQuery().getMessage().getMessageId()).setChatId(update.getCallbackQuery().getMessage().getChatId());
                pdpOrderBot.execute(deleteMessage);
                botMainService.cabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotConstant.ACTIVE_ORDER_PAGE)) {
            try {
                DeleteMessage deleteMessage = new DeleteMessage().setMessageId(update.getCallbackQuery().getMessage().getMessageId()).setChatId(update.getCallbackQuery().getMessage().getChatId());
                pdpOrderBot.execute(deleteMessage);
                botMainService.activeOrderPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotConstant.CUSTOMER_IGNORE_ORDER_IGNORE)) {
            botMainService.activeOrderPage(update);
        } else if (query.equals(BotConstant.BALANCE)) {
            botMainService.getCustomerBalance(update);
        } else if (query.startsWith(BotConstant.NOT_ALLOW_IGNORE_ORDER)) {
            Order order = orderRepository.findById(UUID.fromString(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("So'rovingiz rad etildi. Murojaat uchun tel: " + order.getCreatedBy().getPhoneNumber());
            sendMessage.setChatId(order.getUser().getTelegramId().longValue());
            try {
                pdpOrderBot.execute(sendMessage);
                sendMessage.setText("Mijoz so'rovi rad etildi");
                sendMessage.setChatId(order.getCreatedBy().getTelegramId().longValue());
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith(BotConstant.CUSTOMER_IGNORE_ALLOW)) {
            Order order = orderRepository.findById(UUID.fromString(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
            try {
                pdpOrderBot.execute(new SendMessage(order.getUser().getTelegramId().longValue(), "Admin javobini kuting"));
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            SendMessage toAdmin = new SendMessage();
            toAdmin.setChatId(order.getCreatedBy().getTelegramId().longValue());
            toAdmin.setText("<b>Buyurtmani bekor qilish so'rovi</b>\n" +
                    "<b>Mijoz:</b> " + order.getUser().getLastName() + " " + order.getUser().getFirstName() + " " + order.getUser().getCompanyName() + "\n" +
                    "<b>Maxsulot:</b> " + order.getProductName() + "\n" +
                    "<b>Narxi:</b> " + order.getPrice() + "\n" +
                    "<b>Soni:</b>" + order.getCount());
            toAdmin.setParseMode(ParseMode.HTML);
            InlineKeyboardButton button = new InlineKeyboardButton();
            button.setText("✅");
            button.setCallbackData(BotConstant.ALLOW_IGNORE_ORDER + "/" + order.getId());
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            button1.setText("❌");
            button1.setCallbackData(BotConstant.NOT_ALLOW_IGNORE_ORDER + "/" + order.getId());
            List<InlineKeyboardButton> buttons = new ArrayList<>();
            buttons.add(button);
            buttons.add(button1);
            List<List<InlineKeyboardButton>> rows = new ArrayList<>();
            rows.add(buttons);
            InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
            inlineKeyboardMarkup.setKeyboard(rows);
            toAdmin.setReplyMarkup(inlineKeyboardMarkup);
            try {
                pdpOrderBot.execute(toAdmin);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.IGNORE_ORDER)) {
            try {
                Order order = orderRepository.findById(UUID.fromString(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                TelegramState telegramState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
                telegramState.setState(BotState.WAITING_ADMIN_RESPONSE);
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("<b>Buyurtmani bekor qilish</b>\n" +
                        "<b>Maxsulot:</b> " + order.getProductName() + "\n" +
                        "<b>Narxi:</b> " + order.getPrice() + "\n" +
                        "<b>Soni:</b> " + order.getCount());
                sendMessage.setParseMode(ParseMode.HTML);
                List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                List<InlineKeyboardButton> buttons = new ArrayList<>();
                InlineKeyboardButton button = new InlineKeyboardButton();
                button.setText("❌");
                button.setCallbackData(BotConstant.CUSTOMER_IGNORE_ORDER_IGNORE);
                InlineKeyboardButton button1 = new InlineKeyboardButton();
                button1.setText("✅");
                button1.setCallbackData(BotConstant.CUSTOMER_IGNORE_ALLOW + "/" + order.getId());
                buttons.add(button);
                buttons.add(button1);
                rows.add(buttons);
                InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                inlineKeyboardMarkup.setKeyboard(rows);
                sendMessage.setReplyMarkup(inlineKeyboardMarkup);
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.ALLOW_IGNORE_ORDER)) {
            try {
                Order order = orderRepository.findById(UUID.fromString(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("order", "id", update));
                orderService.delete(order.getId());
                List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                List<InlineKeyboardButton> row = new ArrayList<>();
                InlineKeyboardButton button = new InlineKeyboardButton();
                button.setText("\uD83C\uDFE0Bosh sahifaga qaytish");
                button.setCallbackData(BotState.BACK_TO_CABINET);
                row.add(button);
                rows.add(row);
                InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                inlineKeyboardMarkup.setKeyboard(rows);
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Buyurtmangiz bekor qilindi.");
                sendMessage.setReplyMarkup(inlineKeyboardMarkup);
                sendMessage.setChatId(order.getUser().getTelegramId().longValue());
                SendMessage sendMessage1 = new SendMessage();
                sendMessage1.setText("Buyurtma bekor qilindi.");
                sendMessage1.setChatId(update.getCallbackQuery().getMessage().getChatId());
                pdpOrderBot.execute(sendMessage1);
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }


        } else if (query.startsWith("ActivateOrder/")) {
            try {
                UUID orderId = UUID.fromString(query.split("/")[1]);
                Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("order", "id", query));
                order.setStatus(OrderStatus.ACTIVE);
                Order save = orderRepository.save(order);
                SendMessage sendMessage = new SendMessage();
                sendMessage.setChatId(order.getCreatedBy().getTelegramId().longValue());
                sendMessage.setText("<b>Buyurtma</b>\n" +
                        "<b>Maxsulot nomi:</b> " + order.getProductName() + "\n" +
                        "<b>Narxi:</b> " + order.getPrice() + "\n" +
                        "<b>Soni:</b> " + order.getCount() + "\n" +
                        "<b>Xolati:</b> **Tasdiqlandi**");
                sendMessage.setParseMode(ParseMode.HTML);
                pdpOrderBot.execute(sendMessage);
                EditMessageText sendMessage1 = new EditMessageText();
                sendMessage1.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
                sendMessage1.setChatId(update.getCallbackQuery().getMessage().getChatId());
                sendMessage1.setText("Raxbarning ism, sharifini kiriting(Shaxs haqida kiritilgan ma'lumot to'g'ri ekanligiga e'tibor bering. Chunki ushbu ma'lumot shartnomaga kiritiladi).");
                sendMessage1.setParseMode(ParseMode.HTML);
                TelegramState telegramState = telegramStateRepository.findByTgUserId(update.getCallbackQuery().getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
                telegramState.setState(BotState.DIRECTOR_NAME);
                telegramState.setOrderId(save.getId());
                pdpOrderBot.execute(sendMessage1);
                telegramStateRepository.save(telegramState);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith("DeactivateOrder/")) {
            UUID orderId = UUID.fromString(query.split("/")[1]);
            Order order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("order", "id", query));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setChatId(order.getCreatedBy().getTelegramId().longValue());
            sendMessage.setText("<b>Buyurtma</b>\n" +
                    "<b>Maxsulot nomi:</b> " + order.getProductName() + "\n" +
                    "<b>Narxi:</b> " + order.getPrice() + "\n" +
                    "<b>Soni:</b> " + order.getCount() + "\n" +
                    "<b>Xolati:</b> **Bekor qilindi**");
            sendMessage.setParseMode(ParseMode.HTML);
            try {
                pdpOrderBot.execute(sendMessage);
                EditMessageText sendMessage1 = new EditMessageText();
                sendMessage1.setChatId(update.getCallbackQuery().getMessage().getChatId());
                sendMessage1.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
                sendMessage1.setText("Buyurtma bekor qilindi");
                pdpOrderBot.execute(sendMessage1);
                orderRepository.deleteById(orderId);
                botMainService.cabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }


        } else if (query.startsWith(BotState.ADMIN_IGNORE_ORDER_CABINET)) {
            UUID basketId = UUID.fromString(query.split("#")[1]);
            Basket basket = basketRepository.findById(basketId).orElseThrow(() -> new ResourceNotFoundException("basket", "Id", basketId));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Buyurtmangiz adminstrator tomonidan bekor qilindi. Murojaat uchun tel:" + basket.getOrders().get(0).getCreatedBy().getPhoneNumber());
            sendMessage.setChatId(basket.getOrders().get(0).getUser().getTelegramId().longValue());
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Bosh menyu", BotState.BACK_TO_CABINET));

            basketRepository.deleteById(basketId);

            for (Order order : basket.getOrders()) {
                orderRepository.deleteById(order.getId());
            }
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            try {
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }


        } else if (query.startsWith(BotConstant.ORDER_ALLOW_BY_CUSTOMER)) {
            Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("basket", "id", update));
            for (Order order : basket.getOrders()) {
                order.setStatus(OrderStatus.ACTIVE);
                orderRepository.save(order);
            }
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText(botMainService.basketMessageGeneration(basket) + "\nTasdiqlandi");
            sendMessage.setChatId(basket.getOrders().get(0).getCreatedBy().getTelegramId().longValue());
            sendMessage.setParseMode(ParseMode.HTML);
            basketRepository.deleteById(basket.getId());
            try {
                botMainService.cabinetPage(update);
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith(BotConstant.ORDER_IGNORE_BY_CUSTOMER)) {
            Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("basket", "id", update));
            EditMessageText sendMessage1 = new EditMessageText();
            sendMessage1.setMessageId(update.getCallbackQuery().getMessage().getMessageId());
            sendMessage1.setChatId(basket.getOrders().get(0).getUser().getTelegramId().longValue());
            sendMessage1.setText("Buyurtmangiz bekor qilindi");
            try {
                pdpOrderBot.execute(sendMessage1);
                botMainService.clearBasket(basket);
                botMainService.cabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

        } else if (query.startsWith(BotConstant.FINISH_ORDER)) {
            try {
                Basket basket = basketRepository.findById(UUID.fromString(query.split("#")[1])).orElseThrow(() -> new ResourceNotFoundException("Basket", "id", update));
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Mijoz tasdiqlagandan so'ng buyurtma rasmiylashtiriladi");
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                SendMessage sendMessage1 = new SendMessage();
                String msg = "<b>Basket</b>\n" +
                        "<b>Mijoz:</b>" + basket.getUser().getLastName() + " " + basket.getUser().getFirstName() + " " + basket.getUser().getCompanyName() + "\n-------------\n";
                Double a = 0.0;
                for (Order saveOrder : basket.getOrders()) {
                    a += saveOrder.getPrice() * saveOrder.getCount();
                    msg += (basket.getOrders().indexOf(saveOrder) + 1) +
                            "<b>. Mahsulot:</b> " + saveOrder.getProductName() + "\n" +
                            "<b>Soni:</b> " + saveOrder.getCount() + "\n" +
                            "<b>Narx:</b> " + saveOrder.getPrice() * saveOrder.getCount() + "\n-------------\n";
                }
                msg += "\n<b>Umumiy:</b>" + a;
                sendMessage1.setText(msg);
                List<List<InlineKeyboardButton>> rows = new ArrayList<>();
                List<InlineKeyboardButton> row = new ArrayList<>();
                List<InlineKeyboardButton> row1 = new ArrayList<>();
                InlineKeyboardButton button = new InlineKeyboardButton();
                InlineKeyboardButton button1 = new InlineKeyboardButton();
                InlineKeyboardButton button2 = new InlineKeyboardButton();
                button2.setText("Yana maxsulot qo'shish");
                button2.setCallbackData(BotState.BACK_TO_CABINET);
                button.setText("Tasdiqlash");
                button1.setText("Bekor qilish");
                button.setCallbackData(BotConstant.ORDER_ALLOW_BY_CUSTOMER + "#" + basket.getId());
                button1.setCallbackData(BotConstant.ORDER_IGNORE_BY_CUSTOMER + "#" + basket.getId());
                row.add(button);
                row.add(button1);
                row1.add(button2);
                rows.add(row);
                rows.add(row1);
                InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
                inlineKeyboardMarkup.setKeyboard(rows);
                sendMessage1.setParseMode(ParseMode.HTML);
                sendMessage1.setReplyMarkup(inlineKeyboardMarkup);
                sendMessage1.setChatId(basket.getUser().getTelegramId().longValue());
                pdpOrderBot.execute(sendMessage1);
                pdpOrderBot.execute(sendMessage);
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith("PdfSend#")) {
            try {
                SendMessage sendMessage = new SendMessage();
                sendMessage.setChatId(update.getCallbackQuery().getFrom().getId().longValue());
                sendMessage.setText("Quyidagi tartibda ma'lumotlarni kiriting\n" +
                        "Maxsulot nomi/1ta maxsulot narxi/Soni");
                TelegramState telegramState = telegramStateRepository.findByTgUserId(update.getCallbackQuery().getFrom().getId()).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
                telegramState.setState(BotState.GENERATE_ORDER);
                telegramState.setCustomerChatId(Long.parseLong(query.split("#")[1]));
                telegramStateRepository.save(telegramState);
                pdpOrderBot.execute(sendMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (query.startsWith("PdfSendkmp#")) {
            try {
                Long clientChatId = Long.parseLong(query.split("#")[1]);
                TelegramState telegramState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
                telegramState.setCustomerChatId(clientChatId);
                telegramState.setState(BotState.FILE_SEND);
                telegramStateRepository.save(telegramState);
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Faylni kiriting");
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                pdpOrderBot.execute(sendMessage);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else if (false) {
            TelegramState telegramState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Mijoz tasdiqlagandan so'ng buyurtma aktivlashtiriladi");
            sendMessage.setChatId(update.getMessage().getChatId());
            telegramState.setState(BotState.ADMIN_CABINET);
            telegramStateRepository.save(telegramState);
            try {
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }

            SendMessage sendMessage1 = new SendMessage();
//            sendMessage1.setText("<b>Buyurtma:</b>\n" +
//                    "<b>Maxsulot nomi:</b> " + order.getProductName() + "\n" +
//                    "<b>Narxi(dona):</b> " + order.getPrice() + "\n" +
//                    "<b>Soni:</b>: " + order.getCount());
            List<ReqInlineButton> buttons = new ArrayList<>();
            buttons.add(new ReqInlineButton("✅ Tasdiqlash", "ActivateOrder/"));
            buttons.add(new ReqInlineButton("❌ Bekror qilish", "DeactivateOrder/"));
            List<List<InlineKeyboardButton>> rows = new ArrayList<>();
            List<InlineKeyboardButton> row = createButtonService.createOneRowButtons(buttons);
            rows.add(row);
            InlineKeyboardMarkup inlineKeyboardMarkup = new InlineKeyboardMarkup();
            inlineKeyboardMarkup.setKeyboard(rows);
            sendMessage1.setReplyMarkup(inlineKeyboardMarkup);
            sendMessage1.setChatId(telegramState.getCustomerChatId());
            sendMessage1.setParseMode(ParseMode.HTML);
            try {
                pdpOrderBot.execute(sendMessage1);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotConstant.APLY_ORDER_WITH_NEW_PRICE)) {
            try {
                TelegramState clientState = botMainService.getLastState(update).get();
                User client = userRepository.findByTelegramId(clientState.getTgUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "telegramid", clientState));
                Order order = orderRepository.findById(clientState.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", clientState));
                Order order1 = orderService.saveOrderByBot(new ReqOrderBot("ACTIVE", order.getUser().getId(), new Timestamp(System.currentTimeMillis()), order.getProductName(), clientState.getNewPrice(), clientState.getCount(), order.getCreatedBy().getId()));
                SendMessage toManager = new SendMessage();
                toManager.setChatId(Long.parseLong(query.split("/")[1]));
                toManager.setText("Buyurtma mijoz tomonidan tasdiqlandi\n" +
                        "<b>Mijoz:</b> " + order1.getUser().getLastName() + " " + order1.getUser().getFirstName() + "\n" +
                        "<b>Maxsulot:</b> " + order1.getProductName() + "\n" +
                        "<b>Soni:</b> " + order1.getCount() + "\n" +
                        "<b>Narxi:</b> " + order1.getPrice() + "\n" +
                        "<b>Sana:</b> " + order1.getOrderedDate());
                toManager.setParseMode(ParseMode.HTML);
                pdpOrderBot.execute(toManager);
                clientState.setState(BotState.DIRECTOR_NAME);
                telegramStateRepository.save(clientState);
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Raxbarning to'liq nomini(FIO) kiriting. Kiritilgan ma'lumot to'g'ri ekanligiga ishonch hosil qiling. Chunki ushbu ma'lumotingiz shartnomaga yoziladi");
                sendMessage.setChatId(client.getTelegramId().longValue());
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotState.KOMPRED)) {
            botMainService.sendSimpleMessage(update, "Faylni yuklang", BotState.FILE_SEND);
        } else if (query.startsWith(BotConstant.CHANGE_EXISTING_ORDER_PRICE)) {
            try {
                TelegramState telegramState = botMainService.getLastState(update).orElseThrow(() -> new ResourceNotFoundException("laststate", "id", update));
                SendMessage sendMessage = new SendMessage();
                sendMessage.setText("Yangi narxni kiriting:");
                sendMessage.setChatId(update.getCallbackQuery().getMessage().getChatId());
                telegramState.setState(BotState.NEW_PRICE_EXSISTING_ORDER);
                telegramState.setCustomerChatId(Long.parseLong(query.split("/")[1]));
                telegramStateRepository.save(telegramState);
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.startsWith(BotState.ADMIN_CABINET)) {
            SendMessage sendMessage = new SendMessage();
            sendMessage.setText("Buyurtmangiz bekor qilingdi");
            sendMessage.setReplyMarkup(createButtonService.createInlineButton("Ok", BotState.BACK_TO_CABINET));
            sendMessage.setChatId(query.split("/")[1]);
            try {
                pdpOrderBot.execute(new DeleteMessage().setChatId(update.getCallbackQuery().getMessage().getChatId()).setMessageId(update.getCallbackQuery().getMessage().getMessageId()));
                pdpOrderBot.execute(sendMessage);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
            try {
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (query.equals(BotState.BACK_TO_ADMIM_CABINET)) {
            try {
                botMainService.adminCabinetPage(update);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
    }

}
