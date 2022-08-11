import { Parser } from "../../mod.ts";

const __dirname = new URL(".", import.meta.url).pathname;

interface SVGPath {
  type: "move" | "line" | "horizontal" | "vertical" | "custom";
  x: number;
  y: number;
}

const data = await Deno.readTextFile(`${__dirname}/svg`);
console.log(data);
const parser = new Parser<SVGPath>(data);

while (parser.remaining()) {
    parser.skip(/^(?:\s|\n)/)
    const start = parser.pointer
    const pathType = parser.read(/[mlhv]/i)
    console.log("type", parser.remaining())
    switch(pathType.toLowerCase()) {
        case "m": {
            const coOrdinates = /(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/.exec(parser.read(/(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/));
            parser.stack.push({start, end: parser.pointer, data: {type: "move", x: Number(coOrdinates?.[1] || 0), y: Number(coOrdinates?.[2] || 0)}})
            break;
        }
        case "h": {
            const coOrdinates = /(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/.exec(parser.read(/(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/));
            parser.stack.push({start, end: parser.pointer, data: {type: "horizontal", x: Number(coOrdinates?.[1] || 0), y: Number(coOrdinates?.[2] || 0)}})

            break;
        }
        case "l": {
            const coOrdinates = /(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/.exec(parser.read(/(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/));
            parser.stack.push({start, end: parser.pointer, data: {type: "line", x: Number(coOrdinates?.[1] || 0), y: Number(coOrdinates?.[2] || 0)}})

            break;
        }
        case "v": {
            const coOrdinates = /(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/.exec(parser.read(/(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/));
            parser.stack.push({start, end: parser.pointer, data: {type: "vertical", x: Number(coOrdinates?.[1] || 0), y: Number(coOrdinates?.[2] || 0)}})

            break;
        }
        default: {
            const coOrdinates = parser.read(/(?:\s|\n)*(\d+)(?:\s|\n)*(\d*)/);
            parser.stack.push({start, end: parser.pointer, data: {type: "custom", x: Number(coOrdinates[1] || 0), y: Number(coOrdinates[2] || 0)}})

            break;
        }
    }

}

console.log(parser.stack);
