"use server";

import { date } from "zod";
import { getCopilotMetrics, IFilter as MetricsFilter } from "./copilot-metrics-service";
import { getCopilotSeatsManagement, IFilter as SeatServiceFilter } from "./copilot-seat-service";

export async function refreshMetricsData(filter: {
  startDate?: Date;
  endDate?: Date;
  enterprise?: string;
  organization?: string;
  teams?: string[];
}) {
  try {
    const metricsFilter: MetricsFilter = {
      startDate: filter.startDate,
      endDate: filter.endDate,
      enterprise: filter.enterprise || "",
      organization: filter.organization || "",
      team: filter.teams || [],
    };

    const metrics = await getCopilotMetrics(metricsFilter);

    if (metrics.status !== "OK") {
      return {
        success: false,
        error: metrics.errors[0]?.message || "Failed to fetch metrics",
      };
    }

    return {
      success: true,
      data: metrics.response,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

export async function refreshSeatsData(filter: {
  date?: Date;
  enterprise?: string;
  organization?: string;
  teams?: string[];
}) {
  try {

    const seats = await getCopilotSeatsManagement({
      date: filter.date,
      enterprise: filter.enterprise || "",
      organization: filter.organization || "",
      team: filter.teams || [],
    } as SeatServiceFilter);

    if (seats.status !== "OK") {
      return {
        success: false,
        error: seats.errors[0]?.message || "Failed to fetch seats data",
      };
    }

    return {
      success: true,
      data: seats.response,
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
