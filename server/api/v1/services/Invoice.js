import Invoice from "../../../models/Invoice";
// services/invoiceServices.js


const invoiceServices = {
  /**
   * Create a new invoice document
   * @param {Object} insertObj - validated invoice payload
   * @returns {Promise<Invoice>}
   */
  createInvoice: async (insertObj) => {
    return await Invoice.create(insertObj);
  },

  /**
   * Find a single invoice (optionally populate refs)
   * @param {Object} query - Mongoose findOne filter
   * @param {Array<string>} populatePaths - e.g. ["customer", "createdBy"]
   * @returns {Promise<Invoice|null>}
   */
  findInvoice: async (query, populatePaths = []) => {
    let q = Invoice.findOne(query);
    if (populatePaths.length) {
      const population = populatePaths.map((p) => ({ path: p }));
      q = q.populate(population);
    }
    return await q;
  },

  /**
   * Update a single invoice and return the new document
   * @param {Object} query - filter
   * @param {Object} updatedObj - fields to update
   * @param {Array<string>} populatePaths - optional refs to populate
   * @returns {Promise<Invoice|null>}
   */
  updateInvoice: async (query, updatedObj, populatePaths = []) => {
    let q = Invoice.findOneAndUpdate(query, updatedObj, {
      new: true,
      runValidators: true,
    });
    if (populatePaths.length) {
      const population = populatePaths.map((p) => ({ path: p }));
      q = q.populate(population);
    }
    return await q;
  },

  /**
   * Get a list of invoices with optional population
   * @param {Object} query - filter
   * @param {Array<string>} populatePaths - refs to populate
   * @param {Object} sortObj - e.g. { createdAt: -1 }
   * @returns {Promise<Invoice[]>}
   */
  findInvoiceList: async (query = {}, populatePaths = [], sortObj = { createdAt: -1 }) => {
    let q = Invoice.find(query).sort(sortObj);
    if (populatePaths.length) {
      const population = populatePaths.map((p) => ({ path: p }));
      q = q.populate(population);
    }
    return await q;
  },

  /**
   * Lightweight list without population (use for dropdowns etc.)
   * @param {Object} query - filter
   * @returns {Promise<Invoice[]>}
   */
  invoicesList: async (query = {}) => {
    return await Invoice.find(query).sort({ createdAt: -1 });
  },

  /**
   * Find one invoice and populate default references
   * @param {Object} query - filter
   * @returns {Promise<Invoice|null>}
   */
  findInvoicePopulate: async (query) => {
    return await Invoice.findOne(query).populate([
      { path: "customer" },
      { path: "createdBy" },
    ]);
  },
};

module.exports = { invoiceServices };
