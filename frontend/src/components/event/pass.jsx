import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Svg,
  Path,
} from "@react-pdf/renderer";
import QRCode from "qrcode";

// Add custom fonts - comment these out if you don't have the actual fonts
// Font.register({
//   family: "Montserrat",
//   fonts: [
//     { src: "/path/to/Montserrat-Regular.ttf" },
//     { src: "/path/to/Montserrat-Bold.ttf", fontWeight: "bold" }
//   ]
// });

// Generate QR code for the location
const generateLocationQR = async (location) => {
  try {
    return await QRCode.toDataURL(location, {
      errorCorrectionLevel: "H",
      margin: 1,
      width: 200,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Failed to generate location QR code:", err);
    return null;
  }
};

// Enhanced styles for a more creative and professional ticket
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f6f9fc",
    padding: 30,
    fontFamily: "Helvetica", // Change to "Montserrat" if custom fonts are enabled
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 45,
    objectFit: "contain",
  },
  headerText: {
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    fontSize: 14,
    color: "#1a3a5f",
    letterSpacing: 1,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    overflow: "hidden",
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e0e7ff",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  gradientBanner: {
    height: 12,
    backgroundColor: "#3b82f6",
    backgroundGradient: ["#3b82f6", "#8b5cf6"], // Gradient only works with PDF libraries that support it
  },
  eventBanner: {
    backgroundColor: "#172554",
    padding: 15,
    alignItems: "center",
  },
  contentWrapper: {
    padding: 25,
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    color: "#111827",
    textAlign: "center",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 25,
  },
  detailsContainer: {
    flexDirection: "row",
    marginVertical: 20,
    flexWrap: "wrap",
  },
  leftColumn: {
    flex: 3,
    paddingRight: 20,
  },
  rightColumn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    borderLeft: "1px dashed #cbd5e1",
    paddingLeft: 20,
  },
  ticketNumber: {
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    fontSize: 11,
    color: "#1e40af",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 14,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    width: 85,
    fontSize: 12,
    color: "#4b5563",
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 12,
    color: "#1f2937",
    flex: 1,
  },
  qrCodeContainer: {
    alignItems: "center",
  },
  qrCode: {
    width: 130,
    height: 130,
    marginBottom: 8,
    padding: 4,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 5,
    borderColor: "#eff6ff",
  },
  locationQrCode: {
    width: 100,
    height: 100,
    marginTop: 10,
    padding: 2,
    backgroundColor: "#ffffff",
    borderRadius: 6,
    borderWidth: 4,
    borderColor: "#f0fdf4",
  },
  termsSection: {
    marginTop: 50,
  },
  termsContainer: {
    padding: 20,
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderLeft: "4px solid #3b82f6",
  },
  termsTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    marginBottom: 12,
    color: "#374151",
  },
  termItem: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 5,
    textAlign: "justify",
  },
  footer: {
    marginTop: 20,
    fontSize: 10,
    color: "#6b7280",
    textAlign: "center",
    paddingHorizontal: 40,
    lineHeight: 1.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomStyle: "dashed",
    borderBottomColor: "#e5e7eb",
    marginVertical: 20,
  },
  eventHighlight: {
    backgroundColor: "#f3f4f6",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  eventDate: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    color: "#2563eb",
    marginBottom: 5,
    textAlign: "center",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  locationIcon: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  locationText: {
    fontSize: 12,
    color: "#4b5563",
    textAlign: "center",
  },
  scanText: {
    fontSize: 10,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 5,
  },
  placeholderLogo: {
    width: 120,
    height: 45,
    backgroundColor: "#eff6ff",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#60a5fa",
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
  },
  badge: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  badgeText: {
    color: "#1e40af",
    fontSize: 10,
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 22,
    height: 22,
    backgroundColor: "#eff6ff",
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  mapContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  mapLabel: {
    fontSize: 10,
    color: "#059669",
    textAlign: "center",
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    marginBottom: 5,
  },
  ticketInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },
  ticketInfoItem: {
    alignItems: "center",
  },
  ticketInfoLabel: {
    fontSize: 8,
    color: "#6b7280",
    marginBottom: 3,
  },
  ticketInfoValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold", // "Montserrat-Bold" if custom fonts are enabled
    color: "#1f2937",
  },
});

