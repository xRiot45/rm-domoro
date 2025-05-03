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
