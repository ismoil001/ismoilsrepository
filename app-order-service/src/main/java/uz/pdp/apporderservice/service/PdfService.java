package uz.pdp.apporderservice.service;


import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import org.springframework.stereotype.Service;
import uz.pdp.apporderservice.payload.ReqPdf;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


@Service
public class PdfService {
    public File readPdf(ReqPdf reqPdf){
        try {
            PdfWriter writer = new PdfWriter(reqPdf.getCustomerCompanyName() + ".pdf");
            PdfDocument pdfDocument = new PdfDocument(writer);
            Document document = new Document(pdfDocument);
            Paragraph paragraphTop = new Paragraph();
            paragraphTop.setTextAlignment(TextAlignment.CENTER);
            Text textTop = new Text("ДОГОВОР №");
            PdfFont font = PdfFontFactory.createFont("C:\\\\WINDOWS\\\\Fonts\\\\ARIAL.TTF", PdfEncodings.IDENTITY_H, true);
            textTop.setFont(font).setBold();
            textTop.setFontSize(10f);
            paragraphTop.setFixedLeading(6f);
            paragraphTop.add(textTop);
            Text text1 = new Text("г. Коканд");
            text1.setFont(font).setBold();
            text1.setFontSize(6f);
            Paragraph paragraph1 = new Paragraph();
            paragraph1.setTextAlignment(TextAlignment.RIGHT);
            paragraph1.add(text1);

            Text text2 = new Text("ООО «EUROPRINT KOKAND», именуемое в дальнейшем «Продавец», в лице Директора ПОЗИЛОВА A.A., действующего на основании Устава,\n"+
                    "с одной стороны, и    \" "+reqPdf.getCustomerCompanyName()+
                    " \"   именуемое в дальнейшем «Покупатель» в лице Генерального директора\n"+
                    reqPdf.getCustomerCompanyDirector().toUpperCase()+"    действующего на основании Устава с другой стороны, все вместе в дальнейшем именуемые Стороны, заключили\n" +
                    "настоящий Договор о нижеследующем:");
            text2.setFont(font);
            text2.setFontSize(7f);
            Paragraph paragraph2 = new Paragraph();
            paragraph2.add(text2);

            Text text3=new Text("1. Предмет Договора");
            text3.setFont(font).setBold();
            text3.setFontSize(8f);
            Paragraph paragraph3 = new Paragraph();
            paragraph3.setTextAlignment(TextAlignment.CENTER);
            paragraph3.add(text3);

            Text text4=new Text("1.1. «Продавец» обязуется произвести поставку Товара, обусловленную настоящим Договором, а «Покупатель» обязуется принять и оплатить\n" +
                    "данный Товар в установленный Договором срок.\n" +
                    "1.2. Наименование, количество, единицы измерения, цена Товара определены в соответствии со Спецификацией-Приложением, которое\n" +
                    "является неотъемлемой частью настоящего Договора.\n" +
                    "1.3. Спецификацией к настоящему Договору будут являться отгрузочные документы.");
            text4.setFont(font);
            text4.setFontSize(7f);
            Paragraph paragraph4 = new Paragraph();
            paragraph4.add(text4);

            Text text5=new Text("2. Сроки и порядок поставки Товаров");
            text5.setFont(font).setBold();
            text5.setFontSize(8f);
            Paragraph paragraph5 = new Paragraph();
            paragraph5.setTextAlignment(TextAlignment.CENTER);
            paragraph5.add(text5);

            Text text6=new Text("2.1. Срок поставки Товаров составляет 15 (пятнадцать) банковских дней с момента поступления от «Покупателя» предоплаты на расчетный счет\n" +
                    "«Продавца» согласно пункту 3.1 настоящего Договора.\n" +
                    "2.2. Поставка Товаров осуществляется со склада «Продавца» и за счет средств «Покупателя».\n" +
                    "2.3. Товар отпускается при предъявлении «Покупателем» надлежаще оформленной доверенности согласно Положению МЮ РУз №1245 от\n" +
                    "27.05.2003 г. и паспорта удостоверяющего личность получателя.\n" +
                    "2.4. Отпуск товарно-материальных ценностей по доверенности не производится в случаях:\n" +
                    "· Предъявления доверенности, выданной с нарушениями установленного порядка ее заполнения.\n" +
                    "· Предъявления доверенности, имеющей поправки и помарки.\n" +
                    "· Не предъявления паспорта (копии паспорта), указанного в доверенности.\n" +
                    "· Окончания срока, на который выдана доверенность.");
            text6.setFont(font);
            text6.setFontSize(7f);
            Paragraph paragraph6 = new Paragraph();
            paragraph6.add(text6);

            Text text7=new Text("3. Порядок оплаты");
            text7.setFont(font).setBold();
            text7.setFontSize(8f);
            Paragraph paragraph7 = new Paragraph();
            paragraph7.setTextAlignment(TextAlignment.CENTER);
            paragraph7.add(text7);

            Text text8=new Text("3.1. Окончательный расчет по заявленной партии производится в течении 10 (десяти) банковских дней с момента поставки Товара и\n" +
                    "выставления «Продавцом» счета-фактуры.\n" +
                    "3.2. «Продавец» оставляет за собой право изменить цены на товары указанные в пункте 1.2 настоящего Договора в случае невыполнения\n" +
                    "«Покупателем» пункта 3.1 настоящего Договора.\n" +
                    "3.3. Цена товара действует на момент его поставки. Если окончательный расчет не будет произведен «Покупателем» в течении 15 (пятнадцати)\n" +
                    "банковских дней согласно пункту 3.2 настоящего Договора, цена может изменяться «Продавцом» с учетом роста или понижения цен на сырьё,\n" +
                    "материалы, энергоресурсы и изменения уплачиваемых налогов, действующих на территории Республики Узбекистан.");
            text8.setFont(font);
            text8.setFontSize(7f);
            Paragraph paragraph8 = new Paragraph();
            paragraph8.add(text8);

            Text text9=new Text("4. Срок действия Договора");
            text9.setFont(font).setBold();
            text9.setFontSize(8f);
            Paragraph paragraph9 = new Paragraph();
            paragraph9.setTextAlignment(TextAlignment.CENTER);
            paragraph9.add(text9);

            Text text10=new Text("4.1. Настоящий Договор заключен на срок до момента полного исполнения сторонами обязательств по настоящему Договору до 31 декабря 2019 г.");
            text10.setFont(font);
            text10.setFontSize(7f);
            Paragraph paragraph10 = new Paragraph();
            paragraph10.add(text10);

            Text text11=new Text("5. Ответственность сторон");
            text11.setFont(font).setBold();
            text11.setFontSize(8f);
            Paragraph paragraph11 = new Paragraph();
            paragraph11.setTextAlignment(TextAlignment.CENTER);
            paragraph11.add(text11);

            Text text12=new Text("5.1. В случае несвоевременной поставки Товаров, указанных п. 1.2. настоящего договора «Продавец» уплачивает пеню в размере 0,5 %\n" +
                    "за каждый день просрочки, но не более 50% от суммы недопоставленного Товара.\n" +
                    "5.2. В случае просрочки оплаты согласно пункта 3.2. «Покупатель» уплачивает пеню в размере 0,4% от неисполненной части договора за каждый\n" +
                    "день просрочки, но не более 50% от суммы просроченного платежа.\n" +
                    "5.3. За неосновательный отказ от получения товаров при доставке их «Продавцом» в установленный договором срок (период) поставки\n" +
                    "«Покупатель» уплачивает «Продавцу» штраф в размере 5% от стоимости неполученных Товаров.\n" +
                    "5.4. В случае поставки Товаров, не выпущенных в режим свободного пользования или завезенного в рамках программы локализации, «Продавец»\n" +
                    "уплачивает штраф в размере 50% от суммы договора.\n" +
                    "5.5. Меры ответственности сторон, не предусмотренные настоящим Договором устанавливаются в соответствии с Законом «О договорно-правовой\n" +
                    "базе деятельности хозяйствующих субъектов» от 29.08.1998г.");
            text12.setFont(font);
            text12.setFontSize(7f);
            Paragraph paragraph12 = new Paragraph();
            paragraph12.add(text12);

            Text text13=new Text("6. Форс-мажорные обстоятельства");
            text13.setFont(font).setBold();
            text13.setFontSize(8f);
            Paragraph paragraph13 = new Paragraph();
            paragraph13.setTextAlignment(TextAlignment.CENTER);
            paragraph13.add(text13);

            Text text14=new Text("6.1. Стороны не несут ответственности за неисполнение, либо ненадлежащее исполнение обязательств по настоящему Договору, если\n" +
                    "докажут, что это произошло вследствие наступления обстоятельств непреодолимой силы (форс- мажор), возникших после заключения\n" +
                    "настоящего Договора в результате событий чрезвычайного характера, которые Стороны не могли ни предвидеть, ни предотвратить\n" +
                    "разумными мерами, и Стороны предприняли все возможные и зависящие от них меры по надлежащему исполнению своих обязанностей.\n" +
                    "К форс-мажорным обстоятельствам относятся, в частности: военные действия, воздействие сил природы (землетрясение, наводнение и т.д.),\n" +
                    "решения государственных органов.\n" +
                    "6.2. О наступлении форс-мажорных обстоятельств, Стороны должны уведомить друг друга в течение трех рабочих дней с момента\n" +
                    "их наступления.\n" +
                    "6.3. В случае возникновения форс-мажорных обстоятельств, срок выполнения обязательств по настоящему Договору переносится на период,\n" +
                    "в течение которого действуют такие обстоятельства и их последствия.\n" +
                    "\n\n\n\n\n");
            text14.setFont(font);
            text14.setFontSize(7f);
            Paragraph paragraph14 = new Paragraph();
            paragraph14.add(text14);

            Text text15=new Text("7. Порядок разрешения споров");
            text15.setFont(font).setBold();
            text15.setFontSize(8f);
            Paragraph paragraph15 = new Paragraph();
            paragraph15.setTextAlignment(TextAlignment.CENTER);
            paragraph15.add(text15);

            Text text16=new Text("7.1. Все споры и разногласия, возникшие, в процессе исполнения настоящего Договора решаются путем двустороннего урегулирования\n" +
                    "их путем переговоров.\n" +
                    "7.2. В случае невозможности разрешения разногласий путем переговоров, они подлежат рассмотрению в Экономическом суде в установленном\n" +
                    "законодательством порядке.");
            text16.setFont(font);
            text16.setFontSize(7f);
            Paragraph paragraph16 = new Paragraph();
            paragraph16.add(text16);

            Text text17=new Text("8. Прочие условия");
            text17.setFont(font).setBold();
            text17.setFontSize(8f);
            Paragraph paragraph17 = new Paragraph();
            paragraph17.setTextAlignment(TextAlignment.CENTER);
            paragraph17.add(text17);

            Text text18=new Text("8.1. Любые изменения и дополнения к настоящему Договору имеют силу только в том случае, если они оформлены в письменном\n" +
                    "виде и они подписаны обеими сторонами\n" +
                    "8.2. Настоящий Договор вступает в силу с момента подписания его уполномоченными представителями сторон.\n" +
                    "8.3. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.");
            text18.setFont(font);
            text18.setFontSize(8f);
            Paragraph paragraph18 = new Paragraph();
            paragraph18.add(text18);

            Text text19=new Text("9. Реквизиты сторон");
            text19.setFont(font).setBold();
            text19.setFontSize(8f);
            Paragraph paragraph19 = new Paragraph();
            paragraph19.setTextAlignment(TextAlignment.CENTER);
            paragraph19.add(text19);

            Text text20=new Text("               Продавец                                                                                                                         Покупатель");
            text20.setFont(font);
            text20.setFontSize(8f);
            Paragraph paragraph20 = new Paragraph();
            paragraph20.add(text20);

            Text text21=new Text("ООО «EURO PRINT KOKAND»\n" +
                    "г.Коканд, ул А.Т.Хукандий 130 «Б»\n" +
                    "ОАТБ «Узсаноаткурилиш Банк», Кокандский филиал\n" +
                    "МФО 00531. ИНН:301678745. ОКОНХ 19400.\n" +
                    "ОКЭД: 17210.\n" +
                    "Р/с: 20208000504864923001\n" +
                    "Тел: +998 90 567 60 33");
            text21.setFont(font);
            text21.setFontSize(8f);
            Paragraph paragraph21 = new Paragraph();
            paragraph21.setTextAlignment(TextAlignment.LEFT);
            paragraph21.add(text21);

            Text text22=new Text("Директор:                                                     A.A.ПОЗИЛОВ                                    Директор:                                                  "+reqPdf.getCustomerCompanyDirector().toUpperCase());
            text22.setFont(font);
            text22.setFontSize(8f);
            Paragraph paragraph22 = new Paragraph();
            paragraph22.add(text22);

            Text text23=new Text("        М.П.                                                                                                                                                      М.П.\n" +
                    "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
            text23.setFont(font);
            text23.setFontSize(8f);
            Paragraph paragraph23 = new Paragraph();
            paragraph23.add(text23);

            Text text24=new Text("Спецификация-Приложение к Договору                0 00.01.1900");
            text24.setFont(font);
            text24.setFontSize(8f);
            Paragraph paragraph24 = new Paragraph();
            paragraph24.add(text24);

            float[] floats = {10f, 300f,80f,80f,80f,150f};
            Table table1 = new Table(floats).setFont(font).setFontSize(10f);
            Border border = new SolidBorder(ColorConstants.BLACK,2f);
            //LastName
            Cell cell1 = new Cell();
            cell1.setBorder(border);
            cell1.setFont(font);
            cell1.add(new Paragraph("№"));
            table1.addCell(cell1);
            //LastName
            Cell cell2 = new Cell();
            cell2.setBorder(border);
            cell2.setFont(font);
            cell2.add(new Paragraph("Наименование"));
            table1.addCell(cell2);
            //FirstName
            Cell cell3 = new Cell();
            cell3.setBorder(border);
            cell3.add(new Paragraph("Ед. изм."));
            table1.addCell(cell3);
            //FirstName
            Cell cell4 = new Cell();
            cell4.setBorder(border);
            cell4.add(new Paragraph("Кол-во"));
            table1.addCell(cell4);
            //MiddleName
            Cell cell5 = new Cell();
            cell5.setBorder(border);
            cell5.add(new Paragraph("Цена за единицу"));
            table1.addCell(cell5);
            //MiddleName
            Cell cell6 = new Cell();
            cell6.setBorder(border);
            cell6.add(new Paragraph("Общая стоимость"));
            table1.addCell(cell6);

            Cell cell11 = new Cell();
            cell11.setBorder(border);
            cell11.setFont(font);
            cell11.add(new Paragraph("1"));
            table1.addCell(cell11);
            //LastName
            Cell cell22 = new Cell();
            cell22.setBorder(border);
            cell22.setFont(font);
            cell22.add(new Paragraph(""));
            table1.addCell(cell22);
            //FirstName
            Cell cell33 = new Cell();
            cell33.setBorder(border);
            cell33.add(new Paragraph(""));
            table1.addCell(cell33);
            //FirstName
            Cell cell44 = new Cell();
            cell44.setBorder(border);
            cell44.add(new Paragraph(""));
            table1.addCell(cell44);
            //MiddleName
            Cell cell55 = new Cell();
            cell55.setBorder(border);
            cell55.add(new Paragraph(""));
            table1.addCell(cell55);
            //MiddleName
            Cell cell66 = new Cell();
            cell66.setBorder(border);
            cell66.add(new Paragraph(""));
            table1.addCell(cell66);



            document.add(paragraphTop);
            document.add(paragraph1);
            document.add(paragraph2);
            document.add(paragraph3);
            document.add(paragraph4);
            document.add(paragraph5);
            document.add(paragraph6);
            document.add(paragraph7);
            document.add(paragraph8);
            document.add(paragraph9);
            document.add(paragraph10);
            document.add(paragraph11);
            document.add(paragraph12);
            document.add(paragraph13);
            document.add(paragraph14);
            document.add(paragraph15);
            document.add(paragraph16);
            document.add(paragraph17);
            document.add(paragraph18);
            document.add(paragraph19);
            document.add(paragraph20);
            document.add(paragraph21);
            document.add(paragraph22);
            document.add(paragraph23);
            document.add(paragraph24);
            document.add(table1);
            document.add(paragraph20);
            document.add(paragraph21);
            document.add(paragraph22);
            document.add(paragraph23);
            document.close();


            return new File(reqPdf.getCustomerCompanyName() + ".pdf");


        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    }


