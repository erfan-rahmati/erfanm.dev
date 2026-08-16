export type ArticleTextMark = Readonly<{
  type: "bold" | "italic" | "strike" | "code" | "link";
  attrs?: Readonly<{
    href?: string;
    target?: string;
    rel?: string;
  }>;
}>;

export type ArticleContentNode = Readonly<{
  type: string;
  attrs?: Readonly<Record<string, unknown>>;
  content?: readonly ArticleContentNode[];
  marks?: readonly ArticleTextMark[];
  text?: string;
}>;

export type ArticleDocument = Readonly<{
  type: "doc";
  content: readonly ArticleContentNode[];
}>;

export type ArticleFaqItem = Readonly<{
  question: string;
  answer: string;
}>;

export type ArticleSourceItem = Readonly<{
  title: string;
  url: string;
  publisher?: string;
}>;

export const EMPTY_ARTICLE_DOCUMENT: ArticleDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};
