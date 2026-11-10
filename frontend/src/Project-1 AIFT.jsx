
import { useMemo, useState } from 'react';
import './App.css';

const initialProducts = [
  { id: 1, name: 'Wireless Headphones', sku: 'WH-2048', category: 'Electronics', quantity: 48, price: 2499, threshold: 15, icon: '🎧' },
  { id: 2, name: 'Minimal Desk Lamp', sku: 'DL-1092', category: 'Home & Living', quantity: 12, price: 1899, threshold: 15, icon: '💡' },
  { id: 3, name: 'Everyday Backpack', sku: 'BP-3021', category: 'Accessories', quantity: 86, price: 1599, threshold: 20, icon: '🎒' },
  { id: 4, name: 'Ceramic Coffee Mug', sku: 'CM-4410', category: 'Home & Living', quantity: 7, price: 499, threshold: 15, icon: '☕' },
  { id: 5, name: 'Mechanical Keyboard', sku: 'MK-8812', category: 'Electronics', quantity: 34, price: 3299, threshold: 10, icon: '⌨️' },
  { id: 6, name: 'Classic Water Bottle', sku: 'WB-7720', category: 'Accessories', quantity: 0, price: 799, threshold: 12, icon: '🧴' },
];

const initialTransactions = [
  { id: 1, product: 'Wireless Headphones', type: 'Stock in', quantity: 20, date: 'Today, 10:42 AM' },
  { id: 2, product: 'Ceramic Coffee Mug', type: 'Stock out', quantity: 5, date: 'Today, 09:18 AM' },
  { id: 3, product: 'Everyday Backpack', type: 'Stock in', quantity: 30, date: 'Yesterday, 04:30 PM' },
  { id: 4, product: 'Minimal Desk Lamp', type: 'Stock out', quantity: 8, date: 'Yesterday, 01:15 PM' },
];

function formatMoney(amount) {
  return '₹' + amount.toLocaleString('en-IN');
}

