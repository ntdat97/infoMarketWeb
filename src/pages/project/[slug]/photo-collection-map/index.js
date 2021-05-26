import { Redirect } from "../../../../components/common/Redirect";
import { useRouter } from "next/router";
export default function MyProject() {
  const router = useRouter();
  return (
    <>
      <Redirect to={`/project/${router.query.slug}/photo-collection-map/all`} />
    </>
  );
}