// Create SVG location icon component
const LocationIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 21C15.5 17.4 19 14.1764 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 14.1764 8.5 17.4 12 21Z"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Create SVG ticket icon component
const TicketIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 10.5H15M9 13.5H15M19 3V21L17 19L15 21L13 19L11 21L9 19L7 21L5 19L3 21V3L5 5L7 3L9 5L11 3L13 5L15 3L17 5L19 3Z"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Create SVG user icon component
const UserIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Create SVG chair icon component
const ChairIcon = () => (
  <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 21V17M18 21V17M6 11V5C6 3.89543 6.89543 3 8 3H16C17.1046 3 18 3.89543 18 5V11M6 11H18M6 11V17M18 11V17M6 17H18"
      stroke="#2563eb"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EventTicket = ({ eventData }) => {
  // This would be used in a real implementation to generate the QR code
  // const [locationQRCode, setLocationQRCode] = React.useState(null);

  // React.useEffect(() => {
  //   const generateQR = async () => {
  //     if (eventData.location) {
  //       const qrData = await generateLocationQR(
  //         `https://maps.google.com/?q=${encodeURIComponent(eventData.location)}`
  //       );
  //       setLocationQRCode(qrData);
  //     }
  //   };
  //   generateQR();
  // }, [eventData.location]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header with logo */}
        <View style={styles.header}>
          {/* Always display logo or placeholder */}
          {eventData.logoUrl ? (
            <Image style={styles.logo} src={eventData.logoUrl} />
          ) : (
            <View style={styles.placeholderLogo}>
              <Text style={styles.placeholderText}>EVENT LOGO</Text>
            </View>
          )}
          <Text style={styles.headerText}>OFFICIAL E-TICKET</Text>
        </View>

        {/* Main Ticket Container */}
        <View style={styles.container}>
          <View style={styles.gradientBanner} />

          <View style={styles.eventBanner}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>ADMISSION TICKET</Text>
            </View>
            <Text style={[styles.title, { color: "white" }]}>
              {eventData.eventName}
            </Text>
            <Text style={[styles.subtitle, { color: "#94a3b8" }]}>
              {eventData.subtitle || "Live Experience"}
            </Text>
          </View>

          <View style={styles.contentWrapper}>
            <View style={styles.eventHighlight}>
              <Text style={styles.eventDate}>{eventData.date}</Text>
              <View style={styles.locationContainer}>
                <LocationIcon />
                <Text style={styles.locationText}>{eventData.location}</Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.leftColumn}>
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <UserIcon />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>ATTENDEE</Text>
                    <Text style={styles.detailValue}>
                      {eventData.attendeeName}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <ChairIcon />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>SEAT</Text>
                    <Text style={styles.detailValue}>
                      {eventData.seat || "General Admission"}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <TicketIcon />
                  </View>
                  <View>
                    <Text style={styles.detailLabel}>SECTION</Text>
                    <Text style={styles.detailValue}>
                      {eventData.section || "Main Floor"}
                    </Text>
                  </View>
                </View>

                <View style={styles.ticketInfoRow}>
                  <View style={styles.ticketInfoItem}>
                    <Text style={styles.ticketInfoLabel}>GATE</Text>
                    <Text style={styles.ticketInfoValue}>
                      {eventData.gate || "Gate A"}
                    </Text>
                  </View>

                  <View style={styles.ticketInfoItem}>
                    <Text style={styles.ticketInfoLabel}>QUANTITY</Text>
                    <Text style={styles.ticketInfoValue}>
                      {eventData.quantity || "1"}
                    </Text>
                  </View>

                  <View style={styles.ticketInfoItem}>
                    <Text style={styles.ticketInfoLabel}>TYPE</Text>
                    <Text style={styles.ticketInfoValue}>
                      {eventData.type || "Regular"}
                    </Text>
                  </View>
                </View>

                {eventData.ticketNumber && (
                  <View style={styles.ticketNumber}>
                    <Text>TICKET #: {eventData.ticketNumber}</Text>
                  </View>
                )}

                {/* Location QR code for mobile devices */}
                <View style={styles.mapContainer}>
                  <Text style={styles.mapLabel}>SCAN FOR DIRECTIONS</Text>
                  {eventData.locationQrUrl ? (
                    <Image
                      style={styles.locationQrCode}
                      src={eventData.locationQrUrl}
                    />
                  ) : (
                    // In a real implementation, use the state variable locationQRCode
                    <Image
                      style={styles.locationQrCode}
                      src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://maps.google.com/?q=Event+Location"
                    />
                  )}
                </View>
              </View>

              <View style={styles.rightColumn}>
                <View style={styles.qrCodeContainer}>
                  {eventData.qrCodeUrl ? (
                    <Image style={styles.qrCode} src={eventData.qrCodeUrl} />
                  ) : (
                    <Image
                      style={styles.qrCode}
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Sample+Ticket+QR+Code"
                    />
                  )}
                  <Text style={styles.scanText}>SCAN FOR ENTRY</Text>
                </View>
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
                  responsibility of the ticket holder to confirm the date and
                  time of the event.
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
};

export default EventTicket;
