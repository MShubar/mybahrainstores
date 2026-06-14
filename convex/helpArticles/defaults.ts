export type DefaultHelpArticle = {
  slug: string;
  title: string;
  category: string;
  content: string;
};

export const DEFAULT_HELP_ARTICLES: DefaultHelpArticle[] = [
  {
    slug: "how-to-create-store-account",
    title: "How to create a store account",
    category: "getting-started",
    content: `## Create your store account

1. Visit the RandomStores website and choose **Apply to sell** or go directly to sign up.
2. Select **Store** as your account type during registration.
3. Verify your email address when prompted.
4. Log in to the store dashboard at your web app URL.

After signup you can complete your store profile. If store approval is required, your store goes live after backoffice review.

**Tip:** Use the demo account on the website if you want to explore the dashboard before applying.`,
  },
  {
    slug: "how-store-approval-works",
    title: "How store approval works",
    category: "getting-started",
    content: `## Store approval

RandomStores may require backoffice approval before your store appears publicly.

### What happens after you submit your profile

1. Your store profile is saved in the dashboard.
2. Backoffice reviews your store name, categories, address, and listing quality.
3. You receive a notification when your store is approved or if changes are needed.

### While you wait

- Add products and prepare images.
- Review the store guidelines and help articles.
- Make sure your contact details are correct.

Once approved, customers can discover your store on the public website.`,
  },
  {
    slug: "how-to-complete-your-profile",
    title: "How to complete your profile",
    category: "getting-started",
    content: `## Complete your store profile

From the **Store Dashboard**, fill in:

- **Store name** and URL slug
- **Description** of what you sell
- **Logo** and **cover image**
- **Categories** that match your products
- **Address**, city, and area
- **Open/closed** status

Accurate profiles build trust and help customers find you in search and category browsing.`,
  },
  {
    slug: "store-setup-checklist",
    title: "Store setup checklist",
    category: "store-setup",
    content: `## Store setup checklist

- [ ] Create store account
- [ ] Add logo and cover image
- [ ] Select correct categories
- [ ] Add at least 5 products with photos
- [ ] Set store to **Open**
- [ ] Wait for approval (if required)
- [ ] Review order notification settings

Use the training videos for a quick walkthrough of each step.`,
  },
  {
    slug: "store-profile-best-practices",
    title: "Store profile best practices",
    category: "store-setup",
    content: `## Profile best practices

- Use a clear logo and high-quality cover photo.
- Write a short, honest description of your business.
- Keep your address and city accurate for delivery expectations.
- Stay **Open** only when you can accept and fulfil orders.
- Update your profile when hours, location, or offerings change.`,
  },
  {
    slug: "how-to-add-products",
    title: "How to add products",
    category: "products",
    content: `## Add a product

1. Open **Products** in the store dashboard.
2. Click **Add product**.
3. Enter name, price in BHD, description, and category.
4. Upload at least one product image.
5. Set stock quantity if you track inventory.
6. Save and confirm the product is **Available** and **Active**.

Products appear to customers once your store is approved and open.`,
  },
  {
    slug: "how-to-upload-images",
    title: "How to upload images",
    category: "products",
    content: `## Product images

- Use bright, real photos of the actual item.
- Upload JPG or PNG files through the image upload field.
- Add multiple angles when helpful.
- Avoid watermarks, heavy filters, or stock photos that misrepresent the product.

Good images reduce returns, disputes, and support questions.`,
  },
  {
    slug: "how-to-edit-products",
    title: "How to edit products",
    category: "products",
    content: `## Edit products

1. Go to **Products** in your dashboard.
2. Select the product to update.
3. Change price, description, images, or stock.
4. Save your changes.

Update prices promptly when costs change. Customers see the latest price at checkout.`,
  },
  {
    slug: "how-to-disable-products",
    title: "How to disable products",
    category: "products",
    content: `## Disable unavailable products

When an item is out of stock or discontinued:

1. Open the product in your dashboard.
2. Set **Available** to off, or reduce stock to zero.
3. Save the product.

Disabled or unavailable products cannot be added to new orders. Do not leave sold-out items purchasable.`,
  },
  {
    slug: "how-to-manage-orders",
    title: "How to manage orders",
    category: "orders",
    content: `## Manage orders

1. Open **Orders** in the store dashboard.
2. Review new orders as soon as they arrive.
3. Confirm the order and begin preparation.
4. Update status as the order progresses.
5. Mark **Delivered** only after the customer receives the order.

Respond quickly to reduce cancellations and support tickets.`,
  },
  {
    slug: "order-status-meanings",
    title: "Order status meanings",
    category: "orders",
    content: `## Order statuses

| Status | Meaning |
|--------|---------|
| **pending** | Order placed; awaiting store action |
| **confirmed** | Store accepted the order |
| **preparing** | Items are being prepared |
| **out_for_delivery** | Order is on the way |
| **delivered** | Customer received the order |
| **cancelled** | Order was cancelled |

Statuses are configurable by the platform. Use the status that best matches reality.`,
  },
  {
    slug: "how-delivery-tracking-works",
    title: "How delivery tracking works",
    category: "orders",
    content: `## Delivery tracking

Customers see order status updates in their order history. As a store:

- Move orders to **out_for_delivery** when the driver or courier has the package.
- Mark **delivered** after handoff is complete.
- Contact the customer if there is a delay or address issue.

Live GPS tracking may be added in a future release. Today, status updates are the primary tracking method.`,
  },
  {
    slug: "how-commissions-work",
    title: "How commissions work",
    category: "payouts",
    content: `## Commissions

RandomStores may charge a commission on completed paid orders.

- Commission is calculated on the order total.
- Your **net earnings** are the order total minus commission.
- Commission rate may use the platform default or a store-specific rate set by backoffice.

View commission totals on your store dashboard and analytics pages.`,
  },
  {
    slug: "how-payouts-work",
    title: "How payouts work",
    category: "payouts",
    content: `## Payouts

After orders are paid:

1. Your **store amount** (net earnings) accrues in your balance.
2. Backoffice records manual payouts to your business.
3. You can see payout history and amount owed on the dashboard.

Payout timing and method depend on platform operations. Contact support if you have questions about a specific payout.`,
  },
  {
    slug: "revenue-dashboard-explanation",
    title: "Revenue dashboard explanation",
    category: "payouts",
    content: `## Revenue dashboard

Your dashboard shows:

- **Gross revenue** — total paid order value
- **Commission paid** — platform fees on paid orders
- **Net earnings** — amount owed to your store before payouts
- **Paid out** — payouts already sent
- **Amount owed** — remaining balance

Use these figures for weekly reviews and reconciliation.`,
  },
  {
    slug: "understanding-store-analytics",
    title: "Understanding store analytics",
    category: "analytics",
    content: `## Store analytics

The analytics page summarizes:

- Total revenue and net earnings
- Order counts by status
- Average order value
- Commission paid

Use analytics weekly to spot trends, slow periods, and best-selling categories.`,
  },
  {
    slug: "top-products-report",
    title: "Top products report",
    category: "analytics",
    content: `## Top products

The top products table ranks items by revenue on paid orders.

Use it to:

- Restock bestsellers
- Promote high-margin items
- Retire products that never sell

Pair this report with your inventory planning.`,
  },
  {
    slug: "revenue-reports",
    title: "Revenue reports",
    category: "analytics",
    content: `## Revenue reports

Store analytics focuses on your shop. Backoffice users can access platform-wide revenue reports.

As a store owner, use:

- **Store dashboard** for quick totals
- **Analytics page** for orders, AOV, and top products
- **Payouts** for amounts already sent to you

Export and advanced reporting may be added later.`,
  },
  {
    slug: "store-guidelines-summary",
    title: "Store guidelines summary",
    category: "policies",
    content: `## Store guidelines

Stores on RandomStores must:

- Provide accurate product information and pricing
- Fulfil accepted orders promptly
- Use real product photos
- Follow local laws and platform rules

Read the full **Store Guidelines** on the website for onboarding, listings, orders, and compliance details.`,
  },
  {
    slug: "commission-and-fees-policy",
    title: "Commission and fees policy",
    category: "policies",
    content: `## Commission and fees

- Commission rates are set by the platform and may vary per store.
- Delivery fees and taxes may apply to customer orders per platform settings.
- Payouts are recorded manually by backoffice until automated payouts are enabled.

Contact support for questions about your specific commission rate.`,
  },
  {
    slug: "help-faq-getting-help",
    title: "How to get help",
    category: "faq",
    content: `## Getting help

1. Search this Help Center for your question.
2. Watch the training videos for step-by-step guides.
3. Create a **support ticket** in the app if you still need assistance.

Include your store name, order ID, and screenshots when contacting support.`,
  },
  {
    slug: "help-faq-approval-time",
    title: "How long does store approval take?",
    category: "faq",
    content: `## Approval timing

Approval time depends on application volume and profile completeness. Most stores are reviewed within a few business days.

Ensure your profile, categories, and sample products are complete to avoid delays.`,
  },
  {
    slug: "help-faq-mock-payments",
    title: "Are payments real during testing?",
    category: "faq",
    content: `## Mock payments

The platform may use mock payments during testing or before payment provider approval. Orders still flow through the dashboard so you can test operations end to end.

Real payment integration will be announced before go-live.`,
  },
];
