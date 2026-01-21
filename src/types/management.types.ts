export interface FeedType {
    id: string;
    code: string;
    name: string;
    category?: string;
    currentStockKg?: number;
}

export interface FeedMovement {
    id: string;
    feedTypeId: string;
    movementType: 'purchase' | 'adjustment' | 'transfer';
    quantityKg: number;
    movementDate: string;
}

export interface FinancialTransaction {
    id: string;
    transactionDate: string;
    transactionType: 'income' | 'expense';
    amount: number;
    description: string;
    categoryId: string;
}

export interface AnimalSale {
    id: string;
    saleDate: string;
    customerName: string;
    totalAmount: number;
    paymentStatus: 'pending' | 'partially_paid' | 'paid';
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    assignedTo?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}
