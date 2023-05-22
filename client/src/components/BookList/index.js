import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaginationBookStore from "../PaginationBookStore";
import { ToastContainer, toast } from "react-toastify";

import { Row, Col, Card, Table, Spinner, Modal, Button } from "react-bootstrap";
import bookApi from "../../api/bookApi";
import format from "../../helper/format";
import styles from "./BookList.module.css";

function BookList() {
  const [bookData, setBookData] = useState({});
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);

  const [bookDelete, setBookDelete] = useState({});

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [keySearch, setKeySearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await bookApi.getAll({
          key: keySearch,
          page: page,
          limit: 10,
          sortByDate: "desc",
        });
        setLoading(false);
        setBookData({ books: res.data, totalPage: res.pagination.totalPage });
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    fetchData();
  }, [page, keySearch]);

  const handleClickDeleteBook = (e) => {
    setBookDelete({
      _id: e.target?.getAttribute("data-id"),
      name: e.target?.getAttribute("data-name"),
    });
    setShowModal(true);
  };

  const handleChangePage = useCallback((page) => {
    setPage(page);
  }, []);

  const handleCallApiDelete = async (e) => {
    try {
      const canDelete = await bookApi.checkIsOrdered(bookDelete?._id);
      if (canDelete.data.length > 0) {
        toast.error("Sản phẩm đã được mua, không thể xóa!", {
          autoClose: 2000,
        });
        return;
      }
      await bookApi.deleteBook(bookDelete?._id);
      toast.success("Xóa thành công!", { autoClose: 2000 });
      setShowModal(false);
      setBookData((preState) => {
        const newArray = [...preState.books];
        return {
          ...preState,
          books: newArray.filter((item) => item._id !== bookDelete?._id),
        };
      });
    } catch (error) {
      alert("Xóa thất bại!");
      setShowModal(false);
    }
  };

  return (
    <Row>
      <ToastContainer />
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc xóa sách <b>{bookDelete && bookDelete.name}</b> này không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleCallApiDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
      <Col xl={12}>
        <Card>
          <Card.Header className={styles.title}>Tất cả sách</Card.Header>
          <Card.Body className={styles.bookList}>
            <div className="d-flex mb-2 justify-content-between align-items-center">
              <div>
                <input
                  className={`form-control ${styles.inputSearch}`}
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setKeySearch(search);
                    setPage(1);
                  }}
                >
                  Tìm kiếm
                </button>
              </div>
              <a href="/admin/book/add" className="btn btn-primary">
                Thêm sách
              </a>
            </div>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>STT</th>
                  <th className={styles.name}>Tên sách</th>
                  <th>Thể loại</th>
                  <th>Xuất bản</th>
                  <th>Giá</th>
                  <th>Khuyến mãi (%)</th>
                  <th colSpan="2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7}>
                      <Spinner animation="border" variant="success" />
                    </td>
                  </tr>
                ) : bookData.books && bookData.books.length > 0 ? (
                  bookData.books.map((item, index) => {
                    return (
                      <tr key={item?._id}>
                        <td>{(1 && page - 1) * 10 + (index + 1)}</td>
                        <td>
                          {item.name} - {item.author?.name}
                        </td>
                        <td>{item.genre?.name}</td>
                        <td>
                          {item.publisher?.name} - {item.year}
                        </td>
                        <td>{format.formatPrice(item.price)}</td>
                        <td>{item.discount}</td>
                        <td>
                          <Link
                            to={`/admin/book/update/${item?._id}`}
                            className="btn btn-warning"
                            data-id={item?._id}
                          >
                            Sửa
                          </Link>
                        </td>
                        <td>
                          <button
                            className="btn btn-danger"
                            data-id={item?._id}
                            data-name={item.name}
                            onClick={handleClickDeleteBook}
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6}>Không có sản phẩm nào!</td>
                  </tr>
                )}
              </tbody>
            </Table>
            <div className={styles.pagination}>
              <Row>
                <Col xl={12}>
                  {bookData.totalPage > 1 ? (
                    <PaginationBookStore
                      totalPage={bookData.totalPage}
                      currentPage={page}
                      onChangePage={handleChangePage}
                    />
                  ) : null}
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default BookList;
