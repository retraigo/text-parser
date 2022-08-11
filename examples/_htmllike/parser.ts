import { Parser } from "../../mod.ts";
import type { ExpressionElement } from "../../mod.ts";

type HTMLType = "text" | "tag" | "comment" | "attribute";

const attributeRegex = /\s*([a-zA-z])\s*=(?:(?:"([^"])")|(?:'([^'])'))/g;

export function parseText(parser: Parser<HTMLType>) {
  const start = parser.pointer;
  let data = "";
  while (
    parser.pointer < parser.template.length && !parser.match("<") &&
    !parser.match("{{")
  ) {
    data += parser.template[parser.pointer++];
  }
  parser.current.children?.push({
    start,
    end: parser.pointer,
    type: "text",
    data,
    children: [],
  });
  return null;
}

export function parseTag(parser: Parser<HTMLType>) {
  const start = parser.pointer++;

  if (parser.move("!--")) {
    const data = parser.readUntil(/-->/);
    parser.current?.children?.push({
      type: "comment",
      data,
      start,
      end: parser.pointer,
      children: [],
    });
    return null;
  }

  parser.move("/") // ignore endtag for now
  const name = parser.readUntil(/(\s|\/|>)/);

  const element: ExpressionElement<HTMLType> = {
    type: "tag",
    name: name,
    data: "",
    start: start,
    end: 0,
    children: [],
  };

  const data = parser.readUntil(/>/);
  parser.move(">")
  element.data = data;
  element.end = parser.pointer;
  parser.current?.children.push(element);
}
