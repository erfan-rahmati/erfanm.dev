import Image from "next/image";
import type { ReactNode } from "react";

import type {
  ArticleContentNode,
  ArticleDocument,
  ArticleTextMark,
} from "./article-content.types";
import {
  isAllowedArticleImageUrl,
  isSafeHttpUrl,
} from "./article-content.utils";

type HeadingEntry = Readonly<{
  id: string;
  level: 2 | 3;
  text: string;
}>;

function getNodeText(
  node: ArticleContentNode,
): string {
  if (
    node.type === "text" &&
    typeof node.text === "string"
  ) {
    return node.text;
  }

  return (
    node.content
      ?.map(getNodeText)
      .join("") ?? ""
  );
}

export function collectArticleHeadings(
  document: ArticleDocument,
): readonly HeadingEntry[] {
  const headings: HeadingEntry[] = [];

  function visit(node: ArticleContentNode) {
    if (node.type === "heading") {
      const level = node.attrs?.level;

      if (level === 2 || level === 3) {
        headings.push({
          id: `article-section-${headings.length + 1}`,
          level,
          text: getNodeText(node),
        });
      }
    }

    node.content?.forEach(visit);
  }

  document.content.forEach(visit);

  return headings;
}

function renderTextMarks(
  text: ReactNode,
  marks: readonly ArticleTextMark[],
  key: string,
) {
  return marks.reduce<ReactNode>(
    (content, mark, markIndex) => {
      const markKey = `${key}-mark-${markIndex}`;

      switch (mark.type) {
        case "bold":
          return (
            <strong key={markKey}>
              {content}
            </strong>
          );
        case "italic":
          return <em key={markKey}>{content}</em>;
        case "strike":
          return <s key={markKey}>{content}</s>;
        case "code":
          return (
            <code key={markKey}>{content}</code>
          );
        case "link": {
          const href = mark.attrs?.href;

          if (
            typeof href !== "string" ||
            !isSafeHttpUrl(href)
          ) {
            return content;
          }

          const isExternal =
            href.startsWith("http://") ||
            href.startsWith("https://");

          return (
            <a
              key={markKey}
              href={href}
              target={
                isExternal ? "_blank" : undefined
              }
              rel={
                isExternal
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {content}
            </a>
          );
        }
        default:
          return content;
      }
    },
    text,
  );
}

type RenderState = {
  headingIndex: number;
};

function renderNodes(
  nodes: readonly ArticleContentNode[] | undefined,
  state: RenderState,
  parentKey: string,
): ReactNode {
  return nodes?.map((node, index) =>
    renderNode(
      node,
      state,
      `${parentKey}-${index}`,
    ),
  );
}

function renderNode(
  node: ArticleContentNode,
  state: RenderState,
  key: string,
): ReactNode {
  const children = renderNodes(
    node.content,
    state,
    key,
  );

  switch (node.type) {
    case "text":
      return renderTextMarks(
        node.text ?? "",
        node.marks ?? [],
        key,
      );
    case "paragraph":
      return <p key={key}>{children}</p>;
    case "heading": {
      state.headingIndex += 1;
      const id = `article-section-${state.headingIndex}`;

      if (node.attrs?.level === 3) {
        return (
          <h3 key={key} id={id}>
            {children}
          </h3>
        );
      }

      return (
        <h2 key={key} id={id}>
          {children}
        </h2>
      );
    }
    case "bulletList":
      return <ul key={key}>{children}</ul>;
    case "orderedList":
      return <ol key={key}>{children}</ol>;
    case "listItem":
      return <li key={key}>{children}</li>;
    case "blockquote":
      return (
        <blockquote key={key}>
          {children}
        </blockquote>
      );
    case "codeBlock":
      return (
        <pre key={key}>
          <code>{getNodeText(node)}</code>
        </pre>
      );
    case "horizontalRule":
      return <hr key={key} />;
    case "hardBreak":
      return <br key={key} />;
    case "image": {
      const src = node.attrs?.src;
      const alt = node.attrs?.alt;
      const caption = node.attrs?.title;

      if (
        typeof src !== "string" ||
        !isAllowedArticleImageUrl(src) ||
        typeof alt !== "string"
      ) {
        return null;
      }

      return (
        <figure key={key}>
          <Image
            src={src}
            alt={alt}
            width={1200}
            height={675}
            sizes="(max-width: 900px) 100vw, 820px"
            unoptimized
          />
          {typeof caption === "string" &&
          caption.trim() ? (
            <figcaption>
              {caption.trim()}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    case "table":
      return (
        <div
          key={key}
          className="blog-article__table-wrap"
          role="region"
          aria-label="جدول مقاله"
          tabIndex={0}
        >
          <table>
            <tbody>{children}</tbody>
          </table>
        </div>
      );
    case "tableRow":
      return <tr key={key}>{children}</tr>;
    case "tableHeader":
      return <th key={key}>{children}</th>;
    case "tableCell":
      return <td key={key}>{children}</td>;
    default:
      return null;
  }
}

export function ArticleContent({
  document,
}: Readonly<{ document: ArticleDocument }>) {
  return (
    <div className="blog-article__content">
      {renderNodes(
        document.content,
        { headingIndex: 0 },
        "article",
      )}
    </div>
  );
}
