import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Enhanced styles for the ticket - using standard fonts only
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f0f2f5",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 12,
    color: "#444444",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  gradientBanner: {
    height: 20,
    backgroundColor: "#007bff",
  },
  contentWrapper: {
    padding: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
    marginBottom: 25,
  },
  detailsContainer: {
    flexDirection: "row",
    marginBottom: 25,
  },
  leftColumn: {
    flex: 3,
    paddingRight: 20,
  },
  rightColumn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "1px dashed #ddd",
    paddingLeft: 20,
  },
  ticketNumber: {
    backgroundColor: "#f4f8ff",
    padding: 10,
    borderRadius: 6,
    marginTop: 15,
    fontSize: 10,
    color: "#555",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#e0e8ff",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 14,
  },
  detailLabel: {
    fontWeight: "bold",
    width: 85,
    fontSize: 12,
    color: "#555",
  },
  detailValue: {
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  qrCode: {
    width: 120,
    height: 120,
    marginBottom: 12,
    borderWidth: 8,
    borderColor: "#f4f8ff",
  },
  termsSection: {
    marginTop: 25,
  },
  termsContainer: {
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderLeft: "4px solid #007bff",
  },
  termsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  termItem: {
    fontSize: 8,
    color: "#555",
    marginBottom: 5,
    textAlign: "justify",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: "#777",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#ddd",
    marginVertical: 20,
  },
  eventHighlight: {
    backgroundColor: "#f4f8ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  eventDate: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 3,
  },
  scanText: {
    fontSize: 9,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
  },
  placeholderLogo: {
    width: 100,
    height: 40,
    backgroundColor: "#f4f8ff",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 8,
    color: "#aaa",
  },
});

const EventTicket = ({ eventData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with logo */}
      <View style={styles.header}>
        {/* Always display logo or placeholder */}
        {eventData.logoUrl ? (
          <Image style={styles.logo} src={eventData.logoUrl} />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>LOGO</Text>
          </View>
        )}
        <Text style={styles.headerText}>OFFICIAL E-TICKET</Text>
      </View>

      {/* Main Ticket Container */}
      <View style={styles.container}>
        <View style={styles.gradientBanner} />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{eventData.eventName}</Text>

          <View style={styles.eventHighlight}>
            <Text style={styles.eventDate}>{eventData.date}</Text>
            <Text style={styles.detailValue}>{eventData.location}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.leftColumn}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  ATTENDEE:{eventData.quantity}
                </Text>
                <Text style={styles.detailValue}>{eventData.attendeeName}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SEAT:</Text>
                <Text style={styles.detailValue}>
                  {eventData.seat || "General Admission"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>SECTION:</Text>
                <Text style={styles.detailValue}>
                  {eventData.section || "Main Floor"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>GATE:</Text>
                <Text style={styles.detailValue}>
                  {eventData.gate || "Gate A"}
                </Text>
              </View>

              {eventData.ticketNumber && (
                <View style={styles.ticketNumber}>
                  <Text>TICKET #: {eventData.ticketNumber}</Text>
                </View>
              )}
            </View>

            <View style={styles.rightColumn}>
              {eventData.qrCodeUrl ? (
                <Image style={styles.qrCode} src={eventData.qrCodeUrl} />
              ) : (
                <Text>QR Code Unavailable</Text>
              )}
              <Text style={styles.scanText}>Scan for entry</Text>
            </View>

            <View style={styles.rightColumn}>
              {eventData.mapsUrl ? (
                <Image style={styles.qrCode} src={eventData.mapsUrl} />
              ) : (
                <Text>QR Code Unavailable</Text>
              )}
              <Text style={styles.scanText}>Scan for location</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.termsSection}>
            <View style={styles.termsContainer}>
              <Text style={styles.termsTitle}>Terms & Conditions</Text>
              <Text style={styles.termItem}>
                1. This ticket is a revocable license and may be taken and
                admission refused upon refunding the purchase price.
              </Text>
              <Text style={styles.termItem}>
                2. Holder voluntarily assumes all risks and danger of personal
                injury and all other hazards arising from or related to the
                event.
              </Text>
              <Text style={styles.termItem}>
                3. Tickets are non-refundable and cannot be replaced if lost,
                stolen, or destroyed.
              </Text>
              <Text style={styles.termItem}>
                4. No re-entry is permitted once you leave the venue.
              </Text>
              <Text style={styles.termItem}>
                5. Management reserves the right to refuse admission or eject
                any person whose conduct is deemed disorderly.
              </Text>
              <Text style={styles.termItem}>
                6. No outside food or beverages, professional cameras, or
                recording equipment are permitted.
              </Text>
              <Text style={styles.termItem}>
                7. Event date and time are subject to change. It is the
                responsibility of the ticket holder to confirm the date and time
                of the event.
              </Text>
              <Text style={styles.termItem}>
                8. In case of event cancellation, only the face value of the
                ticket will be refunded.
              </Text>
              <Text style={styles.termItem}>
                9. Holder consents to reasonable security checks and bag
                searches upon entry.
              </Text>
              <Text style={styles.termItem}>
                10. By using this ticket, holder consents to the use of their
                image or likeness in any live or recorded video display or
                photograph taken during the event.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Please arrive at least 30 minutes before the event starts. A valid ID
        matching the ticket holder's name will be required for entry. For any
        queries, contact {eventData.contactInfo || "the event organizer"}.
      </Text>
    </Page>
  </Document>
);

export default EventTicket;
