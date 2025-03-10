import ModifyBlog from "../../components/ModifyBlog";

function AddBlog() {
  return <ModifyBlog route="/api/blogs/" method="add" />;
}

export default AddBlog;
