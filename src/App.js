import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const App = () => {
  const [data, setData] = useState({});

  const getValue = (obj) => {
    for (let x in obj) {
      return obj[x];
    }
  };

  const validateStock = (arr, location) => {
    return location.map((value) => {
      return {
        [value.id]: getValue(arr.find((item) => item[value.id])) || 0,
      };
    });
  };

  useEffect(() => {
    fetch("data.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((myJson) => {
        setData({
          ...myJson,
          proformaItem: myJson.proformaItem.map((value) => {
            return {
              ...value,
              total_stock: JSON.parse(value.product_stock).reduce(
                (total, value) => {
                  return total + getValue(value);
                },
                0
              ),
              product_stock: validateStock(
                JSON.parse(value.product_stock),
                myJson.location
              ),
              items: JSON.parse(value.items),
            };
          }),
        });
      })
      .catch((err) => console.log(err));
  }, []);

  return data ? (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>No.</th>
          {data.location?.map((value) => {
            return <th key={value.id}>{value.name}</th>;
          })}
          <th>Category</th>
          <th>Product</th>
          <th>Total Stock</th>
          <th>Percent %</th>
          <th>Total Order</th>
        </tr>
      </thead>
      <tbody>
        {data.proformaItem?.map((value, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              {value.product_stock.map((value) => {
                return <td>{getValue(value)}</td>;
              })}
              <td>{value.categoryDescription}</td>
              <td>{value.productDescription}</td>
              <td>{value.total_stock}</td>
              <td>
                {((value.items[0].qty / value.total_stock) * 100).toFixed(2)} %
              </td>
              <td>{value.items[0].qty}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  ) : (
    <p>Tidak ada data</p>
  );
};

export default App;
