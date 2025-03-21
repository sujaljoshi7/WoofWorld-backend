const BASE_URL = import.meta.env.VITE_API_URL;

export const exportToCSV = (data, headers, fields, filename = "export.csv") => {
  if (data.length === 0) {
    alert("No data available to export.");
    return;
  }

  const csvHeaders = headers;
  const csvRows = data.map((item) =>
    fields.map((field) => (field === "image" ? `${BASE_URL}${item[field] || ""}` : `"${item[field]}"`))
  );

  const csvContent = [
    csvHeaders.join(","), // Headers
    ...csvRows.map((row) => row.join(",")), // Data rows
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
