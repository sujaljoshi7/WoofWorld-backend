import ModifyEvent from "../../components/ModifyEvent";

function AddEvent() {
  return <ModifyEvent route="/api/events/event/" method="add" />;
}

export default AddEvent;
