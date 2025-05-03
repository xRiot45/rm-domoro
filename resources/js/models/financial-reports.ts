export interface RevenueReport {
    id: number;
    report_date: string;
    total_transactions: number;
    total_revenue: number;
}

export interface ExpenseReport {
    id: number;
    report_date: string;
    description: string;
    total_expense: number;
    expense_items: ExpenseReportItem[];
}

export interface ExpenseReportItem {
    id: number;
    expense_name: string;
    description: string;
    amount: number;
}

export interface ExpenseSummary {
    total_expense: number;
    total_reports: number;
    total_items: number;
    max_report_expense: number;
    average_report_expense: number;
    expense_by_date: {
        report_date: string;
        total: number;
    }[];
}

export interface NetProfit {
    date: string;
    revenue: number;
    expense: number;
    net_profit: number;
}

export interface NetProfitChart {
    labels: string[];
    datasets: {
        revenue: number[];
        expense: number[];
        net_profit: number[];
    };
}
