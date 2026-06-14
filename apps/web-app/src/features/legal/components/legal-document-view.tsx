import type { LegalDocument } from "@my-bahrain/content";

type LegalDocumentViewProps = {
  document: LegalDocument;
};

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-card">
      <p className="text-xs font-medium text-gray-400">
        Last updated: {document.lastUpdated}
      </p>

      <div className="mt-6 space-y-8 text-sm leading-relaxed text-gray-700">
        {document.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-bold text-gray-900">{section.title}</h2>

            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3">
                {paragraph}
              </p>
            ))}

            {section.list ? (
              <ul className="mt-3 list-disc space-y-2 pl-5">
                {section.list.map((item) => (
                  <li key={`${item.label ?? ""}-${item.text}`}>
                    {item.label ? (
                      <>
                        <strong>{item.label}</strong> — {item.text}
                      </>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
