import { generateInvoice } from "../services/invoiceService.js";

export const createInvoice = async (req, res) => {
    try {
        const { apiKey, startDate, endDate} = req.body;

        const invoice = await generateInvoice(apiKey, startDate, endDate);

        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Invoice error"});
        
    }
}