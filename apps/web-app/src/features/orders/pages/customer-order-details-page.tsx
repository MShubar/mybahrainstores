import { FormEvent, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { PageHeader } from "../../customer/components/page-header";
import { OrderTrackingTimeline } from "../components/order-tracking-timeline";
import {
    ORDER_STATUS_STEPS,
    getOrderStatusIndex,
} from "../utils/order-status";
import { useTrackEvent } from "../../analytics/hooks/use-track-event";

export function CustomerOrderDetailsPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const createTapCharge = useAction(api.payments.actions.createTapCharge);
    const completeMockPayment = useMutation(api.payments.mutations.completeMockPayment);
    const trackEvent = useTrackEvent();
    const paymentProvider = useQuery(api.settings.queries.getValueByKey, {
        key: "payment_provider",
    });
    const defaultPaymentStatus = useQuery(api.settings.queries.getValueByKey, {
        key: "default_payment_status",
    });

    const tracking = useQuery(
        api.orders.queries.getCustomerTracking,
        orderId ? { orderId: orderId as Id<"orders"> } : "skip",
    );

    const [payError, setPayError] = useState("");
    const [paying, setPaying] = useState(false);


    if (!orderId) {
        return <div>Missing order.</div>;
    }

    if (
        tracking === undefined ||
        paymentProvider === undefined ||
        defaultPaymentStatus === undefined
    ) {
        return <div>Loading order...</div>;
    }

    if (!tracking) {
        return <div>Order not found.</div>;
    }

    const { order, paymentSteps, orderSteps, isCancelled, isDelivered } = tracking;
    const currentIndex = getOrderStatusIndex(order.orderStatus);

    const pendingStatus =
        typeof defaultPaymentStatus === "string" ? defaultPaymentStatus : "pending";
    const canPay = order.paymentStatus === pendingStatus;
    const currentOrderId = order._id;
    const isMockProvider = paymentProvider === "mock";

    async function onPay(event: FormEvent) {
        event.preventDefault();
        setPayError("");
        setPaying(true);

        try {
            if (isMockProvider) {
                await completeMockPayment({ orderId: currentOrderId });
                await trackEvent("mock_payment_completed", "order", currentOrderId);
                setPaying(false);
                return;
            }

            const result = await createTapCharge({ orderId: currentOrderId });

            if (!result.paymentUrl) {
                throw new Error("Tap did not return a payment URL");
            }

            window.location.href = result.paymentUrl;
        } catch (err) {
            setPayError(err instanceof Error ? err.message : "Payment failed");
            setPaying(false);
        }
    }

    return (
        <div className="space-y-6 pb-6">
            <PageHeader
                title={`Order #${order._id.slice(-6)}`}
                subtitle={`Placed ${new Date(order.createdAt).toLocaleString()}`}
                onBack={() => navigate("/customer/orders")}
            />

            <div className="rounded-xl border bg-white p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="flex flex-wrap gap-2">
                            <span
                                className={`rounded px-2 py-1 text-xs ${isCancelled
                                        ? "bg-red-100 text-red-700"
                                        : isDelivered
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {tracking.currentStatusLabel}
                            </span>

                            <span
                                className={`rounded px-2 py-1 text-xs ${tracking.isPaid
                                        ? "bg-green-100 text-green-700"
                                        : tracking.isPaymentFailed
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                Payment: {tracking.currentPaymentLabel}
                            </span>
                        </div>

                        {order.updatedAt !== order.createdAt && (
                            <p className="mt-2 text-sm text-gray-500">
                                Updated {new Date(order.updatedAt).toLocaleString()}
                            </p>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            {order.totalAmount.toFixed(3)} {order.currency}
                        </div>

                        {canPay && (
                            <form onSubmit={onPay} className="mt-4">
                                {payError && (
                                    <p className="mb-2 text-sm text-red-600">{payError}</p>
                                )}
                                <button
                                    type="submit"
                                    disabled={paying}
                                    className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    {paying
                                        ? isMockProvider
                                            ? "Processing..."
                                            : "Redirecting to Tap..."
                                        : "Pay Now"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="mb-2 flex justify-between text-sm">
                        <span className="text-gray-600">Fulfillment progress</span>
                        <span className="font-medium">{tracking.progressPercent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className={`h-full rounded-full transition-all ${isCancelled ? "bg-red-500" : "bg-green-600"
                                }`}
                            style={{ width: `${tracking.progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-5">
                    <h2 className="text-xl font-bold">Track your order</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Live status updates from payment through delivery.
                    </p>

                    <div className="mt-6 border-t pt-6">
                        <OrderTrackingTimeline title="Payment" steps={paymentSteps} />
                    </div>

                    <div className="mt-8 border-t pt-6">
                        <OrderTrackingTimeline title="Order progress" steps={orderSteps} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border bg-white p-5">
                        <h2 className="text-xl font-bold">Items</h2>

                        <div className="mt-4 space-y-3">
                            {order.items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex justify-between border-b pb-3 last:border-0"
                                >
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {item.quantity} × {item.unitPrice.toFixed(3)}{" "}
                                            {order.currency}
                                        </div>
                                    </div>
                                    <div className="font-semibold">
                                        {item.totalPrice.toFixed(3)} {order.currency}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5">
                        <h2 className="text-xl font-bold">Delivery address</h2>
                        <div className="mt-4 space-y-2 text-sm">
                            <div>{order.deliveryAddress.fullName}</div>
                            <div>{order.deliveryAddress.phone}</div>
                            <div>{order.deliveryAddress.addressLine1}</div>
                            {order.deliveryAddress.addressLine2 && (
                                <div>{order.deliveryAddress.addressLine2}</div>
                            )}
                            <div>
                                {order.deliveryAddress.city}
                                {order.deliveryAddress.area
                                    ? `, ${order.deliveryAddress.area}`
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border bg-white p-5">
                        <h2 className="text-xl font-bold">Summary</h2>
                        <div className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>
                                    {order.subtotal.toFixed(3)} {order.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery fee</span>
                                <span>
                                    {order.deliveryFee.toFixed(3)} {order.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>
                                    {order.taxAmount.toFixed(3)} {order.currency}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Discount</span>
                                <span>
                                    {order.discountAmount.toFixed(3)} {order.currency}
                                </span>
                            </div>
                            <div className="flex justify-between border-t pt-3 text-lg font-bold">
                                <span>Total</span>
                                <span>
                                    {order.totalAmount.toFixed(3)} {order.currency}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rounded-xl border bg-white p-5">
                <h2 className="text-xl font-bold">Order Tracking</h2>

                <div className="mt-6 grid gap-4 md:grid-cols-5">
                    {ORDER_STATUS_STEPS.map((status, index) => {
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={status} className="flex flex-col items-center text-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${isCompleted
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-400"
                                        }`}
                                >
                                    {index + 1}
                                </div>

                                <div
                                    className={`mt-2 text-sm ${isCurrent ? "font-bold text-black" : "text-gray-600"
                                        }`}
                                >
                                    {status.replaceAll("_", " ")}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {order.orderStatus === "cancelled" && (
                    <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
                        This order has been cancelled.
                    </div>
                )}
            </div>

            {order.customerNotes && (
                <div className="rounded-xl border bg-white p-5">
                    <h2 className="text-xl font-bold">Your notes</h2>
                    <p className="mt-3 text-gray-700">{order.customerNotes}</p>
                </div>
            )}

            {order.storeNotes && (
                <div className="rounded-xl border bg-white p-5">
                    <h2 className="text-xl font-bold">Seller note</h2>
                    <p className="mt-3 text-gray-700">{order.storeNotes}</p>
                </div>
            )}
        </div>
    );
}
