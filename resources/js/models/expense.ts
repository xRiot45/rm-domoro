export interface ExpenseReportForm {
    report_date: Date | null;
    description: string;
    items: ExpenseReportItem[];
}

export interface ExpenseReportItem {
    expense_name: string;
    description: string;
    amount: number;
}
