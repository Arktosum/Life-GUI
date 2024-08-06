import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteTransaction,
  fetchTransactionById,
  FinanceUser,
  Transaction,
} from "../redux/reducers/financeReducer";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import moment from "moment";

export default function FinanceInfo() {
  const { transaction_id } = useParams();
  const _id = transaction_id;
  const [transaction, setTransaction] = useState<Transaction>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function handleDelete() {
    if (_id == null) return;
    dispatch(deleteTransaction(_id)).then(() => {
      navigate("/finance");
    });
  }
  useEffect(() => {
    if (_id == null) return;
    dispatch(fetchTransactionById(_id)).then((action) => {
      if (action.meta.requestStatus == "fulfilled") {
        setTransaction(action.payload as Transaction);
      }
    });
  }, [_id, dispatch]);
  const financeUser = transaction?.transactee as FinanceUser;
  return (
    <div>
      <div>{financeUser?.transactee}</div>
      <div>{transaction?.amount}</div>
      <div>{transaction?.category}</div>
      <div>{transaction?.mode}</div>
      <div>{moment(transaction?.createdAt).toString()}</div>
      <div>{moment(transaction?.updatedAt).toString()}</div>
      <div>{transaction?.remarks}</div>
      <div>{transaction?.status}</div>
      <Link to="/finance">
        <button className="text-blue-600 border-2 border-blue-600 px-5 py-2">
          Go back
        </button>
      </Link>
      <button
        onClick={handleDelete}
        className="text-red-600 border-2 border-red-600 px-5 py-2"
      >
        Delete transaction!
      </button>
    </div>
  );
}
