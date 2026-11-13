export default function TransactionList({ items, onEdit, onDelete }) {
  if (items.length === 0) return <p className="muted center">No transactions found.</p>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Title</th><th>Category</th><th>Amount</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((t) => (
            <tr key={t._id}>
              <td>{t.date.slice(0, 10)}</td>
              <td>{t.title}{t.note && <div className="muted small">{t.note}</div>}</td>
              <td><span className="tag">{t.category}</span></td>
              <td className={t.type === 'income' ? 'green' : 'red'}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
              </td>
              <td>
                <button className="btn small" onClick={() => onEdit(t)}>Edit</button>{' '}
                <button className="btn small danger" onClick={() => onDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
