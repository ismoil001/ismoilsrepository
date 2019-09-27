package uz.pdp.apporderservice.bot.actions;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.meta.api.methods.ParseMode;
import org.telegram.telegrambots.meta.api.methods.send.SendDocument;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.DeleteMessage;
import org.telegram.telegrambots.meta.api.methods.updatingmessages.EditMessageText;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.pdp.apporderservice.bot.PdpOrderBot;
import uz.pdp.apporderservice.bot.service.BotMainService;
import uz.pdp.apporderservice.bot.utils.BotConstant;
import uz.pdp.apporderservice.bot.utils.BotState;
import uz.pdp.apporderservice.entity.Order;
import uz.pdp.apporderservice.entity.TelegramState;
import uz.pdp.apporderservice.entity.User;
import uz.pdp.apporderservice.entity.enums.OrderStatus;
import uz.pdp.apporderservice.exception.ResourceNotFoundException;
import uz.pdp.apporderservice.payload.ReqPdf;
import uz.pdp.apporderservice.repository.OrderRepository;
import uz.pdp.apporderservice.repository.RoleRepository;
import uz.pdp.apporderservice.repository.TelegramStateRepository;
import uz.pdp.apporderservice.repository.UserRepository;
import uz.pdp.apporderservice.service.OrderService;
import uz.pdp.apporderservice.service.PdfService;

import java.io.File;
import java.sql.Timestamp;
import java.util.*;

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
            Order newOrder = new Order();
            newOrder.setUser(byId);
            newOrder.setStatus(OrderStatus.ACTIVE);
            newOrder.setProductName(order.getProductName());
            newOrder.setPrice(order.getPrice());
            newOrder.setOrderedDate(new Timestamp(System.currentTimeMillis()));
            newOrder.setCount(clientState.getCount());
            newOrder.setCreatedBy(userAdmin);
            newOrder.setUpdatedBy(userAdmin);
            orderRepository.save(newOrder);
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
            button.setText("Tasdiqlash");
            button.setCallbackData(BotConstant.ALLOW_IGNORE_ORDER + "/" + order.getId());
            InlineKeyboardButton button1 = new InlineKeyboardButton();
            button1.setText("Bekor qilish");
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
                button.setText("Bekor qilish");
                button.setCallbackData(BotConstant.CUSTOMER_IGNORE_ORDER_IGNORE);
                InlineKeyboardButton button1 = new InlineKeyboardButton();
                button1.setText("Tasdiqlash");
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
            try {
                pdpOrderBot.execute(sendMessage);
                SendMessage sendMessage1 = new SendMessage();
                sendMessage1.setChatId(update.getCallbackQuery().getMessage().getChatId());
                sendMessage1.setText("Raxbarning ism, sharifini kiriting(Shaxs haqida kiritilgan ma'lumot to'g'ri ekanligiga e'tibor bering. Chunki ushbu ma'lumot shartnomaga kiritiladi).");
                sendMessage1.setParseMode(ParseMode.HTML);
                TelegramState telegramState = telegramStateRepository.findByTgUserId(update.getCallbackQuery().getMessage().getChatId().intValue()).orElseThrow(() -> new ResourceNotFoundException("state", "id", update));
                telegramState.setState(BotState.DIRECTOR_NAME);
                telegramState.setOrderId(save.getId());
                telegramStateRepository.save(telegramState);
                pdpOrderBot.execute(sendMessage1);
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
                SendMessage sendMessage1 = new SendMessage();
                sendMessage1.setChatId(update.getCallbackQuery().getMessage().getChatId());
                sendMessage1.setText("Buyurtma bekor qilindi");
                pdpOrderBot.execute(sendMessage1);
                botMainService.cabinetPage(update);
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
        }
        if (query.startsWith(BotConstant.APLY_ORDER_WITH_NEW_PRICE)) {
            try {
                TelegramState clientState = botMainService.getLastState(update).get();
                User client = userRepository.findByTelegramId(clientState.getTgUserId()).orElseThrow(() -> new ResourceNotFoundException("user", "telegramid", clientState));
                Order order = orderRepository.findById(clientState.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("order", "id", clientState));
                Order order1 = new Order();
                order1.setCount(clientState.getCount());
                order1.setOrderedDate(new Timestamp(System.currentTimeMillis()));
                order1.setPrice(clientState.getNewPrice());
                order1.setProductName(order.getProductName());
                order1.setStatus(OrderStatus.ACTIVE);
                order1.setUser(client);
                order1.setCreatedBy(userRepository.findByTelegramId(Integer.parseInt(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("user", "id", update)));
                order1.setUpdatedBy(userRepository.findByTelegramId(Integer.parseInt(query.split("/")[1])).orElseThrow(() -> new ResourceNotFoundException("user", "id", update)));
                orderRepository.save(order1);
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
        }
        if (query.startsWith(BotConstant.CHANGE_EXISTING_ORDER_PRICE)) {
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
        }
        if (query.startsWith(BotState.ADMIN_CABINET)) {
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
        }
    }

}
