import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Charts from '../components/Charts.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [editing, setEditing] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterMonth, setFilterMonth] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await api.get('/transactions');
      setTransactions(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load transactions');
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (payload) => {
    setError('');
    try {
      if (editing) {
        await api.put(`/transactions/${editing._id}`, payload);
        setEditing(null);
      } else {
        await api.post('/transactions', payload);
      }
      await load();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save transaction');
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete');
    }
  };

  // apply filters
  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (filterType === 'all' || t.type === filterType) &&
          (!filterMonth || t.date.slice(0, 7) === filterMonth)
      ),
    [transactions, filterType, filterMonth]
  );

  // summary cards (based on filtered list)
  const income = filtered.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expense = filtered.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  // pie chart: expenses by category
  const pieData = useMemo(() => {
    const map = {};
    filtered.filter((t) => t.type === 'expense').forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // bar chart: monthly income vs expense (all data)
  const barData = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!map[m]) map[m] = { month: m, Income: 0, Expense: 0 };
      if (t.type === 'income') map[m].Income += t.amount;
      else map[m].Expense += t.amount;
    });
    return Object.values(map).sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return (
    <div className="container">
      <header className="navbar">
        <h1>💰 ExpenseTrack</h1>
        <div>
          <span className="muted">Hi, {user.name} </span>
          <button className="btn small" onClick={logout}>Logout</button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="grid-3">
        <div className="card stat"><span>Total Income</span><strong className="green">₹{income.toFixed(2)}</strong></div>
        <div className="card stat"><span>Total Expense</span><strong className="red">₹{expense.toFixed(2)}</strong></div>
        <div className="card stat"><span>Balance</span><strong className={balance >= 0 ? 'green' : 'red'}>₹{balance.toFixed(2)}</strong></div>
      </div>

      <Charts pieData={pieData} barData={barData} />

      <div className="grid-main">
        <TransactionForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />

        <div className="card">
          <div className="row between">
            <h3>Transactions</h3>
            <div className="row">
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
              {(filterType !== 'all' || filterMonth) && (
                <button className="btn small" onClick={() => { setFilterType('all'); setFilterMonth(''); }}>Clear</button>
              )}
            </div>
          </div>
          <TransactionList items={filtered} onEdit={setEditing} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
