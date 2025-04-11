<div className="card border-0 shadow-sm">
  <div className="card-body">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 className="card-title text-primary mb-2">Invoice</h5>
        <p className="text-muted mb-0">Order #{order.id}</p>
      </div>
      <div className="text-end">
        <p className="mb-1">
          <span className="text-muted">Date:</span>{" "}
          <span className="fw-medium">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </p>
        <p className="mb-0">
          <span className="text-muted">Status:</span>{" "}
          <span className={`badge ${getStatusBadgeClass(order.status)}`}>
            {order.status}
          </span>
        </p>
      </div>
    </div>

    <div className="row mb-4">
      <div className="col-md-6">
        <h6 className="text-muted mb-3">Billing Information</h6>
        <div className="bg-light p-3 rounded">
          <p className="mb-1 fw-medium">
            {order.user?.first_name} {order.user?.last_name}
          </p>
          <p className="mb-1 text-muted">{order.user?.email}</p>
          <p className="mb-1 text-muted">{order.user?.phone_number}</p>
          <p className="mb-0 text-muted">{order.user?.address}</p>
        </div>
      </div>
      <div className="col-md-6">
        <h6 className="text-muted mb-3">Shipping Information</h6>
        <div className="bg-light p-3 rounded">
          <p className="mb-1 fw-medium">{order.shipping_address?.name}</p>
          <p className="mb-1 text-muted">{order.shipping_address?.address}</p>
          <p className="mb-1 text-muted">
            {order.shipping_address?.city}, {order.shipping_address?.state}
          </p>
          <p className="mb-0 text-muted">{order.shipping_address?.pincode}</p>
        </div>
      </div>
    </div>

    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th style={{ width: "5%" }}>#</th>
            <th style={{ width: "40%" }}>Product</th>
            <th style={{ width: "15%" }} className="text-end">
              Price
            </th>
            <th style={{ width: "10%" }} className="text-center">
              Quantity
            </th>
            <th style={{ width: "15%" }} className="text-end">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {order.items?.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={item.product?.image}
                    alt={item.product?.name}
                    className="rounded me-2"
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p className="mb-0 fw-medium">{item.product?.name}</p>
                    <small className="text-muted">
                      SKU: {item.product?.sku || "N/A"}
                    </small>
                  </div>
                </div>
              </td>
              <td className="text-end">₹{item.price}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-end">₹{item.price * item.quantity}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="table-light">
          <tr>
            <td colSpan="4" className="text-end fw-bold">
              Subtotal
            </td>
            <td className="text-end">₹{order.total_amount}</td>
          </tr>
          <tr>
            <td colSpan="4" className="text-end fw-bold">
              Shipping
            </td>
            <td className="text-end">₹{order.shipping_charge || 0}</td>
          </tr>
          <tr>
            <td colSpan="4" className="text-end fw-bold">
              Tax
            </td>
            <td className="text-end">₹{order.tax || 0}</td>
          </tr>
          <tr>
            <td colSpan="4" className="text-end fw-bold">
              Total
            </td>
            <td className="text-end fw-bold">
              ₹
              {order.total_amount +
                (order.shipping_charge || 0) +
                (order.tax || 0)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <div className="mt-4">
      <h6 className="text-muted mb-2">Payment Information</h6>
      <div className="bg-light p-3 rounded">
        <p className="mb-1">
          <span className="text-muted">Method:</span>{" "}
          <span className="fw-medium">{order.payment_method}</span>
        </p>
        <p className="mb-1">
          <span className="text-muted">Transaction ID:</span>{" "}
          <span className="fw-medium">{order.transaction_id || "N/A"}</span>
        </p>
        <p className="mb-0">
          <span className="text-muted">Status:</span>{" "}
          <span
            className={`badge ${
              order.payment_status === "completed" ? "bg-success" : "bg-warning"
            }`}
          >
            {order.payment_status}
          </span>
        </p>
      </div>
    </div>
  </div>
</div>;

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 1:
      return "bg-warning text-dark"; // Pending
    case 2:
      return "bg-info text-dark"; // Processing
    case 3:
      return "bg-primary text-white"; // Shipped
    case 4:
      return "bg-success text-white"; // Delivered
    case 5:
      return "bg-danger text-white"; // Cancelled
    case 6:
      return "bg-secondary text-white"; // Refunded
    default:
      return "bg-secondary text-white";
  }
};
