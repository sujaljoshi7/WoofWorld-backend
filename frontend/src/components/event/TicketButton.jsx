import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import EventTicket from "./pass"; // Ensure the correct file name

const TicketButton = ({ eventData }) => {
  return (
    <PDFDownloadLink
      document={<EventTicket eventData={eventData} />}
      //   fileName="Event_Ticket.pdf"
      fileName={`${eventData.eventName} Ticket.pdf`} // Corrected template literal
      className="btn btn-primary rounded-pill"
    >
      {({ loading }) => (
        <>
          <i className="fas fa-qrcode me-2"></i>
          {loading ? "Generating Ticket..." : "Download Ticket"}
        </>
      )}
    </PDFDownloadLink>
  );
};

export default TicketButton;
