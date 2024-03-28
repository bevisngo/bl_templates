import fs from 'fs';
import path from 'path';
import { widthPixels, heightPixels } from "../../global/constants.js";
import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

const inputDirectory = 'test/assets/input';
const outputDirectory = 'test/assets/output';

if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
}

fs.readdir(inputDirectory, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(inputDirectory, file);
        if (path.extname(filePath).toLowerCase() === '.svg') {
            const svgContent = fs.readFileSync(filePath, 'utf-8');
            
            const pdfFilePath = path.join(outputDirectory, path.basename(file, '.svg') + '.pdf');
            const pdfStream = fs.createWriteStream(pdfFilePath);
            const doc = new PDFDocument({ size: [widthPixels, heightPixels] });
            SVGtoPDF(doc, svgContent, 0, 0);
            doc.pipe(pdfStream);
            doc.end();
            pdfStream.on('finish', () => {
                console.log(`Converted ${filePath} to PDF`);
            });

            pdfStream.on('error', err => {
                console.error(`Error converting ${filePath} to PDF:`, err);
            });
        }
    });
});
