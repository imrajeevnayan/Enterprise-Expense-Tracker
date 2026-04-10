package com.expensetracker.scheduler;

import com.expensetracker.entity.Budget;
import com.expensetracker.repository.BudgetRepository;
import com.expensetracker.repository.TransactionRepository;
import com.expensetracker.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Component
public class BudgetAlertScheduler {

    private static final Logger logger = LoggerFactory.getLogger(BudgetAlertScheduler.class);

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private EmailService emailService;

    @Scheduled(cron = "0 0 9 * * ?")
    @Transactional(readOnly = true)
    public void checkBudgets() {
        logger.info("Running daily budget alert checks...");
        LocalDate now = LocalDate.now();
        List<Budget> allBudgets = budgetRepository.findByMonthAndYear(now.getMonthValue(), now.getYear());

        for (Budget budget : allBudgets) {
            LocalDate start = now.withDayOfMonth(1);
            LocalDate end = now.withDayOfMonth(now.lengthOfMonth());

            BigDecimal spending = transactionRepository.sumAmountByUserIdAndCategoryIdAndDateBetween(
                    budget.getUser().getId(), budget.getCategory().getId(), start, end);
            
            spending = spending != null ? spending : BigDecimal.ZERO;

            if (spending.compareTo(budget.getLimitAmount()) >= 0) {
                sendAlert(budget, "EXCEEDED", spending);
            } else if (spending.compareTo(budget.getLimitAmount().multiply(new BigDecimal("0.9"))) >= 0) {
                sendAlert(budget, "NEAR LIMIT (90%)", spending);
            }
        }
    }

    private void sendAlert(Budget budget, String status, BigDecimal currentSpending) {
        String message = String.format("Alert for your %s budget: Status %s. Limit: %s, Current: %s",
                budget.getCategory().getName(), status, budget.getLimitAmount(), currentSpending);
        
        try {
            emailService.sendSimpleMessage(budget.getUser().getEmail(), "Budget Alert: " + budget.getCategory().getName(), message);
            logger.info("Sent budget alert to: {}", budget.getUser().getEmail());
        } catch (Exception e) {
            logger.error("Failed to send email alert to {}: {}", budget.getUser().getEmail(), e.getMessage());
        }
    }
}
