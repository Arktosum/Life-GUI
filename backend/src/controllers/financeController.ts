import { Request, Response } from "express";
import FinanceUser, { IFinanceUser } from "../models/financeUserModel";
import Transaction from "../models/transactionModel";

export async function createFinanceUser(req: Request, res: Response) {
    const user = new FinanceUser(req.body);
    await user.save();
    res.status(201).json(user);
};

export async function fetchAllTransactions(req: Request, res: Response) {
    const transactions = await Transaction.find().populate("transactee").sort({ createdAt: 'desc' });
    res.status(200).json(transactions);
};



// Balance = amount * IS_SEND(-1,1) * IS_COMPLETE(1,0)
// DUE = amount * IS_SEND(-1,1) * IS_COMPLETE(0,1)

export async function fetchFinanceBalance(req: Request, res: Response) {
    const result = await Transaction.aggregate([
        {
            $project: {
                balance: {
                    $multiply: [
                        "$amount",
                        { $cond: [{ $eq: ["$mode", "SEND"] }, -1, 1] }, // If mode is SEND, multiply by -1
                        { $cond: [{ $eq: ["$status", "PAID"] }, 1, 0] } // If status is COMPLETED, keep value; otherwise, zero it out
                    ]
                },
                due: {
                    $multiply: [
                        "$amount",
                        { $cond: [{ $eq: ["$mode", "SEND"] }, -1, 1] }, // If mode is SEND, multiply by -1
                        { $cond: [{ $eq: ["$status", "PAID"] }, 0, 1] } // If status is COMPLETED, zero it out; otherwise, keep value
                    ]
                }
            }
        },
        {
            $group: {
                _id: null,
                balance: { $sum: "$balance" }, // Sum all computed results
                due: { $sum: "$due" } // Sum all computed results
            }
        }
    ]);
    res.send({ balance: result[0]?.balance || 0, due : result[0]?.due || 0 })
}


export async function fetchFinanceUsersRegex(req: Request, res: Response) {
    const regex = req.params.regex
    const financeUsers = await FinanceUser.find({ transactee: { $regex: regex, $options: 'i' } }).sort({ createdAt: 'desc' });
    res.status(200).json(financeUsers);
};



export async function fetchFinanceUserById(req: Request, res: Response) {
    const id = req.params.id;
    const user = await FinanceUser.findById(id);
    res.status(200).json(user);
};


export async function createTransaction(req: Request, res: Response) {
    const financeUser = await FinanceUser.findById(req.body.transactee)

    if (!financeUser) {
        res.status(400).json({ message: "Cannot find user!" });
    }

    const transaction = new Transaction(req.body);
    if (!transaction) {
        res.status(400).json({ message: "Failed to create transaction!" });
    }
    await transaction.save();

    financeUser?.transactions.push(transaction._id as string);
    await financeUser?.save();

    res.status(201).json(transaction);
};

export async function deleteTransactionById(req: Request, res: Response) {
    const item = await Transaction.findByIdAndDelete(req.params.id);
    if (!item) {
        res.status(404).json({ message: 'item not found' });
        return;
    }

    const financeUser = await FinanceUser.findById(item.transactee)

    if (!financeUser) {
        res.status(400).json({ message: "Cannot find user!" });
    }

    financeUser?.transactions.filter((id) => id != item._id);
    await financeUser?.save();
    res.status(200).json({ message: 'item deleted successfully' });
};

export async function fetchTransactionById(req: Request, res: Response) {
    const id = req.params.id;
    const transaction = await Transaction.findById(id).populate("transactee");
    res.status(200).json(transaction);
};



export async function updateTransactionById(req: Request, res: Response) {
    const item = await Transaction.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate("transactee");;
    if (!item) {
        res.status(404).json({ message: 'item not found' });
        return;
    }
    res.status(200).json(item);
};