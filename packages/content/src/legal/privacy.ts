import type { LegalDocument } from "./types";

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  lastUpdated: "June 3, 2026",
  sections: [
    {
      title: "1. Introduction",
      paragraphs: [
        'RandomStores ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, store, and protect personal information when you use our website, web application, mobile application, and related services (the "Platform") in the Kingdom of Bahrain.',
        "By using the Platform, you acknowledge this Policy. If you do not agree, please do not use our services.",
      ],
    },
    {
      title: "2. Information we collect",
      paragraphs: ["We may collect the following types of information:"],
      list: [
        {
          label: "Account information",
          text: "name, email address, phone number, role (customer, store, or backoffice), and profile image where provided.",
        },
        {
          label: "Store information",
          text: "business name, address, city, descriptions, logos, cover images, and product listings.",
        },
        {
          label: "Order information",
          text: "items ordered, delivery address, order status, payment status, and notes.",
        },
        {
          label: "Payment information",
          text: "payment status and transaction references processed through our payment providers. We do not store full card numbers on our servers.",
        },
        {
          label: "Usage data",
          text: "analytics events (e.g. signups, orders, store views), audit logs for administrative actions, and error logs to improve reliability.",
        },
        {
          label: "Device information (mobile)",
          text: "push notification tokens and device platform when you enable notifications.",
        },
        {
          label: "Uploaded files",
          text: "images you upload for stores or products, stored securely via our file hosting service.",
        },
      ],
    },
    {
      title: "3. How we use your information",
      paragraphs: ["We use personal information to:"],
      list: [
        { text: "Create and manage your account" },
        { text: "Facilitate orders between customers and stores" },
        { text: "Process payments and display order history" },
        { text: "Send notifications about orders and account activity" },
        { text: "Approve and manage stores on the Platform" },
        { text: "Operate analytics and monitoring to improve the service" },
        { text: "Prevent fraud, enforce our Terms, and maintain security" },
        { text: "Comply with legal obligations in Bahrain" },
      ],
    },
    {
      title: "4. Legal basis",
      paragraphs: [
        "We process personal data where necessary to perform our contract with you (providing the Platform), with your consent (e.g. push notifications), for legitimate interests (security, analytics, improvement), or to comply with applicable law.",
      ],
    },
    {
      title: "5. Sharing information",
      paragraphs: ["We may share information with:", "We do not sell your personal information to third parties."],
      list: [
        {
          label: "Stores and customers",
          text: "as needed to fulfil orders (e.g. delivery details shared with the relevant store).",
        },
        {
          label: "Service providers",
          text: "hosting, authentication, database, payment, and analytics providers that help us operate the Platform under appropriate safeguards.",
        },
        {
          label: "Authorities",
          text: "when required by law or to protect rights, safety, and security.",
        },
      ],
    },
    {
      title: "6. Data retention",
      paragraphs: [
        "We retain personal information for as long as your account is active or as needed to provide services, resolve disputes, enforce agreements, and meet legal requirements. You may request account deletion subject to applicable retention obligations.",
      ],
    },
    {
      title: "7. Security",
      paragraphs: [
        "We implement technical and organisational measures to protect your data, including access controls, encrypted connections, and secure authentication. No method of transmission over the internet is 100% secure; we cannot guarantee absolute security.",
      ],
    },
    {
      title: "8. Your rights",
      paragraphs: ["Depending on applicable law in Bahrain, you may have the right to:", "To exercise these rights, contact us using the details in section 12."],
      list: [
        { text: "Access the personal information we hold about you" },
        { text: "Request correction of inaccurate information" },
        { text: "Request deletion of your account and associated data" },
        { text: "Withdraw consent where processing is consent-based" },
        { text: "Object to certain processing or request restriction" },
      ],
    },
    {
      title: "9. Cookies & similar technologies",
      paragraphs: [
        "Our web applications may use cookies and local storage for authentication, session management, and preferences. You can control cookies through your browser settings; some features may not work correctly if cookies are disabled.",
      ],
    },
    {
      title: "10. Children",
      paragraphs: [
        "The Platform is not intended for users under 18 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us data, please contact us.",
      ],
    },
    {
      title: "11. Changes to this Policy",
      paragraphs: [
        'We may update this Privacy Policy from time to time. The "Last updated" date at the top will reflect changes. Continued use of the Platform after updates constitutes acceptance of the revised Policy.',
      ],
    },
    {
      title: "12. Contact",
      paragraphs: [
        "For privacy-related questions or requests, contact us through the support channels provided on the Platform.",
      ],
    },
  ],
};
