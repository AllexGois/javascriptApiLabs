import PDFDocument from "pdfkit";

const genLabPDF = (laboratories) => {
  const doc = new PDFDocument();

  // Configuração do cabeçalho
  doc.fontSize(18).text("Relatório de Laboratórios", { align: "center" });
  doc.moveDown();

  // Listagem de laboratórios
  laboratories.forEach((lab, index) => {
    doc.fontSize(14).text(`Laboratório ${index + 1}: ${lab.nome}`);
    doc.fontSize(12).text(`Descrição: ${lab.descricao}`);
    doc.text(`Capacidade: ${lab.capacidade}`);
    if (lab.foto) {
      try {
        doc.image(lab.photo, { fit: [100, 100] });
      } catch (error) {
        doc.text("[Foto não disponível]");
      }
    }
    doc.moveDown();
  });

  doc.end();
  return doc;
};

export default genLabPDF