import { useMemo, useCallback, useRef, useEffect, useState } from "react";
import { AutoLinkPlugin, createLinkMatcherWithRegExp } from "@lexical/react/LexicalAutoLinkPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HashtagNode } from "@lexical/hashtag";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { registerCodeHighlighting } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS as markdownTransformers,
} from "@lexical/markdown";
import { FloatingMenuPlugin } from "./FloatingMenu";
import { RemixRootDefaultErrorBoundary } from "@remix-run/react/dist/errorBoundaries";

const URL_REGEX =
  /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const EMAIL_REGEX =
  /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

const linkMatchers = [
  createLinkMatcherWithRegExp(URL_REGEX, text => {
    return text.startsWith("http") ? text : `https://${text}`;
  }),
  createLinkMatcherWithRegExp(EMAIL_REGEX, text => {
    return `mailto:${text}`;
  }),
];

export function Editor({
  defaultValue,
  name,
  placeholder,
  onChange,
}: {
  onChange(markdown: string): void;
  defaultValue: string;
  name: string;
  placeholder?: null | React.ReactElement;
}) {
  const initialConfig = useMemo(
    () => ({
      namespace: name,
      onError: console.error.bind(console),
      nodes: [
        AutoLinkNode,
        CodeNode,
        CodeHighlightNode,
        HeadingNode,
        LinkNode,
        ListNode,
        ListItemNode,
        QuoteNode,
      ],
      editorState() {
        return $convertFromMarkdownString(defaultValue, markdownTransformers);
      },
    }),
    [name],
  );

  return (
    <div className="">
      <LexicalComposer initialConfig={initialConfig}>
        <AutoFocusPlugin />
        <RichTextPlugin
          placeholder={placeholder ?? null}
          contentEditable={
            <ContentEditable
              className={`
                prose
                dark:prose-invert
                rounded
                outline
                outline-2
                outline-primary-500
                focus:outline-primary-400
                dark:placeholder:text-primary-400
                p-2
              `}
            />
          }
        />
        <MarkdownShortcutPlugin transformers={markdownTransformers} />
        <OnChangePlugin onChange={onChange} />
        <CodeHighlightPlugin />
        <AutoLinkPlugin matchers={linkMatchers} />
        <FloatingMenuPlugin />
      </LexicalComposer>
    </div>
  );
}

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    registerCodeHighlighting(editor);
  }, [editor]);
  return null;
}

function AutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.focus();
  }, [editor]);
  return null;
}

function OnChangePlugin({ onChange }: { onChange: (markdown: string) => void }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        onChange($convertToMarkdownString(markdownTransformers));
      });
    });
  }, [editor, onChange]);
  return null;
}
