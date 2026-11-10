                </td>

                <td>
                  <StatusBadge status={getStatus(product)} />
                </td>

                <td>
                  <div className="stock-controls">
                    <button
                      onClick={() => changeStock(product.id, -1)}
                      aria-label="Remove one unit"
                    >
                      −
                    </button>
                    <button
                      onClick={() => changeStock(product.id, 1)}
                      aria-label="Add one unit"
                    >
                      ＋
                    </button>
                    <button
                      type="button"
                      onClick={() => onCustomStock(product)}
                      title="Enter a custom stock quantity"
                      aria-label={`Custom stock update for ${product.name}`}
                      style={{
                        border: '1px solid #d8e2dc',
                        background: '#f1f7f3',
                        color: '#276749',
                        borderRadius: '7px',
                        padding: '6px 9px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Custom
                    </button>
                  </div>
                </td>

                <td>
                  <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      title="Edit product"
                      aria-label={`Edit ${product.name}`}
                      style={{
                        border: '1px solid #d8e2dc',
                        background: '#f1f7f3',
                        color: '#276749',
                        borderRadius: '7px',
                        padding: '7px 10px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ✎ Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(product)}
                      title="Delete product"
                      aria-label={`Delete ${product.name}`}
                      style={{
                        border: '1px solid #f1d5d5',
                        background: '#fff4f4',
                        color: '#c0392b',
                        borderRadius: '7px',
                        padding: '7px 10px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      × Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan="8" className="empty-table">
                  No products found. Try another search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-bottom">
        <span>
          Showing <strong>{products.length}</strong> products
        </span>
        <span>Stock values update instantly in this demo.</span>
      </div>
    </section>
  );
}

export default App;
