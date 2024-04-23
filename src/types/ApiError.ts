class APIError extends Error {
    statusCode: number;
    errors: any[]; // You may want to define a specific type for errors

    constructor(
        statusCode: number,
        message: string = 'Something Went Wrong',
        errors: any[] = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors.slice(); 
        this.name = 'APIError'; 
        this.stack = stack || (new Error()).stack || ''; 
    }
}

export {APIError};
