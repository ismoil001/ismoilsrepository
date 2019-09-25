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
            textTop.setFont(font);
            textTop.setFontSize(10f);
            paragraphTop.setFixedLeading(6f);
            paragraphTop.add(textTop);
            Text text1 = new Text("г. Коканд");
            text1.setFont(font);
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
            text3.setFont(font);
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
            text5.setFont(font);
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
            text7.setFont(font);
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
            text9.setFont(font);
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
            text11.setFont(font);
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

            Text text13=new Text("2. Сроки и порядок поставки Товаров");
            text13.setFont(font);
            text13.setFontSize(8f);
            Paragraph paragraph13 = new Paragraph();
            paragraph13.setTextAlignment(TextAlignment.CENTER);
            paragraph13.add(text13);

            Text text14=new Text("2. Сроки и порядок поставки Товаров");
            text14.setFont(font);
            text14.setFontSize(8f);
            Paragraph paragraph14 = new Paragraph();
            paragraph14.setTextAlignment(TextAlignment.CENTER);
            paragraph14.add(text14);



//            Text text9 = new Text("");
//            text9.setFont(font);
//            text9.setFontSize(10f);
//            Paragraph paragraph9 = new Paragraph();
//            paragraph9.setMarginTop(0);
//            paragraph9.setPaddingTop(0);
//            paragraph9.add(text9);
//            Text text10 = new Text("");
//            text10.setFont(font);
//            text10.setFontSize(10f);
//            Paragraph paragraph10 = new Paragraph();
//            paragraph10.setMarginBottom(0);
//            paragraph10.setPaddingBottom(0);
//            paragraph10.add(text10);
//            Text text11 = new Text("");
//            text11.setFont(font);
//            text11.setFontSize(10f);
//            Paragraph paragraph11 = new Paragraph();
//            paragraph11.setMarginTop(0);
//            paragraph11.setPaddingTop(0);
//            paragraph11.add(text11);
//            Text text12 = new Text("");
//            text12.setFont(font);
//            text12.setFontSize(10f);
//            Paragraph paragraph12 = new Paragraph();
//            paragraph12.setMarginBottom(0);
//            paragraph12.setPaddingBottom(0);
//            paragraph12.add(text12);
//            Text text13 = new Text("");
//            text13.setFont(font);
//            text13.setFontSize(10f);
//            Paragraph paragraph13 = new Paragraph();
//            paragraph13.setMarginTop(0);
//            paragraph13.setPaddingTop(0);
//            paragraph13.add(text13);
//            float[] pointColumnWidths = {300f, 300f};
//            Table table = new Table(pointColumnWidths);
//            Border border = new DashedBorder(ColorConstants.WHITE, 2f);
//            //LastName
//            Cell cell1 = new Cell();
//            cell1.setBorder(border);
//            cell1.setFont(font);
//            cell1.add(paragraph2);
//            table.addCell(cell1);
//            //LastName
//            Cell cell2 = new Cell();
//            cell2.setBorder(border);
//            cell2.setFont(font);
//            cell2.add(paragraph9);
//            table.addCell(cell2);
//            //FirstName
//            Cell cell3 = new Cell();
//            cell3.setBorder(border);
//            cell3.add(paragraph10);
//            table.addCell(cell3);
//            //FirstName
//            Cell cell4 = new Cell();
//            cell4.setBorder(border);
//            cell4.add(paragraph11);
//            table.addCell(cell4);
//            //MiddleName
//            Cell cell5 = new Cell();
//            cell5.setBorder(border);
//            cell5.add(paragraph12);
//            table.addCell(cell5);
//            //MiddleName
//            Cell cell6 = new Cell();
//            cell6.setBorder(border);
//            cell6.add(paragraph13);
//            table.addCell(cell6);
//            Text text14 = new Text("");
//            text14.setFont(font);
//            text14.setFontSize(10f);
//            Paragraph paragraph14 = new Paragraph();
//            paragraph14.setTextAlignment(TextAlignment.CENTER);
//            paragraph14.add(text14);
//
//            float[] floats = {300f, 300f, 300f, 300f};
//            Table table1 = new Table(floats);
//            Cell cell16 = new Cell();
//            Paragraph paragraph16 = new Paragraph();
//            paragraph16.add(reqPdf.getCustomerCompanyName());
//            paragraph16.setMarginTop(6f);
//            paragraph16.setBold();
//            cell16.setBorderRight(new SolidBorder(ColorConstants.BLACK, 1f));
//            cell16.setTextAlignment(TextAlignment.CENTER);
//            paragraph16.setFixedLeading(9f);
//            cell16.add(paragraph16);
//            table1.addCell(cell16);
//            Cell cellPustoy = new Cell();
//
//            cellPustoy.setBorder(border);
//            cellPustoy.setBorderLeft(new SolidBorder(ColorConstants.BLACK, 1f));
//            table1.addCell(cellPustoy);
//            Cell cell17 = new Cell();
//            Paragraph paragraph17 = new Paragraph();
//            paragraph17.setFixedLeading(9f);
//            Text text17 = new Text("");
//            text17.setFont(font);
//            text17.setFontSize(10f);
//            paragraph17.add(text17);
//            cell17.add(paragraph17);
//            cell17.setBorder(border);
//            table1.addCell(cell17);
//            float[] floats1={150,200,200};
//            Table table2 = new Table(floats1).setFont(font).setMarginTop(10f);
//            Cell cell = new Cell();
//            cell.add(new Paragraph("").setFixedLeading(10f).setFontSize(10f)).setBorder(border);
//            table2.addCell(cell);
//            cell = new Cell();
//            cell.setBorder(border);
//            table2.addCell(cell);
//            cell = new Cell();
//            cell.add(new Paragraph(reqPdf.getCustomerCompanyName().toUpperCase()+"  TUMANI").setFixedLeading(10f).setFontSize(10f))
//                    .setBorder(border);
//            table2.addCell(cell);
//
//            Paragraph paragraph=new Paragraph("").setFont(font).setTextAlignment(TextAlignment.CENTER);
//
//            Table table3=new Table(2).setFont(font).setFontSize(10f);
//            Cell cell9=new Cell();
//            cell9.add(new Paragraph("")).setBorder(border).setTextAlignment(TextAlignment.CENTER);
//            table3.addCell(cell9);
//            cell9=new Cell();
//            cell9.add(new Paragraph("")).setBorder(border).setTextAlignment(TextAlignment.CENTER);
//            table3.addCell(cell9);
//            float[] floats2={400f,400f};
//            Table table4=new Table(floats2).setFont(font).setFontSize(10f);
//            cell9=new Cell();
//            cell9.add(new Paragraph("").setFixedLeading(10f)).setBorder(border);
//            table4.addCell(cell9);
//            table4.addCell(cell9);

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
            document.close();


            return new File(reqPdf.getCustomerCompanyName() + ".pdf");


        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }
    }


