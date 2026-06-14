import type { LegalDocument } from "./types";

export const termsAndConditions: LegalDocument = {
  title: "Terms & Conditions",
  lastUpdated: "June 3, 2026",
  sections: [
    {
      title: "1. Introduction",
      paragraphs: [
        'Welcome to RandomStores ("we", "us", "our"). These Terms & Conditions ("Terms") govern your access to and use of our website, web application, and related services (collectively, the "Platform") operated in the Kingdom of Bahrain.',
        "By creating an account, browsing stores, placing orders, or listing products as a store, you agree to these Terms. If you do not agree, do not use the Platform.",
      ],
    },
    {
      title: "2. Definitions",
      list: [
        {
          label: "Customer",
          text: "a user who browses stores and places orders.",
        },
        {
          label: "Store",
          text: "a business or seller registered on the Platform to list products and fulfil orders.",
        },
        {
          label: "Order",
          text: "a transaction between a Customer and a Store facilitated through the Platform.",
        },
        {
          label: "Backoffice",
          text: "platform administrators who manage categories, approvals, and settings.",
        },
      ],
    },
    {
      title: "3. Accounts",
      paragraphs: [
        "You must provide accurate information when registering. You are responsible for keeping your login credentials secure and for all activity under your account.",
        "We may suspend or terminate accounts that violate these Terms, engage in fraud, or misuse the Platform.",
      ],
    },
    {
      title: "4. Customer use",
      paragraphs: [
        "As a Customer, you may browse categories, stores, and products, add items to your cart, and place orders subject to store availability and platform settings.",
        "Prices, delivery fees, taxes, and order statuses are displayed at checkout and may be configured by the Platform or individual stores. You agree to pay the total amount shown when placing an order.",
      ],
    },
    {
      title: "5. Store use",
      paragraphs: [
        "Stores must provide accurate business information, product descriptions, prices, and images. Stores are responsible for order fulfilment, stock accuracy, and compliance with applicable laws in Bahrain.",
        "Stores may require platform approval before becoming publicly visible. We reserve the right to approve, reject, or deactivate stores at our discretion.",
      ],
    },
    {
      title: "6. Orders & fulfilment",
      paragraphs: [
        "An order is an agreement between the Customer and the Store. RandomStores facilitates the transaction but is not the seller of record unless explicitly stated.",
        "Order status updates (e.g. pending, confirmed, preparing, delivered) are provided through the Platform. Delivery times and methods are the responsibility of the Store unless otherwise specified.",
      ],
    },
    {
      title: "7. Payments",
      paragraphs: [
        "Payments are processed through integrated payment providers or approved methods configured on the Platform. You agree to provide valid payment information where required.",
        "Refunds, cancellations, and disputes between Customers and Stores should be resolved according to store policies and applicable law. We may assist with dispute coordination but are not obligated to issue refunds unless required by law or our policies.",
      ],
    },
    {
      title: "8. Prohibited conduct",
      paragraphs: ["You must not:"],
      list: [
        { text: "Use the Platform for illegal, fraudulent, or harmful activity" },
        { text: "Upload false, misleading, or infringing content" },
        { text: "Attempt to bypass security, permissions, or rate limits" },
        { text: "Harass other users or platform staff" },
        { text: "Scrape or automate access without written permission" },
      ],
    },
    {
      title: "9. Intellectual property",
      paragraphs: [
        "The Platform, branding, and software are owned by RandomStores or its licensors. Stores retain rights to their own logos, product images, and descriptions but grant us a licence to display them on the Platform.",
      ],
    },
    {
      title: "10. Limitation of liability",
      paragraphs: [
        'The Platform is provided "as is" to the extent permitted by Bahrain law. We are not liable for indirect, incidental, or consequential damages arising from your use of the Platform, store actions, delivery failures, or third-party payment issues.',
        "Our total liability for any claim relating to the Platform shall not exceed the fees paid to us by you in the twelve (12) months preceding the claim, where applicable.",
      ],
    },
    {
      title: "11. Changes",
      paragraphs: [
        "We may update these Terms from time to time. Continued use of the Platform after changes are posted constitutes acceptance of the revised Terms. Material changes may be communicated via the Platform or email where appropriate.",
      ],
    },
    {
      title: "12. Governing law",
      paragraphs: [
        "These Terms are governed by the laws of the Kingdom of Bahrain. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bahrain, unless otherwise required by mandatory law.",
      ],
    },
    {
      title: "13. Contact",
      paragraphs: [
        "For questions about these Terms, contact us through the support channels provided on the Platform.",
      ],
    },
  ],
};
