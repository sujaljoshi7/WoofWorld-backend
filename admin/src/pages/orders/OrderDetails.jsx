<div className="container-fluid">
  <div className="row">
    <Sidebar />
    <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Order Details</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => navigate("/admin/orders")}
          >
            Back to Orders
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Order Information */}
          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Order Information</h5>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-1">
                      <span className="text-muted">Order ID:</span>{" "}
                      <span className="fw-bold">{order.order_id}</span>
                    </p>
                    <p className="mb-1">
                      <span className="text-muted">Date:</span>{" "}
                      <span className="fw-bold">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-1">
                      <span className="text-muted">Status:</span>{" "}
                      <span
                        className={`badge ${getStatusBadgeClass(
                          order.order_status
                        )}`}
                      >
                        {getStatusText(order.order_status)}
                      </span>
                    </p>
                    <p className="mb-1">
                      <span className="text-muted">Total Amount:</span>{" "}
                      <span className="fw-bold">₹{order.total}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Order Items</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderItems.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.product_details?.image}
                                alt={item.product_details?.name}
                                className="me-2"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                              />
                              <div>
                                <div className="fw-bold">
                                  {item.product_details?.name}
                                </div>
                                <small className="text-muted">
                                  SKU: {item.product_details?.sku}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>₹{item.product_details?.price}</td>
                          <td>{item.quantity}</td>
                          <td>
                            ₹
                            {(
                              item.quantity * item.product_details?.price
                            ).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="card-title mb-0">Customer Information</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <h6 className="text-muted mb-2">Contact Details</h6>
                  <p className="mb-1">
                    <span className="fw-bold">Name:</span>{" "}
                    {order.user?.first_name} {order.user?.last_name}
                  </p>
                  <p className="mb-1">
                    <span className="fw-bold">Email:</span> {order.user?.email}
                  </p>
                  <p className="mb-1">
                    <span className="fw-bold">Username:</span>{" "}
                    {order.user?.username}
                  </p>
                </div>

                <div>
                  <h6 className="text-muted mb-2">Shipping Address</h6>
                  {order.user?.address ? (
                    <>
                      <p className="mb-1">
                        <span className="fw-bold">Name:</span>{" "}
                        {order.user.address.name}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">Address:</span>{" "}
                        {order.user.address.address_line_1}
                        {order.user.address.address_line_2 && (
                          <>, {order.user.address.address_line_2}</>
                        )}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">City:</span>{" "}
                        {order.user.address.city}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">State:</span>{" "}
                        {order.user.address.state}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">Country:</span>{" "}
                        {order.user.address.country}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">Postal Code:</span>{" "}
                        {order.user.address.postal_code}
                      </p>
                      <p className="mb-1">
                        <span className="fw-bold">Phone:</span>{" "}
                        {order.user.address.phone}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted">No address available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
