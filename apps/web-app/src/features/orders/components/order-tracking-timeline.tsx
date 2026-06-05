export type TrackingStepState =
  | "complete"
  | "current"
  | "upcoming"
  | "failed"
  | "cancelled";

export type TrackingStep = {
  key: string;
  label: string;
  state: TrackingStepState;
};

type OrderTrackingTimelineProps = {
  title: string;
  steps: TrackingStep[];
};

function stepCircleClass(state: TrackingStepState): string {
  switch (state) {
    case "complete":
      return "bg-green-600 text-white";
    case "current":
      return "bg-black text-white ring-4 ring-black/10";
    case "failed":
      return "bg-red-600 text-white";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-500";
  }
}

function stepLabelClass(state: TrackingStepState): string {
  switch (state) {
    case "complete":
      return "text-gray-900";
    case "current":
      return "font-semibold text-gray-900";
    case "failed":
    case "cancelled":
      return "font-semibold text-red-700";
    default:
      return "text-gray-400";
  }
}

export function OrderTrackingTimeline({
  title,
  steps,
}: OrderTrackingTimelineProps) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>

      <ol className="mt-4 space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
              {!isLast && (
                <span
                  className={`absolute left-4 top-8 h-full w-0.5 -translate-x-1/2 ${
                    step.state === "complete" ? "bg-green-600" : "bg-gray-200"
                  }`}
                  aria-hidden
                />
              )}

              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${stepCircleClass(step.state)}`}
              >
                {step.state === "complete" ? "✓" : index + 1}
              </span>

              <div className="min-w-0 pt-1">
                <p className={`text-sm ${stepLabelClass(step.state)}`}>
                  {step.label}
                </p>
                {step.state === "current" && (
                  <p className="mt-0.5 text-xs text-gray-500">In progress</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
