import { Parser } from "../../mod.ts";
import { parseTag, parseText } from "./parser.ts";

const __dirname = new URL(".", import.meta.url).pathname;
type HTMLType = "text" | "tag" | "comment" | "attribute";

const data = await Deno.readTextFile(`${__dirname}/test.html`);
console.log(data)
const parser = new Parser<HTMLType>(data);

parser.stack.push({
    name: "root",
    type: "tag",
    data: "",
    children: [],
    start: 0,
    end: parser.template.length
})

while (parser.remaining()) {
    console.log("HT")

  if (parser.match("<")) {
    parseTag(parser);
  } else parseText(parser);
}

console.log(parser.current.children);
