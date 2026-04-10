package com.expensetracker.service.impl;

import com.expensetracker.entity.Transaction;
import com.expensetracker.entity.User;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.ReportService;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "monthlyReports", key = "#user.id + #startDate.toString() + #endDate.toString()")
    public ByteArrayInputStream generateMonthlyReport(User user, LocalDate startDate, LocalDate endDate) {
        List<Transaction> transactions = transactionRepository.findByUserIdAndTransactionDateBetween(
                user.getId(), startDate, endDate);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter writer = new PdfWriter(out);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Monthly Expense Report")
                    .setFontSize(20)
                    .setBold());
            document.add(new Paragraph("User: " + user.getName()));
            document.add(new Paragraph("Period: " + startDate + " to " + endDate));
            document.add(new Paragraph("\n"));

            // Corrected iText 7 Table Syntax
            Table table = new Table(UnitValue.createPercentArray(new float[]{25, 35, 20, 20}));
            table.setWidth(UnitValue.createPercentValue(100));
            
            table.addHeaderCell(new Cell().add(new Paragraph("Date")));
            table.addHeaderCell(new Cell().add(new Paragraph("Description")));
            table.addHeaderCell(new Cell().add(new Paragraph("Category")));
            table.addHeaderCell(new Cell().add(new Paragraph("Amount (" + user.getCurrency() + ")")));

            for (Transaction transaction : transactions) {
                table.addCell(new Cell().add(new Paragraph(transaction.getTransactionDate().toString())));
                table.addCell(new Cell().add(new Paragraph(transaction.getDescription() != null ? transaction.getDescription() : "")));
                table.addCell(new Cell().add(new Paragraph(transaction.getCategory().getName())));
                table.addCell(new Cell().add(new Paragraph(transaction.getAmount().toString())));
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}
