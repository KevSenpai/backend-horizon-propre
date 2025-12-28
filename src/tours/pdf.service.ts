import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Tour } from './entities/tour.entity';

@Injectable()
export class PdfService {
  
  // Génère un stream (flux de données) PDF
  generateTourRoadmap(tour: Tour, clients: any[]): PDFKit.PDFDocument {
    const doc = new PDFDocument({ margin: 50 });

    // 1. En-tête
    doc.fontSize(20).text('HORIZON PROPRE 🌍', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`Feuille de Route : ${tour.name}`, { align: 'center' });
    doc.fontSize(12).text(`Date : ${tour.tour_date} | Équipe : ${tour.team?.name || 'N/A'}`, { align: 'center' });
    doc.moveDown();
    
    // Ligne de séparation
    doc.moveTo(50, 150).lineTo(550, 150).stroke();
    doc.moveDown();

    // 2. Liste des arrêts
    doc.fontSize(14).text('Liste des Clients à collecter :', { underline: true });
    doc.moveDown();

    if (clients.length === 0) {
      doc.fontSize(12).text("Aucun client planifié pour le moment.");
    } else {
      clients.forEach((item, index) => {
        const client = item.client;
        const position = item.position;
        
        // Cadre pour chaque client
        doc.fontSize(12).font('Helvetica-Bold').text(`${position}. ${client.name}`);
        doc.font('Helvetica').text(`    Adresse : ${client.street_address}, ${client.district}`);
        doc.text(`    Téléphone : ${client.phone_number}`);
        doc.moveDown(0.5);
      });
    }

    // 3. Pied de page
    doc.moveDown(2);
    doc.fontSize(10).text('Généré automatiquement par Horizon Manager.', { align: 'center', color: 'grey' });

    doc.end();
    return doc;
  }
}