package com.expensetracker.service;

import com.expensetracker.entity.User;
import java.io.ByteArrayInputStream;
import java.time.LocalDate;

public interface ReportService {
    ByteArrayInputStream generateMonthlyReport(User user, LocalDate startDate, LocalDate endDate);
}