function getStatus(product) {
  if (product.quantity === 0) return 'Out of stock';
  if (product.quantity <= product.threshold) return 'Low stock';
  return 'In stock';
}

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activePage, setActivePage] = useState('Overview');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All products');
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', category: 'Electronics', quantity: '', price: '', threshold: '10', icon: '📦',
  });

  const totalUnits = products.reduce((sum, product) => sum + product.quantity, 0);
  const inventoryValue = products.reduce((sum, product) => sum + product.quantity * product.price, 0);
  const lowStock = products.filter((product) => product.quantity > 0 && product.quantity <= product.threshold).length;
  const outOfStock = products.filter((product) => product.quantity === 0).length;

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.sku} ${product.category}`.toLowerCase().includes(search.toLowerCase());
      const status = getStatus(product);
      const matchesFilter = filter === 'All products' || status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [products, search, filter]);

  function changeStock(id, amount) {
    const product = products.find((item) => item.id === id);
    if (!product) return;

    const actualChange = amount < 0 ? -Math.min(product.quantity, Math.abs(amount)) : amount;
    if (actualChange === 0) return;

    setProducts((current) => current.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + actualChange } : item
    ));

    setTransactions((current) => [{
      id: Date.now(),
      product: product.name,
      type: actualChange > 0 ? 'Stock in' : 'Stock out',
      quantity: Math.abs(actualChange),
      date: 'Just now',
    }, ...current]);
  }

  function addProduct(event) {
    event.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name.trim(),
      sku: newProduct.sku.trim(),
      category: newProduct.category,
      quantity: Number(newProduct.quantity),
      price: Number(newProduct.price),
      threshold: Number(newProduct.threshold),
      icon: newProduct.icon,
    };

    setProducts((current) => [product, ...current]);
    setNewProduct({ name: '', sku: '', category: 'Electronics', quantity: '', price: '', threshold: '10', icon: '📦' });
    setShowModal(false);
    setActivePage('Inventory');
  }

  const navItems = [
    { label: 'Overview', icon: '◫' },
    { label: 'Inventory', icon: '▤' },
    { label: 'Transactions', icon: '↔' },
    { label: 'Analytics', icon: '▥' },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <div className="brand-name">stockwise<span>.</span></div>
            <div className="brand-caption">INVENTORY INTELLIGENCE</div>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-card">
          <div className="workspace-avatar">A</div>
          <div className="workspace-info">
            <strong>Acme Store</strong>
            <span>Free workspace</span>
          </div>
          <span className="workspace-chevron">⌄</span>
        </div>

        <div className="nav-label">MENU</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activePage === item.label ? 'active' : ''}`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Inventory' && <span className="nav-count">{products.length}</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Need a hand?</strong>
            <p>Explore tips to manage your inventory smarter.</p>
            <button onClick={() => setActivePage('Analytics')}>Explore insights ↗</button>
          </div>
          <div className="profile">
            <div className="profile-avatar">AS</div>
            <div className="profile-info">
              <strong>Store Admin</strong>
              <span>Administrator</span>
            </div>
            <span className="profile-more">···</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">Workspace <span>/</span> <strong>{activePage}</strong></div>
          <div className="topbar-actions">
            <div className="system-status"><span className="status-dot"></span> All systems normal</div>
            <button className="icon-button" aria-label="Notifications">♧<i></i></button>
            <div className="topbar-avatar">AS</div>
          </div>
        </header>

        <div className="page-content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">SUNDAY, NOVEMBER 08, 2026</div>
              <h1>{activePage === 'Overview' ? 'Good evening' : activePage}<span className="heading-period">.</span></h1>
              <p>
                {activePage === 'Overview'
                  ? 'Here’s what’s happening with your inventory today.'
                  : `Stay on top of your ${activePage.toLowerCase()} and keep your store running smoothly.`}
              </p>
            </div>
            <div className="heading-actions">
              <span className="demo-tag">DEMO DATA</span>
              <button className="secondary-button" onClick={() => setActivePage('Transactions')}>↻ Activity</button>
              <button className="primary-button" onClick={() => setShowModal(true)}>＋ Add product</button>
            </div>
          </div>

          {activePage === 'Overview' && (
            <>
              <section className="metrics-grid">
                <MetricCard label="Total products" value={products.length} detail="Unique items in catalogue" icon="▤" tone="violet" />
                <MetricCard label="Inventory value" value={formatMoney(inventoryValue)} detail="Based on current unit prices" icon="₹" tone="green" />
                <MetricCard label="Units in stock" value={totalUnits.toLocaleString('en-IN')} detail="Across all products" icon="▦" tone="blue" />
                <MetricCard label="Need attention" value={lowStock + outOfStock} detail={`${lowStock} low stock · ${outOfStock} out of stock`} icon="!" tone="amber" />
              </section>

              <section className="dashboard-grid">
                <div className="panel stock-panel">
                  <div className="panel-heading">
                    <div><h2>Inventory overview</h2><p>A snapshot of your stock health</p></div>
                    <span className="period-select">All products⌄</span>
                  </div>
                  <div className="stock-overview">
                    <div className="donut-wrap">
                      <div className="donut-chart">
                        <div className="donut-center"><strong>{products.length}</strong><span>Products</span></div>
                      </div>
                    </div>
                    <div className="legend">
                      <Legend color="green" label="In stock" value={products.filter((p) => getStatus(p) === 'In stock').length} />
                      <Legend color="amber" label="Low stock" value={lowStock} />
                      <Legend color="red" label="Out of stock" value={outOfStock} />
                    </div>
                  </div>
                  <div className="panel-footnote"><span className="footnote-dot"></span> Stock levels are calculated using your reorder thresholds.</div>
                </div>

                <div className="panel attention-panel">
                  <div className="panel-heading">
                    <div><h2>Attention needed</h2><p>Products that may need a restock</p></div>
                    <span className="attention-count">{lowStock + outOfStock}</span>
                  </div>
                  <div className="attention-list">
                    {products.filter((p) => getStatus(p) !== 'In stock').length === 0 && <p className="empty-note">Everything looks good!</p>}
                    {products.filter((p) => getStatus(p) !== 'In stock').slice(0, 4).map((product) => (
                      <div className="attention-item" key={product.id}>
                        <div className="product-icon small">{product.icon}</div>
                        <div className="attention-product"><strong>{product.name}</strong><span>{product.sku}</span></div>
                        <div className="attention-qty"><strong>{product.quantity}</strong><span>left</span></div>
                        <StatusBadge status={getStatus(product)} />
                      </div>
                    ))}
                  </div>
                  <button className="text-link" onClick={() => { setActivePage('Inventory'); setFilter('Low stock'); }}>View inventory alerts ↗</button>
                </div>
              </section>

              <ProductTable
                products={filteredProducts.slice(0, 5)}
                search={search}
                setSearch={setSearch}
                filter={filter}
                setFilter={setFilter}
                changeStock={changeStock}
                onViewAll={() => setActivePage('Inventory')}
                compact
              />
            </>
          )}

          {activePage === 'Inventory' && (
            <ProductTable
              products={filteredProducts}
              search={search}
              setSearch={setSearch}
              filter={filter}
              setFilter={setFilter}
              changeStock={changeStock}
              onViewAll={() => setShowModal(true)}
            />
          )}

          {activePage === 'Transactions' && (
            <div className="panel transactions-panel">
              <div className="panel-heading"><div><h2>Recent activity</h2><p>A record of stock movements in your workspace</p></div></div>
              {transactions.length === 0 ? <p className="empty-note">No transactions yet.</p> : transactions.map((transaction) => (
                <div className="transaction-row" key={transaction.id}>
                  <div className={`transaction-symbol ${transaction.type === 'Stock in' ? 'in' : 'out'}`}>{transaction.type === 'Stock in' ? '↓' : '↑'}</div>
                  <div className="transaction-name"><strong>{transaction.product}</strong><span>{transaction.date}</span></div>
                  <span className={`transaction-type ${transaction.type === 'Stock in' ? 'positive' : 'negative'}`}>{transaction.type}</span>
                  <strong className="transaction-quantity">{transaction.type === 'Stock in' ? '+' : '−'}{transaction.quantity} units</strong>
                </div>
              ))}
            </div>
          )}

          {activePage === 'Analytics' && (
            <section className="analytics-grid">
              <div className="panel analytics-card">
                <div className="panel-heading"><div><h2>Stock distribution</h2><p>Current quantity by product</p></div></div>
                <div className="bar-chart">
                  {products.map((product) => (
                    <div className="bar-column" key={product.id}>
                      <strong>{product.quantity}</strong>
                      <div className="bar-track"><div className="bar-fill" style={{ height: `${Math.max(4, (product.quantity / Math.max(totalUnits, 1)) * 100 * 4)}%` }}></div></div>
                      <span>{product.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="panel analytics-card">
                <div className="panel-heading"><div><h2>Inventory summary</h2><p>At a glance</p></div></div>
                <div className="summary-line"><span>Total inventory value</span><strong>{formatMoney(inventoryValue)}</strong></div>
                <div className="summary-line"><span>Total units</span><strong>{totalUnits}</strong></div>
                <div className="summary-line"><span>Low-stock products</span><strong>{lowStock}</strong></div>
                <div className="summary-line"><span>Out-of-stock products</span><strong>{outOfStock}</strong></div>
                <div className="summary-note">Insights are based on the current demo inventory.</div>
              </div>
            </section>
          )}

          <footer className="footer"><span>© 2026 StockWise</span><span>Inventory, made intelligent. <b>✦</b></span></footer>
        </div>
      </main>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">YOUR CATALOGUE</span><h2>Add a product</h2><p>Enter the details to add a new item to your inventory.</p></div>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={addProduct}>
              <label>Product name<input required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="e.g. Wireless Mouse" /></label>
              <label>SKU / Product code<input required value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} placeholder="e.g. WM-1024" /></label>
              <label>Category<select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}><option>Electronics</option><option>Home & Living</option><option>Accessories</option><option>Office Supplies</option><option>Other</option></select></label>
              <div className="form-row">
                <label>Quantity<input required min="0" type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })} placeholder="0" /></label>
                <label>Unit price (₹)<input required min="0" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} placeholder="0" /></label>
              </div>
              <label>Low-stock alert threshold<input required min="0" type="number" value={newProduct.threshold} onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })} /></label>
              <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowModal(false)}>Cancel</button><button type="submit" className="primary-button">Add product →</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, detail, icon, tone }) {
  return (
    <div className="metric-card">
      <div className="metric-top"><span>{label}</span><div className={`metric-icon ${tone}`}>{icon}</div></div>
      <div className="metric-value">{value}</div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function Legend({ color, label, value }) {
  return <div className="legend-row"><span className={`legend-dot ${color}`}></span><span>{label}</span><strong>{value}</strong></div>;
}

function StatusBadge({ status }) {
  const className = status === 'In stock' ? 'success' : status === 'Low stock' ? 'warning' : 'danger';
  return <span className={`status-badge ${className}`}>{status}</span>;
}

function ProductTable({ products, search, setSearch, filter, setFilter, changeStock, onViewAll, compact }) {
  return (
    <section className="panel inventory-panel">
      <div className="inventory-heading">
        <div><h2>{compact ? 'Recent inventory' : 'Product inventory'}</h2><p>{compact ? 'A quick look at your products' : 'Manage your products and stock levels'}</p></div>
        {compact && <button className="text-link" onClick={onViewAll}>View all products ↗</button>}
      </div>
      <div className="table-toolbar">
        <div className="search-box"><span>⌕</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, SKU..." /></div>
        <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All products</option><option>In stock</option><option>Low stock</option><option>Out of stock</option>
        </select>
        {!compact && <button className="primary-button small-button" onClick={onViewAll}>＋ Add product</button>}
      </div>
      <div className="table-scroll">
        <table>
          <thead><tr><th>PRODUCT</th><th>SKU</th><th>CATEGORY</th><th>UNIT PRICE</th><th>QUANTITY</th><th>STATUS</th><th>UPDATE STOCK</th></tr></thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td><div className="table-product"><div className="product-icon">{product.icon}</div><strong>{product.name}</strong></div></td>
                <td className="sku-cell">{product.sku}</td>
                <td>{product.category}</td>
                <td className="price-cell">{formatMoney(product.price)}</td>
                <td><strong>{product.quantity}</strong> <span className="unit-label">units</span></td>
                <td><StatusBadge status={getStatus(product)} /></td>
                <td><div className="stock-controls"><button onClick={() => changeStock(product.id, -1)} aria-label="Remove one unit">−</button><button onClick={() => changeStock(product.id, 1)} aria-label="Add one unit">＋</button></div></td>
              </tr>
            ))}
            {products.length === 0 && <tr><td colSpan="7" className="empty-table">No products found. Try another search.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="table-bottom"><span>Showing <strong>{products.length}</strong> products</span><span>Stock values update instantly in this demo.</span></div>
    </section>
  );
}

export default App;
