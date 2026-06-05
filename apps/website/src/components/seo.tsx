import { useEffect } from "react";

type Props = {
  title: string;
  description: string;
};

export function SEO({ title, description }: Props) {
  useEffect(() => {
    document.title = title;

    const descriptionTag = document.querySelector("meta[name='description']");

    if (descriptionTag) {
      descriptionTag.setAttribute("content", description);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);

  return null;
}
