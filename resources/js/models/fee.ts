interface Fee {
    delivery: {
        id: number;
        type: string;
        amount: number;
    };
    service: {
        id: number;
        type: string;
        amount: number;
    };
    discount: {
        id: number;
        type: string;
        amount: number;
    };
    tax: {
        id: number;
        type: string;
        amount: number;
    };
}

export type { Fee };
