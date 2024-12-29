import { useParams } from "react-router-dom";
import List from "../components/List";
import Members from "../components/Members";

const currentUser = { userId: 2, userName: "Matěj", role: "member" };

const ListDetail = () => {
  const { listId } = useParams();

  return (
    <section className="list-detail">
      <List listId={parseInt(listId, 10)} user={currentUser} />
      <Members listId={parseInt(listId, 10)} user={currentUser} />{" "}
    </section>
  );
};

export default ListDetail;
