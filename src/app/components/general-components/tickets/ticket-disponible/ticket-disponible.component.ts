import { Component } from '@angular/core';

@Component({
  selector: 'app-ticket-disponible',
  templateUrl: './ticket-disponible.component.html',
  styleUrl: './ticket-disponible.component.css'
})
export class TicketDisponibleComponent {
// Método para capturar e imprimir el boleto
imprimirBoleto(ticketId: string) {
  const ticketElement = document.getElementById(ticketId);
  if (!ticketElement) return;

  // Clona el contenido del boleto
  const ticketHTML = ticketElement.outerHTML;

  // Abre una nueva ventana para impresión
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Boleto</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
          <style>
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f3f4f6;
              height: 100vh;
            }
            .invisible {
              display: none;
            }
          </style>
        </head>
        <body>${ticketHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
}
