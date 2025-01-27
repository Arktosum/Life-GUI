import { Link } from "react-router-dom";
import { useAppDispatch } from "../redux/hooks";
import { logoutUser } from "../redux/reducers/authReducer";

function PageContainer({ children }: React.PropsWithChildren) {
  return (
    <div className="w-[100vw] h-[100dvh] flex flex-col bg-black">
      {children}
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useAppDispatch();
  function handleLogout() {
    dispatch(logoutUser());
  }
  return (
    <PageContainer>
      <div className="flex items-center gap-5 m-5 justify-center">
        <img src="/brand-logo-full.svg" alt="" className="w-[50%]" />
      </div>
      <Link
        className="text-white bg-[#1c1c1c] p-5 rounded-xl m-5"
        to="/finance/dashboard"
      >
        Finance
      </Link>
      <Link className="text-white bg-[#1c1c1c] p-5 rounded-xl m-5" to="/friend">
        Hall of Friends
      </Link>
      <Link
        className="text-white bg-[#1c1c1c] p-5 rounded-xl m-5"
        to="/finance"
      >
        Finance
      </Link>
      <Link
        className="text-white bg-[#1c1c1c] p-5 rounded-xl m-5"
        to="/finance"
      >
        Finance
      </Link>
      <Link
        onClick={handleLogout}
        className="text-red-600 bg-[#1c1c1c] p-5 rounded-xl m-5"
        to="/"
      >
        Logout
      </Link>
    </PageContainer>
  );
}
