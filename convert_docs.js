
import fs from 'fs';
import MarkdownIt from 'markdown-it';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType } from 'docx';

const md = new MarkdownIt();

async function convertFile(inputPath, outputPath) {
    console.log(`Converting ${inputPath} to ${outputPath}...`);
    const markdown = fs.readFileSync(inputPath, 'utf-8');
    const tokens = md.parse(markdown, {});
    
    const children = [];
    
    // Helper to build TextRuns from inline tokens
    const buildTextRuns = (inlineTokens) => {
        const runs = [];
        let currentStyle = {};
        
        if (!inlineTokens) return runs;

        for (const token of inlineTokens) {
            if (token.type === 'text') {
                // Handle newlines in text by splitting
                const parts = token.content.split('\n');
                parts.forEach((part, index) => {
                    if (index > 0) {
                        runs.push(new TextRun({ text: "", break: 1 }));
                    }
                    if (part) {
                        runs.push(new TextRun({ text: part, ...currentStyle }));
                    }
                });
            } else if (token.type === 'code_inline') {
                runs.push(new TextRun({ text: token.content, font: "Courier New", ...currentStyle }));
            } else if (token.type === 'strong_open') {
                currentStyle.bold = true;
            } else if (token.type === 'strong_close') {
                currentStyle.bold = false;
            } else if (token.type === 'em_open') {
                currentStyle.italics = true;
            } else if (token.type === 'em_close') {
                currentStyle.italics = false;
            } else if (token.type === 'softbreak' || token.type === 'hardbreak') {
                 runs.push(new TextRun({ text: "", break: 1 }));
            }
        }
        return runs;
    };

    let i = 0;
    while (i < tokens.length) {
        const token = tokens[i];
        
        if (token.type === 'heading_open') {
            const level = parseInt(token.tag.replace('h', ''));
            const inlineToken = tokens[i + 1];
            const headingLevel = level === 1 ? HeadingLevel.HEADING_1 :
                                 level === 2 ? HeadingLevel.HEADING_2 :
                                 level === 3 ? HeadingLevel.HEADING_3 :
                                 level === 4 ? HeadingLevel.HEADING_4 : HeadingLevel.HEADING_5;
            
            children.push(new Paragraph({
                children: buildTextRuns(inlineToken.children),
                heading: headingLevel,
                spacing: { before: 240, after: 120 }
            }));
            i += 3; // skip inline and close
        } 
        else if (token.type === 'paragraph_open') {
            // Check if inside a table cell (handled by table logic) or list (handled by list logic)
            // But markdown-it structure is flat.
            // Actually, for simple paragraphs:
            const inlineToken = tokens[i + 1];
            if (inlineToken.type === 'inline') {
                 children.push(new Paragraph({
                    children: buildTextRuns(inlineToken.children),
                    spacing: { before: 120, after: 120 }
                }));
            }
            i += 3;
        }
        else if (token.type === 'bullet_list_open') {
            i++;
            while (i < tokens.length && tokens[i].type !== 'bullet_list_close') {
                if (tokens[i].type === 'list_item_open') {
                    i++;
                    // Expect paragraph
                    if (tokens[i].type === 'paragraph_open') {
                        const inlineToken = tokens[i+1];
                        children.push(new Paragraph({
                            children: buildTextRuns(inlineToken.children),
                            bullet: { level: 0 } // simplified level
                        }));
                        i += 3; // skip p_open, inline, p_close
                    }
                    // Handle nested lists or other content inside list items?
                    // Simplified: just skip until list_item_close
                    while(i < tokens.length && tokens[i].type !== 'list_item_close') {
                         i++;
                    }
                    i++; // skip list_item_close
                } else {
                    i++;
                }
            }
            i++; // skip bullet_list_close
        }
        else if (token.type === 'table_open') {
            // Simple table handler
            const rows = [];
            i++; // skip table_open
            
            // Thead
            if (tokens[i].type === 'thead_open') {
                i++;
                while(tokens[i].type !== 'thead_close') {
                    if (tokens[i].type === 'tr_open') {
                        const cells = [];
                        i++;
                        while(tokens[i].type !== 'tr_close') {
                            if (tokens[i].type === 'th_open') {
                                i++;
                                if (tokens[i].type === 'inline') {
                                    cells.push(new TableCell({
                                        children: [new Paragraph({ children: buildTextRuns(tokens[i].children), alignment: AlignmentType.CENTER })],
                                        width: { size: 100, type: WidthType.AUTO },
                                        shading: { fill: "EEEEEE" }
                                    }));
                                }
                                i += 2; // skip inline, th_close
                            } else {
                                i++;
                            }
                        }
                        rows.push(new TableRow({ children: cells }));
                        i++; // skip tr_close
                    } else {
                        i++;
                    }
                }
                i++; // skip thead_close
            }
            
            // Tbody
            if (tokens[i].type === 'tbody_open') {
                i++;
                while(tokens[i].type !== 'tbody_close') {
                     if (tokens[i].type === 'tr_open') {
                        const cells = [];
                        i++;
                        while(tokens[i].type !== 'tr_close') {
                            if (tokens[i].type === 'td_open') {
                                i++;
                                if (tokens[i].type === 'inline') { // simple cell
                                     cells.push(new TableCell({
                                        children: [new Paragraph({ children: buildTextRuns(tokens[i].children) })],
                                        width: { size: 100, type: WidthType.AUTO }
                                    }));
                                    i += 2; // skip inline, td_close
                                } else {
                                    // Complex cell content (e.g. paragraphs inside)
                                    // Simplified: just skip to td_close
                                    while(tokens[i].type !== 'td_close') i++;
                                    cells.push(new TableCell({ children: [new Paragraph("Complex Cell")] }));
                                    i++;
                                }
                            } else {
                                i++;
                            }
                        }
                        rows.push(new TableRow({ children: cells }));
                        i++; // skip tr_close
                    } else {
                        i++;
                    }
                }
                i++; // skip tbody_close
            }
            
            children.push(new Table({
                rows: rows,
                width: { size: 100, type: WidthType.PERCENTAGE }
            }));
            
            i++; // skip table_close
        }
        else {
            i++;
        }
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: children,
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);
    console.log(`Generated ${outputPath}`);
}

// Execute
const files = [
    { in: 'TRIP_TECHNICAL_SPECS.md', out: 'TRIP_TECHNICAL_SPECS.docx' }
];

(async () => {
    for (const f of files) {
        if (fs.existsSync(f.in)) {
            await convertFile(f.in, f.out);
        }
    }
})();
