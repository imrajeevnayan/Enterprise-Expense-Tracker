package com.expensetracker.controller;

import com.expensetracker.entity.User;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@Tag(name = "Reports", description = "Endpoints for generating and downloading financial artifacts and PDF statements")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/monthly")
    @Operation(summary = "Export Monthly Statement (PDF)", description = "Generates a professional PDF report containing all transactions and budget summaries for the given date range.")
    @ApiResponse(responseCode = "200", description = "PDF statement generated and returned as a byte stream")
    public ResponseEntity<InputStreamResource> downloadMonthlyReport(
            @Parameter(description = "Start date for the report (Format: YYYY-MM-DD)") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "End date for the report (Format: YYYY-MM-DD)") 
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @Parameter(hidden = true) Authentication authentication) {
        
        User user = userRepository.findByEmail(authentication.getName()).get();
        ByteArrayInputStream bis = reportService.generateMonthlyReport(user, startDate, endDate);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=expanse_report_" + startDate + ".pdf");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }
}
