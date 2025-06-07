import Joi from "joi";
import apiError from "../../../../helper/apiError";
import response from "../../../../../assets/response";
import responseMessage from "../../../../../assets/responseMessage"

import PDFDocument from 'pdfkit';
import { invoiceServices } from '../../services/Invoice'
import { userServices } from "../../services/user";
import { tripPlanServices } from "../../services/tripPlan";
import { adminServices } from "../../services/admin";
const { findAdmin } = adminServices
const { findUser } = userServices;
import { tripServices } from "../../services/trip";
const { createTripDetails, findTrip, updateTrip, findTripList, findPopulateTrip, } = tripServices;
import { customerServices } from "../../services/customer";
const { createCustomer, findCustomer, updateCustomer, findCustomerList, findPopulatedCustomer } = customerServices
const path = require('path');
console.log('paths', __filename, __dirname)

class customerController {

    async createCustomer(req, res, next) {
        const validSchema = Joi.object({
            tripId: Joi.string().required(),
            name: Joi.string().required(),
            contact: Joi.string().required(),
            agreedPrice: Joi.number().required(),
            numOfPeople: Joi.number().required(),
            payment: Joi.object().optional()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const checkTrip = await findTrip({ _id: value.tripId });
            if (!checkTrip) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            value.createdBy = adminResult._id;
            const cres = await createCustomer(value);
            const result = await findPopulatedCustomer({ _id: cres._id });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async addPayment(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            payment: Joi.object().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const checkCustomer = await findCustomer({ _id: value._id });
            if (!checkCustomer) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            const result = await updateCustomer({ _id: checkCustomer._id }, { $push: { payments: value.payment } });
            return res.json(new response(result, responseMessage.DATA_SAVED));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getcustomerList(req, res, next) {
        try {
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const query = { isDeleted: { $ne: true } };
            if (req.query._id) {
                query.tripId = req.query._id;

            }
            const result = await findCustomerList(query);
            if (result.length === 0) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            return res.json(new response(result, responseMessage.DATA_FOUND));
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateCustomer(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required(),
            tripId: Joi.string().required(),
            name: Joi.string().required(),
            contact: Joi.string().required(),
            agreedPrice: Joi.number().required(),
            numOfPeople: Joi.number().required(),
            payments: Joi.array().optional()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const customerResult = await findCustomer({ _id: value._id });
            if (!customerResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateCustomer({ _id: customerResult._id }, value);
            return res.json(new response({}, responseMessage.DATA_SAVED));
        } catch (error) {

        }
    }
    async deleteCustomer(req, res, next) {
        const validSchema = Joi.object({
            _id: Joi.string().required()
        })
        try {
            const { error, value } = await validSchema.validate(req.body);
            if (error) {
                throw apiError.badRequest(error.details[0].message);
            }
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }
            const customerResult = await findCustomer({ _id: value._id });
            if (!customerResult) {
                throw apiError.notFound(responseMessage.DATA_NOT_FOUND);
            }
            await updateCustomer({ _id: customerResult._id }, { isDeleted: true });
            return res.json(new response({}, responseMessage.DELETE_SUCCESS));
        } catch (error) {

        }
    }

    async generateInvoice(req, res, next) {
        try {
            const { customerId,
                invoiceDate,
                paymentMethod,
                transactionId,
                gstin,
                gst,
                cgst,
                notes,
                tripName,
                packageSelected,
                customerAddress } = req.body;

            const customer = await findCustomer({ _id: customerId });
            if (!customer) return res.status(404).send("Customer not found");
            const formattedDate = new Date(invoiceDate || new Date()).toLocaleDateString('en-IN');
            const adminResult = await findAdmin({ _id: req.userId });
            if (!adminResult) {
                throw apiError.notAllowed(responseMessage.ADMIN_NOT_FOUND);
            }

            // Calculate total price before taxes
            const totalPrice = customer.agreedPrice * customer.numOfPeople;
            // Calculate taxes based on total price
            const gstPrice = totalPrice * gst / 100;
            const cgstPrice = totalPrice * cgst / 100;

            const invoiceData = {
                customer: customerId,
                invoiceDate: formattedDate,
                invoiceNumber: `INV-${Date.now()}`,
                agreedPrice: totalPrice, // Now storing total price for all people
                cgst: cgstPrice,
                sgst: gstPrice,
                total: totalPrice + cgstPrice + gstPrice,
                paymentMethod,
                transactionId,
                notes,
                tripName,
                packageSelected,
                customerAddress,
                status: 'generated',
                createdBy: adminResult || 'TravelChapes'
            };

            // Save to database
            await invoiceServices.createInvoice(invoiceData);
            // Set headers
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                `attachment; filename=invoice-${customer._id}.pdf`
            );

            const doc = new PDFDocument({ margin: 40, size: "A4" });
            doc.pipe(res); // stream
            doc.on('error', (err) => {
                console.error('PDF generation error:', err);
                if (!res.headersSent) {
                    res.status(500).send('Error generating PDF');
                }
            });

            // 1) First draw the colored header
            doc.rect(0, 0, doc.page.width, 90).fillAndStroke("#2c3e50", "#2c3e50");

            // 2) Then add the logo (positioned above the header)
            try {
                const logoPath = path.join(__dirname, "../../../../../public/logo.png");
                console.log('Logo path:', logoPath);
                doc.image(logoPath, 40, 40, { width: 100 });
            } catch (err) {
                console.error("Could not load logo:", err);
                // If logo fails, use text with new styling
                doc.fontSize(18)
                    .font('Helvetica-Bold')
                    .fillColor("#d97706") // Tailwind yellow-600
                    .text("Travel Chapes", 160, 40)
                    .fillColor("#ffffff"); // Reset to white for other header text
            }

            // 3) Add header text (on top of the colored background)
            doc.fillColor("#d97706") // Tailwind yellow-600
                .font('Helvetica-Bold')
                .fontSize(18)
                .text("Travel Chapes", 160, 45) // Positioned above GSTIN
                .fillColor("#ffffff") // Switch to white for GSTIN and address
                .fontSize(10)
                .text("GSTIN: 09XXXXXX1Z2", 160, 65)
                .text("2nd Floor, Sector 62, Noida 201301", 160, 80)
                .fillColor("#000000") // Reset color for rest of document
                .font('Helvetica') // Reset to regular font
                .moveDown();

            doc.fillColor("#3498db")
                .fontSize(14)
                .text("TAX INVOICE", { align: "right" })
                .fillColor("#000000")
                .fontSize(10)
                .text(`Invoice Date: ${formattedDate}`, { align: "right" })
                .text(`Invoice # ${invoiceData.invoiceNumber}`, { align: "right" })
                .moveDown();


            // 3) Bill To section with light background
            doc.fillColor("#f8f9fa")
                .rect(40, doc.y, doc.page.width - 80, 100)
                .fill()
                .fillColor("#000000")
                .fontSize(12)
                .text("Bill To:", 50, doc.y + 10, { underline: true })
                .fontSize(10)
                .text(customer.name, 50, doc.y + 10)        // +25
                .text(customer.contact, 50, doc.y + 10)     // +40
                .text(customerAddress, 50, doc.y + 10)
                .text(gstin ? `Customer GSTIN: ${gstin}` : "", 50, doc.y + 10)
                .moveDown(5);

            // 4) Trip details
            doc.fontSize(12)
                .text("Trip Details", 50, doc.y, { underline: true })
                .moveDown()
                .fontSize(10)
                .text(`Trip: ${tripName}`, 40)
                .text(`Package: ${packageSelected}`, 40)
                .moveDown();

            const tableTop = doc.y;
            const itemWidth = 150;
            const quantityWidth = 80;
            const rateWidth = 100;
            const amountWidth = 100;
            // Table header
            doc.fillColor("#3498db")
                .font("Helvetica-Bold")
                .text("Description", 40, tableTop)
                .text("Qty", 40 + itemWidth, tableTop)
                .text("Rate", 40 + itemWidth + quantityWidth, tableTop)
                .text("Amount", 40 + itemWidth + quantityWidth + rateWidth, tableTop)
                .fillColor("#000000")
                .font("Helvetica");
            // Table row with alternating colors
            doc.fillColor("#f8f9fa")
                .rect(40, tableTop + 20, doc.page.width - 80, 20)
                .fill()
                .fillColor("#000000")
                .text(`Trip package – ${tripName}`, 40, tableTop + 25)
                .text(customer.numOfPeople, 40 + itemWidth, tableTop + 25)
                .text(customer.agreedPrice.toLocaleString(), 40 + itemWidth + quantityWidth, tableTop + 25)
                .text(totalPrice.toLocaleString(), 40 + itemWidth + quantityWidth + rateWidth, tableTop + 25)
                .moveDown(2);
            // 6) Summary with colored total
            doc.fontSize(10)
                .text(`Subtotal: Rs. ${totalPrice.toLocaleString()}`, { align: "right" })
                .text(`CGST (${cgst}%): Rs. ${cgstPrice.toLocaleString()}`, { align: "right" })
                .text(`SGST (${gst}%): Rs. ${gstPrice.toLocaleString()}`, { align: "right" })
                .fillColor("#2c3e50")
                .font("Helvetica-Bold")
                .fontSize(16)
                .text(`Total: Rs. ${invoiceData.total.toLocaleString()}`, { align: "right" })
                .fillColor("#000000")
                .font("Helvetica")
                .moveDown();
            // 7) Payment details with light background
            doc.fillColor("#f8f9fa")
                .rect(40, doc.y, doc.page.width - 80, 40)
                .fill()
                .fillColor("#000000")
                .fontSize(10)
                .text(`Payment Method: ${paymentMethod}`, 50, doc.y + 10)
                .text(transactionId ? `Transaction ID: ${transactionId}` : "", 50, doc.y + 25)
                .moveDown(3);
            // 8) Notes section
            if (notes) {
                doc.fontSize(9)
                    .text("Notes:", { underline: true })
                    .text(notes)
                    .moveDown();
            }
            // 9) Footer with contact info
            doc.fillColor("#7f8c8d")
                .fontSize(8)
                .text("Thank you for your business!", { align: "center" })
                .text("For any queries, please contact:", { align: "center" })
                .text("Phone: +91 9876543210 | Email: info@travelchapes.com | Website: www.travelchapes.com", { align: "center" })
                .text("Registered Office: 2nd Floor, Sector 62, Noida 201301, Uttar Pradesh, India", { align: "center" });

            doc.end();

        } catch (e) {
            console.error(e);
            res.status(500).send("Could not generate invoice");
        }
    }

    async getCustomerInvoices(req, res, next) {
        try {
            const { customerId } = req.params;

            // Get invoices with customer and createdBy details populated
            const invoices = await invoiceServices.findInvoiceList(
                { customer: customerId },
                ['customer', 'createdBy'],
                { invoiceDate: -1 }
            );

            if (!invoices || invoices.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "No invoices found for this customer"
                });
            }

            res.status(200).json({
                success: true,
                data: invoices
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error fetching invoices"
            });
        }
    }
}



export default new customerController()