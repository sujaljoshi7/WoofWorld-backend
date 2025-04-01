const EventsFAQ = () => {
  const faqs = [
    {
      question: "How do I buy tickets?",
      answer:
        "Tickets can be purchased directly from the WoofWorld website at woofworld.in.",
    },
    {
      question: "How do I buy tickets in bulk?",
      answer:
        "For bulk ticket bookings, please contact us at bulkbooking@woofworld.in.",
    },
    {
      question: "Where can I find my purchased tickets?",
      answer:
        "Digital tickets will be available in the Profile section of the WoofWorld website after purchase.",
    },
    {
      question: "How long do I have to complete my ticket purchase?",
      answer:
        "Once tickets are added to the cart, you have 10 minutes to complete the purchase.",
    },
    {
      question: "Can I change my contact details after booking?",
      answer: "No modifications are allowed.",
    },
    {
      question: "Can someone else attend the event using my ticket?",
      answer: "Anyone can attend the event using the ticket.",
    },
  ];

  return (
    <section className="mt-5">
      <div className="accordion" id="faqAccordion">
        <div className="accordion-item border-0 rounded">
          <h2 className="accordion-header">
            <button
              className="accordion-button text-bold bg-transparent shadow-none collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#faqCollapse"
              aria-expanded="false"
              aria-controls="faqCollapse"
            >
              Frequently Asked Questions
            </button>
          </h2>
          <div id="faqCollapse" className="accordion-collapse collapse">
            <div className="accordion-body">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <p>
                    <strong>{faq.question}</strong>
                    <br />
                    {faq.answer}
                  </p>
                  {index !== faqs.length - 1 && <hr className="faq-divider" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-divider {
          margin: 10px 0;
          border: none;
          border-top: 1px solid rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
};

export default EventsFAQ;
