const EventsTC = () => {
  const faqStatements = [
    "Tickets can be purchased directly from the WoofWorld website at woofworld.in.",
    "For bulk ticket bookings, please contact us at bulkbooking@woofworld.in.",
    "Digital tickets will be available in the Profile section of the WoofWorld website after purchase.",
    "Once tickets are added to the cart, you have 10 minutes to complete the purchase.",
    "No modifications are allowed after booking.",
    "Anyone can attend the event using the ticket.",
  ];

  return (
    <section className="mt-3">
      <div className="accordion" id="tcAccordion">
        <div className="accordion-item border-0 rounded">
          <h2 className="accordion-header">
            <button
              className="accordion-button text-bold bg-transparent shadow-none collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#tcCollapse"
              aria-expanded="false"
              aria-controls="tcCollapse"
            >
              Important Information
            </button>
          </h2>
          <div id="tcCollapse" className="accordion-collapse collapse">
            <div className="accordion-body">
              <ul className="ps-3">
                {faqStatements.map((statement, index) => (
                  <li key={index} className="mb-2">
                    {statement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .accordion-body ul {
          list-style-type: disc;
          padding-left: 1rem;
        }
      `}</style>
    </section>
  );
};

export default EventsTC;
