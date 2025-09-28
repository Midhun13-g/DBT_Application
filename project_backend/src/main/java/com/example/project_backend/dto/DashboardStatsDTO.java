package com.example.project_backend.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalUsers;
    private Long dbtEnabled;
    private Long dbtLinkedNotEnabled;
    private Long dbtNotLinked;
    private Long totalBookings;
    private Long pendingBookings;
    private Long confirmedBookings;
    private Long completedBookings;
    private Long monthlyBookings;
}